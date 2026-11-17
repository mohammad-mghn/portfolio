"use client";

import type Lenis from "lenis";
import { useState, type ReactNode } from "react";
import { LenisContext, LenisSetterContext } from "@/lib/lenis";

/**
 * Holds the smooth-scroll instance for the whole page tree. The instance itself is created by
 * <LenisRuntime/>, which loads after the first paint; until then (and with JavaScript problems)
 * the page simply scrolls natively. This provider is tiny and always mounted, so the page tree
 * never remounts when smooth scrolling arrives.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | undefined>(undefined);
  return (
    <LenisSetterContext.Provider value={setLenis}>
      <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
    </LenisSetterContext.Provider>
  );
}
