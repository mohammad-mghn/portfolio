import "server-only";
import { sanityFetch } from "@/sanity/lib/live";
import { createSanitySource } from "./sanity-mapper";

/** Sanity as the content source, fetched through next-sanity's live cache (see sanity/lib/live.ts). */
export const sanitySource = createSanitySource(async (query, params = {}) => (await sanityFetch({ query, params })).data);
