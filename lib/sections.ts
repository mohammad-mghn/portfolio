/** Home-page sections in order: id, i18n key under `nav`, and whether they sit on a dark background. */
export const homeSections = [
  { id: "top", key: "home", dark: false },
  { id: "pillars", key: "pillars", dark: false },
  { id: "recommendations", key: "recommendations", dark: false },
  { id: "numbers", key: "numbers", dark: false },
  { id: "journey", key: "journey", dark: false },
  { id: "work", key: "work", dark: false },
  { id: "beliefs", key: "beliefs", dark: true },
  { id: "about", key: "about", dark: false },
  { id: "social", key: "social", dark: false },
  { id: "contact", key: "contact", dark: true },
] as const;

export type HomeSectionId = (typeof homeSections)[number]["id"];
