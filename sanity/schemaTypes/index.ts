import { about, experience, journey, pages, project, recommendation, siteSettings, venture } from "./documents";
import { altImage, localeBlock, localeList, localeString, localeTags, localeText } from "./locale";

export const schemaTypes = [
  localeString,
  localeText,
  localeBlock,
  localeTags,
  localeList,
  altImage,
  siteSettings,
  about,
  pages,
  journey,
  experience,
  project,
  venture,
  recommendation,
];

/** One document each, opened straight from the menu: no "new" button, no delete. */
export const singletonTypes = new Set(["siteSettings", "about", "pages", "journey"]);
