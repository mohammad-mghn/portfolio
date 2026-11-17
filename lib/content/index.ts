import "server-only";
import { cache } from "react";
import { isSanityConfigured } from "@/sanity/env";
import { seedSource } from "./seed-source";
import type { ContentSource, Locale } from "./types";

export type * from "./types";

/**
 * Picks the content source once per request: Sanity when a project is configured,
 * otherwise the typed local seed. The Sanity module is imported lazily so the site
 * builds and runs before any CMS exists.
 */
const getSource = cache(async (): Promise<ContentSource> => {
  if (!isSanityConfigured) return seedSource;
  const { sanitySource } = await import("./sanity-source");
  return sanitySource;
});

export const getSiteSettings = cache(async (locale: Locale) => (await getSource()).getSiteSettings(locale));
export const getAbout = cache(async (locale: Locale) => (await getSource()).getAbout(locale));
export const getJourney = cache(async (locale: Locale) => (await getSource()).getJourney(locale));
export const getVentures = cache(async (locale: Locale) => (await getSource()).getVentures(locale));
export const getExperience = cache(async (locale: Locale) => (await getSource()).getExperience(locale));
export const getProjects = cache(async (locale: Locale) => (await getSource()).getProjects(locale));
export const getProject = cache(async (locale: Locale, slug: string) => (await getSource()).getProject(locale, slug));
export const getProjectSlugs = cache(async () => (await getSource()).getProjectSlugs());
export const getRecommendations = cache(async (locale: Locale) => (await getSource()).getRecommendations(locale));
