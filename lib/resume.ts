import "server-only";
import { cache } from "react";
import { getAbout, getExperience, getProjects, getSiteSettings } from "@/lib/content";
import type { Locale } from "@/lib/content";

/**
 * Everything the resume shows, from the same content as the rest of the site.
 * The web resume (/resume) and the PDF (/resume.pdf) both read this, so they never drift apart.
 */
export const getResume = cache(async (locale: Locale) => {
  const [site, about, experience, projects] = await Promise.all([
    getSiteSettings(locale),
    getAbout(locale),
    getExperience(locale),
    getProjects(locale),
  ]);
  const profile = (label: string) => site.socials.find((s) => s.label === label);
  return {
    site,
    about,
    experience,
    projects: projects.filter((p) => p.featured),
    links: [profile("LinkedIn"), profile("GitHub")].filter((s) => s !== undefined),
  };
});

export type ResumeData = Awaited<ReturnType<typeof getResume>>;
