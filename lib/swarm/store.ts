"use client";

/**
 * The on/off switch for the agent build mode (the "click me :)" box on the home page), plus the
 * one handshake it needs with the page's own scroll animations.
 *
 * It is tiny on purpose: the box, the reveal system and the hover effects read it from the first
 * paint, while the build engine itself (lib/swarm/engine.ts) loads only when the box is clicked.
 * While the mode is on, <html data-swarm> is set, which is how CSS and the hover effects can tell.
 */
export type SwarmMode = "off" | "loading" | "on";

let mode: SwarmMode = "off";
let progress = 0;
let touring = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());

export const swarmStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  mode: () => mode,
  /** Share of the page built so far, 0 to 1, in steps of 1%. */
  progress: () => progress,
  /** The tour is scrolling the page. */
  touring: () => touring,
};

/** True from the click until the page is back to normal. */
export const swarmActive = () => mode !== "off";

export function setSwarmMode(next: SwarmMode) {
  if (mode === next) return;
  mode = next;
  const root = document.documentElement;
  if (next === "off") delete root.dataset.swarm;
  else root.dataset.swarm = next;
  if (next === "off") {
    progress = 0;
    touring = false;
  }
  if (next !== "off" && revealers > 0) parked = false;
  emit();
}

/*
 * Tour pacing. A section that moves by scroll on its own (the journey's camera) can tell the tour
 * how to play it: scroll ranges, each to be crossed in a given time. The tour follows these
 * wherever they apply, and its own pace everywhere else.
 */
export type TourSegment = { from: number; to: number; ms: number };
let tourPath: (() => TourSegment[]) | null = null;

/** The returned function unregisters it. */
export function registerTourPath(path: () => TourSegment[]) {
  tourPath = path;
  return () => {
    if (tourPath === path) tourPath = null;
  };
}

export const tourSegments = (): TourSegment[] => tourPath?.() ?? [];

export function setSwarmTour(next: boolean) {
  if (touring === next) return;
  touring = next;
  emit();
}

export function setSwarmProgress(value: number) {
  const rounded = Math.round(Math.min(1, Math.max(0, value)) * 100) / 100;
  if (rounded === progress) return;
  progress = rounded;
  emit();
}

/*
 * Parking. The page's reveal animations (components/motion/ScrollReveals.tsx) split headings into
 * lines and hide content below the screen. Before the build mode looks at the page, they must be
 * undone, or it would measure markup that is about to be replaced. ScrollReveals registers itself,
 * stands down when the mode turns on, and reports back here.
 */
let revealers = 0;
let parked = true;
let waiting: (() => void)[] = [];

const flushParked = () => {
  const run = waiting;
  waiting = [];
  run.forEach((resolve) => resolve());
};

/** Called by a reveal system when it mounts; the returned function unregisters it. */
export function registerRevealer() {
  revealers += 1;
  return () => {
    revealers -= 1;
    if (revealers === 0) {
      parked = true;
      flushParked();
    }
  };
}

/** Called by the reveal system once it has undone its work for the build mode. */
export function markParked() {
  parked = true;
  flushParked();
}

/** Resolves once nothing else is animating the page's content (at the latest after `timeout` ms). */
export function whenParked(timeout = 800): Promise<void> {
  if (parked || revealers === 0) return Promise.resolve();
  return new Promise((resolve) => {
    const timer = window.setTimeout(resolve, timeout);
    waiting.push(() => {
      window.clearTimeout(timer);
      resolve();
    });
  });
}
