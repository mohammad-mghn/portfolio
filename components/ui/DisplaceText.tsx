"use client";

import clsx from "clsx";
import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";
import type { Displacer } from "@/lib/effects/displace-text";
import { onSwarmStart, swarmHolds } from "@/lib/swarm/store";

/**
 * A heading whose text shears into colour-fringed tiles under a sweeping pointer and springs back
 * (see lib/effects/displace-text.ts, fetched on the first hover). Without a mouse, with reduced
 * motion, or without JavaScript it is an ordinary <h2>. In the agent build mode it works too, once
 * the agents have built the heading.
 */
export function DisplaceText({ id, className, children }: { id?: string; className?: string; children: ReactNode }) {
  const heading = useRef<HTMLHeadingElement>(null);
  const effect = useRef<Displacer | null>(null);
  const loading = useRef(false);
  const pointer = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => () => effect.current?.destroy(), []);
  // When the build mode starts, tiles in motion go at once, so the agents copy the plain heading.
  // (The effect is made again, from the heading as it is then, on the next hover.)
  useEffect(
    () =>
      onSwarmStart(() => {
        pointer.current = null;
        effect.current?.destroy();
        effect.current = null;
      }),
    [],
  );

  const at = (e: PointerEvent<HTMLHeadingElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - box.left, y: e.clientY - box.top };
  };

  const allowed = (e: PointerEvent<HTMLHeadingElement>) =>
    e.pointerType !== "touch" && !swarmHolds(heading.current) && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /**
   * Load the effect once and start it where the pointer is. The tiles are copies of the heading as
   * it is at that moment, so they are never made while anything inside it is still animating in
   * (they would copy half-shown text); the next pointer move tries again.
   */
  function start() {
    const el = heading.current;
    if (!el || !pointer.current) return;
    if (effect.current) return effect.current.enter(pointer.current.x, pointer.current.y);
    if (loading.current || el.getAnimations({ subtree: true }).length) return;
    loading.current = true;
    void import("@/lib/effects/displace-text").then(({ createDisplacer }) => {
      loading.current = false;
      if (!heading.current || swarmHolds(heading.current)) return;
      if (heading.current.getAnimations({ subtree: true }).length) return;
      effect.current = createDisplacer(heading.current);
      // Still over the heading when the code arrived: start from where the pointer is now.
      if (pointer.current) effect.current.enter(pointer.current.x, pointer.current.y);
    });
  }

  function onEnter(e: PointerEvent<HTMLHeadingElement>) {
    if (!allowed(e)) return;
    pointer.current = at(e);
    start();
  }

  function onMove(e: PointerEvent<HTMLHeadingElement>) {
    if (!allowed(e)) return;
    const first = !pointer.current;
    pointer.current = at(e);
    if (!effect.current) return start();
    if (first) effect.current.enter(pointer.current.x, pointer.current.y);
    else effect.current.move(pointer.current.x, pointer.current.y);
  }

  function onLeave() {
    pointer.current = null;
    effect.current?.leave();
  }

  return (
    <h2 ref={heading} id={id} className={clsx("relative", className)} onPointerEnter={onEnter} onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
    </h2>
  );
}
