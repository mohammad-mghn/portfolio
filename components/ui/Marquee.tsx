"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * An endless row of pills that drifts sideways. Both edges fade into the background (see
 * .marquee-mask), and hovering or focusing it eases the row to a stop instead of freezing it.
 * The list is rendered twice and moved by exactly half its width, so the loop has no seam.
 * With reduced motion it is a static, scrollable row.
 */
export function Marquee({ items, className }: { items: string[]; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const drift = useRef<gsap.core.Tween | null>(null);

  useGSAP(
    () => {
      const list = root.current?.querySelector("ul");
      if (!list) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        drift.current = gsap.to(list, { xPercent: -50, duration: 32, ease: "none", repeat: -1 });
        return () => {
          drift.current?.kill();
          drift.current = null;
          gsap.set(list, { clearProps: "transform" });
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // Ease the speed itself down to zero and back up, rather than pausing on the spot.
  const speed = (to: number) => {
    if (drift.current) gsap.to(drift.current, { timeScale: to, duration: to ? 1 : 0.7, ease: "power2.out", overwrite: true });
  };

  return (
    <div
      ref={root}
      dir="ltr"
      className={`marquee-mask ${className ?? ""}`}
      onPointerEnter={() => speed(0)}
      onPointerLeave={() => speed(1)}
      onFocus={() => speed(0)}
      onBlur={() => speed(1)}
    >
      <ul className="marquee">
        {[...items, ...items].map((item, i) => (
          <li
            key={`${item}-${i}`}
            aria-hidden={i >= items.length}
            // Space after every pill (not a flex gap), so the doubled list is exactly twice one set.
            className="text-lead me-3 whitespace-nowrap rounded-full border border-hair px-4 py-2"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
