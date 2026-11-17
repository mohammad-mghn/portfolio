import { isSanityConfigured } from "@/sanity/env";
import { Studio } from "./Studio";

export const dynamic = "force-static";

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <main style={{ fontFamily: "ui-monospace, monospace", padding: 32, lineHeight: 1.6, maxWidth: 640 }}>
        <h1 style={{ fontSize: 20 }}>Sanity is not connected yet</h1>
        <p>
          Set <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> and <code>NEXT_PUBLIC_SANITY_DATASET</code>, then reload. Until
          then the site renders from the typed seed in <code>content/seed</code>.
        </p>
      </main>
    );
  }
  return <Studio />;
}
