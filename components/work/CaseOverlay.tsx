"use client";

import { useLenis } from "lenis/react";
import { useEffect, useRef, type ReactNode } from "react";
import { useRouter } from "@/i18n/navigation";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

/**
 * Overlay shell for intercepted case-study routes. Slides up over the current page, scrolls its own
 * container (Lenis paused underneath), Esc / ✕ go back in history so the URL stays honest.
 */
export function CaseOverlay({ children, closeLabel, titleId }: { children: ReactNode; closeLabel: string; titleId: string }) {
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const lenis = useLenis();
  const closing = useRef(false);

  useEffect(() => {
    lenis?.stop();
    return () => lenis?.start();
  }, [lenis]);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(panel.current, { yPercent: 100, duration: 0.9, ease: "house" });
      gsap.from(root.current, { backgroundColor: "rgba(21,20,18,0)", duration: 0.6 });
    },
    { scope: root },
  );

  const close = () => {
    if (closing.current) return;
    closing.current = true;
    if (prefersReducedMotion()) return router.back();
    gsap.to(panel.current, { yPercent: 100, duration: 0.7, ease: "house", onComplete: () => router.back() });
  };

  useEffect(() => {
    panel.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={root} className="fixed inset-0 z-[60] bg-[rgba(21,20,18,0.55)]">
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        data-lenis-prevent
        className="absolute inset-x-0 bottom-0 top-3 overflow-y-auto overscroll-contain rounded-t-[10px] bg-paper outline-none"
      >
        <button
          type="button"
          onClick={close}
          className="text-label sticky top-3 z-10 float-end me-3 mt-3 flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-paper hover:bg-accent"
        >
          {closeLabel}
          <span aria-hidden>✕</span>
        </button>
        {children}
      </div>
    </div>
  );
}
