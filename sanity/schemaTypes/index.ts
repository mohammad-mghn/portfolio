import { about, experience, milestone, project, recommendation, siteSettings } from "./documents";
import { altImage, localeBlock, localeString, localeTags, localeText } from "./locale";

export const schemaTypes = [
  localeString,
  localeText,
  localeBlock,
  localeTags,
  altImage,
  siteSettings,
  about,
  milestone,
  experience,
  project,
  recommendation,
];

export const singletonTypes = new Set(["siteSettings", "about"]);
