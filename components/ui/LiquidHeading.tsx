"use client";

import clsx from "clsx";
import { useEffect, useRef, type HTMLAttributes, type PointerEvent, type ReactNode } from "react";
import type { Liquid } from "@/lib/effects/liquid-text";
import { swarmActive, swarmStore } from "@/lib/swarm/store";

/**
 * The home page's <h1>: hovering it drags the letters through a liquid that swirls under the
 * pointer (lib/effects/liquid-text.ts, fetched on the first hover). The effect draws on a canvas
 * laid over the heading and hides the real letters only while it runs. Without a mouse, with
 * reduced motion, during the agent build mode, or without JavaScript, it is an ordinary heading.
 */
export function LiquidHeading({ className, children, ...rest }: HTMLAttributes<HTMLHeadingElement> & { children: ReactNode }) {
  const heading = useRef<HTMLHeadingElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const effect = useRef<Liquid | null>(null);
  const state = useRef<"idle" | "loading" | "ready" | "off">("idle");
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
  // The agent build mode has the heading to itself while it runs.
  useEffect(
    () =>
      swarmStore.subscribe(() => {
        if (!swarmActive()) return;
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

  async function onEnter(e: PointerEvent<HTMLHeadingElement>) {
    if (e.pointerType === "touch" || swarmActive() || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    pointer.current = at(e);
    if (state.current === "ready") return effect.current?.enter(pointer.current.x, pointer.current.y);
    if (state.current !== "idle" || !heading.current || !canvas.current) return;
    state.current = "loading";
    try {
      const { createLiquid } = await import("@/lib/effects/liquid-text");
      effect.current = await createLiquid(heading.current, canvas.current, { show, hide });
    } catch {
      effect.current = null;
    }
    // Could not match the page (or no WebGL 2): stay an ordinary heading. Try again on a later
    // hover only if it was too early (the heading was still animating in).
    state.current = effect.current ? "ready" : heading.current?.getAnimations({ subtree: true }).length ? "idle" : "off";
    if (effect.current && pointer.current && !swarmActive()) effect.current.enter(pointer.current.x, pointer.current.y);
  }

  function onMove(e: PointerEvent<HTMLHeadingElement>) {
    if (!pointer.current) return;
    pointer.current = at(e);
    effect.current?.move(pointer.current.x, pointer.current.y);
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
