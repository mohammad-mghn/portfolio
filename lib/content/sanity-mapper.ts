import { defineQuery } from "next-sanity";
import { pages as seedPages } from "@/content/seed/pages";
import { formatDate } from "@/lib/format";
import { buildJourney, type RawJourneyStop } from "./journey";
import { companyKey, pageCopy, pick, pickStr } from "./localize";
import { IMG, sanityImg as img, sanityShareImage, type SanityImg as SImg } from "./sanity-image";
import type {
  BuiltAt,
  ContentSource,
  ExperienceType,
  Img,
  L,
  Locale,
  PillarKey,
  Project,
  ProjectGroup,
  ProjectStatus,
  ProjectSummary,
  RichText,
  SocialGroup,
} from "./types";

const SITE = defineQuery(`*[_type == "siteSettings"][0]{ ..., "ogImage": ogImage${IMG} }`);
const ABOUT = defineQuery(`*[_type == "about"][0]{ ..., "portrait": portrait${IMG} }`);
// Journey stops hold references only; they are resolved against the lists below by id or slug.
const JOURNEY = defineQuery(
  `*[_type == "journey"][0].stops[]{ _key, _type, weight, sceneBreak, highlights, href, "media": media${IMG}, "roles": roles[]._ref, "venture": venture->slug.current, "projects": projects[]->slug.current }`,
);
const PAGES = defineQuery(`*[_type == "pages"][0]`);
const VENTURES = defineQuery(`*[_type == "venture"] | order(order asc){ ..., "slug": slug.current, "cover": cover${IMG} }`);
const BUILT_AT = `"builtAt": builtAt->{ _id, company, type }`;
const EXPERIENCE = defineQuery(
  `*[_type == "experience"] | order(order asc){ ..., "projects": *[_type == "project" && builtAt._ref == ^._id && defined(slug.current)] | order(order asc){ "slug": slug.current, title } }`,
);
const PROJECTS = defineQuery(
  `*[_type == "project" && defined(slug.current)] | order(order asc){ ..., "slug": slug.current, "cover": cover${IMG}, ${BUILT_AT} }`,
);
const PROJECT = defineQuery(
  `*[_type == "project" && slug.current == $slug][0]{ ..., "slug": slug.current, "cover": cover${IMG}, "gallery": gallery[]${IMG}, ${BUILT_AT} }`,
);
const SLUGS = defineQuery(`*[_type == "project" && defined(slug.current)].slug.current`);
const RECOMMENDATIONS = defineQuery(`*[_type == "recommendation"] | order(order asc){ ..., "portrait": portrait${IMG} }`);

// GROQ results are typed loosely here; the DTO mapping below is the contract the UI relies on.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Doc = Record<string, any>;

/** Runs one GROQ query. The site passes next-sanity's live fetch; the offline check passes a local evaluator. */
export type SanityFetch = (query: string, params?: Record<string, string>) => Promise<unknown>;

const GROUPS: ProjectGroup[] = ["cofounded", "client", "personal"];

const toBuiltAt = (b: Doc | null | undefined, locale: Locale): BuiltAt | undefined =>
  b?._id
    ? {
        experienceId: b._id,
        companyKey: companyKey(b.company?.en ?? ""),
        company: pickStr(b.company, locale),
        type: (b.type ?? "employee") as ExperienceType,
      }
    : undefined;

/** The Persian site shows a recommendation's translation only when both translated fields are filled in. */
const translated = (r: Doc, locale: Locale) =>
  locale === "fa" && Boolean(r.highlightFa) && Array.isArray(r.paragraphsFa) && r.paragraphsFa.length > 0;

const toSummary = (p: Doc, locale: Locale): ProjectSummary => ({
  slug: p.slug,
  title: pickStr(p.title, locale),
  year: p.year ?? "",
  sector: pickStr(p.sector, locale),
  kind: pickStr(p.kind, locale),
  scope: pick<string[]>(p.scope, locale, []),
  status: (p.status ?? "live") as ProjectStatus,
  group: GROUPS.includes(p.group) ? (p.group as ProjectGroup) : "personal",
  builtAt: toBuiltAt(p.builtAt, locale),
  partner: pickStr(p.partner, locale) || undefined,
  caseStudy: Boolean(p.caseStudy),
  color: p.color ?? "#151412",
  summary: pickStr(p.summary, locale),
  cover: img(p.cover, locale),
  featured: Boolean(p.featured),
  links: p.links ?? {},
});

/**
 * The Sanity content source: GROQ queries plus the mapping from documents to what the pages render.
 * Kept free of Next-only imports so `pnpm cms:check` can run the very same code against the seed.
 */
export function createSanitySource(run: SanityFetch): ContentSource {
  const fetchDoc = <T = Doc>(query: string, params: Record<string, string> = {}) => run(query, params) as Promise<T>;
  const source: ContentSource = {
    async getSiteSettings(locale) {
      const s = (await fetchDoc(SITE)) ?? {};
      return {
        name: pickStr(s.name, locale),
        shortName: s.shortName ?? "",
        tagline: pickStr(s.tagline, locale),
        headline: pickStr(s.headline, locale),
        positioning: pickStr(s.positioning, locale),
        roles: (s.roles ?? []).map((r: Doc) => ({ title: pickStr(r.title, locale), org: pickStr(r.org, locale), href: r.href })),
        location: pickStr(s.location, locale),
        email: s.email ?? "",
        socials: (s.socials ?? []).map(({ label, href, handle, group, blurb }: Doc) => ({
          label,
          href,
          handle,
          group: (group ?? "professional") as SocialGroup,
          blurb: blurb ? pickStr(blurb, locale) : undefined,
        })),
        openTo: pick<string[]>(s.openTo, locale, []),
        resumeUrl: s.resumeUrl,
        bookingUrl: s.bookingUrl || undefined,
        shareImageUrl: sanityShareImage(s.ogImage),
        seoTitle: pickStr(s.seoTitle, locale),
        seoDescription: pickStr(s.seoDescription, locale),
      };
    },

    async getAbout(locale) {
      const a = (await fetchDoc(ABOUT)) ?? {};
      return {
        statement: pickStr(a.statement, locale),
        bio: (a.bio ?? []).map((p: L) => pickStr(p, locale)),
        outside: (a.outside ?? []).map((p: L) => pickStr(p, locale)),
        closing: pickStr(a.closing, locale),
        portrait: img(a.portrait, locale),
        numbers: (a.numbers ?? []).map((s: Doc) => ({
          value: typeof s.value === "string" ? s.value : pickStr(s.value, locale),
          label: pickStr(s.label, locale),
        })),
        pillars: (a.pillars ?? []).map((p: Doc) => ({
          key: p.key as PillarKey,
          title: pickStr(p.title, locale),
          proof: pickStr(p.proof, locale),
          points: pick<string[]>(p.points, locale, []),
          href: p.href ?? "/",
        })),
        beliefs: (a.beliefs ?? []).map((b: Doc) => ({ text: pickStr(b.text, locale) })),
        quotes: (a.quotes ?? []).map((q: Doc) => ({
          kind: (q.kind ?? "founder") as "founder" | "engineering",
          text: pickStr(q.text, locale),
          author: pickStr(q.author, locale),
          source: q.source ? pickStr(q.source, locale) : undefined,
        })),
        tools: a.tools ?? [],
        education: (a.education ?? []).map((x: Doc) => ({
          school: pickStr(x.school, locale),
          degree: pickStr(x.degree, locale),
          start: x.start ?? "",
          end: x.end ?? "",
          note: pickStr(x.note, locale) || undefined,
        })),
        volunteering: (a.volunteering ?? []).map((v: Doc) => ({
          role: pickStr(v.role, locale),
          org: pickStr(v.org, locale),
          date: v.date ?? "",
          summary: pickStr(v.summary, locale),
          bullets: pick<string[]>(v.bullets, locale, []),
        })),
        languages: (a.languages ?? []).map((l: Doc) => ({ name: pickStr(l.name, locale), level: pickStr(l.level, locale) })),
      };
    },

    async getJourney(locale) {
      const [stops, roles, ventureList, projectList] = await Promise.all([
        fetchDoc<Doc[] | null>(JOURNEY),
        this.getExperience(locale),
        this.getVentures(locale),
        this.getProjects(locale),
      ]);
      const found = <T,>(list: (T | undefined)[]) => list.filter((x): x is T => Boolean(x));
      const raw: RawJourneyStop[] = [];
      for (const s of stops ?? []) {
        if (s._type === "journeyProject") {
          const refs = (s.projects ?? []) as string[];
          raw.push({ type: "project", key: s._key, projects: found(refs.map((slug) => projectList.find((p) => p.slug === slug))) });
          continue;
        }
        const overrides = {
          weight: s.weight === "major" ? ("major" as const) : ("minor" as const),
          sceneBreak: Boolean(s.sceneBreak),
          media: img(s.media, locale),
          highlights: s.highlights ? pick<string[]>(s.highlights, locale, []) : undefined,
          href: s.href as string | undefined,
        };
        if (s._type === "journeyVenture") {
          const venture = ventureList.find((v) => v.slug === s.venture);
          if (venture) raw.push({ type: "venture", key: s._key, venture, ...overrides });
          continue;
        }
        const refs = (s.roles ?? []) as string[];
        raw.push({ type: "role", key: s._key, roles: found(refs.map((id) => roles.find((r) => r.id === id))), ...overrides });
      }
      return buildJourney(raw);
    },

    async getPageCopy(locale, page) {
      // An empty or missing field falls back to the seed, so a half-filled panel never leaves a page blank.
      const doc = (await fetchDoc<Doc | null>(PAGES)) ?? {};
      const seed = pageCopy(seedPages[page], seedPages.contactDefault, locale);
      const cms = pageCopy(doc[page], doc.contactDefault ?? seedPages.contactDefault, locale);
      return {
        statement: cms.statement ?? seed.statement,
        contact: doc[page]?.contactTitleA || doc.contactDefault ? cms.contact : seed.contact,
      };
    },

    async getVentures(locale) {
      const list = (await fetchDoc<Doc[]>(VENTURES)) ?? [];
      return list.map((v) => ({
        slug: v.slug ?? "",
        name: pickStr(v.name, locale),
        role: pickStr(v.role, locale),
        since: v.since ?? "",
        partner: pickStr(v.partner, locale),
        traction: pickStr(v.traction, locale),
        summary: pickStr(v.summary, locale),
        facts: pick<string[]>(v.facts, locale, []),
        note: pick<string[]>(v.note, locale, []),
        links: ((v.links ?? []) as Doc[]).map((l) => ({ label: l.label ?? "", href: l.href ?? "" })),
        cover: img(v.cover, locale),
      }));
    },

    async getExperience(locale) {
      const list = (await fetchDoc<Doc[]>(EXPERIENCE)) ?? [];
      return list.map((e) => ({
        id: e._id,
        company: pickStr(e.company, locale),
        companyKey: companyKey(e.company?.en ?? ""),
        companyNote: pickStr(e.companyNote, locale) || undefined,
        url: e.url,
        role: pickStr(e.role, locale),
        type: (e.type ?? "employee") as ExperienceType,
        start: e.start ?? "",
        end: e.end,
        workplace: pickStr(e.workplace, locale) || undefined,
        location: pickStr(e.location, locale) || undefined,
        summary: pickStr(e.summary, locale),
        bullets: pick<string[]>(e.bullets, locale, []),
        tech: e.tech ?? [],
        spec: { built: pickStr(e.spec?.built, locale), outcome: pickStr(e.spec?.outcome, locale) || undefined },
        projects: ((e.projects ?? []) as Doc[]).map((p) => ({ slug: p.slug, title: pickStr(p.title, locale) })),
      }));
    },

    async getProjects(locale) {
      const list = (await fetchDoc<Doc[]>(PROJECTS)) ?? [];
      return list.map((p) => toSummary(p, locale));
    },

    async getProject(locale, slug) {
      const p = await fetchDoc<Doc | null>(PROJECT, { slug });
      if (!p) return null;
      const project: Project = {
        ...toSummary(p, locale),
        client: pickStr(p.client, locale) || undefined,
        location: pickStr(p.location, locale) || undefined,
        role: pickStr(p.role, locale),
        problem: pick<RichText>(p.problem, locale, []),
        decision: pick<RichText>(p.decision, locale, []),
        result: pick<RichText>(p.result, locale, []),
        gallery: ((p.gallery ?? []) as SImg[]).map((g) => img(g, locale)).filter(Boolean) as Img[],
        stack: p.stack ?? [],
      };
      return project;
    },

    async getProjectSlugs() {
      return (await fetchDoc<string[]>(SLUGS)) ?? [];
    },

    async getRecommendations(locale) {
      const list = (await fetchDoc<Doc[]>(RECOMMENDATIONS)) ?? [];
      return list.map((r) => ({
        id: r._id,
        name: pickStr(r.name, locale),
        headline: r.headline ?? "",
        source: r.source === "mghn.info" ? "mghn.info" : "linkedin",
        lang: translated(r, locale) ? "fa" : "en",
        portrait: img(r.portrait, locale, pickStr(r.name, locale)),
        relationship: pickStr(r.relationship, locale) || undefined,
        date: r.date ? formatDate(r.date, locale) : undefined,
        highlight: translated(r, locale) ? r.highlightFa : (r.highlight ?? ""),
        paragraphs: translated(r, locale) ? r.paragraphsFa : (r.paragraphs ?? []),
        href: r.href,
      }));
    },
  };
  return source;
}
