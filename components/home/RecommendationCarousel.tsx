"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Link } from "@/i18n/navigation";
import type { Recommendation } from "@/lib/content/types";

type Labels = {
  region: string;
  prev: string;
  next: string;
  of: string;
  readFull: string;
  oldSite: string;
  original?: string;
};

/**
 * Recommendations as a horizontal row of equal-height cards that snaps card by card. Every card is
 * always rendered, so moving between them never changes the height of the section. The next card
 * peeks in from the edge; arrows, trackpad, touch and the keyboard all move the row.
 * Quotes stay in English (dir/lang set) on every locale; the full text lives on /recommendations.
 */
export function RecommendationCarousel({
  items,
  indexes,
  labels,
}: {
  items: Recommendation[];
  /** Pre-formatted "01", "02"… in the page's digits. */
  indexes: string[];
  labels: Labels;
}) {
  const track = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  // The current card is the one whose leading edge sits at the start of the row. On a wide screen
  // two cards fit, so "most visible" would be ambiguous; at the very end the last card is current.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const style = getComputedStyle(el);
      const rtl = style.direction === "rtl";
      const pad = parseFloat(style.paddingInlineStart);
      const row = el.getBoundingClientRect();
      const atEnd = el.scrollWidth - el.clientWidth - Math.abs(el.scrollLeft) < 2;
      let best = 0;
      let bestGap = Infinity;
      [...el.children].forEach((card, i) => {
        const box = card.getBoundingClientRect();
        const gap = Math.abs(rtl ? box.right - (row.right - pad) : box.left - (row.left + pad));
        if (gap < bestGap) {
          bestGap = gap;
          best = i;
        }
      });
      setActive(atEnd && el.scrollWidth > el.clientWidth ? el.children.length - 1 : best);
    };
    const onScroll = () => {
      frame ||= requestAnimationFrame(measure);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [items.length]);

  function go(d: number) {
    const el = track.current;
    if (!el) return;
    // Going back from the end: the last cards share one resting position, so step from the first of them.
    const from = d < 0 ? Math.min(active, firstAtEnd(el)) : active;
    const card = el.children[Math.min(items.length - 1, Math.max(0, from + d))] as HTMLElement | undefined;
    if (!card) return;
    // Line the card's leading edge up with the row's padding, measured on screen so it holds in RTL too.
    const style = getComputedStyle(el);
    const pad = parseFloat(style.paddingInlineStart);
    const row = el.getBoundingClientRect();
    const box = card.getBoundingClientRect();
    const delta = style.direction === "rtl" ? box.right - (row.right - pad) : box.left - (row.left + pad);
    el.scrollBy({ left: delta, behavior: "smooth" });
  }

  /** Index of the first card that is aligned to the start when the row is scrolled to its end. */
  function firstAtEnd(el: HTMLElement) {
    const max = el.scrollWidth - el.clientWidth;
    const cards = [...el.children] as HTMLElement[];
    const first = cards[0];
    for (let i = 0; i < cards.length; i++) {
      // Distance this card would need the row to scroll, compared with how far the row can scroll.
      if (Math.abs(cards[i].offsetLeft - first.offsetLeft) >= max - 2) return i;
    }
    return cards.length - 1;
  }

  const arrow =
    "flex size-11 items-center justify-center rounded-full border border-ink/25 transition-[color,background-color,border-color,opacity] duration-500 ease-house hover:border-ink hover:bg-ink hover:text-paper disabled:pointer-events-none disabled:opacity-30";

  return (
    <div className="mt-(--space-section-sm)" role="region" aria-roledescription="carousel" aria-label={labels.region}>
      <div className="flex items-center justify-between px-gutter" data-reveal>
        <p className="text-label text-muted" aria-live="polite">
          {indexes[active]} {labels.of} {indexes[items.length - 1]}
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={() => go(-1)} disabled={active === 0} aria-label={labels.prev} className={arrow}>
            <span aria-hidden className="rtl:-scale-x-100">
              ←
            </span>
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            disabled={active === items.length - 1}
            aria-label={labels.next}
            className={arrow}
          >
            <span aria-hidden className="rtl:-scale-x-100">
              →
            </span>
          </button>
        </div>
      </div>

      <ul
        ref={track}
        tabIndex={0}
        className="mt-6 flex snap-x snap-mandatory scroll-px-(--gutter) gap-(--gutter) overflow-x-auto overscroll-x-contain px-gutter pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        data-reveal
      >
        {items.map((r, i) => (
          <li
            key={r.id}
            data-i={i}
            aria-roledescription="slide"
            aria-label={`${indexes[i]} ${labels.of} ${indexes[items.length - 1]}`}
            className="flex w-[min(84vw,38rem)] shrink-0 snap-start flex-col rounded-[3px] border border-hair bg-[color-mix(in_oklab,var(--paper)_70%,white)] p-6 md:p-8"
          >
            <figure className="flex h-full flex-col">
              <blockquote lang="en" dir="ltr" className="text-start">
                <p className="font-display text-[clamp(1.3rem,1.9vw,1.8rem)] leading-[1.15] font-medium tracking-tight">
                  <span aria-hidden className="accent me-1 text-accent">
                    “
                  </span>
                  {r.highlight}
                  <span aria-hidden className="accent text-accent">
                    ”
                  </span>
                </p>
                <p className="mt-5 line-clamp-4 leading-relaxed text-ink-soft">{r.paragraphs[0]}</p>
              </blockquote>

              <Link
                href={`/recommendations#${r.id}`}
                className="text-label mt-5 inline-flex items-center gap-2 self-start hover:text-accent"
              >
                {labels.readFull}
                <span aria-hidden className="inline-block rtl:-scale-x-100">
                  →
                </span>
              </Link>

              <figcaption className="mt-auto flex items-center gap-4 pt-8">
                <Avatar name={r.name} portrait={r.portrait} className="size-14" />
                <div className="min-w-0 flex-1 text-start" lang="en" dir="ltr">
                  <p className="text-lead font-medium">{r.name}</p>
                  <p className="text-label mt-1 line-clamp-2 leading-relaxed text-muted">{r.headline}</p>
                </div>
              </figcaption>
              <p className="text-label mt-4 flex flex-wrap gap-x-3 gap-y-1 border-t border-hair pt-4 text-muted">
                {r.source === "linkedin" ? (
                  <>
                    {r.relationship ? <span>{r.relationship}</span> : null}
                    {r.date ? <span>· {r.date}</span> : null}
                  </>
                ) : (
                  <span>{labels.oldSite}</span>
                )}
              </p>
            </figure>
          </li>
        ))}
      </ul>
      {labels.original ? <p className="text-label mt-4 px-gutter text-muted">{labels.original}</p> : null}
    </div>
  );
}
