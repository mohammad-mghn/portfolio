/**
 * How an agent builds each kind of piece, as a designer would in a design tool, step by step. Each
 * step has a tool (the cursor it shows), a duration, what it does to the copies, where the cursor
 * is, and what it draws on the canvas. The engine runs the steps one after another.
 *
 *   text      click with the text tool, type it plain (with the odd typo), then set font, size, case
 *             and colour one by one until it matches the page
 *   heading   type the first line, style it, then option-drag copies down and retype each line
 *   box       draw a grey rectangle, type its label, then give it fill, radius, stroke
 *   frame     draw the rectangle (with guides); a painted frame then gets its fill and stroke
 *   picture   draw a grey placeholder, then drag the image file in from the bottom of the screen
 *   copy      option-drag a finished sibling into place, then select its text and retype it
 *   edit      (inside a duplicated card) select the copied text and retype it
 */
import { copyOf, fileName, fitTo, headingLines, imageOf, keystrokes, lineOf, onDark, rawSize, styleSteps, textsAt, visibleColour, type Overlay } from "./builders";
import { BLUE, RED, type Agent, type Painter, type Tool } from "./cursors";
import type { Kind } from "./targets";

export type Piece = { overlay: Overlay; dx: number; dy: number };

/** What a recipe needs to know about the piece it builds. The engine owns the rest. */
export type Job = {
  el: HTMLElement;
  kind: Kind;
  /** Copies laid over the page, kept at an offset from the real element as the page scrolls. */
  pieces: Piece[];
  /** Copied text shown before the agent arrives (inside a duplicated card). */
  preview: Piece | null;
  twin: HTMLElement | null;
  source: { el: HTMLElement } | null;
};

export type Ctx = {
  job: Job;
  agent: Agent;
  rect: DOMRect;
  now: number;
  layer: HTMLElement;
  painter: Painter;
  /** Where the waiting agents stand (pictures are fetched from there). */
  dock: () => { x: number; y: number };
};

export type Step = {
  tool: Tool;
  /** Duration at normal speed, ms. 0 = instant. */
  ms: number;
  start?(c: Ctx): void;
  update?(c: Ctx, p: number): void;
  end?(c: Ctx): void;
  /** Where the cursor is, `p` (0 to 1) into the step. */
  at(c: Ctx, p: number): { x: number; y: number; press?: number };
  draw?(c: Ctx, p: number): void;
  label?: string;
};

export type Api = {
  /** Show the real element in place of its copies: the piece is done. */
  reveal(job: Job): void;
  /** A frame is drawn: find what is inside it and hide that, then show the frame itself. */
  frameDone(job: Job, twins: HTMLElement[] | null): void;
};

const easeOut = (t: number) => 1 - (1 - t) ** 3;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const isRtl = (el: HTMLElement) => getComputedStyle(el).direction === "rtl";

export function ownPaint(el: HTMLElement) {
  const s = getComputedStyle(el);
  if (visibleColour(s.backgroundColor) || s.boxShadow !== "none") return true;
  return (parseFloat(s.borderTopWidth) > 0 && visibleColour(s.borderTopColor)) || (parseFloat(s.borderBottomWidth) > 0 && visibleColour(s.borderBottomColor));
}

function add(job: Job, overlay: Overlay, rect: DOMRect) {
  // Kept by its outer box: the copy inside may change width (and, right to left, its left edge).
  const r = overlay.box.getBoundingClientRect();
  const piece = { overlay, dx: r.left - rect.left, dy: r.top - rect.top };
  job.pieces.push(piece);
  return piece;
}

/* ───────────────────────── Shared steps ───────────────────────── */

/** Drag out a rectangle with the crosshair: grey (or empty) shape, outline, size, guides. */
function drawRect(fill: "grey" | "picture" | "none", then?: (c: Ctx) => void): Step {
  const corner = (c: Ctx) => (isRtl(c.job.el) ? { x: c.rect.right, y: c.rect.top, ex: c.rect.left } : { x: c.rect.left, y: c.rect.top, ex: c.rect.right });
  return {
    tool: "cross",
    ms: 420,
    at(c, p) {
      const k = corner(c);
      const e = easeOut(p);
      return { x: k.x + (k.ex - k.x) * e, y: k.y + c.rect.height * e, press: 1 };
    },
    draw(c, p) {
      const k = corner(c);
      const e = easeOut(p);
      const x1 = k.x + (k.ex - k.x) * e;
      const x = Math.min(k.x, x1);
      const w = Math.abs(x1 - k.x);
      const h = c.rect.height * e;
      if (fill !== "none") c.painter.placeholder(x, k.y, w, h, onDark(c.job.el), fill === "picture");
      c.painter.guides([x, x + w], 1 - p * 0.3);
      c.painter.selection(x, k.y, w, h, BLUE, false);
      c.painter.size(x, k.y, w, h);
    },
    end: then,
  };
}

/** Where a designer's cursor goes to change a style: just outside the selection's top corner. */
function panelPoint(c: Ctx, r: DOMRect, i: number) {
  const vw = window.innerWidth;
  // The style label is drawn to the right of the cursor: keep both on screen.
  const rightOk = r.right + 26 + 130 < vw;
  const leftOk = r.left - 42 > 12;
  const right = isRtl(c.job.el) ? rightOk && !leftOk : rightOk || !leftOk;
  const nudge = (i % 3) * 8;
  let x = right ? r.right + 26 + nudge : r.left - 26 - nudge;
  if (!rightOk && !leftOk) x = r.right - 150 - nudge; // no room either side: just inside the selection
  return { x: Math.min(vw - 140, Math.max(12, x)), y: Math.max(12, r.top + 10 + (i % 4) * 9) };
}

/** Style steps on a copy: each removes one plain-copy class (the size is scrubbed up). */
function styling(get: (c: Ctx) => Overlay | undefined, el: HTMLElement, box: boolean, text: boolean): Step[] {
  const s = getComputedStyle(el);
  const finalSize = parseFloat(s.fontSize);
  return styleSteps(el, box, text).map((step, i) => ({
    tool: "arrow" as Tool,
    ms: step.key === "size" ? 460 : 190,
    label: step.label,
    start(c) {
      if (step.key !== "size") get(c)?.apply(step.key);
    },
    update(c, p) {
      if (step.key === "size") get(c)?.scrubSize(rawSize(el), finalSize, easeInOut(p));
    },
    end(c) {
      if (step.key === "size") get(c)?.apply("size");
    },
    at(c, p) {
      const r = get(c)?.rect() ?? c.rect;
      const point = panelPoint(c, r, i);
      return { ...point, press: p < 0.35 ? 1 : 0 };
    },
    draw(c) {
      const r = get(c)?.rect() ?? c.rect;
      c.painter.selection(r.left, r.top, r.width, r.height);
      c.painter.size(r.left, r.top, r.width, r.height);
    },
  }));
}

/** Type texts into a copy, keystroke by keystroke, the caret and an outlined text box showing. */
function typing(get: (c: Ctx) => Overlay | undefined, finals: () => string[], longest: number, before: (() => string[]) | null = null): Step {
  let script: ReturnType<typeof keystrokes> = [];
  let length = 0;
  let node = 0;
  const step: Step = {
    tool: "ibeam",
    ms: longest,
    start() {
      script = fitTo(keystrokes(finals()), longest);
      length = script.at(-1)?.at ?? 0;
      step.ms = Math.max(120, length);
    },
    update(c, p) {
      const overlay = get(c);
      if (!overlay) return;
      const state = textsAt(script, finals(), p * length, before ? finals().map(() => "") : null);
      node = state.node;
      overlay.write(p >= 1 ? finals() : state.texts);
    },
    at(c) {
      const caret = get(c)?.caret(node);
      if (!caret) return { x: c.rect.left, y: c.rect.top };
      return { x: caret.x + 4, y: (caret.top + caret.bottom) / 2 };
    },
    draw(c) {
      const overlay = get(c);
      if (!overlay) return;
      const r = overlay.rect();
      c.painter.selection(r.left - 2, r.top - 1, r.width + 4, Math.max(r.height, 16) + 2, BLUE, false);
      const caret = overlay.caret(node);
      if (caret) c.painter.caret(caret.x, caret.top, caret.bottom, c.agent.colour);
    },
  };
  return step;
}

/** Select all the text of a copy (double click), as before retyping it. */
function selectAll(get: (c: Ctx) => Overlay | undefined): Step {
  return {
    tool: "arrow",
    ms: 260,
    at(c, p) {
      const r = get(c)?.rect() ?? c.rect;
      return { x: r.left + Math.min(r.width / 2, 120), y: r.top + Math.min(r.height / 2, 14), press: p < 0.2 || (p > 0.3 && p < 0.45) ? 1 : 0 };
    },
    draw(c, p) {
      const overlay = get(c);
      if (!overlay || p < 0.45) return;
      c.painter.highlight(overlay.textRects());
    },
  };
}

const reveal = (api: Api): Step => ({ tool: "arrow", ms: 0, start: (c) => api.reveal(c.job), at: (c) => ({ x: c.agent.x, y: c.agent.y }) });

/* ───────────────────────── Recipes ───────────────────────── */

const typeBudget = (kind: Kind) => (kind === "words" ? 2200 : kind === "pop" ? 900 : 1600);

/** Text, and boxes with text in them (buttons, chips): typed plain, then styled. */
export function text(job: Job, api: Api): Step[] {
  const el = job.el;
  if (job.kind === "type" && !ownPaint(el)) {
    const lines = headingLines(el);
    if (lines) return heading(job, api, lines);
  }
  const box = ownPaint(el);
  let overlay: Overlay | undefined;
  const get = () => overlay;
  const create = (c: Ctx) => {
    if (overlay) return;
    overlay = copyOf(el, c.layer);
    overlay.plain(["font", "size", "case", "color", "wrap", ...(box ? (["fill", "radius", "stroke", "shadow"] as const) : [])]);
    overlay.write(overlay.finals.map(() => ""));
    add(job, overlay, c.rect);
  };
  const steps: Step[] = [];
  if (box) steps.push(drawRect("grey", create));
  steps.push({
    tool: "ibeam",
    ms: 140,
    start: create,
    at(c, p) {
      const caret = overlay?.caret(0);
      return caret ? { x: caret.x + 4, y: (caret.top + caret.bottom) / 2, press: p < 0.5 ? 1 : 0 } : { x: c.rect.left, y: c.rect.top };
    },
    draw(c) {
      const r = overlay?.rect();
      if (r) c.painter.selection(r.left - 2, r.top - 1, r.width + 4, Math.max(r.height, 16) + 2, BLUE, false);
    },
  });
  steps.push(typing(get, () => overlay?.finals ?? [], typeBudget(job.kind)));
  steps.push(...styling(get, el, box, true));
  steps.push(reveal(api));
  return steps;
}

/** A multi-line heading: the first line typed and styled, the others duplicated from it and retyped. */
function heading(job: Job, api: Api, lines: { text: string; rect: DOMRect }[]): Step[] {
  const el = job.el;
  const base = el.getBoundingClientRect();
  const offsets = lines.map((line) => ({ dx: line.rect.left - base.left, dy: line.rect.top - base.top }));
  const copies: (Piece | undefined)[] = [];
  const first = () => copies[0]?.overlay;
  const steps: Step[] = [
    {
      tool: "ibeam",
      ms: 140,
      start(c) {
        const overlay = lineOf(el, lines[0].text, lines[0].rect, c.layer);
        overlay.plain(["font", "size", "case", "color"]);
        overlay.write([""]);
        const piece = { overlay, ...offsets[0] };
        job.pieces.push(piece);
        copies[0] = piece;
      },
      at(c, p) {
        const caret = first()?.caret(0);
        return caret ? { x: caret.x + 4, y: (caret.top + caret.bottom) / 2, press: p < 0.5 ? 1 : 0 } : { x: c.rect.left, y: c.rect.top };
      },
    },
    typing(first, () => [lines[0].text], 1200),
    ...styling(first, el, false, true),
  ];
  for (let i = 1; i < lines.length; i++) {
    const get = () => copies[i]?.overlay;
    steps.push(
      {
        // Option-drag the first line down to where this one goes.
        tool: "dup",
        ms: 380,
        start(c) {
          const overlay = lineOf(el, lines[0].text, lines[i].rect, c.layer);
          const piece = { overlay, ...offsets[0] };
          job.pieces.push(piece);
          copies[i] = piece;
        },
        update(_c, p) {
          const piece = copies[i];
          if (!piece) return;
          const e = easeInOut(p);
          piece.dx = offsets[0].dx + (offsets[i].dx - offsets[0].dx) * e;
          piece.dy = offsets[0].dy + (offsets[i].dy - offsets[0].dy) * e;
        },
        at(c) {
          const piece = copies[i];
          return piece ? { x: c.rect.left + piece.dx + 14, y: c.rect.top + piece.dy + 12, press: 1 } : { x: c.rect.left, y: c.rect.top };
        },
        draw(c) {
          const r = get()?.rect();
          const r0 = first()?.rect();
          if (!r || !r0) return;
          c.painter.selection(r.left, r.top, r.width, r.height, RED);
          c.painter.measure(r0.left, r0.bottom, r.left, r.top);
        },
      },
      selectAll(get),
      typing(get, () => [lines[i].text], 1100),
    );
  }
  steps.push(reveal(api));
  return steps;
}

/** A container: drawn as a rectangle; if it has its own fill or border, that is styled in. */
export function frame(job: Job, api: Api): Step[] {
  const el = job.el;
  const paint = ownPaint(el);
  let shell: Overlay | undefined;
  const steps: Step[] = [
    drawRect(paint ? "grey" : "none", (c) => {
      if (!paint) return;
      shell = copyOf(el, c.layer, true);
      shell.plain(["fill", "radius", "stroke", "shadow"]);
      add(job, shell, c.rect);
    }),
  ];
  if (paint) steps.push(...styling(() => shell, el, true, false));
  steps.push({ tool: "arrow", ms: 0, start: (c) => api.frameDone(c.job, null), at: (c) => ({ x: c.agent.x, y: c.agent.y }) });
  return steps;
}

/** A picture: a grey placeholder, then the file dragged in from where the agents wait. */
export function picture(job: Job, api: Api): Step[] {
  const el = job.el;
  const img = imageOf(el);
  const name = fileName(el);
  const steps: Step[] = [drawRect("picture")];
  // Things without a picture of their own just appear once their placeholder is drawn.
  if (img && name) {
    let thumb: HTMLImageElement | null = null;
    let from = { x: 0, y: 0 };
    steps.push({
      tool: "move",
      ms: 620,
      start(c) {
        from = c.dock();
        thumb = document.createElement("img");
        thumb.src = img.currentSrc || img.src;
        thumb.className = "swarm-thumb";
        c.layer.appendChild(thumb);
      },
      update(c, p) {
        const e = easeInOut(p);
        const x = from.x + (c.rect.left + c.rect.width / 2 - from.x) * e;
        const y = from.y + (c.rect.top + c.rect.height / 2 - from.y) * e;
        if (thumb) thumb.style.transform = `translate3d(${x - 36}px, ${y - 24}px, 0)`;
      },
      end() {
        thumb?.remove();
      },
      at(c, p) {
        const e = easeInOut(p);
        return { x: from.x + (c.rect.left + c.rect.width / 2 - from.x) * e, y: from.y + (c.rect.top + c.rect.height / 2 - from.y) * e, press: 1 };
      },
      draw(c, p) {
        c.painter.placeholder(c.rect.left, c.rect.top, c.rect.width, c.rect.height, onDark(el), true);
        c.painter.selection(c.rect.left, c.rect.top, c.rect.width, c.rect.height, BLUE, p > 0.85);
        c.painter.chip(c.agent.x + 14, c.agent.y + 26, name, c.agent.colour);
      },
    });
  }
  steps.push(reveal(api));
  return steps;
}

/** A copy of a finished sibling, option-dragged into place; then its text is retyped. */
export function copy(job: Job, api: Api, source: HTMLElement): Step[] {
  const el = job.el;
  let ghost: Piece | undefined;
  let from = { dx: 0, dy: 0 };
  let target: Overlay | undefined;
  const textLeaf = job.kind === "type" || job.kind === "words" || job.kind === "pop";
  const steps: Step[] = [
    {
      tool: "dup",
      ms: 420,
      start(c) {
        const overlay = copyOf(source, c.layer);
        const s = source.getBoundingClientRect();
        from = { dx: s.left - c.rect.left, dy: s.top - c.rect.top };
        ghost = { overlay, ...from };
        ghost.overlay.place(s.left, s.top);
        job.pieces.push(ghost);
      },
      update(_c, p) {
        if (!ghost) return;
        const e = easeInOut(p);
        ghost.dx = from.dx * (1 - e);
        ghost.dy = from.dy * (1 - e);
      },
      at(c) {
        if (!ghost) {
          // On the way: to the original, to grab it.
          const s = source.getBoundingClientRect();
          return { x: s.left + 16, y: s.top + 12 };
        }
        return { x: c.rect.left + ghost.dx + 16, y: c.rect.top + ghost.dy + 12, press: 1 };
      },
      draw(c) {
        if (!ghost) return;
        const r = ghost.overlay.rect();
        const s = source.getBoundingClientRect();
        c.painter.selection(r.left, r.top, r.width, r.height, RED);
        c.painter.measure(s.right, s.top, r.left, r.top);
      },
      end(c) {
        if (!ghost) return;
        if (job.kind === "frame") {
          // The whole card is in place: what is inside shows the copied text until each part is edited.
          api.frameDone(c.job, null);
          return;
        }
        if (!textLeaf) return;
        // Swap the dragged copy for a copy of this element still saying what the original says.
        target = copyOf(el, c.layer);
        const sourceTexts = copyOf(source, c.layer);
        const old = sourceTexts.finals;
        sourceTexts.remove();
        target.write(old.length === target.nodes.length ? old : [old.join(" "), ...target.nodes.slice(1).map(() => "")]);
        add(job, target, c.rect);
        ghost.overlay.remove();
        job.pieces = job.pieces.filter((piece) => piece !== ghost);
      },
    },
  ];
  if (job.kind === "frame") return steps;
  if (textLeaf) {
    const get = () => target;
    steps.push(selectAll(get), typing(get, () => target?.finals ?? [], typeBudget(job.kind), () => []));
  }
  steps.push(reveal(api));
  return steps;
}

/** Inside a duplicated card: the copied text is selected and retyped. */
export function edit(job: Job, api: Api): Step[] {
  const get = () => job.preview?.overlay;
  const same = (() => {
    const overlay = get();
    if (!overlay) return true;
    return overlay.nodes.map((n) => n.nodeValue ?? "").join("") === overlay.finals.join("");
  })();
  if (same) return [reveal(api)];
  return [selectAll(get), typing(get, () => get()?.finals ?? [], typeBudget(job.kind), () => []), reveal(api)];
}

/** The copied-text stand-in for a piece of a duplicated card, shown until an agent edits it. */
export function previewFor(job: Job, twin: HTMLElement, layer: HTMLElement): Piece {
  const overlay = copyOf(job.el, layer);
  const old = copyOf(twin, layer);
  const texts = old.finals;
  old.remove();
  overlay.write(texts.length === overlay.nodes.length ? texts : [texts.join(" "), ...overlay.nodes.slice(1).map(() => "")]);
  const r = job.el.getBoundingClientRect();
  const o = overlay.box.getBoundingClientRect();
  return { overlay, dx: o.left - r.left, dy: o.top - r.top };
}

export function recipe(job: Job, api: Api): Step[] {
  if (job.twin && job.preview) return edit(job, api);
  if (job.source) return copy(job, api, job.source.el);
  if (job.kind === "frame") return frame(job, api);
  if (job.kind === "media") return picture(job, api);
  return text(job, api);
}
