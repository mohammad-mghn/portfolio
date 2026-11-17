/**
 * Builds every Sanity document from the typed local content in content/seed. Shared by the seed
 * script (which uploads images for real) and the seed check (which only needs the shapes).
 */
import { ventures } from "../content/seed/founding";
import { experience, journey } from "../content/seed/journey";
import { pages } from "../content/seed/pages";
import { projects } from "../content/seed/projects";
import { about, recommendations, recommendationsUrl, siteSettings } from "../content/seed/site";

type Ref = { _type: "reference"; _ref: string };
type Loc = { en: string; fa?: string };
type SeedImage = { src: string; alt?: Loc };

let n = 0;
const key = () => `k${(n++).toString(36)}${Math.random().toString(36).slice(2, 8)}`;

const blocks = (paragraphs: string[] = []) =>
  paragraphs.map((text) => ({
    _type: "block",
    _key: key(),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: key(), text, marks: [] }],
  }));
const localeBlock = (v: { en: string[]; fa?: string[] }) => ({ en: blocks(v.en), fa: blocks(v.fa) });
const items = <T extends object>(type: string, list: readonly T[]) => list.map((x) => ({ _type: type, _key: key(), ...x }));
const ref = (id: string): Ref => ({ _type: "reference", _ref: id });
const refs = (ids: string[]) => ids.map((id) => ({ _key: key(), ...ref(id) }));

/** Documents the site no longer has: the two jobs that used to be projects (old journey stops go by type). */
export const retired = ["project.nobar", "project.rcoinx"];

/**
 * @param upload turns a path under /public into a reference to the uploaded image asset
 *   (or undefined when the file is missing).
 */
export async function buildSeedDocs(upload: (src: string) => Promise<Ref | undefined>) {
  /** An image field with alt text (covers, galleries, journey media). */
  async function image(img: SeedImage | undefined) {
    const asset = img ? await upload(img.src) : undefined;
    return asset ? { _type: "altImage", asset, alt: img!.alt } : undefined;
  }

  const docs: Record<string, unknown>[] = [];

  const { bookingUrl, ...settings } = siteSettings;
  docs.push({
    ...settings,
    ...(bookingUrl ? { bookingUrl } : {}),
    roles: items("role", settings.roles),
    socials: items("social", settings.socials),
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

  docs.push({ ...pages });

  for (const e of experience) docs.push({ ...e });

  for (const p of projects) {
    const { slug, problem, decision, result, cover, gallery, builtAt, ...rest } = p;
    docs.push({
      ...rest,
      slug: { _type: "slug", current: slug },
      ...(builtAt ? { builtAt: ref(builtAt) } : {}),
      problem: localeBlock(problem),
      decision: localeBlock(decision),
      result: localeBlock(result),
      cover: await image(cover),
      gallery: (await Promise.all(gallery.map((g) => image(g)))).filter(Boolean).map((g) => ({ ...g, _key: key() })),
    });
  }

  for (const v of ventures) {
    const { slug, links, cover, ...rest } = v;
    docs.push({
      ...rest,
      slug: { _type: "slug", current: slug },
      links: items("ventureLink", links),
      cover: await image(cover),
    });
  }

  for (const r of recommendations) {
    const { portrait, ...rest } = r;
    const asset = portrait ? await upload(`/people/${portrait}`) : undefined;
    // LinkedIn entries without their own link point at the recommendations list, as on the site today.
    const href = r.href ?? (r.source === "linkedin" ? recommendationsUrl : undefined);
    docs.push({ ...rest, ...(href ? { href } : {}), ...(asset ? { portrait: { _type: "image", asset } } : {}) });
  }

  // Journey stops only hold references, so every document they point at is created above, in the same transaction.
  const stops = [];
  for (const stop of journey.stops) {
    if (stop._type === "journeyProject") {
      stops.push({ _key: stop._key, _type: stop._type, projects: refs(stop.projects) });
      continue;
    }
    const { media, ...rest } = stop;
    const base = { ...rest, media: await image(media) };
    stops.push(
      stop._type === "journeyVenture"
        ? { ...base, venture: ref(stop.venture) }
        : { ...base, roles: refs(stop.roles) },
    );
  }
  docs.push({ _id: journey._id, _type: journey._type, stops });

  return docs;
}
