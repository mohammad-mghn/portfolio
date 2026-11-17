"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";

/**
 * Drives Lenis from GSAP's ticker so ScrollTrigger and Lenis share one clock.
 * Must live *inside* <ReactLenis>: ReactLenis creates its instance in an effect and exposes it via
 * context on the next render, so `useLenis()` is the only reliable way to know when it exists.
 */
function LenisTicker() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    const update = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.refresh();
    return () => {
      gsap.ticker.remove(update);
      lenis.off("scroll", ScrollTrigger.update);
    };
  }, [lenis]);

  return null;
}

/**
 * Lenis smooth scrolling. Reduced-motion users keep native wheel scrolling (smoothWheel off) —
 * the provider stays mounted either way so the page tree never remounts.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const options = useMemo(
    () => ({ autoRaf: false, smoothWheel: !reduced, lerp: 0.11, wheelMultiplier: 0.9, anchors: true }),
    [reduced],
  );

  return (
    <ReactLenis root options={options}>
      <LenisTicker />
      {children}
    </ReactLenis>
  );
}

export { prefersReducedMotion };
