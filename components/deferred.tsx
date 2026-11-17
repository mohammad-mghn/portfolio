"use client";

import { lazy, Suspense, useEffect, useId, type ComponentType, type JSX } from "react";
import { afterFirstPaint } from "@/lib/after-paint";
import { boundaryGone, boundaryPending, boundaryReady } from "@/lib/hydration";

/**
 * Components whose code loads only after the first paint.
 *
 * Everything here needs GSAP or Lenis: the journey scene, the recommendation row, reveals, the
 * menu overlay… None of it is needed to show the page, and together it is over a third of the
 * site's JavaScript. So the server still renders each component's HTML as usual, the browser
 * shows it, and only then is the code fetched and the component made interactive (React keeps
 * the server HTML in place while a lazy component is pending).
 * Nothing that loads up-front may import "@/lib/gsap" or "lenis", or the saving is lost.
 */
const loaders: (() => Promise<unknown>)[] = [];

/** Sits inside a deferred section's boundary: its effect runs once that section is interactive. */
function Ready({ id }: { id: string }) {
  useEffect(() => boundaryReady(id), [id]);
  return null;
}

function deferred<P extends object>(load: () => Promise<ComponentType<P>>) {
  // One shared promise per component, so warming the cache below and rendering use the same request.
  let pending: Promise<{ default: ComponentType<P> }> | undefined;
  const once = () => (pending ??= load().then((component) => ({ default: component })));
  loaders.push(once);
  const Lazy = lazy(() => afterFirstPaint().then(once));
  return function Deferred(props: P) {
    // Registered with lib/hydration so page-wide DOM work (reveals) can wait for this section.
    const id = useId();
    useEffect(() => {
      boundaryPending(id);
      return () => boundaryGone(id);
    }, [id]);
    return (
      <Suspense fallback={null}>
        {/* Props are forwarded untouched; the cast only bridges React.lazy's generic typing. */}
        <Lazy {...(props as P & JSX.IntrinsicAttributes)} />
        <Ready id={id} />
      </Suspense>
    );
  };
}

export const ScrollReveals = deferred(() => import("@/components/motion/ScrollReveals").then((m) => m.ScrollReveals));
export const LenisRuntime = deferred(() => import("@/components/motion/LenisRuntime").then((m) => m.LenisRuntime));
export const PageWipe = deferred(() => import("@/components/motion/PageWipe").then((m) => m.PageWipe));
export const Menu = deferred(() => import("@/components/chrome/Menu").then((m) => m.Menu));
export const ProgressRail = deferred(() => import("@/components/chrome/ProgressRail").then((m) => m.ProgressRail));
export const DarkSection = deferred(() => import("@/components/home/DarkSection").then((m) => m.DarkSection));
export const RecommendationCarousel = deferred(() =>
  import("@/components/home/RecommendationCarousel").then((m) => m.RecommendationCarousel),
);
export const Journey3D = deferred(() => import("@/components/journey/Journey3D").then((m) => m.Journey3D));
export const WorkList = deferred(() => import("@/components/work/WorkList").then((m) => m.WorkList));
export const Marquee = deferred(() => import("@/components/ui/Marquee").then((m) => m.Marquee));
export const SwarmBox = deferred(() => import("@/components/swarm/SwarmBox").then((m) => m.SwarmBox));

// Once the page is painted, fetch all of them, so a later page that needs one does not have to wait.
// The same moment switches on the fonts the first paint can do without (see ".fonts-late" in globals.css).
if (typeof window !== "undefined") {
  afterFirstPaint().then(() => {
    document.documentElement.classList.add("fonts-late");
    const idle = window.requestIdleCallback ?? ((run: () => void) => setTimeout(run, 200));
    idle(() => loaders.forEach((load) => void load().catch(() => {})));
  });
}
