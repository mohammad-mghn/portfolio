"use client";

import clsx from "clsx";
import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";
import type { Cloth } from "@/lib/effects/cloth";
import { swarmActive, swarmStore } from "@/lib/swarm/store";

/**
 * A picture frame whose picture ripples like hanging cloth while the pointer is over it.
 *
 * It wraps a normal image (pass the <Image/> as the child), so the picture is server-rendered,
 * lazy-loaded and readable without JavaScript as before. The effect draws on a canvas laid over
 * it, and its code (lib/effects/cloth.ts) is fetched on the first hover, so pages pay nothing for
 * it up front. Touch screens and reduced-motion users keep the still picture.
 */
export function ClothImage({
  className,
  canvasClassName,
  children,
}: {
  className?: string;
  /** The filter classes the picture itself carries (grayscale, contrast), so the canvas matches it. */
  canvasClassName?: string;
  children: ReactNode;
}) {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const cloth = useRef<Cloth | null>(null);
  const state = useRef<"idle" | "loading" | "ready" | "off">("idle");
  const hovering = useRef(false);
  const lastPoke = useRef({ x: 0, y: 0 });

  useEffect(() => () => cloth.current?.destroy(), []);
  // The agent build mode has the picture to itself while it runs: a ripple in progress goes at once.
  useEffect(
    () =>
      swarmStore.subscribe(() => {
        if (!swarmActive()) return;
        hovering.current = false;
        cloth.current?.leave();
        if (canvas.current) canvas.current.style.opacity = "0";
      }),
    [],
  );

  const start = () => {
    const fabric = cloth.current;
    const surface = canvas.current;
    if (!fabric || !surface) return;
    fabric.resize();
    fabric.enter(); // draws a first frame that is identical to the still picture
    surface.style.opacity = "1";
  };

  async function onEnter(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "touch" || swarmActive() || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    hovering.current = true;
    lastPoke.current = { x: e.clientX, y: e.clientY };
    if (state.current === "ready") return start();
    if (state.current !== "idle") return;

    state.current = "loading";
    const img = box.current?.querySelector("img");
    const surface = canvas.current;
    if (!img || !surface) {
      state.current = "off";
      return;
    }
    try {
      const [{ createCloth }] = await Promise.all([import("@/lib/effects/cloth"), img.decode()]);
      cloth.current = createCloth(surface, img, () => {
        surface.style.opacity = "0";
      });
    } catch {
      cloth.current = null;
    }
    state.current = cloth.current ? "ready" : "off";
    if (hovering.current) start();
  }

  function onMove(e: PointerEvent<HTMLDivElement>) {
    const fabric = cloth.current;
    if (!fabric || !hovering.current || !box.current) return;
    // A ripple for every stretch of movement; faster strokes make stronger ripples.
    const moved = Math.hypot(e.clientX - lastPoke.current.x, e.clientY - lastPoke.current.y);
    if (moved < 22) return;
    lastPoke.current = { x: e.clientX, y: e.clientY };
    const rect = box.current.getBoundingClientRect();
    fabric.poke((e.clientX - rect.left) / rect.width, (e.clientY - rect.top) / rect.height, Math.min(0.9, 0.25 + moved / 90));
  }

  function onLeave() {
    hovering.current = false;
    cloth.current?.leave();
  }

  return (
    <div ref={box} className={clsx("relative overflow-hidden", className)} onPointerEnter={onEnter} onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
      <canvas
        ref={canvas}
        aria-hidden
        className={clsx("pointer-events-none absolute inset-0 size-full opacity-0", canvasClassName)}
      />
    </div>
  );
}
