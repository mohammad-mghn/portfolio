import type { Img, L, Locale, RichText } from "./types";

export const pick = <T,>(value: L<T> | undefined, locale: Locale, fallback: T): T =>
  (value?.[locale] ?? value?.en ?? fallback) as T;

export const pickStr = (value: L | undefined, locale: Locale) => pick(value, locale, "");

/** Plain paragraphs → minimal Portable Text blocks (same shape Sanity returns). */
export const toBlocks = (paragraphs: string[], key = "b"): RichText =>
  paragraphs.map((text, i) => ({
    _type: "block",
    _key: `${key}${i}`,
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: `${key}${i}s`, text, marks: [] }],
  }));

/** "Pishgaman Farda" → "pishgaman-farda": the anchor for a company on /engineering. */
export const companyKey = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

type SeedImage = { src: string; width: number; height: number; alt: L };

export const toImg = (image: SeedImage | undefined, locale: Locale): Img | undefined =>
  image ? { src: image.src, width: image.width, height: image.height, alt: pickStr(image.alt, locale) } : undefined;
