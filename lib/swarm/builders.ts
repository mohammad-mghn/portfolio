/**
 * How the swarm hides a piece and builds it back, using only browser animations (Element.animate).
 *
 * Nothing on the page is changed: no attribute, class, inline style or text node. That keeps React
 * and GSAP out of it (an animation's value wins over inline styles while it runs, and disappears
 * when it is cancelled), and it means Persian text is never cut into letters, so it stays joined.
 *
 * A hidden piece is held by a 2.5 s animation that the engine keeps rewinding. If the engine ever
 * stops (an error, a frozen tab), the hold simply runs out and the content shows again.
 */
const HOLD = 2500;

export function hold(el: HTMLElement, fade: boolean): Animation {
  return el.animate(
    fade
      ? [
          { opacity: 1, offset: 0 },
          { opacity: 0, offset: 0.1 },
          { opacity: 0, offset: 1 },
        ]
      : [{ opacity: 0 }, { opacity: 0 }],
    { duration: HOLD, id: "swarm-hold" },
  );
}

/** Keep a hold running: rewind it into its hidden stretch before it can end. */
export function keepHolding(animation: Animation) {
  const time = Number(animation.currentTime ?? 0);
  if (time > 1600) animation.currentTime = 300;
}

/** A frame appears once its outline is drawn (its pieces stay held by their own holds). */
export const fadeIn = (el: HTMLElement, duration: number) =>
  el.animate([{ opacity: 0 }, { opacity: 1 }], { duration, easing: "ease-out", id: "swarm-build" });

/** Small things: opened from their centre as if clicked into place (after `delay`, the press). */
export const popIn = (el: HTMLElement, duration: number, delay: number) =>
  el.animate(
    [
      { opacity: 0, clipPath: "inset(42% 42% 42% 42%)" },
      { opacity: 1, clipPath: "inset(-8% -8% -8% -8%)", offset: 0.7 },
      { opacity: 1, clipPath: "inset(-8% -8% -8% -8%)" },
    ],
    { duration, delay, fill: "backwards", easing: "cubic-bezier(.2,.8,.2,1)", id: "swarm-build" },
  );

/** Pictures: scanned in from the top. */
export const scanIn = (el: HTMLElement, duration: number) =>
  el.animate([{ clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)" }], {
    duration,
    easing: "cubic-bezier(.45,0,.2,1)",
    id: "swarm-build",
  });

/* ───────────────────────── Text ───────────────────────── */

type Line = { top: number; bottom: number; start: number; cutTop: number; cutBottom: number };
export type TextPlan = {
  rtl: boolean;
  lines: Line[];
  /** Each step of the reveal: a line, and how far along it the text is shown (x, from the box's left). */
  stops: { line: number; x: number }[];
  /** Horizontal limits of the revealed area, padded so glyphs that overhang are not cut. */
  left: number;
  right: number;
};

type Piece = { l: number; r: number; t: number; b: number };

const segmenters = new Map<string, Intl.Segmenter | null>();
function segments(value: string, granularity: "grapheme" | "word"): { index: number; text: string }[] {
  if (!segmenters.has(granularity)) {
    segmenters.set(granularity, typeof Intl.Segmenter === "function" ? new Intl.Segmenter(undefined, { granularity }) : null);
  }
  const segmenter = segmenters.get(granularity);
  if (segmenter) return [...segmenter.segment(value)].map((s) => ({ index: s.index, text: s.segment }));
  // Older browsers: code points, or runs of non-spaces.
  const out: { index: number; text: string }[] = [];
  const pattern = granularity === "word" ? /\S+/gu : /[\s\S]/gu;
  for (const match of value.matchAll(pattern)) out.push({ index: match.index ?? 0, text: match[0] });
  return out;
}

/**
 * Measures where the text of `el` sits, line by line, without touching it: a Range over each
 * character (or word) gives its boxes. Done when the build starts, so it matches the current layout.
 */
export function measureText(el: HTMLElement, granularity: "grapheme" | "word" | "line"): TextPlan | null {
  const box = el.getBoundingClientRect();
  const style = getComputedStyle(el);
  const rtl = style.direction === "rtl";
  const pad = (parseFloat(style.fontSize) || 16) * 0.3;
  const range = document.createRange();
  const pieces: Piece[] = [];

  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const value = node.nodeValue ?? "";
    if (!value.trim() || node.parentElement?.closest(".sr-only")) continue;
    for (const segment of segments(value, granularity === "grapheme" ? "grapheme" : "word")) {
      if (!segment.text.trim()) continue;
      range.setStart(node, segment.index);
      range.setEnd(node, segment.index + segment.text.length);
      for (const rect of range.getClientRects()) {
        if (rect.width === 0 && rect.height === 0) continue;
        pieces.push({ l: rect.left - box.left, r: rect.right - box.left, t: rect.top - box.top, b: rect.bottom - box.top });
      }
    }
  }
  if (!pieces.length) return null;

  // Group into lines (a piece whose middle is outside the current line starts a new one), and
  // keep the caret moving one way only, so a Latin word inside a Persian line appears in one step.
  const lines: Line[] = [];
  const stops: { line: number; x: number }[] = [];
  let line: Line | null = null;
  let caret = 0;
  for (const piece of pieces) {
    const middle = (piece.t + piece.b) / 2;
    if (!line || middle > line.bottom || middle < line.top) {
      line = { top: piece.t, bottom: piece.b, start: rtl ? piece.r : piece.l, cutTop: 0, cutBottom: 0 };
      lines.push(line);
      caret = rtl ? piece.l : piece.r;
    } else {
      line.top = Math.min(line.top, piece.t);
      line.bottom = Math.max(line.bottom, piece.b);
      line.start = rtl ? Math.max(line.start, piece.r) : Math.min(line.start, piece.l);
      caret = rtl ? Math.min(caret, piece.l) : Math.max(caret, piece.r);
    }
    stops.push({ line: lines.length - 1, x: caret });
  }

  // Tight display line heights make lines overlap, so cut between them at the middle.
  lines.forEach((current, i) => {
    current.cutTop = i === 0 ? current.top - pad : (lines[i - 1].bottom + current.top) / 2;
    if (i > 0) lines[i - 1].cutBottom = current.cutTop;
  });
  lines[lines.length - 1].cutBottom = lines[lines.length - 1].bottom + pad;

  // Whole lines at a time for long passages; otherwise one step per character or word.
  let steps = stops;
  if (granularity === "line") {
    steps = lines.map((_, i) => stops.filter((stop) => stop.line === i).at(-1)!);
  }
  const deduped = steps.filter((stop, i) => i === 0 || stop.line !== steps[i - 1].line || Math.abs(stop.x - steps[i - 1].x) > 0.5);

  const minLeft = Math.min(...pieces.map((p) => p.l));
  const maxRight = Math.max(...pieces.map((p) => p.r));
  return {
    rtl,
    lines,
    stops: deduped,
    left: Math.min(-pad, minLeft - pad),
    right: Math.max(box.width + pad, maxRight + pad),
  };
}

const px = (n: number) => `${n.toFixed(1)}px`;

/** The visible area at one step: every line above in full, the current line up to the caret. */
function shape(plan: TextPlan, line: number, x: number) {
  const { left: L, right: R } = plan;
  const top = plan.lines[0].cutTop;
  const a = plan.lines[line].cutTop;
  const b = plan.lines[line].cutBottom;
  const points = plan.rtl
    ? [[L, top], [R, top], [R, b], [x, b], [x, a], [L, a]]
    : [[L, top], [R, top], [R, a], [x, a], [x, b], [L, b]];
  return `polygon(${points.map(([px1, py1]) => `${px(px1)} ${px(py1)}`).join(", ")})`;
}

/** Types the text in: each step shows the next character (or word, or line) at once. */
export function typeIn(el: HTMLElement, plan: TextPlan, duration: number): Animation {
  const start = { clipPath: shape(plan, 0, plan.rtl ? plan.right : plan.left), easing: "step-end" };
  const frames = plan.stops.map((stop) => ({ clipPath: shape(plan, stop.line, stop.x), easing: "step-end" }));
  return el.animate([start, ...frames], { duration, easing: "linear", id: "swarm-build" });
}

/** Where the caret is `progress` (0 to 1) into a typeIn animation, relative to the element's box. */
export function caretAt(plan: TextPlan, progress: number) {
  // The keyframes are evenly spaced: the start (nothing shown) and then one per step.
  const shown = Math.min(plan.stops.length, Math.floor(progress * plan.stops.length));
  if (shown === 0) {
    const first = plan.lines[0];
    return { x: first.start, top: first.top, bottom: first.bottom };
  }
  const stop = plan.stops[shown - 1];
  const line = plan.lines[stop.line];
  return { x: stop.x, top: line.top, bottom: line.bottom };
}
