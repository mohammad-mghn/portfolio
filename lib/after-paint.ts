/**
 * Resolves once the browser has painted a frame after this call (immediately on the server).
 *
 * Used to hold back code that only adds motion (GSAP, smooth scrolling, the 3D journey) until the
 * page is on screen, so it never competes with the first paint for network or CPU.
 * Two animation frames: the first callback runs before the upcoming paint, the second after it.
 */
export function afterFirstPaint(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(resolve, 0)));
  });
}
