"use client";

import { useLenis } from "@/lib/lenis";
import { useState } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";

type Item = { id: string; label: string; index: string };

/** Right-edge (inline-end) section rail: one tick per section, numbered mono label for the active one. */
export function ProgressRail({ items }: { items: Item[] }) {
  const [active, setActive] = useState(0);
  const lenis = useLenis();

  useGSAP(
    () => {
      const triggers = items.flatMap((item, i) => {
        const el = document.getElementById(item.id);
        if (!el) return [];
        return [
          ScrollTrigger.create({
            trigger: el,
            start: "top 55%",
            end: "bottom 55%",
            onToggle: (self) => self.isActive && setActive(i),
          }),
        ];
      });
      return () => triggers.forEach((t) => t.kill());
    },
    { dependencies: [items] },
  );

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { duration: 1.6 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      aria-label="Sections"
      data-idle={active === 0 ? "" : undefined}
      className="site-rail fixed top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-2.5 transition-opacity duration-700 ease-house data-idle:pointer-events-none data-idle:opacity-0 xl:flex"
      // Just inside the content edge, on any screen width.
      style={{ insetInlineEnd: "calc(var(--page-pad) - var(--gutter) * 0.4)" }}
    >
      {items.map((item, i) => {
        const on = i === active;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => go(item.id)}
            aria-current={on ? "true" : undefined}
            className="group flex items-center gap-3"
          >
            <span
              className={`text-label rail-chip whitespace-nowrap rounded-full px-2 py-1 transition-[opacity,translate] duration-500 ease-house ${
                on ? "opacity-100" : "translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-60"
              }`}
            >
              {item.index} {item.label}
            </span>
            <span
              className={`block h-px transition-[width,background-color] duration-500 ease-house ${
                on ? "w-8 bg-accent" : "w-3.5 bg-current opacity-40 group-hover:w-5"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
