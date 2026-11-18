"use client";

import clsx from "clsx";
import { useEffect, useRef, type HTMLAttributes, type PointerEvent, type ReactNode } from "react";
import type { Liquid } from "@/lib/effects/liquid-text";
import { onSwarmStart, swarmHolds } from "@/lib/swarm/store";

/**
 * The home page's <h1>: hovering it drags the letters through a liquid that swirls under the
 * pointer (lib/effects/liquid-text.ts, fetched on the first hover). The effect draws on a canvas
 * laid over the heading and hides the real letters only while it runs. Without a mouse, with
 * reduced motion, or without JavaScript, it is an ordinary heading. In the agent build mode it
 * works too, once the agents have built the name (not while they are typing it).
 */
export function LiquidHeading({ className, children, ...rest }: HTMLAttributes<HTMLHeadingElement> & { children: ReactNode }) {
  const heading = useRef<HTMLHeadingElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const effect = useRef<Liquid | null>(null);
  const state = useRef<"idle" | "loading" | "waiting" | "ready" | "off">("idle");
  const pointer = useRef<{ x: number; y: number } | null>(null);

  const show = () => {
    heading.current?.setAttribute("data-liquid", "");
    if (canvas.current) canvas.current.style.opacity = "1";
  };
  const hide = () => {
    heading.current?.removeAttribute("data-liquid");
    if (canvas.current) canvas.current.style.opacity = "0";
  };

  useEffect(() => () => effect.current?.destroy(), []);
  // The build mode starts by wiping and rebuilding the first screen: let go of the name at once.
  useEffect(
    () =>
      onSwarmStart(() => {
        pointer.current = null;
        effect.current?.leave();
        hide();
      }),
    [],
  );

  const at = (e: PointerEvent<HTMLHeadingElement>) => {
    const box = canvas.current?.getBoundingClientRect();
    return box ? { x: e.clientX - box.left, y: e.clientY - box.top } : { x: 0, y: 0 };
  };

  /** Not for touch or reduced motion, nor while the build mode is still building the name. */
  const allowed = (e: PointerEvent<HTMLHeadingElement>) =>
    e.pointerType !== "touch" && !swarmHolds(heading.current) && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /**
   * Load the effect (once) and start it where the pointer is. Runs from enter *and* move: after a
   * reload with the pointer already resting on the name there is no enter event, only moves, and a
   * first try made while the intro is still animating has to be repeated once it has finished.
   */
  async function start() {
    if (state.current === "ready") {
      if (pointer.current) effect.current?.enter(pointer.current.x, pointer.current.y);
      return;
    }
    if (state.current !== "idle" || !heading.current || !canvas.current) return;
    state.current = "loading";
    try {
      const { createLiquid } = await import("@/lib/effects/liquid-text");
      effect.current = await createLiquid(heading.current, canvas.current, { show, hide });
    } catch {
      effect.current = null;
    }
    if (effect.current) {
      state.current = "ready";
      if (pointer.current && !swarmHolds(heading.current)) effect.current.enter(pointer.current.x, pointer.current.y);
      return;
    }
    // Could not match the page (or no WebGL 2): stay an ordinary heading, unless it was only too
    // early (the name was still animating in). Then try again the moment the intro has finished.
    const running = heading.current?.getAnimations({ subtree: true }) ?? [];
    if (!running.length) {
      state.current = "off";
      return;
    }
    state.current = "waiting";
    await Promise.allSettled(running.map((a) => a.finished));
    state.current = "idle";
    if (pointer.current && !swarmHolds(heading.current)) void start();
  }

  function onEnter(e: PointerEvent<HTMLHeadingElement>) {
    if (!allowed(e)) return;
    pointer.current = at(e);
    void start();
  }

  function onMove(e: PointerEvent<HTMLHeadingElement>) {
    if (!allowed(e)) return;
    const first = !pointer.current;
    pointer.current = at(e);
    if (state.current === "ready") {
      // Pointer was already inside when the effect became ready (or it never saw an enter): begin here.
      if (first) effect.current?.enter(pointer.current.x, pointer.current.y);
      else effect.current?.move(pointer.current.x, pointer.current.y);
    } else void start();
  }

  function onLeave() {
    pointer.current = null;
    effect.current?.leave();
  }

  return (
    <h1 ref={heading} className={clsx("relative", className)} onPointerEnter={onEnter} onPointerMove={onMove} onPointerLeave={onLeave} {...rest}>
      {children}
      {/* Reaches a little above and below the heading: the letters stand taller than its tight lines. */}
      <canvas ref={canvas} aria-hidden className="liquid-canvas pointer-events-none absolute inset-x-0 opacity-0" />
    </h1>
  );
}
