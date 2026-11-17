"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

type WipeDetail = { color: string; title: string; label: string; done: () => void };

/** Fire a full-screen colour wipe, then run `done` (usually a router navigation) once covered. */
export function startWipe(detail: WipeDetail) {
  window.dispatchEvent(new CustomEvent<WipeDetail>("wipe:start", { detail }));
}

/**
 * Global next-project transition: the next project's colour rises over everything (including the
 * case-study overlay), navigation happens underneath, then the panel lifts away on the new route.
 */
export function PageWipe() {
  const ref = useRef<HTMLDivElement>(null);
  const pending = useRef(false);
  const pathname = usePathname();
  const [content, setContent] = useState<{ title: string; label: string; color: string } | null>(null);

  useEffect(() => {
    const onStart = (e: Event) => {
      const { color, title, label, done } = (e as CustomEvent<WipeDetail>).detail;
      setContent({ color, title, label });
      pending.current = true;
      const el = ref.current!;
      if (prefersReducedMotion()) {
        gsap.fromTo(el, { autoAlpha: 0, clipPath: "inset(0% 0% 0% 0%)" }, { autoAlpha: 1, duration: 0.25, onComplete: done });
        return;
      }
      gsap.fromTo(
        el,
        { autoAlpha: 1, clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.85, ease: "house", onComplete: done },
      );
    };
    window.addEventListener("wipe:start", onStart);
    return () => window.removeEventListener("wipe:start", onStart);
  }, []);

  useEffect(() => {
    if (!pending.current) return;
    pending.current = false;
    const el = ref.current!;
    if (prefersReducedMotion()) {
      gsap.to(el, { autoAlpha: 0, duration: 0.3, delay: 0.1 });
      return;
    }
    gsap.to(el, {
      clipPath: "inset(0% 0% 100% 0%)",
      duration: 0.9,
      delay: 0.25,
      ease: "house",
      onComplete: () => gsap.set(el, { autoAlpha: 0 }),
    });
  }, [pathname]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none invisible fixed inset-0 z-[90] flex flex-col justify-end px-(--page-pad) py-(--gutter) text-[#f4f2ec]"
      style={{ background: content?.color ?? "var(--ink)" }}
    >
      <p className="text-label opacity-70">{content?.label}</p>
      <p className="text-mega">{content?.title}</p>
    </div>
  );
}
