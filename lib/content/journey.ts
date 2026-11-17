import type {
  Experience,
  Img,
  JourneyLink,
  JourneyProjectStop,
  JourneyRoleStop,
  JourneyStop,
  ProjectSummary,
  Venture,
} from "./types";

type Overrides = {
  weight: "major" | "minor";
  sceneBreak?: boolean;
  media?: Img;
  highlights?: string[];
  href?: string;
};

/**
 * A journey stop after its references are resolved and its text is localised. Both content
 * sources (seed and Sanity) produce this shape and hand it to `buildJourney`.
 */
export type RawJourneyStop =
  | { type: "note"; key: string; label: string; title: string; lines: string[]; weight: "major" | "minor"; href?: string }
  | ({ type: "role"; key: string; roles: Experience[] } & Overrides)
  | ({ type: "venture"; key: string; venture: Venture } & Overrides)
  | { type: "project"; key: string; projects: ProjectSummary[] };

const custom = (href: string): JourneyLink => ({ href, kind: /^https?:/.test(href) ? "external" : "page" });

/** A case study opens in the overlay; a short project goes to its live site when that is still online. */
function projectLink(p: ProjectSummary): JourneyLink {
  if (!p.caseStudy && p.status === "live" && p.links.live) return { href: p.links.live, kind: "external" };
  return { href: `/work/${p.slug}`, kind: "modal" };
}

function attachOf(projects: ProjectSummary[]): JourneyProjectStop["attach"] {
  const p = projects[0];
  if (p.builtAt?.type === "employee") return { kind: "builtAt", company: p.builtAt.company };
  if (p.builtAt?.type === "freelance") return { kind: "freelance" };
  return { kind: p.group === "cofounded" ? "cofounded" : "personal" };
}

/**
 * Turns resolved stops into what the journey renders. Everything a card shows is derived here:
 * a role stop takes its name, dates and "built" lines from its roles, a project card takes its
 * title and cover from the project. Stops whose references came back empty are dropped.
 */
export function buildJourney(raw: RawJourneyStop[]): JourneyStop[] {
  const out: JourneyStop[] = [];
  for (const stop of raw) {
    if (stop.type === "note") {
      if (!stop.title) continue;
      out.push({
        kind: "note",
        id: stop.key,
        weight: stop.weight,
        label: stop.label,
        title: stop.title,
        lines: stop.lines.filter(Boolean).slice(0, 3),
        link: stop.href ? custom(stop.href) : undefined,
      });
      continue;
    }
    if (stop.type === "project") {
      if (stop.projects.length === 0) continue;
      out.push({
        kind: "project",
        id: stop.key,
        weight: "project",
        attach: attachOf(stop.projects),
        items: stop.projects.map((p) => ({
          slug: p.slug,
          title: p.title,
          kind: p.kind,
          year: p.year,
          cover: p.cover,
          link: projectLink(p),
        })),
      });
      continue;
    }

    const base = { id: stop.key, weight: stop.weight, media: stop.media, sceneBreak: Boolean(stop.sceneBreak) };

    if (stop.type === "venture") {
      const v = stop.venture;
      const role: JourneyRoleStop = {
        kind: "role",
        ...base,
        year: v.since.slice(0, 4),
        title: v.name,
        employment: "founder",
        roles: [{ title: v.role, start: v.since }],
        highlights: (stop.highlights ?? [v.summary, v.traction, v.partner]).filter(Boolean).slice(0, 3),
        link: stop.href ? custom(stop.href) : { href: `/founding#venture-${v.slug}`, kind: "page" },
      };
      out.push(role);
      continue;
    }

    const roles = [...stop.roles].sort((a, b) => a.start.localeCompare(b.start));
    if (roles.length === 0) continue;
    const first = roles[0];
    out.push({
      kind: "role",
      ...base,
      year: first.start.slice(0, 4),
      title: first.company,
      employment: first.type,
      roles: roles.map((r) => ({ title: r.role, start: r.start, end: r.end })),
      highlights: (stop.highlights ?? roles.map((r) => r.spec.built)).filter(Boolean).slice(0, 3),
      link: stop.href ? custom(stop.href) : { href: `/engineering#${first.companyKey}`, kind: "page" },
    });
  }
  return out;
}
