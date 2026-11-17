/**
 * Seed a Sanity dataset from the typed local content in content/seed.
 *
 *   pnpm seed            # upserts every document (fixed _ids, safe to re-run)
 *
 * Needs NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET and SANITY_API_WRITE_TOKEN
 * (an Editor token from sanity.io/manage → API → Tokens; keep it local, never on Vercel).
 */
import { createReadStream, existsSync } from "node:fs";
import { basename, join } from "node:path";
import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { experience } from "../content/seed/journey";
import { projects } from "../content/seed/projects";
import { about, recommendations, siteSettings } from "../content/seed/site";

config({ path: ".env.local" });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN in .env.local");
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: "2026-11-01", useCdn: false });

let n = 0;
const key = () => `k${(n++).toString(36)}${Math.random().toString(36).slice(2, 8)}`;

type Loc = { en: string; fa?: string };
type SeedImage = { src: string; alt: Loc };

const uploads = new Map<string, string>();
async function image(img: SeedImage | undefined) {
  if (!img) return undefined;
  const file = join(process.cwd(), "public", img.src);
  if (!existsSync(file)) {
    console.warn(`  ! missing image ${img.src}`);
    return undefined;
  }
  let id = uploads.get(file);
  if (!id) {
    const asset = await client.assets.upload("image", createReadStream(file), { filename: basename(file) });
    id = asset._id;
    uploads.set(file, id);
    console.log(`  ↑ ${img.src}`);
  }
  return { _type: "altImage", asset: { _type: "reference", _ref: id }, alt: img.alt };
}

const blocks = (paragraphs: string[] = []) =>
  paragraphs.map((text) => ({
    _type: "block",
    _key: key(),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: key(), text, marks: [] }],
  }));
const localeBlock = (v: { en: string[]; fa?: string[] }) => ({ en: blocks(v.en), fa: blocks(v.fa) });
const items = <T extends object>(type: string, list: T[]) => list.map((x) => ({ _type: type, _key: key(), ...x }));

async function main() {
  console.log(`Seeding ${projectId}/${dataset} …`);
  const docs: Record<string, unknown>[] = [];

  docs.push({
    ...siteSettings,
    roles: items("role", [...siteSettings.roles]),
    socials: items("social", [...siteSettings.socials]),
  });

  docs.push({
    ...about,
    bio: items("localeText", about.bio),
    outside: items("localeText", about.outside),
    numbers: items("stat", about.numbers),
    pillars: items("pillar", about.pillars),
    beliefs: items("belief", about.beliefs),
    quotes: items("quote", about.quotes),
    education: items("educationItem", about.education),
    volunteering: items("volunteeringItem", about.volunteering),
    languages: items("languageItem", about.languages),
    portrait: await image({ src: "/brand/portrait.png", alt: siteSettings.name }),
  });

  for (const e of experience) docs.push({ ...e });

  for (const p of projects) {
    const { slug, problem, decision, result, cover, gallery, ...rest } = p;
    docs.push({
      ...rest,
      slug: { _type: "slug", current: slug },
      problem: localeBlock(problem),
      decision: localeBlock(decision),
      result: localeBlock(result),
      cover: await image(cover),
      gallery: (await Promise.all(gallery.map((g) => image(g)))).filter(Boolean).map((g) => ({ ...g, _key: key() })),
    });
  }

  for (const r of recommendations) docs.push({ ...r });

  const tx = client.transaction();
  for (const d of docs) tx.createOrReplace(d as { _id: string; _type: string });
  await tx.commit();
  console.log(`✓ ${docs.length} documents, ${uploads.size} images`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
