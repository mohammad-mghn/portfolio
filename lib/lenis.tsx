"use client";

import type Lenis from "lenis";
import { createContext, useContext } from "react";

/**
 * The page's smooth-scroll instance, shared through context. It is `undefined` until the motion
 * code has loaded (after the first paint) and for the whole visit if that code never loads, so
 * every user of it must cope with native scrolling too.
 * (A local context instead of lenis/react, so reading it does not pull Lenis into the first bundle.)
 */
export const LenisContext = createContext<Lenis | undefined>(undefined);
export const LenisSetterContext = createContext<(lenis: Lenis | undefined) => void>(() => {});

export const useLenis = () => useContext(LenisContext);
