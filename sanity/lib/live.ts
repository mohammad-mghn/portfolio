import "server-only";
import { defineLive } from "next-sanity/live";
import { client } from "./client";

/**
 * Live content: `sanityFetch` caches with sync tags; `<SanityLive/>` (in the layout) listens to the
 * Live Content API and revalidates exactly what changed. A public dataset needs no token; the
 * optional read token only matters for drafts.
 */
export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: process.env.SANITY_API_READ_TOKEN || false,
  browserToken: false,
});
