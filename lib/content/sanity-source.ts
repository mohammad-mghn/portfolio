import "server-only";
import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";
import { formatDate } from "@/lib/format";
import { companyKey, pick, pickStr } from "./localize";
import type {
  BuiltAt,
  ContentSource,
  ExperienceType,
  Img,
  L,
  Locale,
  MilestoneKind,
  PillarKey,
  Project,
  ProjectGroup,
  ProjectStatus,
  ProjectSummary,
  RichText,
  SocialGroup,
} from "./types";

type SImg = { src?: string; width?: number; height?: number; lqip?: string; alt?: L } | null;

const IMG = `{ "src": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height, "lqip": asset->metadata.lqip, alt }`;

const img = (i: SImg | undefined, locale: Locale): Img | undefined =>
  i?.src ? { src: i.src, width: i.width ?? 1600, height: i.height ?? 1000, alt: pickStr(i.alt, locale), lqip: i.lqip } : undefined;

const SITE = defineQuery(`*[_type == "siteSettings"][0]`);
const ABOUT = defineQuery(`*[_type == "about"][0]{ ..., "portrait": portrait${IMG} }`);
const MILESTONES = defineQuery(`*[_type == "milestone"] | order(order asc){ ..., "media": media${IMG} }`);
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
const RECOMMENDATIONS = defineQuery(`*[_type == "recommendation"] | order(order asc)`);

// GROQ results are typed loosely here; the DTO mapping below is the contract the UI relies on.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Doc = Record<string, any>;

async function fetchDoc<T = Doc>(query: string, params: Record<string, string> = {}): Promise<T> {
  const { data } = await sanityFetch({ query, params });
  return data as T;
}

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

export const sanitySource: ContentSource = {
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

  async getMilestones(locale) {
    const list = (await fetchDoc<Doc[]>(MILESTONES)) ?? [];
    return list.map((m) => ({
      id: m._id,
      year: pickStr(m.year, locale),
      title: pickStr(m.title, locale),
      outcome: pickStr(m.outcome, locale),
      kind: (m.kind ?? "career") as MilestoneKind,
      weight: m.weight === "major" ? "major" : "minor",
      tags: m.tags ?? [],
      media: img(m.media, locale),
      sceneBreak: Boolean(m.sceneBreak),
      placement: m.placement ?? "auto",
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
      relationship: pickStr(r.relationship, locale),
      date: r.date ? formatDate(r.date, locale) : "",
      highlight: r.highlight ?? "",
      paragraphs: r.paragraphs ?? [],
      href: r.href,
    }));
  },
};
