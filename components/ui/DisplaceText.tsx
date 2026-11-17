"use client";

import clsx from "clsx";
import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";
import type { Displacer } from "@/lib/effects/displace-text";

/**
 * A heading whose text shears into colour-fringed tiles under a sweeping pointer and springs back
 * (see lib/effects/displace-text.ts, fetched on the first hover). Without a mouse, with reduced
 * motion, or without JavaScript it is an ordinary <h2>.
 */
export function DisplaceText({ id, className, children }: { id?: string; className?: string; children: ReactNode }) {
  const heading = useRef<HTMLHeadingElement>(null);
  const effect = useRef<Displacer | null>(null);
  const loading = useRef(false);
  const pointer = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => () => effect.current?.destroy(), []);

  const at = (e: PointerEvent<HTMLHeadingElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - box.left, y: e.clientY - box.top };
  };

  function onEnter(e: PointerEvent<HTMLHeadingElement>) {
    if (e.pointerType === "touch" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    pointer.current = at(e);
    if (effect.current) return effect.current.enter(pointer.current.x, pointer.current.y);
    if (loading.current) return;
    loading.current = true;
    void import("@/lib/effects/displace-text").then(({ createDisplacer }) => {
      if (!heading.current) return;
      effect.current = createDisplacer(heading.current);
      // Still over the heading when the code arrived: start from where the pointer is now.
      if (pointer.current) effect.current.enter(pointer.current.x, pointer.current.y);
    });
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
    <h2 ref={heading} id={id} className={clsx("relative", className)} onPointerEnter={onEnter} onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
    </h2>
  );
}
