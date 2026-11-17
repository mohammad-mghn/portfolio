/**
 * Which parts of the page the agents build, and how.
 *
 * The starting points ("seeds") are the blocks the site already marks for its reveal animations
 * (data-reveal, data-split), plus anything marked data-swarm (the first screen, the footer, the
 * journey's title). Nothing else is ever hidden. A seed that is a container ("frame") is built
 * first as an outline; the pieces inside it are found only when it is built, with the same rules.
 *
 * Kinds:
 *  - frame  an outline is dragged around it, then it appears and its pieces are built one by one
 *  - type   short text (headings), typed character by character
 *  - words  longer text, revealed word by word (line by line when very long)
 *  - media  pictures and other things without text, revealed by a scan from the top
 *  - pop    small things (labels, chips, buttons), clicked into view
 * data-swarm="skip" (or any of the kinds) on an element overrides the guess.
 */
export type Kind = "frame" | "type" | "words" | "media" | "pop";

const KINDS = new Set<string>(["frame", "type", "words", "media", "pop"]);
const MEDIA_TAGS = new Set(["IMG", "PICTURE", "VIDEO", "FIGURE", "IFRAME", "CANVAS", "SVG"]);
const NEVER = new Set(["SCRIPT", "STYLE", "TEMPLATE", "NOSCRIPT", "LINK", "META", "BR", "WBR"]);
/** Descendants that make an element a container rather than a run of text. */
const BLOCKS =
  "p,h1,h2,h3,h4,h5,h6,li,ul,ol,dl,div,article,section,header,footer,nav,aside,figure,img,picture,video,canvas,blockquote,table,form";

/** Elements the swarm never hides: hidden ones, fixed chrome, screen-reader text, decorations. */
export function skipped(el: Element): boolean {
  if (!(el instanceof HTMLElement)) return true;
  if (NEVER.has(el.tagName)) return true;
  if (el.dataset.swarm === "skip" || el.hasAttribute("data-displace-layer")) return true;
  if (el.getAttribute("aria-hidden") === "true" || el.classList.contains("sr-only")) return true;
  const style = getComputedStyle(el);
  return style.display === "none" || style.visibility === "hidden" || style.position === "fixed";
}

/** The outermost marked blocks inside `root`, in page order. */
export function findSeeds(root: HTMLElement): HTMLElement[] {
  const marked = [...root.querySelectorAll<HTMLElement>("[data-swarm],[data-reveal],[data-split]")];
  const set = new Set<Element>(marked);
  return marked.filter((el) => {
    if (skipped(el)) return false;
    for (let up = el.parentElement; up && up !== root; up = up.parentElement) {
      if (up instanceof HTMLElement && up.dataset.swarm === "skip") return false;
      if (set.has(up)) return false; // built as part of an outer block
    }
    return true;
  });
}

const visibleText = (el: HTMLElement) => (el.textContent ?? "").replace(/\s+/g, " ").trim();

export function classify(el: HTMLElement, box: DOMRect): Kind {
  const explicit = el.dataset.swarm;
  if (explicit && KINDS.has(explicit)) return explicit as Kind;
  if (MEDIA_TAGS.has(el.tagName.toUpperCase())) return "media";

  const text = visibleText(el);
  if (text.length < 40 && el.querySelector("img,picture,video,canvas")) return "media";
  if (/^H[1-4]$/.test(el.tagName) || el.hasAttribute("data-split")) return text ? "type" : "frame";

  const leaf = !el.querySelector(BLOCKS);
  const small = box.height <= 64 && box.width <= 360;
  if (small) return text || leaf ? "pop" : "frame";
  if (leaf) return text ? (text.length <= 80 ? "type" : "words") : "media";
  return "frame";
}

/** Whether an element paints something of its own (background, border, shadow). */
function ownPaint(el: HTMLElement) {
  const style = getComputedStyle(el);
  const clear = (colour: string) => colour === "transparent" || /rgba\([^)]*,\s*0\)$/.test(colour);
  if (!clear(style.backgroundColor) || style.backgroundImage !== "none" || style.boxShadow !== "none") return true;
  return ["Top", "Right", "Bottom", "Left"].some(
    (side) =>
      parseFloat(style.getPropertyValue(`border-${side.toLowerCase()}-width`)) > 0 &&
      !clear(style.getPropertyValue(`border-${side.toLowerCase()}-color`)),
  );
}

/**
 * The pieces inside a frame, found when the frame is built. Plain wrappers with a single child are
 * looked through (up to three levels), so the agents build the things a visitor would point at.
 */
export function discover(frame: HTMLElement): { el: HTMLElement; kind: Kind }[] {
  const found: { el: HTMLElement; kind: Kind }[] = [];
  const walk = (parent: Element, depth: number) => {
    for (const child of parent.children) {
      if (!(child instanceof HTMLElement)) continue;
      if (getComputedStyle(child).display === "contents") {
        walk(child, depth);
        continue;
      }
      if (skipped(child)) continue;
      const box = child.getBoundingClientRect();
      if (box.width < 1 || box.height < 1) continue;
      const kind = classify(child, box);
      if (kind === "frame" && depth < 3 && child.children.length === 1 && !ownPaint(child)) {
        walk(child, depth + 1);
        continue;
      }
      found.push({ el: child, kind });
    }
  };
  walk(frame, 0);
  return found;
}
