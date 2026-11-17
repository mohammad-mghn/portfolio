"use client";

import Lenis from "lenis";
import { useContext, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { LenisSetterContext } from "@/lib/lenis";

/**
 * Creates the Lenis smooth-scroll instance and drives it from GSAP's ticker, so ScrollTrigger and
 * Lenis share one clock. Reduced-motion users keep native wheel scrolling (smoothWheel off).
 * Renders nothing; it hands the instance to <SmoothScroll/> through context.
 */
export function LenisRuntime() {
  const setLenis = useContext(LenisSetterContext);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const lenis = new Lenis({ autoRaf: false, smoothWheel: !mq.matches, lerp: 0.11, wheelMultiplier: 0.9, anchors: true });
    const update = (time: number) => lenis.raf(time * 1000);
    const sync = () => {
      lenis.options.smoothWheel = !mq.matches;
    };
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    mq.addEventListener("change", sync);
    setLenis(lenis);
    ScrollTrigger.refresh();
    return () => {
      mq.removeEventListener("change", sync);
      gsap.ticker.remove(update);
      lenis.destroy();
      setLenis(undefined);
    };
  }, [setLenis]);

  return null;
}
