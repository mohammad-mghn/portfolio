"use client";

/**
 * Header/rail tone manager. Sections that sit under the fixed header on a dark
 * background register themselves here; <html data-tone="dark"> is set while any is active.
 */
const sources = new Map<string, boolean>();

export function setTone(source: string, dark: boolean) {
  if (sources.get(source) === dark) return;
  sources.set(source, dark);
  const anyDark = [...sources.values()].some(Boolean);
  const root = document.documentElement;
  if (anyDark) root.dataset.tone = "dark";
  else delete root.dataset.tone;
}
