"use client";

import { useEffect, useRef } from "react";
import type { CursorKey, CursorLabels } from "@/lib/cursor";

/** The calls to action: an orange circle. Everything else is frosted white. */
const ACCENT = new Set<string>(["talk", "try"]);
/** A small drawn icon above the word (the site's fonts have no arrows). */
const ICON: Partial<Record<string, string>> = {
  go: "arrow",
  open: "out",
  up: "up",
  play: "play",
  pause: "pause",
  stop: "stop",
  copied: "check",
};

/** Over a dark background (the contact section, the menu) the circle turns brighter. */
function onDark(el: HTMLElement) {
  for (let up: HTMLElement | null = el; up; up = up.parentElement) {
    const m = /rgba?\(([^)]+)\)/.exec(getComputedStyle(up).backgroundColor);
    if (!m) continue;
    const [r, g, b, a = 1] = m[1].split(/[\s,/]+/).map(Number);
    if (a < 0.5) continue;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b < 110;
  }
  return false;
}

/**
 * The circle that replaces the pointer over the site's calls to action and its quieter links
 * (marked with data-cursor="talk" | "read" | "open" | …): the same frosted circle as the
 * recommendation row's drag cursor, with a word for what the click will do. It grows in when the
 * pointer reaches a marked link, presses in while the button is held, and sends out a ring on the
 * click. Only for a mouse or trackpad with motion allowed; everyone else keeps the normal pointer
 * (the native pointer is hidden only once this is running, see :root[data-link-cursor]).
 */
export function LinkCursor({ labels }: { labels: CursorLabels }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = root.current;
    const word = dot?.querySelector<HTMLElement>("[data-word]");
    const icon = dot?.querySelector<HTMLElement>("[data-icon]");
    if (!dot || !word || !icon) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || calm.matches) return;
    const html = document.documentElement;
    html.dataset.linkCursor = "";

    let x = -200;
    let y = -200;
    let cx = x;
    let cy = y;
    let target: HTMLElement | null = null;
    let raf = 0;
    let last = performance.now();
    let clickTimer = 0;

    // The word follows the element's mark, which can change while hovered (copy → copied, try → stop).
    const watcher = new MutationObserver(() => paint());
    function paint() {
      const key = target?.dataset.cursor ?? "";
      word!.textContent = labels[key as CursorKey] ?? "";
      icon!.dataset.icon = ICON[key] ?? "";
      dot!.dataset.tone = ACCENT.has(key) ? "accent" : target && onDark(target) ? "light" : "";
    }

    function aim(next: HTMLElement | null) {
      if (next && (next.matches(":disabled") || next.closest("[inert]"))) next = null;
      if (next === target) return;
      watcher.disconnect();
      const wasShown = Boolean(target);
      target = next;
      if (!next) {
        dot!.dataset.state = "";
        delete dot!.dataset.press;
        return;
      }
      watcher.observe(next, { attributes: true, attributeFilter: ["data-cursor"] });
      paint();
      if (!wasShown) {
        // Appear where the pointer is, not where the circle last was.
        cx = x;
        cy = y;
      }
      dot!.dataset.state = "shown";
      wake();
    }

    const markedAt = (el: EventTarget | Element | null) => (el instanceof Element ? el.closest<HTMLElement>("[data-cursor]") : null);

    function frame(now: number) {
      raf = 0;
      const dt = Math.min(64, now - last);
      last = now;
      if (target && !target.isConnected) aim(null);
      const k = 1 - Math.exp(-dt / 40);
      cx += (x - cx) * k;
      cy += (y - cy) * k;
      dot!.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0)`;
      // Keep following until the circle has caught up with the pointer.
      if (Math.abs(x - cx) > 0.2 || Math.abs(y - cy) > 0.2 || target) raf = requestAnimationFrame(frame);
    }
    function wake() {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return aim(null);
      x = e.clientX;
      y = e.clientY;
      aim(markedAt(e.target));
      wake();
    };
    // The page can move under a still pointer (scrolling, the row that slides sideways).
    const onScroll = () => {
      if (x < 0) return;
      aim(markedAt(document.elementFromPoint(x, y)));
    };
    const onLeave = (e: PointerEvent) => {
      if (!e.relatedTarget) aim(null);
    };
    const onDown = (e: PointerEvent) => {
      if (target && e.button === 0) dot.dataset.press = "";
    };
    const onUp = () => {
      if (!("press" in dot.dataset)) return;
      delete dot.dataset.press;
      // The click: a ring goes out from the circle.
      delete dot.dataset.click;
      void dot.offsetWidth;
      dot.dataset.click = "";
      window.clearTimeout(clickTimer);
      clickTimer = window.setTimeout(() => delete dot.dataset.click, 600);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerout", onLeave, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(clickTimer);
      watcher.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerout", onLeave);
      window.removeEventListener("scroll", onScroll);
      delete html.dataset.linkCursor;
    };
  }, [labels]);

  return (
    <div ref={root} className="link-cursor" aria-hidden data-state="">
      <span className="link-cursor-ring">
        <span className="link-cursor-icon" data-icon="" />
        <span className="link-cursor-word" data-word />
      </span>
    </div>
  );
}
