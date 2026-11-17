/**
 * Tracks the deferred sections of the page (see components/deferred.tsx) so that code which
 * changes the DOM across the whole page can wait until every one of them is interactive.
 *
 * Why: the reveal system splits headings into lines and sets inline styles on elements anywhere
 * on the page. If it did that inside a section React has not attached to yet, React would find
 * markup it does not recognise when it gets there. So reveals start only once nothing is pending.
 */
const waiting = new Set<string>();
const ready = new Set<string>();
let listeners: (() => void)[] = [];

function flush() {
  if (waiting.size > 0) return;
  const run = listeners;
  listeners = [];
  run.forEach((listener) => listener());
}

/** A deferred section has mounted its shell (its code may still be loading). */
export function boundaryPending(id: string) {
  if (!ready.has(id)) waiting.add(id);
}
/** That section's code has loaded and React has attached to its markup. */
export function boundaryReady(id: string) {
  ready.add(id);
  waiting.delete(id);
  flush();
}
/** The section left the page. */
export function boundaryGone(id: string) {
  ready.delete(id);
  waiting.delete(id);
  flush();
}

/** Resolves when no deferred section is still pending (immediately if none is). */
export function whenBoundariesReady(): Promise<void> {
  return waiting.size === 0 ? Promise.resolve() : new Promise((resolve) => listeners.push(resolve));
}
