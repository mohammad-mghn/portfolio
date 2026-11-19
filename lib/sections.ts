/**
 * Home-page sections in reading order. This list is the single source of truth: the page renders
 * in this order, and section numbers come from the position here.
 * `key` is the label under `nav` in messages.
 */
export const homeSections = [
  { id: "top", key: "home" },
  { id: "pillars", key: "pillars" },
  { id: "about", key: "about" },
  { id: "recommendations", key: "recommendations" },
  { id: "work", key: "work" },
  { id: "journey", key: "journey" },
  { id: "social", key: "social" },
  { id: "contact", key: "contact" },
] as const;

export type HomeSectionId = (typeof homeSections)[number]["id"];

/** 1-based section number shown next to a section's eyebrow ("03 — Recommendations"). */
export function homeSectionIndex(id: HomeSectionId): number {
  return homeSections.findIndex((s) => s.id === id);
}
