"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";

/**
 * Page-level reveal system. Server components opt in with attributes:
 *  - data-split   → heading lines rise out of a mask (lines only — safe for Persian joining)
 *  - data-reveal  → element fades up when it enters the viewport (batched)
 * Re-runs on every route change. Reduced-motion users get static content (see globals.css).
 */
export function ScrollReveals() {
  const pathname = usePathname();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
          SplitText.create(el, {
            type: "lines",
            mask: "lines",
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
    { dependencies: [pathname], revertOnUpdate: true },
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
