/**
 * Checks that every document the seed script would send fits the Sanity schema, without touching
 * a dataset:  pnpm seed:check
 *
 * It walks each document against the schema definitions and reports any field the schema does not
 * know, any value of the wrong basic type, and any reference to a document that is not in the seed.
 * Run it after changing content/seed or sanity/schemaTypes.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { schemaTypes } from "../sanity/schemaTypes";
import { buildSeedDocs } from "./seed-docs";

// Schema definitions are plain objects; only the parts read here are typed.
type Def = { name?: string; type: string; fields?: Def[]; of?: Def[]; to?: { type: string }[] };
type Value = unknown;

const custom = new Map((schemaTypes as unknown as Def[]).map((t) => [t.name!, t]));
const problems: string[] = [];
const system = new Set(["_id", "_type", "_key", "_rev", "_createdAt", "_updatedAt"]);
const isObject = (v: Value): v is Record<string, Value> => typeof v === "object" && v !== null && !Array.isArray(v);

function check(value: Value, def: Def, path: string, ids: Set<string>) {
  if (value === undefined || value === null) return;
  const named = custom.get(def.type);
  if (named) return check(value, { ...named, name: def.name }, path, ids);

  switch (def.type) {
    case "document":
    case "object":
    case "image": {
      if (!isObject(value)) return void problems.push(`${path}: expected an object`);
      const known = new Map((def.fields ?? []).map((f) => [f.name!, f]));
      for (const [k, v] of Object.entries(value)) {
        if (system.has(k)) continue;
        if (def.type === "image" && (k === "asset" || k === "crop" || k === "hotspot")) continue;
        const field = known.get(k);
        if (!field) problems.push(`${path}.${k}: not a field of ${def.name ?? def.type}`);
        else check(v, field, `${path}.${k}`, ids);
      }
      return;
    }
    case "array": {
      if (!Array.isArray(value)) return void problems.push(`${path}: expected a list`);
      value.forEach((item, i) => {
        const at = `${path}[${i}]`;
        if (!isObject(item)) return;
        if (!item._key) problems.push(`${at}: list items need a _key`);
        const member =
          (def.of ?? []).find((m) => m.name === item._type || m.type === item._type) ?? (def.of?.length === 1 ? def.of[0] : undefined);
        if (!member) problems.push(`${at}: type "${String(item._type)}" is not allowed in this list`);
        else check(item, member, at, ids);
      });
      return;
    }
    case "reference":
      if (!isObject(value) || typeof value._ref !== "string") return void problems.push(`${path}: expected a reference`);
      if (!ids.has(value._ref) && !value._ref.startsWith("image-")) problems.push(`${path}: points at "${value._ref}", which the seed does not create`);
      return;
    case "slug":
      if (!isObject(value) || typeof value.current !== "string") problems.push(`${path}: expected a slug`);
      return;
    case "number":
      if (typeof value !== "number") problems.push(`${path}: expected a number`);
      return;
    case "boolean":
      if (typeof value !== "boolean") problems.push(`${path}: expected true or false`);
      return;
    case "string":
    case "text":
    case "url":
    case "date":
      if (typeof value !== "string") problems.push(`${path}: expected text, got ${Array.isArray(value) ? "a list" : typeof value}`);
      else if (def.type === "url" && !/^(https?:|mailto:)/.test(value)) problems.push(`${path}: "${value}" is not a URL`);
      return;
    case "block":
      return;
    default:
      problems.push(`${path}: unknown schema type "${def.type}"`);
  }
}

async function main() {
  const missing: string[] = [];
  const docs = (await buildSeedDocs(async (src) => {
    if (!existsSync(join(process.cwd(), "public", src))) {
      missing.push(src);
      return undefined;
    }
    return { _type: "reference", _ref: `image-${src}` };
  })) as { _id: string; _type: string }[];

  const ids = new Set(docs.map((d) => d._id));
  for (const doc of docs) {
    const type = custom.get(doc._type);
    if (!type) problems.push(`${doc._id}: no schema type "${doc._type}"`);
    else check(doc, type, doc._id, ids);
  }

  for (const src of missing) problems.push(`missing image file: public${src}`);
  if (problems.length) {
    console.error(`✖ ${problems.length} problem(s):\n` + problems.map((p) => `  - ${p}`).join("\n"));
    process.exit(1);
  }
  const byType = docs.reduce<Record<string, number>>((acc, d) => ({ ...acc, [d._type]: (acc[d._type] ?? 0) + 1 }), {});
  console.log(`✓ ${docs.length} documents fit the schema:`, byType);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
