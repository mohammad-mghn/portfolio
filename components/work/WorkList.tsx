"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import type { ProjectSummary } from "@/lib/content/types";
import { gsap, useGSAP } from "@/lib/gsap";

type Row = ProjectSummary & { index: string; yearLabel: string };

/**
 * Editorial project rows. Hover fills the row with the project's colour and a sticky preview
 * follows the cursor (fine pointers only). Clicking opens the case study overlay route.
 */
export function WorkList({ rows, openLabel }: { rows: Row[]; openLabel: string }) {
  const root = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  const move = useRef<{ x: gsap.QuickToFunc; y: gsap.QuickToFunc } | null>(null);
  const shown = useRef(false);

  useGSAP(
    () => {
      const el = preview.current!;
      gsap.set(el, { xPercent: -50, yPercent: -50, scale: 0.6, autoAlpha: 0 });
      move.current = {
        x: gsap.quickTo(el, "x", { duration: 0.7, ease: "power3" }),
        y: gsap.quickTo(el, "y", { duration: 0.7, ease: "power3" }),
      };
      return () => {
        gsap.killTweensOf(el);
        move.current = null;
      };
    },
    { scope: root },
  );

  function onEnter(i: number, e: React.PointerEvent) {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setActive(i);
    // A row can slide under a still cursor while scrolling: no pointermove fires, so place the
    // preview at the pointer before it fades in instead of leaving it at its last (or 0,0) spot.
    if (!shown.current) {
      move.current?.x(e.clientX, e.clientX);
      move.current?.y(e.clientY, e.clientY);
    }
    shown.current = true;
    gsap.to(preview.current, { autoAlpha: 1, scale: 1, duration: 0.6, ease: "house", overwrite: "auto" });
  }
  function onLeave() {
    shown.current = false;
    gsap.to(preview.current, { autoAlpha: 0, scale: 0.6, duration: 0.5, ease: "house", overwrite: "auto" });
  }
  function onMove(e: React.PointerEvent) {
    move.current?.x(e.clientX);
    move.current?.y(e.clientY);
  }

  return (
    <div ref={root} onPointerMove={onMove} onPointerLeave={onLeave}>
      <ul>
        {rows.map((p, i) => (
          <li key={p.slug} data-reveal>
            <Link
              href={`/work/${p.slug}`}
              scroll={false}
              onPointerEnter={(e) => onEnter(i, e)}
              onFocus={() => setActive(i)}
              className="work-row grid-12 relative items-baseline gap-y-2 border-t border-hair py-6 last:border-b md:py-8"
              style={{ "--c": p.color } as React.CSSProperties}
            >
              <span className="text-label relative col-span-1 opacity-60">{p.index}</span>
              <span className="text-big relative col-span-3 md:col-span-5">{p.title}</span>
              <span className="relative col-span-2 col-start-2 text-ink-soft md:col-span-3 md:col-start-auto">
                {p.sector}
              </span>
              <span className="text-label relative col-span-1 md:col-span-1">{p.yearLabel}</span>
              <span className="text-label relative col-span-full hidden items-center justify-end gap-2 md:col-span-2 md:flex">
                <span className="work-row-cta">{openLabel}</span>
                <span aria-hidden className="inline-block rtl:-scale-x-100">→</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div
        ref={preview}
        aria-hidden
        // Hidden in CSS from the first paint; GSAP's autoAlpha takes over once the page is interactive.
        className="pointer-events-none invisible fixed left-0 top-0 z-30 hidden aspect-[16/10] w-[min(30vw,460px)] overflow-hidden rounded-[3px] opacity-0 shadow-2xl [@media(pointer:fine)]:block"
      >
        {rows.map((p, i) =>
          p.cover ? (
            <Image
              key={p.slug}
              src={p.cover.src}
              alt=""
              fill
              sizes="460px"
              className={`object-cover object-top transition-opacity duration-500 ${active === i ? "opacity-100" : "opacity-0"}`}
            />
          ) : null,
        )}
      </div>
    </div>
  );
}
