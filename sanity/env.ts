export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-11-01";

/** True once a Sanity project is connected; otherwise the site reads the local seed. */
export const isSanityConfigured = projectId.length > 0;
