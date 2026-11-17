import type { PortableTextBlock } from "next-sanity";
import type { Locale } from "@/i18n/routing";

export type { Locale };

/** A localised value as stored in Sanity / the seed (`{en, fa}`). */
export type L<T = string> = { en: T; fa?: T };

/** Image DTO shared by both content sources. */
export type Img = {
  src: string;
  width: number;
  height: number;
  alt: string;
  lqip?: string;
};

export type RichText = PortableTextBlock[];

/** "content" = channels Mohammad publishes on; "professional" = profiles and code. */
export type SocialGroup = "content" | "professional";

export type Social = {
  label: string;
  href: string;
  handle?: string;
  group: SocialGroup;
  /** One line on what's there, e.g. "Persian videos on engineering and building". */
  blurb?: string;
};

/** A current role, shown in the hero: "Software Engineer @ Nobar". */
export type Role = { title: string; org: string; href?: string };

export type SiteSettings = {
  name: string;
  shortName: string;
  /** "Engineering · Founding · Product building". */
  tagline: string;
  /** "Software engineer, founder and product builder." */
  headline: string;
  positioning: string;
  roles: Role[];
  /** Shown instead of a city: "Remote, worldwide". */
  location: string;
  email: string;
  socials: Social[];
  /** What Mohammad is open to: jobs, co-founding and partnerships, client work. */
  openTo: string[];
  resumeUrl?: string;
  seoTitle: string;
  seoDescription: string;
};

export type Stat = { value: string; label: string };

export type PillarKey = "engineering" | "founding" | "product";

/** One of the three pillars, in order: Engineering, Founding, Product building. */
export type Pillar = { key: PillarKey; title: string; proof: string; points: string[]; href: string };

/** Something Mohammad believes, in his own words (no outside source). */
export type Belief = { text: string };

/** A quote from someone else, always with its real source. */
export type Quote = { text: string; author: string; source?: string; kind: "founder" | "engineering" };

export type About = {
  statement: string;
  bio: string[];
  /** "Outside my main job" bullets from the LinkedIn About. */
  outside: string[];
  closing: string;
  portrait?: Img;
  numbers: Stat[];
  pillars: Pillar[];
  beliefs: Belief[];
  quotes: Quote[];
  tools: string[];
  education: Education[];
  volunteering: Volunteering[];
  languages: { name: string; level: string }[];
};

export type Education = { school: string; degree: string; start: string; end: string; note?: string };
export type Volunteering = { role: string; org: string; date: string; summary: string; bullets: string[] };

/** Who wrote a LinkedIn recommendation, and the recommendation itself (kept verbatim, in English). */
export type Recommendation = {
  id: string;
  name: string;
  headline: string;
  /** e.g. "Worked with Mohammad on the same team". */
  relationship: string;
  /** e.g. "Aug 2026". */
  date: string;
  /** One sentence lifted verbatim from the text, shown big. */
  highlight: string;
  /** Full text, verbatim, split into paragraphs. */
  paragraphs: string[];
  href?: string;
};

/** Where a journey card goes: a case study in the overlay, a page anchor, or another site. */
export type JourneyLink = { href: string; kind: "modal" | "page" | "external" };

/** A job, a role group at one company, or a co-founded venture: the big stops of the journey. */
export type JourneyRoleStop = {
  kind: "role";
  id: string;
  /** "major" stops (2025 on) are drawn bigger than "minor" early ones. */
  weight: "major" | "minor";
  /** Year the first role started, "2024". */
  year: string;
  /** Company or venture name. */
  title: string;
  employment: ExperienceType;
  /** Roles held there, oldest first. Dates are "YYYY-MM". */
  roles: { title: string; start: string; end?: string }[];
  /** Up to 3 short lines on what was built. */
  highlights: string[];
  media?: Img;
  link: JourneyLink;
  sceneBreak: boolean;
};

export type JourneyProjectItem = {
  slug: string;
  title: string;
  kind: string;
  year: string;
  cover?: Img;
  link: JourneyLink;
};

/** One small card with 1–3 projects, shown after the role they were built in. */
export type JourneyProjectStop = {
  kind: "project";
  id: string;
  weight: "project";
  /** How the projects relate to the role before them. */
  attach: { kind: "builtAt"; company: string } | { kind: "freelance" | "cofounded" | "personal" };
  items: JourneyProjectItem[];
};

export type JourneyStop = JourneyRoleStop | JourneyProjectStop;

/** A product Mohammad co-founded, as told on the Founding page. */
export type Venture = {
  slug: string;
  name: string;
  role: string;
  /** "YYYY-MM". */
  since: string;
  partner: string;
  traction: string;
  summary: string;
  facts: string[];
  note: string[];
  links: { label: string; href: string }[];
  cover?: Img;
};

export type ExperienceType = "founder" | "employee" | "freelance" | "community";

/** One role, word for word from LinkedIn. Roles at the same company share `company` and `companyKey`. */
export type Experience = {
  id: string;
  company: string;
  /** Slug of the English company name: the anchor on /engineering ("nobar", "pishgaman-farda"). */
  companyKey: string;
  companyNote?: string;
  url?: string;
  role: string;
  type: ExperienceType;
  start: string;
  end?: string;
  workplace?: string;
  location?: string;
  summary: string;
  bullets: string[];
  tech: string[];
  /** Small spec block: what was built first, then the outcome. */
  spec: { built: string; outcome?: string };
  /** Client projects built in this role, linked to their pages on /work. */
  projects: { slug: string; title: string }[];
};

export type ProjectStatus = "live" | "nda" | "offline" | "archived";

/** How a project relates to Mohammad: a product he co-founded, a client project, or open source / personal work. */
export type ProjectGroup = "cofounded" | "client" | "personal";

/** The role a client project was built in: a full-time job (type "employee") or the freelance years. */
export type BuiltAt = { experienceId: string; companyKey: string; company: string; type: ExperienceType };

export type ProjectLinks = { live?: string; repo?: string; figma?: string };

export type ProjectSummary = {
  slug: string;
  title: string;
  year: string;
  sector: string;
  kind: string;
  scope: string[];
  status: ProjectStatus;
  group: ProjectGroup;
  builtAt?: BuiltAt;
  /** "Co-founded with …" for co-founded products. */
  partner?: string;
  /** Full case study page (true) or a short card (false). */
  caseStudy: boolean;
  color: string;
  summary: string;
  cover?: Img;
  featured: boolean;
  links: ProjectLinks;
};

export type Project = ProjectSummary & {
  client?: string;
  location?: string;
  role: string;
  problem: RichText;
  decision: RichText;
  result: RichText;
  gallery: Img[];
  stack: string[];
};

export interface ContentSource {
  getSiteSettings(locale: Locale): Promise<SiteSettings>;
  getAbout(locale: Locale): Promise<About>;
  getJourney(locale: Locale): Promise<JourneyStop[]>;
  getVentures(locale: Locale): Promise<Venture[]>;
  getExperience(locale: Locale): Promise<Experience[]>;
  getProjects(locale: Locale): Promise<ProjectSummary[]>;
  getProject(locale: Locale, slug: string): Promise<Project | null>;
  getProjectSlugs(): Promise<string[]>;
  getRecommendations(locale: Locale): Promise<Recommendation[]>;
}
