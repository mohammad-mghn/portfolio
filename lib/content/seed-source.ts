import "server-only";
import { experience, milestones } from "@/content/seed/journey";
import { projects } from "@/content/seed/projects";
import { about, recommendations, recommendationsUrl, siteSettings } from "@/content/seed/site";
import { formatDate } from "@/lib/format";
import { companyKey, pick, pickStr, toBlocks, toImg } from "./localize";
import type { BuiltAt, ContentSource, ExperienceType, Locale, PillarKey, Project, ProjectSummary } from "./types";

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

/** Resolves a project's `builtAt` id to the role it points at. A bad id is a seed bug, so fail the build. */
const builtAt = (id: string | undefined, locale: Locale): BuiltAt | undefined => {
  if (!id) return undefined;
  const e = experience.find((x) => x._id === id);
  if (!e) throw new Error(`Seed: project builtAt "${id}" does not match an experience _id`);
  return { experienceId: e._id, companyKey: companyKey(e.company.en), company: pickStr(e.company, locale), type: e.type };
};

const summary = (p: (typeof projects)[number], locale: Locale): ProjectSummary => ({
  slug: p.slug,
  title: pickStr(p.title, locale),
  year: p.year,
  sector: pickStr(p.sector, locale),
  kind: pickStr(p.kind, locale),
  scope: pick(p.scope, locale, []),
  status: p.status,
  group: p.group,
  builtAt: builtAt(p.builtAt, locale),
  partner: pickStr(p.partner, locale) || undefined,
  caseStudy: p.caseStudy,
  color: p.color,
  summary: pickStr(p.summary, locale),
  cover: toImg(p.cover, locale),
  featured: p.featured,
  links: p.links,
});

export const seedSource: ContentSource = {
  async getSiteSettings(locale) {
    const s = siteSettings;
    return {
      name: pickStr(s.name, locale),
      shortName: s.shortName,
      tagline: pickStr(s.tagline, locale),
      headline: pickStr(s.headline, locale),
      positioning: pickStr(s.positioning, locale),
      roles: s.roles.map((r) => ({
        title: pickStr(r.title, locale),
        org: pickStr(r.org, locale),
        href: "href" in r ? r.href : undefined,
      })),
      location: pickStr(s.location, locale),
      email: s.email,
      socials: s.socials.map((x) => ({
        label: x.label,
        href: x.href,
        handle: x.handle,
        group: x.group,
        blurb: "blurb" in x ? pickStr(x.blurb, locale) : undefined,
      })),
      openTo: [...pick<readonly string[]>(s.openTo, locale, [])],
      seoTitle: pickStr(s.seoTitle, locale),
      seoDescription: pickStr(s.seoDescription, locale),
    };
  },

  async getAbout(locale) {
    return {
      statement: pickStr(about.statement, locale),
      bio: about.bio.map((p) => pickStr(p, locale)),
      outside: about.outside.map((p) => pickStr(p, locale)),
      closing: pickStr(about.closing, locale),
      portrait: { src: "/brand/portrait.png", width: 3024, height: 4032, alt: pickStr(siteSettings.name, locale) },
      numbers: about.numbers.map((s) => ({ value: pickStr(s.value, locale), label: pickStr(s.label, locale) })),
      pillars: about.pillars.map((p) => ({
        key: p.key as PillarKey,
        title: pickStr(p.title, locale),
        proof: pickStr(p.proof, locale),
        points: pick(p.points, locale, []),
        href: p.href,
      })),
      beliefs: about.beliefs.map((b) => ({ text: pickStr(b.text, locale) })),
      quotes: about.quotes.map((q) => ({
        kind: q.kind as "founder" | "engineering",
        text: pickStr(q.text, locale),
        author: pickStr(q.author, locale),
        source: "source" in q ? pickStr(q.source, locale) : undefined,
      })),
      tools: about.tools,
      education: about.education.map((x) => ({
        school: pickStr(x.school, locale),
        degree: pickStr(x.degree, locale),
        start: x.start,
        end: x.end,
        note: pickStr(x.note, locale) || undefined,
      })),
      volunteering: about.volunteering.map((v) => ({
        role: pickStr(v.role, locale),
        org: pickStr(v.org, locale),
        date: v.date,
        summary: pickStr(v.summary, locale),
        bullets: pick(v.bullets, locale, []),
      })),
      languages: about.languages.map((l) => ({ name: pickStr(l.name, locale), level: pickStr(l.level, locale) })),
    };
  },

  async getMilestones(locale) {
    return [...milestones].sort(byOrder).map((m) => ({
      id: m._id,
      year: pickStr(m.year, locale),
      title: pickStr(m.title, locale),
      outcome: pickStr(m.outcome, locale),
      kind: m.kind,
      weight: m.weight,
      tags: m.tags,
      media: toImg(m.media, locale),
      sceneBreak: m.sceneBreak,
      placement: m.placement,
    }));
  },

  async getExperience(locale) {
    return [...experience].sort(byOrder).map((e) => ({
      id: e._id,
      company: pickStr(e.company, locale),
      companyKey: companyKey(e.company.en),
      companyNote: pickStr(e.companyNote, locale) || undefined,
      url: e.url,
      role: pickStr(e.role, locale),
      type: e.type as ExperienceType,
      start: e.start,
      end: e.end,
      workplace: pickStr(e.workplace, locale) || undefined,
      location: pickStr(e.location, locale) || undefined,
      summary: pickStr(e.summary, locale),
      bullets: pick(e.bullets, locale, []),
      tech: e.tech,
      spec: { built: pickStr(e.spec.built, locale), outcome: pickStr(e.spec.outcome, locale) || undefined },
      projects: [...projects]
        .filter((p) => p.builtAt === e._id)
        .sort(byOrder)
        .map((p) => ({ slug: p.slug, title: pickStr(p.title, locale) })),
    }));
  },

  async getProjects(locale) {
    return [...projects].sort(byOrder).map((p) => summary(p, locale));
  },

  async getProject(locale, slug) {
    const p = projects.find((x) => x.slug === slug);
    if (!p) return null;
    const project: Project = {
      ...summary(p, locale),
      client: pickStr(p.client, locale) || undefined,
      location: pickStr(p.location, locale) || undefined,
      role: pickStr(p.role, locale),
      problem: toBlocks(pick(p.problem, locale, []), "p"),
      decision: toBlocks(pick(p.decision, locale, []), "d"),
      result: toBlocks(pick(p.result, locale, []), "r"),
      gallery: p.gallery.map((g) => toImg(g, locale)!),
      stack: p.stack,
    };
    return project;
  },

  async getProjectSlugs() {
    return projects.map((p) => p.slug);
  },

  async getRecommendations(locale) {
    return [...recommendations].sort(byOrder).map((r) => ({
      id: r._id,
      name: pickStr(r.name, locale),
      headline: r.headline,
      relationship: pickStr(r.relationship, locale),
      date: formatDate(r.date, locale),
      highlight: r.highlight,
      paragraphs: r.paragraphs,
      href: recommendationsUrl,
    }));
  },
};
