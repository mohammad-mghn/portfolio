/**
 * Fill a Sanity dataset from the typed local content in content/seed.
 *
 *   pnpm seed            # adds whatever is missing; never overwrites what you edited in the panel
 *   pnpm seed --force    # replaces every document with the seed version (your panel edits are lost)
 *
 * Needs NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET and SANITY_API_WRITE_TOKEN in
 * .env.local (an Editor token from sanity.io/manage → API → Tokens; keep it local, never on Vercel).
 * Safe to re-run: ids are fixed, and Sanity stores an identical image only once.
 */
import { createReadStream, existsSync } from "node:fs";
import { basename, join } from "node:path";
import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { buildSeedDocs, retired } from "./seed-docs";

config({ path: ".env.local" });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN in .env.local");
  process.exit(1);
}
const force = process.argv.includes("--force");

const client = createClient({ projectId, dataset, token, apiVersion: "2026-11-01", useCdn: false });

const uploads = new Map<string, string>();
async function upload(src: string) {
  const file = join(process.cwd(), "public", src);
  if (!existsSync(file)) {
    console.warn(`  ! missing image ${src}`);
    return undefined;
  }
  let id = uploads.get(file);
  if (!id) {
    const asset = await client.assets.upload("image", createReadStream(file), { filename: basename(file) });
    id = asset._id;
    uploads.set(file, id);
    console.log(`  ↑ ${src}`);
  }
  return { _type: "reference" as const, _ref: id };
}

async function main() {
  console.log(`Seeding ${projectId}/${dataset} ${force ? "(replacing everything)" : "(adding what is missing)"} …`);
  const docs = await buildSeedDocs(upload);

  const tx = client.transaction();
  for (const d of docs) {
    const doc = d as { _id: string; _type: string };
    if (force) tx.createOrReplace(doc);
    else tx.createIfNotExists(doc);
  }
  await tx.commit();

  const old = await client.fetch<string[]>(`*[_type == "milestone" || _id in $ids]._id`, { ids: retired });
  if (old.length) {
    const cleanup = client.transaction();
    for (const id of old) cleanup.delete(id);
    await cleanup.commit();
    console.log(`  − removed ${old.length} retired documents`);
  }

  console.log(`✓ ${docs.length} documents, ${uploads.size} images`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
