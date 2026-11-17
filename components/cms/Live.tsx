import { isSanityConfigured } from "@/sanity/env";

/** Mounts <SanityLive/> only when a Sanity project is connected (the seed fallback has nothing to listen to). */
export async function Live() {
  if (!isSanityConfigured) return null;
  const { SanityLive } = await import("@/sanity/lib/live");
  return <SanityLive />;
}
