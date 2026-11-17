/**
 * Checks the CMS path without a Sanity project:  pnpm cms:check
 *
 * It builds the documents the seed script would upload, runs the site's real GROQ queries over
 * them with a local evaluator, maps the results with the same code the site uses, and compares
 * every page's content with what the seed source gives, in English and in Persian.
 * If this passes, connecting Sanity and running `pnpm seed` shows the same site as before.
 */
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { evaluate, parse } from "groq-js";
import { createSanitySource } from "../lib/content/sanity-mapper";
import { seedSource } from "../lib/content/seed-source";
import type { ContentSource, Locale, PageKey } from "../lib/content/types";
import { buildSeedDocs } from "./seed-docs";

type Doc = Record<string, unknown>;

/** Image sizes as the seed declares them, by path under /public, so fake assets carry real dimensions. */
function seedImageSizes(docs: unknown): Map<string, { w: number; h: number }> {
  const sizes = new Map<string, { w: number; h: number }>();
  const walk = (v: unknown) => {
    if (Array.isArray(v)) return v.forEach(walk);
    if (typeof v !== "object" || v === null) return;
    const o = v as Record<string, unknown>;
    if (typeof o.src === "string" && typeof o.width === "number" && typeof o.height === "number") {
      sizes.set(o.src, { w: o.width, h: o.height });
    }
    Object.values(o).forEach(walk);
  };
  walk(docs);
  return sizes;
}

/**
 * What must match between the two sources. Left out by design: an image's URL, blur preview and
 * pixel size (the CMS path asks for at most 2400px), and the internal keys of rich-text blocks.
 */
function comparable(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(comparable);
  if (typeof value !== "object" || value === null) return value;
  const o = value as Record<string, unknown>;
  const isImage = typeof o.src === "string" && typeof o.width === "number" && "alt" in o;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(o).sort(([a], [b]) => a.localeCompare(b))) {
    if (v === undefined) continue;
    if (isImage && ["src", "lqip", "focus", "width", "height"].includes(k)) continue;
    if (k === "_key") continue;
    out[k] = comparable(v);
  }
  return out;
}

function firstDifference(a: unknown, b: unknown, path = ""): string | null {
  if (JSON.stringify(a) === JSON.stringify(b)) return null;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return `${path}: ${a.length} items in seed, ${b.length} from the CMS path`;
    for (let i = 0; i < a.length; i++) {
      const d = firstDifference(a[i], b[i], `${path}[${i}]`);
      if (d) return d;
    }
  }
  if (typeof a === "object" && typeof b === "object" && a && b && !Array.isArray(a) && !Array.isArray(b)) {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const k of keys) {
      const d = firstDifference((a as Doc)[k], (b as Doc)[k], `${path}.${k}`);
      if (d) return d;
    }
  }
  return `${path}: seed ${JSON.stringify(a)?.slice(0, 120)} ≠ CMS ${JSON.stringify(b)?.slice(0, 120)}`;
}

async function main() {
  const { projects } = await import("../content/seed/projects");
  const { ventures } = await import("../content/seed/founding");
  const { journey } = await import("../content/seed/journey");
  const sizes = seedImageSizes([projects, ventures, journey]);

  // Fake "uploads": an asset document per image, with an id in Sanity's own format.
  const assets: Doc[] = [];
  const docs = (await buildSeedDocs(async (src) => {
    if (!existsSync(join(process.cwd(), "public", src))) return undefined;
    const { w, h } = sizes.get(src) ?? { w: 3024, h: 4032 };
    const ext = src.split(".").pop() ?? "png";
    const id = `image-${createHash("sha1").update(src).digest("hex")}-${w}x${h}-${ext}`;
    if (!assets.some((a) => a._id === id)) {
      assets.push({ _id: id, _type: "sanity.imageAsset", url: `https://cdn.sanity.io${src}`, metadata: { dimensions: { width: w, height: h } } });
    }
    return { _type: "reference", _ref: id };
  })) as Doc[];
  const dataset = [...docs, ...assets];

  const cms: ContentSource = createSanitySource(async (query, params = {}) => {
    const value = await evaluate(parse(query, { params }), { dataset, params });
    return value.get();
  });

  const pageKeys: PageKey[] = ["home", "engineering", "founding", "work", "content", "about", "recommendations", "resume", "contact"];
  const problems: string[] = [];
  let checks = 0;
  const same = (label: string, seed: unknown, fromCms: unknown) => {
    checks += 1;
    const d = firstDifference(comparable(seed), comparable(fromCms), label);
    if (d) problems.push(d);
  };

  for (const locale of ["en", "fa"] as Locale[]) {
    const tag = (what: string) => `${locale} ${what}`;
    same(tag("siteSettings"), await seedSource.getSiteSettings(locale), await cms.getSiteSettings(locale));
    same(tag("about"), await seedSource.getAbout(locale), await cms.getAbout(locale));
    same(tag("experience"), await seedSource.getExperience(locale), await cms.getExperience(locale));
    same(tag("projects"), await seedSource.getProjects(locale), await cms.getProjects(locale));
    same(tag("ventures"), await seedSource.getVentures(locale), await cms.getVentures(locale));
    same(tag("journey"), await seedSource.getJourney(locale), await cms.getJourney(locale));
    same(tag("recommendations"), await seedSource.getRecommendations(locale), await cms.getRecommendations(locale));
    for (const page of pageKeys) same(tag(`page:${page}`), await seedSource.getPageCopy(locale, page), await cms.getPageCopy(locale, page));
    for (const slug of await seedSource.getProjectSlugs()) {
      same(tag(`project:${slug}`), await seedSource.getProject(locale, slug), await cms.getProject(locale, slug));
    }
  }
  same("project slugs", [...(await seedSource.getProjectSlugs())].sort(), [...(await cms.getProjectSlugs())].sort());

  if (problems.length) {
    console.error(`✖ ${problems.length} of ${checks} checks differ:\n` + problems.map((p) => `  - ${p}`).join("\n"));
    process.exit(1);
  }
  console.log(`✓ CMS path matches the seed in ${checks} checks (${docs.length} documents, ${assets.length} images, en + fa)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
