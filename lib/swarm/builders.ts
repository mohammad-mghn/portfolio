/**
 * The materials the agents build with.
 *
 * The page itself is never changed: no attribute, class, inline style or text node of it. A piece
 * is hidden with a browser animation (Element.animate) and shown again by cancelling it; a hold the
 * engine stops renewing runs out after 2.5 s, so a stalled engine can never leave content hidden.
 *
 * Everything the agents make happens on copies in a layer of our own over the page: a copy starts
 * plain (default font, small, black, grey box) and is typed and styled step by step until it is
 * identical to the real element, which is then shown in its place in the same frame.
 */
const HOLD = 2500;

export function hold(el: HTMLElement): Animation {
  return el.animate([{ opacity: 0 }, { opacity: 0 }], { duration: HOLD, id: "swarm-hold" });
}

/** Keep a hold running: rewind it before it can end. */
export function keepHolding(animation: Animation) {
  const time = Number(animation.currentTime ?? 0);
  if (time > 1600) animation.currentTime = 300;
}

/** A short name for what a picture is, like a file: "rooza/1.jpg". */
export function fileName(el: HTMLElement) {
  const img = el instanceof HTMLImageElement ? el : el.querySelector("img");
  const src = img?.currentSrc || img?.src || "";
  if (!src) return "";
  let path = src;
  try {
    const url = new URL(src, location.href);
    path = url.searchParams.get("url") ?? url.pathname; // next/image wraps the real path
  } catch {}
  return path.split("?")[0].split("/").filter(Boolean).slice(-2).join("/");
}

export const imageOf = (el: HTMLElement) => (el instanceof HTMLImageElement ? el : el.querySelector("img"));

/* ───────────────────────── Colours ───────────────────────── */

function rgb(colour: string): [number, number, number, number] | null {
  const m = /rgba?\(([^)]+)\)/.exec(colour);
  if (!m) return null;
  const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
  return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1];
}
export const visibleColour = (colour: string) => (rgb(colour)?.[3] ?? 0) > 0.02;
export function hex(colour: string) {
  const c = rgb(colour);
  if (!c) return colour;
  return `#${c
    .slice(0, 3)
    .map((v) => Math.round(v).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;
}
/** Light text means a dark background: plain copies there start white on dark grey. */
export function onDark(el: HTMLElement) {
  const c = rgb(getComputedStyle(el).color);
  if (!c) return false;
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2] > 150;
}

/* ───────────────────────── Style steps ───────────────────────── */

/** One styling action an agent performs on a copy, shown as a label next to its cursor. */
export type StyleStep = { key: "font" | "size" | "case" | "color" | "fill" | "radius" | "stroke" | "shadow"; label: string };

const RAW_SIZE = 14;
const WEIGHTS: Record<string, string> = { "100": "Thin", "200": "ExtraLight", "300": "Light", "400": "Regular", "500": "Medium", "600": "SemiBold", "700": "Bold", "800": "ExtraBold", "900": "Black" };

/** What separates the element from a plain default copy of it, in the order a designer would set it. */
export function styleSteps(el: HTMLElement, box: boolean, text: boolean): StyleStep[] {
  const s = getComputedStyle(el);
  const steps: StyleStep[] = [];
  if (box) {
    if (visibleColour(s.backgroundColor)) steps.push({ key: "fill", label: `Fill  ${hex(s.backgroundColor)}` });
    const radius = parseFloat(s.borderTopLeftRadius);
    if (radius > 0) steps.push({ key: "radius", label: `Radius  ${radius > 200 ? "Full" : Math.round(radius)}` });
    const stroke = parseFloat(s.borderTopWidth) || parseFloat(s.borderBottomWidth);
    if (stroke > 0 && visibleColour(s.borderTopColor || s.borderBottomColor)) steps.push({ key: "stroke", label: `Stroke  ${stroke}` });
    if (s.boxShadow !== "none") steps.push({ key: "shadow", label: "Drop shadow" });
  }
  if (text) {
    const family = s.fontFamily.split(",")[0].replace(/["']/g, "").trim();
    steps.push({ key: "font", label: `${family}  ${WEIGHTS[s.fontWeight] ?? s.fontWeight}` });
    const size = parseFloat(s.fontSize);
    if (Math.abs(size - RAW_SIZE) > 1.5) steps.push({ key: "size", label: `Size  ${Math.round(size)}` });
    if (s.textTransform === "uppercase") steps.push({ key: "case", label: "Case  AA" });
    else if (s.letterSpacing !== "normal" && Math.abs(parseFloat(s.letterSpacing)) > 0.3) steps.push({ key: "case", label: "Letter spacing" });
    steps.push({ key: "color", label: `Color  ${hex(s.color)}` });
  }
  return steps;
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

function ancestorsOpacity(el: HTMLElement) {
  let opacity = 1;
  for (let up = el.parentElement; up && up !== document.body; up = up.parentElement) {
    if (up.getAnimations().some((a) => a.id.startsWith("swarm-"))) continue;
    opacity *= parseFloat(getComputedStyle(up).opacity) || 1;
  }
  return opacity;
}

function scrub(node: Element) {
  for (const el of [node, ...node.querySelectorAll("*")]) {
    el.removeAttribute("id");
    for (const attr of [...el.attributes]) {
      if (attr.name.startsWith("data-") || attr.name.startsWith("aria-") || attr.name === "tabindex") el.removeAttribute(attr.name);
    }
  }
}

const RAW_CLASSES: Record<StyleStep["key"] | "wrap", string> = {
  font: "swarm-raw-font",
  size: "swarm-raw-size",
  case: "swarm-raw-case",
  color: "swarm-raw-color",
  fill: "swarm-raw-fill",
  radius: "swarm-raw-radius",
  stroke: "swarm-raw-stroke",
  shadow: "swarm-raw-shadow",
  wrap: "swarm-raw-wrap",
};

/**
 * A copy of something on the page, laid over it. `raw` starts it plain: each style step removes one
 * of the plain-copy classes, and the size step is scrubbed from small to the real size.
 */
export class Overlay {
  readonly box: HTMLDivElement;
  readonly content: HTMLElement;
  readonly rtl: boolean;
  private raw = new Set<string>();
  /** Text nodes of the copy and what each must end up saying. */
  nodes: Text[] = [];
  finals: string[] = [];
  private range = document.createRange();

  constructor(content: HTMLElement, styleFrom: HTMLElement, layer: HTMLElement, width: number) {
    const style = getComputedStyle(styleFrom);
    this.rtl = style.direction === "rtl";
    this.box = document.createElement("div");
    this.box.className = "swarm-piece";
    this.box.style.width = `${width}px`;
    this.box.style.opacity = String(ancestorsOpacity(styleFrom));
    this.content = content;
    for (const property of INHERITED) content.style.setProperty(property, style.getPropertyValue(property));
    content.style.setProperty("--raw-ink", onDark(styleFrom) ? "#F4F4F2" : "#1E1E1E");
    content.style.setProperty("--raw-fill", onDark(styleFrom) ? "#3A3A37" : "#D9D9D9");
    content.style.setProperty("--raw-size", `${RAW_SIZE}px`);
    this.box.appendChild(content);
    layer.appendChild(this.box);
    const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (!node.nodeValue?.trim()) continue;
      this.nodes.push(node as Text);
      this.finals.push((node.nodeValue ?? "").replace(/\s+/g, " "));
    }
  }

  place(x: number, y: number) {
    this.box.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
  }

  rect() {
    return this.content.getBoundingClientRect();
  }

  /** Start plain in these respects (see the swarm-raw-* classes in globals.css). */
  plain(keys: (StyleStep["key"] | "wrap")[]) {
    for (const key of keys) {
      this.raw.add(RAW_CLASSES[key]);
      this.content.classList.add(RAW_CLASSES[key]);
    }
  }

  /** Apply one style for real (remove its plain-copy class). */
  apply(key: StyleStep["key"] | "wrap") {
    this.content.classList.remove(RAW_CLASSES[key]);
    this.raw.delete(RAW_CLASSES[key]);
    if (key === "size") this.content.classList.remove(RAW_CLASSES.wrap);
  }

  /** Part way through the size step: the text grows from the plain size to its real size. */
  scrubSize(from: number, to: number, p: number) {
    this.content.style.setProperty("--raw-size", `${(from + (to - from) * p).toFixed(1)}px`);
    this.content.style.setProperty("--raw-line", p > 0.5 ? "normal" : "1.35");
  }

  /** Set what each text node says. */
  write(texts: string[]) {
    this.nodes.forEach((node, i) => {
      const value = texts[i] ?? "";
      if (node.nodeValue !== value) node.nodeValue = value;
    });
  }

  /** Boxes of the text as it stands (for drawing a selection over it). */
  textRects(): DOMRect[] {
    const rects: DOMRect[] = [];
    for (const node of this.nodes) {
      if (!node.nodeValue) continue;
      this.range.selectNodeContents(node);
      rects.push(...this.range.getClientRects());
    }
    return rects;
  }

  /** Where the caret is: just after the last character of node `index`. */
  caret(index: number): { x: number; top: number; bottom: number } | null {
    const node = this.nodes[index];
    if (!node) return null;
    const value = node.nodeValue ?? "";
    let rect: DOMRect | undefined;
    if (value.length) {
      this.range.setStart(node, Math.max(0, value.length - 1));
      this.range.setEnd(node, value.length);
      const rects = this.range.getClientRects();
      rect = rects[rects.length - 1];
      if (rect) return { x: this.rtl ? rect.left : rect.right, top: rect.top, bottom: rect.bottom };
    }
    // Empty: the caret sits at the start of the box, one line high.
    const box = this.content.getBoundingClientRect();
    const line = parseFloat(getComputedStyle(this.content).fontSize) * 1.3 || 18;
    return { x: this.rtl ? box.right : box.left, top: box.top, bottom: box.top + line };
  }

  remove() {
    this.box.remove();
  }
}

/** A copy of an element. `shell`: only its own box (fill, border), its contents hidden. */
export function copyOf(source: HTMLElement, layer: HTMLElement, shell = false) {
  const rect = source.getBoundingClientRect();
  const clone = source.cloneNode(true) as HTMLElement;
  scrub(clone);
  const style = getComputedStyle(source);
  if (style.display === "inline") clone.style.display = "inline-block";
  clone.style.margin = "0";
  clone.style.width = "100%";
  clone.style.minWidth = "0";
  clone.style.maxWidth = "none";
  clone.style.boxSizing = "border-box";
  if (shell) {
    clone.classList.add("swarm-shell");
    clone.style.height = `${rect.height}px`;
  }
  const overlay = new Overlay(clone, source, layer, rect.width);
  overlay.place(rect.left, rect.top);
  return overlay;
}

/**
 * The lines of a heading, as the page lays them out, when the whole heading is in one style. A
 * designer types the first line, then duplicates it for the others and retypes them.
 */
export function headingLines(el: HTMLElement): { text: string; rect: DOMRect }[] | null {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  for (let node = walker.nextNode(); node; node = walker.nextNode()) if (node.nodeValue?.trim()) nodes.push(node as Text);
  if (!nodes.length) return null;
  const key = (n: Text) => {
    const s = getComputedStyle(n.parentElement!);
    return [s.fontFamily, s.fontSize, s.fontWeight, s.fontStyle, s.color, s.textTransform, s.letterSpacing].join("|");
  };
  const style = key(nodes[0]);
  if (nodes.some((n) => key(n) !== style)) return null;

  const range = document.createRange();
  const lines: { text: string; l: number; r: number; t: number; b: number }[] = [];
  for (const node of nodes) {
    const value = node.nodeValue ?? "";
    for (let i = 0; i < value.length; i++) {
      const ch = value[i];
      if (/\s/.test(ch)) {
        const last = lines[lines.length - 1];
        if (last && !last.text.endsWith(" ")) last.text += " ";
        continue;
      }
      range.setStart(node, i);
      range.setEnd(node, i + 1);
      const r = range.getClientRects()[0];
      if (!r) continue;
      const mid = (r.top + r.bottom) / 2;
      let line = lines[lines.length - 1];
      if (!line || mid > line.b || mid < line.t) {
        if (line) line.text = line.text.trimEnd();
        line = { text: "", l: r.left, r: r.right, t: r.top, b: r.bottom };
        lines.push(line);
      }
      line.text += ch;
      line.l = Math.min(line.l, r.left);
      line.r = Math.max(line.r, r.right);
      line.t = Math.min(line.t, r.top);
      line.b = Math.max(line.b, r.bottom);
    }
  }
  if (lines.length < 2 || lines.length > 6) return null;
  return lines.map((line) => ({ text: line.text.trim(), rect: new DOMRect(line.l, line.t, line.r - line.l, line.b - line.t) }));
}

/** One line of a heading, as its own little text box styled like the heading. */
export function lineOf(styleFrom: HTMLElement, text: string, rect: DOMRect, layer: HTMLElement) {
  const firstText = (() => {
    const walker = document.createTreeWalker(styleFrom, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) if (node.nodeValue?.trim()) return node.parentElement!;
    return styleFrom;
  })();
  const div = document.createElement("div");
  div.textContent = text;
  div.style.whiteSpace = "nowrap";
  div.style.lineHeight = "normal";
  div.style.margin = "0";
  const overlay = new Overlay(div, firstText, layer, rect.width);
  div.style.lineHeight = "normal";
  div.style.whiteSpace = "nowrap";
  div.style.textAlign = "start";
  overlay.place(rect.left, rect.top);
  return overlay;
}

/* ───────────────────────── Typing ───────────────────────── */

export type Keystroke = { node: number; text: string; at: number };

const NEARBY: Record<string, string> = {
  a: "sq", b: "vn", c: "xv", d: "sf", e: "wr", f: "dg", g: "fh", h: "gj", i: "uo", j: "hk", k: "jl", l: "k", m: "n",
  n: "bm", o: "ip", p: "o", q: "w", r: "et", s: "ad", t: "ry", u: "yi", v: "cb", w: "qe", x: "zc", y: "tu", z: "x",
};
const PERSIAN = "ابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی";

function wrongFor(ch: string) {
  if (/[؀-ۿ]/.test(ch)) return PERSIAN[Math.floor(Math.random() * PERSIAN.length)];
  const lower = ch.toLowerCase();
  const near = NEARBY[lower];
  if (!near) return null;
  const pick = near[Math.floor(Math.random() * near.length)];
  return ch === lower ? pick : pick.toUpperCase();
}

const segmenter = typeof Intl.Segmenter === "function" ? new Intl.Segmenter(undefined, { granularity: "grapheme" }) : null;
const graphemes = (s: string) => (segmenter ? [...segmenter.segment(s)].map((g) => g.segment) : Array.from(s));

/**
 * The keystrokes of a person typing these texts (one per text node, in order): uneven rhythm, a
 * pause after punctuation, and now and then a wrong key, noticed a character or two later,
 * deleted and typed again. Long texts may also get a wrong word that is deleted whole.
 */
export function keystrokes(texts: string[], { typos = true, from = 0 }: { typos?: boolean; from?: number } = {}): Keystroke[] {
  const out: Keystroke[] = [];
  let at = from;
  let typosLeft = typos ? 2 : 0;
  const total = texts.join("").length;
  let wrongWord = typos && total > 60 && Math.random() < 0.5;
  texts.forEach((text, node) => {
    const chars = graphemes(text);
    let typed = "";
    const push = (value: string, dt: number) => {
      at += dt;
      out.push({ node, text: value, at });
    };
    for (let i = 0; i < chars.length; i++) {
      const ch = chars[i];
      // A wrong word at a word boundary: typed, noticed, deleted.
      if (wrongWord && ch === " " && i > chars.length * 0.3) {
        wrongWord = false;
        const words = text.split(/\s+/).filter((w) => w.length > 3);
        const word = graphemes(words[Math.floor(Math.random() * words.length)] ?? "");
        if (word.length) {
          push(`${typed} `, 50);
          for (let k = 1; k <= word.length; k++) push(`${typed} ${word.slice(0, k).join("")}`, 30 + Math.random() * 30);
          at += 260;
          for (let k = word.length - 1; k >= 0; k--) push(`${typed} ${word.slice(0, k).join("")}`, 28);
          push(typed, 30);
        }
      }
      // A wrong key, noticed after one or two more characters: deleted back and typed again.
      if (typosLeft && chars.length > 6 && i > 1 && /\p{L}/u.test(ch) && Math.random() < 0.05) {
        const wrong = wrongFor(ch);
        if (wrong) {
          typosLeft -= 1;
          const extra = chars.slice(i + 1, i + 1 + (Math.random() < 0.5 ? 1 : 2)).filter((c) => c.trim());
          push(typed + wrong, 40 + Math.random() * 40);
          for (let k = 1; k <= extra.length; k++) push(typed + wrong + extra.slice(0, k).join(""), 35 + Math.random() * 35);
          at += 180;
          for (let k = extra.length - 1; k >= 0; k--) push(typed + wrong + extra.slice(0, k).join(""), 34);
          push(typed, 34);
        }
      }
      typed += ch;
      const pause = /[.,!?؟،:;]/.test(ch) ? 110 : ch === " " ? 45 : 0;
      push(typed, 24 + Math.random() * 34 + pause);
    }
  });
  return out;
}

/** Scale a keystroke script to last `duration` ms at most. */
export function fitTo(script: Keystroke[], duration: number) {
  const end = script.at(-1)?.at ?? 0;
  const start = script[0]?.at ?? 0;
  if (end - start <= duration || end === start) return script;
  const k = duration / (end - start);
  return script.map((s) => ({ ...s, at: start + (s.at - start) * k }));
}

/** The text of every node after `time` ms of a script (nodes before the current one are complete). */
export function textsAt(script: Keystroke[], finals: string[], time: number, before: string[] | null = null) {
  const texts = before ? [...before] : finals.map(() => "");
  let current = -1;
  for (const stroke of script) {
    if (stroke.at > time) break;
    if (stroke.node !== current) {
      for (let n = 0; n < stroke.node; n++) texts[n] = finals[n];
      current = stroke.node;
    }
    texts[stroke.node] = stroke.text;
  }
  return { texts, node: Math.max(0, current) };
}
