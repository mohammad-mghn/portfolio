"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import { useEffect } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";

/**
 * Page-level reveal system. Server components opt in with attributes:
 *  - data-split   → heading lines rise out of a mask (lines only — safe for Persian joining)
 *  - data-reveal  → element fades up when it enters the viewport (batched)
 * Re-runs when the page changes. Opening or closing a case study over a page changes the URL but
 * not the page underneath (the overlay is a separate route slot), so that must not restart the
 * reveals: it would hide the whole page again and replay every animation.
 * Reduced-motion users get static content (see globals.css).
 */
export function ScrollReveals() {
  // The page slot's own segments: they stay the same while the overlay slot opens and closes.
  const page = useSelectedLayoutSegments().join("/");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
          SplitText.create(el, {
            type: "lines",
            mask: "lines",
            aria: "none",
            linesClass: "split-line",
            autoSplit: true,
            onSplit(self) {
              gsap.set(el, { visibility: "visible" });
              const immediate = el.hasAttribute("data-split-now");
              return gsap.from(self.lines, {
                yPercent: 110,
                duration: 1.05,
                stagger: 0.09,
                ease: "house",
                delay: immediate ? 0.15 : 0,
                scrollTrigger: immediate ? undefined : { trigger: el, start: "top 88%", once: true },
              });
            },
          });
        });

        ScrollTrigger.batch("[data-reveal]", {
          start: "top 92%",
          once: true,
          onEnter: (els) =>
            gsap.to(els, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.07, ease: "house", overwrite: true }),
        });
      });
      return () => mm.revert();
    },
    { dependencies: [page], revertOnUpdate: true },
  );

  // Content height changes (3D journey switching modes, images, fonts) → recompute trigger positions.
  useEffect(() => {
    let raf = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    ro.observe(document.body);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return null;
}
