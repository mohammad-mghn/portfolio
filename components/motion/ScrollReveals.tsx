"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { whenBoundariesReady } from "@/lib/hydration";
import { markParked, registerRevealer, swarmStore } from "@/lib/swarm/store";

const swarmOn = () => swarmStore.mode() !== "off";
const swarmOff = () => false;

/** Scrolling faster than this (px per second), an animation would only hide what the reader is flying past. */
const FLYING = 2400;

/**
 * Page-level reveal system. Server components opt in with attributes:
 *  - data-split   → heading lines rise out of a mask (lines only — safe for Persian joining)
 *  - data-reveal  → element fades up when it enters the viewport (batched)
 *
 * Content is visible without this code (nothing is hidden in CSS). When it starts, it hides only
 * what is still below the screen and animates that in on arrival; whatever the reader can already
 * see, or has scrolled past, is left alone. Scrolling fast skips the animation, so content is
 * there the moment it is on screen.
 *
 * Re-runs when the page changes. Opening or closing a case study over a page changes the URL but
 * not the page underneath (the overlay is a separate route slot), so that must not restart the
 * reveals. Reduced-motion users get static content.
 */
export function ScrollReveals() {
  // The page slot's own segments: they stay the same while the overlay slot opens and closes.
  const page = useSelectedLayoutSegments().join("/");

  // The agent build mode (lib/swarm) rebuilds the page its own way. While it runs, reveals stand down
  // completely (headings un-split, nothing hidden) and report that they did; they start again after.
  const building = useSyncExternalStore(swarmStore.subscribe, swarmOn, swarmOff);
  useEffect(() => registerRevealer(), []);
  useEffect(() => {
    if (building) markParked();
  }, [building]);

  // Reveals touch elements all over the page, so they start only once every deferred section on
  // this page is interactive (see lib/hydration). `armed` is the page they are set up for.
  const [armed, setArmed] = useState<string | null>(null);
  useEffect(() => {
    let current = true;
    void whenBoundariesReady().then(() => {
      if (current) setArmed(page);
    });
    return () => {
      current = false;
    };
  }, [page]);

  useGSAP(
    () => {
      if (armed !== page || building) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Still below the screen (with a small margin): safe to hide without the reader noticing.
        const edge = window.innerHeight * 1.05;
        const waiting = (el: HTMLElement) => el.getBoundingClientRect().top > edge;

        gsap.utils
          .toArray<HTMLElement>("[data-split]")
          .filter(waiting)
          .forEach((el) => {
            SplitText.create(el, {
              type: "lines",
              mask: "lines",
              aria: "none",
              linesClass: "split-line",
              autoSplit: true,
              onSplit(self) {
                return gsap.from(self.lines, {
                  yPercent: 110,
                  duration: 0.8,
                  stagger: 0.07,
                  ease: "power3.out",
                  scrollTrigger: {
                    trigger: el,
                    start: "top 95%",
                    once: true,
                    onEnter: (trigger) => {
                      if (Math.abs(trigger.getVelocity()) > FLYING) trigger.animation?.progress(1);
                    },
                  },
                });
              },
            });
          });

        const targets = gsap.utils.toArray<HTMLElement>("[data-reveal]").filter(waiting);
        gsap.set(targets, { autoAlpha: 0, y: 24 });
        ScrollTrigger.batch(targets, {
          start: "top 97%",
          once: true,
          onEnter: (els, triggers) => {
            const flying = Math.abs(triggers[0]?.getVelocity() ?? 0) > FLYING;
            gsap.to(els, {
              autoAlpha: 1,
              y: 0,
              duration: flying ? 0.15 : 0.7,
              // The whole batch is in within 0.3s, however many elements arrive together.
              stagger: flying ? 0 : { amount: Math.min(0.3, els.length * 0.05) },
              ease: "power3.out",
              overwrite: true,
            });
          },
        });
      });
      return () => mm.revert();
    },
    { dependencies: [page, armed, building], revertOnUpdate: true },
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
