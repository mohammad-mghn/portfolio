"use client";

import { useLenis } from "@/lib/lenis";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Link } from "@/i18n/navigation";
import type { Recommendation } from "@/lib/content/types";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import styles from "./Recommendations.module.css";

type Labels = {
  region: string;
  prev: string;
  next: string;
  of: string;
  readFull: string;
  oldSite: string;
  original?: string;
};

/** Desktop with motion allowed: the section pins and the page's own scroll moves the row sideways. */
const PINNED = "(min-width: 768px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)";

const Chevron = ({ flip }: { flip?: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" className={flip ? "-scale-x-100" : undefined}>
    <path d="M10 3 5 8l5 5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * The recommendations section: a row of equal-height cards, always all rendered, so moving between
 * them never changes the section's height.
 *
 * On desktop the section pins to the screen and scrolling the page moves the row sideways
 * (a tall "runway" with a sticky stage; the runway is as long as the row is wide). Over the row
 * the cursor becomes a circle with two chevrons, and the row can be dragged. On phones, or with
 * reduced motion, it is a plain swipeable row with arrows.
 * Quotes stay in English (dir/lang set) on every locale; the full text lives on /recommendations.
 */
export function RecommendationCarousel({
  items,
  indexes,
  labels,
  header,
  footer,
}: {
  items: Recommendation[];
  /** Pre-formatted "01", "02"… in the page's digits. */
  indexes: string[];
  labels: Labels;
  /** The section heading, rendered on the server. */
  header: ReactNode;
  /** The "all recommendations" link, shown after the row has finished travelling. */
  footer: ReactNode;
}) {
  const section = useRef<HTMLElement>(null);
  const runway = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const move = useRef<{ x: gsap.QuickToFunc; y: gsap.QuickToFunc } | null>(null);
  const cursorShown = useRef(false);
  /** A drag in progress: where it started, where the page should be now, and how fast the pointer is going (px/ms). */
  const drag = useRef<{ x: number; scroll: number; target: number; lastX: number; lastT: number; speed: number } | null>(null);
  const [active, setActive] = useState(0);

  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

  const isPinned = () => Boolean(trigger.current);
  const scrollPage = (y: number, immediate = false) => {
    if (lenisRef.current) lenisRef.current.scrollTo(y, { immediate });
    else window.scrollTo({ top: y, behavior: immediate ? "auto" : "smooth" });
  };
  /**
   * Move the page towards `y` and keep easing (`lerp` is the share of the remaining distance covered
   * each frame). Called again and again with a moving target, as while dragging or on a trackpad,
   * the row follows without steps. Before the smooth-scroll code has loaded it simply jumps.
   */
  const glidePage = (y: number, lerp: number) => {
    // programmatic: false makes the scroller remember `y` as its target at once (as it does for its
    // own wheel handling), so the next small step is added to the target, not to where it has got to.
    if (lenisRef.current) lenisRef.current.scrollTo(y, { lerp, programmatic: false });
    else window.scrollTo({ top: y, behavior: "auto" });
  };

  useGSAP(
    () => {
      const root = section.current;
      const el = track.current;
      const dot = cursor.current;
      if (!root || !el || !dot || !runway.current) return;

      const mm = gsap.matchMedia();
      mm.add(PINNED, () => {
        root.dataset.pinned = "";
        const rtl = getComputedStyle(el).direction === "rtl";
        const max = () => Math.max(0, el.scrollWidth - el.clientWidth);
        // The runway is one screen plus the row's overflow, so one pixel of page scroll moves the row one pixel.
        const setDistance = () => root.style.setProperty("--rec-distance", `${max()}px`);
        const sync = (progress: number) => {
          el.scrollLeft = (rtl ? -1 : 1) * progress * max();
        };
        setDistance();

        const st = ScrollTrigger.create({
          trigger: runway.current,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => sync(self.progress),
          onRefresh: (self) => sync(self.progress),
        });
        trigger.current = st;

        // A wider or narrower row changes the runway; the page-height observer then refreshes ScrollTrigger.
        const ro = new ResizeObserver(setDistance);
        ro.observe(el);

        // Sideways scrolling (two fingers on a trackpad, a tilt wheel, or Shift + wheel) moves the row
        // as well: it is turned into the page scroll that drives the row. Mostly-vertical scrolling is
        // left alone. Handled here, and not passed on, so the smooth scroller does not add its own move.
        const onWheel = (e: WheelEvent) => {
          const sideways = e.shiftKey && !e.deltaX ? e.deltaY : e.deltaX;
          const vertical = e.shiftKey && !e.deltaX ? 0 : e.deltaY;
          if (!sideways || Math.abs(sideways) <= Math.abs(vertical)) return;
          const y = window.scrollY;
          if (y < st.start - 2 || y > st.end + 2) return; // the row is not pinned to the screen right now
          e.preventDefault(); // also keeps the browser from treating the swipe as "go back"
          e.stopPropagation();
          const unit = e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? window.innerWidth : 1;
          const from = lenisRef.current ? lenisRef.current.targetScroll : y;
          const to = from + (rtl ? -1 : 1) * sideways * unit;
          glidePage(Math.min(st.end, Math.max(st.start, to)), 0.28);
        };
        root.addEventListener("wheel", onWheel, { passive: false });

        gsap.set(dot, { xPercent: -50, yPercent: -50, scale: 0.4, autoAlpha: 0 });
        move.current = {
          x: gsap.quickTo(dot, "x", { duration: 0.35, ease: "power3" }),
          y: gsap.quickTo(dot, "y", { duration: 0.35, ease: "power3" }),
        };

        return () => {
          st.kill();
          ro.disconnect();
          root.removeEventListener("wheel", onWheel);
          trigger.current = null;
          move.current = null;
          cursorShown.current = false;
          drag.current = null;
          gsap.killTweensOf(dot);
          gsap.set(dot, { clearProps: "all" });
          delete root.dataset.pinned;
          root.style.removeProperty("--rec-distance");
          el.scrollLeft = 0;
        };
      });
      return () => mm.revert();
    },
    { scope: section, dependencies: [items.length] },
  );

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

  /** How far the row has to scroll for card `i` to sit at its start (never past the end of the row). */
  function offsetOf(el: HTMLElement, i: number) {
    const cards = [...el.children] as HTMLElement[];
    return Math.min(el.scrollWidth - el.clientWidth, Math.abs(cards[i].offsetLeft - cards[0].offsetLeft));
  }

  /** Index of the first card that is aligned to the start when the row is scrolled to its end. */
  function firstAtEnd(el: HTMLElement) {
    const max = el.scrollWidth - el.clientWidth;
    for (let i = 0; i < el.children.length; i++) {
      if (offsetOf(el, i) >= max - 2) return i;
    }
    return el.children.length - 1;
  }

  function goTo(i: number) {
    const el = track.current;
    if (!el) return;
    const target = offsetOf(el, Math.min(items.length - 1, Math.max(0, i)));
    // Pinned: the page scroll drives the row, so move the page. Otherwise scroll the row itself.
    if (trigger.current) scrollPage(trigger.current.start + target);
    else el.scrollTo({ left: (getComputedStyle(el).direction === "rtl" ? -1 : 1) * target, behavior: "smooth" });
  }

  function go(d: number) {
    const el = track.current;
    if (!el) return;
    // Going back from the end: the last cards share one resting position, so step from the first of them.
    goTo((d < 0 ? Math.min(active, firstAtEnd(el)) : active) + d);
  }

  // ── Circle cursor and dragging (pinned mode, mouse or trackpad only) ──
  const usesCursor = () => isPinned() && window.matchMedia("(pointer: fine)").matches;

  function showCursor(e: React.PointerEvent, show: boolean) {
    const dot = cursor.current;
    if (!dot) return;
    if (show && !cursorShown.current) {
      // The row can slide under a still pointer, so jump to it before fading in.
      move.current?.x(e.clientX, e.clientX);
      move.current?.y(e.clientY, e.clientY);
    }
    if (show === cursorShown.current) return;
    cursorShown.current = show;
    gsap.to(dot, { autoAlpha: show ? 1 : 0, scale: show ? 1 : 0.4, duration: show ? 0.45 : 0.3, ease: "power3", overwrite: "auto" });
  }
  /** Links keep the normal pointer; everywhere else on the row gets the circle. */
  const overLink = (e: React.PointerEvent) => Boolean((e.target as HTMLElement).closest("a"));

  function onPointerMove(e: React.PointerEvent) {
    if (!usesCursor()) return;
    move.current?.x(e.clientX);
    move.current?.y(e.clientY);
    const d = drag.current;
    const st = trigger.current;
    if (!d || !st) return;
    // Dragging the row left moves forward, as far as the pointer moved (mirrored in RTL). The page
    // eases towards that point instead of jumping to it on every pointer event, so the row glides.
    const sign = document.documentElement.dir === "rtl" ? 1 : -1;
    d.target = Math.min(st.end, Math.max(st.start, d.scroll + sign * (e.clientX - d.x)));
    const dt = e.timeStamp - d.lastT;
    if (dt > 0) {
      d.speed = d.speed * 0.6 + ((sign * (e.clientX - d.lastX)) / dt) * 0.4;
      d.lastX = e.clientX;
      d.lastT = e.timeStamp;
    }
    glidePage(d.target, 0.3);
  }
  function onPointerDown(e: React.PointerEvent<HTMLUListElement>) {
    if (!usesCursor() || e.button !== 0 || overLink(e)) return;
    drag.current = { x: e.clientX, scroll: window.scrollY, target: window.scrollY, lastX: e.clientX, lastT: e.timeStamp, speed: 0 };
    // Keep receiving the drag when the pointer leaves the row. A pointer that is already gone cannot be captured.
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    e.preventDefault(); // no text selection while dragging
    gsap.to(cursor.current, { scale: 0.8, duration: 0.25, ease: "power3", overwrite: "auto" });
  }
  function onPointerUp(e: React.PointerEvent<HTMLUListElement>) {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    // Let go while moving: the row carries on in that direction and slows to a stop. A pointer that
    // had already stopped (no movement for a moment) leaves the row where it is.
    const st = trigger.current;
    const moving = e.timeStamp - d.lastT < 90 && Math.abs(d.speed) > 0.15;
    if (st && moving) glidePage(Math.min(st.end, Math.max(st.start, d.target + d.speed * 380)), 0.085);
    if (cursorShown.current) gsap.to(cursor.current, { scale: 1, duration: 0.3, ease: "power3", overwrite: "auto" });
  }

  const arrow =
    "flex size-11 items-center justify-center rounded-full border border-ink/25 transition-[color,background-color,border-color,opacity] duration-500 ease-house hover:border-ink hover:bg-ink hover:text-paper disabled:pointer-events-none disabled:opacity-30";

  return (
    <section ref={section} id="recommendations" aria-labelledby="recommendations-title" className={styles.section}>
      <div ref={runway} className={styles.runway}>
        <div className={styles.stage}>
          {header}

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
              className={`${styles.track} mt-6 flex snap-x snap-mandatory scroll-px-(--page-pad) gap-(--gutter) overflow-x-auto overscroll-x-contain px-gutter pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
              data-reveal
              onPointerEnter={(e) => usesCursor() && showCursor(e, !overLink(e))}
              onPointerOver={(e) => usesCursor() && !drag.current && showCursor(e, !overLink(e))}
              onPointerLeave={(e) => showCursor(e, false)}
              onPointerMove={onPointerMove}
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onFocus={(e) => {
                // Keyboard: tabbing into a card that is still off-screen brings it to the start of the row.
                const card = e.target.closest<HTMLElement>("li[data-i]");
                if (isPinned() && card && e.target.matches(":focus-visible")) goTo(Number(card.dataset.i));
              }}
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
                    <blockquote lang={r.lang} dir={r.lang === "fa" ? "rtl" : "ltr"} className="text-start">
                      <p className="font-display text-[clamp(1.3rem,1.9vw,1.8rem)] leading-[1.15] font-medium tracking-tight">
                        <span aria-hidden className="accent me-1 text-accent">
                          “
                        </span>
                        {r.highlight}
                        <span aria-hidden className="accent text-accent">
                          ”
                        </span>
                      </p>
                      <p className={`${styles.excerpt} mt-5 line-clamp-4 leading-relaxed text-ink-soft`}>{r.paragraphs[0]}</p>
                    </blockquote>

                    <Link
                      href={`/recommendations#${r.id}`}
                      draggable={false}
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
        </div>
      </div>

      <div className={styles.footer}>{footer}</div>

      {/* Follows the pointer over the row: this section moves sideways. */}
      <div ref={cursor} aria-hidden className={styles.cursor}>
        <Chevron />
        <Chevron flip />
      </div>
    </section>
  );
}
