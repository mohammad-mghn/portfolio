/**
 * How the swarm hides a piece and builds it back.
 *
 * The page itself is never changed: no attribute, class, inline style or text node of it. A piece
 * is hidden with a browser animation (Element.animate) and shown again by cancelling it. That keeps
 * React and GSAP out of it, and a hold the engine stops renewing runs out after 2.5 s, so a stalled
 * engine can never leave content hidden.
 *
 * Typing and dragging happen on copies: an exact copy of the element is laid over it in a layer of
 * our own (outside the page's markup), its text is typed there, and when it is done the copy goes
 * and the real element is shown in the same frame.
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

/**
 * Pictures load like a file arriving: scanned in from the top, blurred and grey at first, then sharp.
 * Elements whose filter is already driven by other code (the journey's cards) only get the scan.
 */
export function loadIn(el: HTMLElement, duration: number): Animation {
  const blur = !el.style.filter;
  const frames = blur
    ? [
        { clipPath: "inset(0 0 100% 0)", filter: "blur(16px) saturate(0)" },
        { clipPath: "inset(0 0 0% 0)", filter: "blur(8px) saturate(0.35)", offset: 0.6 },
        { clipPath: "inset(0 0 0% 0)", filter: "blur(0px) saturate(1)" },
      ]
    : [{ clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", offset: 0.6 }, { clipPath: "inset(0 0 0% 0)" }];
  return el.animate(frames, { duration, easing: "cubic-bezier(.45,0,.2,1)", id: "swarm-build" });
}

/** A short name for what a picture is, like a file: "rooza/1.jpg". */
export function fileName(el: HTMLElement) {
  const img = el instanceof HTMLImageElement ? el : el.querySelector("img");
  const src = img?.currentSrc || img?.src || "";
  if (!src) return el.querySelector("svg") ? "vector.svg" : "layer.png";
  let path = src;
  try {
    const url = new URL(src, location.href);
    path = url.searchParams.get("url") ?? url.pathname; // next/image wraps the real path
  } catch {}
  const parts = path.split("?")[0].split("/").filter(Boolean);
  return parts.slice(-2).join("/");
}

/* ───────────────────────── The copy layer ───────────────────────── */

export function createLayer() {
  const layer = document.createElement("div");
  layer.className = "swarm-layer";
  layer.setAttribute("aria-hidden", "true");
  document.body.appendChild(layer);
  return layer;
}

/** Inherited styles a copy would otherwise take from the layer instead of from the page. */
const INHERITED = [
  "color",
  "font-family",
  "font-size",
  "font-weight",
  "font-style",
  "font-stretch",
  "font-variant",
  "font-feature-settings",
  "font-variation-settings",
  "font-kerning",
  "line-height",
  "letter-spacing",
  "word-spacing",
  "text-transform",
  "text-align",
  "text-indent",
  "direction",
  "white-space",
  "word-break",
  "overflow-wrap",
  "hyphens",
  "text-wrap",
  "text-shadow",
  "-webkit-font-smoothing",
  "text-rendering",
];

/** How transparent the element's ancestors make it (ignoring the swarm's own animations). */
function ancestorsOpacity(el: HTMLElement) {
  let opacity = 1;
  for (let up = el.parentElement; up && up !== document.body; up = up.parentElement) {
    if (up.getAnimations().some((a) => a.id.startsWith("swarm-"))) continue;
    opacity *= parseFloat(getComputedStyle(up).opacity) || 1;
  }
  return opacity;
}

function copyOf(source: HTMLElement) {
  const clone = source.cloneNode(true) as HTMLElement;
  for (const node of [clone, ...clone.querySelectorAll("*")]) {
    node.removeAttribute("id");
    for (const attr of [...node.attributes]) {
      if (attr.name.startsWith("data-") || attr.name.startsWith("aria-") || attr.name === "tabindex") node.removeAttribute(attr.name);
    }
  }
  const style = getComputedStyle(source);
  for (const property of INHERITED) clone.style.setProperty(property, style.getPropertyValue(property));
  if (style.display === "inline") clone.style.display = "inline-block";
  clone.style.margin = "0";
  clone.style.width = "100%";
  clone.style.height = "100%";
  clone.style.minWidth = "0";
  clone.style.maxWidth = "none";
  clone.style.boxSizing = "border-box";
  return clone;
}

/** An exact copy of an element, laid over the page at the element's place. */
export class Piece {
  readonly box: HTMLDivElement;
  readonly clone: HTMLElement;
  width: number;
  height: number;

  constructor(source: HTMLElement, layer: HTMLElement) {
    const rect = source.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    this.box = document.createElement("div");
    this.box.className = "swarm-piece";
    this.box.style.width = `${rect.width}px`;
    this.box.style.height = `${rect.height}px`;
    this.box.style.opacity = String(ancestorsOpacity(source));
    this.clone = copyOf(source);
    this.box.appendChild(this.clone);
    layer.appendChild(this.box);
    this.place(rect.left, rect.top);
  }

  place(x: number, y: number) {
    this.box.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
  }

  remove() {
    this.box.remove();
  }
}

/** A copy being dragged from one item to the next (see "copy" in the engine). */
export class Ghost extends Piece {
  constructor(source: HTMLElement, layer: HTMLElement, colour: string) {
    super(source, layer);
    this.box.classList.add("swarm-ghost");
    this.box.style.setProperty("--ghost", colour);
  }
}

/* ───────────────────────── Typing ───────────────────────── */

const segmenters = new Map<string, Intl.Segmenter | null>();
function segments(value: string, granularity: "grapheme" | "word") {
  if (!segmenters.has(granularity)) {
    segmenters.set(granularity, typeof Intl.Segmenter === "function" ? new Intl.Segmenter(undefined, { granularity }) : null);
  }
  const segmenter = segmenters.get(granularity);
  if (segmenter) {
    return [...segmenter.segment(value)].map((s) => ({
      end: s.index + s.segment.length,
      real: granularity === "word" ? Boolean(s.isWordLike) : Boolean(s.segment.trim()),
    }));
  }
  // Older browsers: code points, or words and the spaces between them.
  const out: { end: number; real: boolean }[] = [];
  const pattern = granularity === "word" ? /\S+|\s+/gu : /[\s\S]/gu;
  for (const match of value.matchAll(pattern)) out.push({ end: (match.index ?? 0) + match[0].length, real: Boolean(match[0].trim()) });
  return out;
}

/**
 * Types an element's text into its copy, one character (or word) at a time.
 *
 * Every character is in the copy from the start; the ones not typed yet are in a transparent run
 * right after the typed ones. So the copy wraps its lines exactly like the real element, Persian
 * letters keep their joined shapes, and nothing is ever drawn half way.
 */
export class Typist extends Piece {
  private parts: { node: Text; tail: HTMLSpanElement; text: string; cuts: number[] }[] = [];
  readonly size: number;
  readonly rtl: boolean;
  private shown = -1;
  private range = document.createRange();
  /** Where the caret is, relative to the copy's top left corner. */
  caret = { x: 0, top: 0, bottom: 0 };

  constructor(source: HTMLElement, layer: HTMLElement, granularity: "grapheme" | "word") {
    super(source, layer);
    this.rtl = getComputedStyle(source).direction === "rtl";
    const walker = document.createTreeWalker(this.clone, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = [];
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (node.nodeValue?.trim()) nodes.push(node as Text);
    }
    let size = 0;
    for (const node of nodes) {
      const text = node.nodeValue ?? "";
      const cuts: number[] = [];
      for (const segment of segments(text, granularity)) {
        // Spaces and punctuation go with the word before them.
        if (!segment.real && cuts.length) cuts[cuts.length - 1] = segment.end;
        else if (segment.real) cuts.push(segment.end);
      }
      if (!cuts.length) continue;
      const tail = document.createElement("span");
      tail.className = "swarm-tail";
      node.after(tail);
      this.parts.push({ node, tail, text, cuts });
      size += cuts.length;
    }
    this.size = size;
    this.show(0);
  }

  /** Show the first `count` characters (or words). */
  show(count: number) {
    if (count === this.shown) return;
    this.shown = count;
    let left = count;
    let last: { node: Text; from: number; to: number } | null = null;
    for (const part of this.parts) {
      const typed = Math.min(left, part.cuts.length);
      left -= typed;
      const at = typed ? part.cuts[typed - 1] : 0;
      part.node.nodeValue = part.text.slice(0, at);
      part.tail.textContent = part.text.slice(at);
      if (typed) last = { node: part.node, from: typed > 1 ? part.cuts[typed - 2] : 0, to: at };
    }
    this.measure(last);
  }

  private measure(last: { node: Text; from: number; to: number } | null) {
    const origin = this.box.getBoundingClientRect();
    let rect: DOMRect | undefined;
    if (last) {
      this.range.setStart(last.node, last.from);
      this.range.setEnd(last.node, last.to);
      const rects = this.range.getClientRects();
      rect = rects[rects.length - 1];
    } else {
      const first = this.parts[0]?.tail.firstChild;
      if (first) {
        this.range.setStart(first, 0);
        this.range.setEnd(first, Math.min(1, first.textContent?.length ?? 0));
        rect = this.range.getClientRects()[0];
      }
    }
    if (!rect) return;
    const edge = last ? (this.rtl ? rect.left : rect.right) : this.rtl ? rect.right : rect.left;
    this.caret = { x: edge - origin.left, top: rect.top - origin.top, bottom: rect.bottom - origin.top };
  }
}
