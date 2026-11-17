/** What a page wipe needs: the colour that rises, the text on it, and what to do once the screen is covered. */
export type WipeDetail = { color: string; title: string; label: string; done: () => void };

/**
 * Fire a full-screen colour wipe, then run `done` (usually a router navigation) once covered.
 * The wipe itself lives in components/motion/PageWipe.tsx, which loads after the first paint;
 * if it has not loaded yet nothing listens, so `done` runs straight away instead.
 */
export function startWipe(detail: WipeDetail) {
  if (!document.querySelector("[data-page-wipe]")) return detail.done();
  window.dispatchEvent(new CustomEvent<WipeDetail>("wipe:start", { detail }));
}
