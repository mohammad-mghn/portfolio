import { createImageUrlBuilder } from "@sanity/image-url";
import { dataset, projectId } from "@/sanity/env";
import { pickStr } from "./localize";
import type { Img, L, Locale } from "./types";

const builder = createImageUrlBuilder({ projectId, dataset });

/** What the `IMG` projection returns for an image field. */
export type SanityImg = {
  asset?: { _ref?: string };
  crop?: { top?: number; bottom?: number; left?: number; right?: number };
  hotspot?: { x?: number; y?: number };
  alt?: L;
  meta?: { lqip?: string; w?: number; h?: number };
} | null;

/** GROQ projection for any image field: the reference with the editor's crop and hotspot, plus size and blur preview. */
export const IMG = `{ asset, crop, hotspot, alt, "meta": asset->metadata{ lqip, "w": dimensions.width, "h": dimensions.height } }`;

/**
 * A Sanity image as the site uses it. The crop set in the panel is baked into the URL (and into
 * width/height), the hotspot becomes the focal point for cropped frames, and the tiny blurred
 * preview is passed along for loading. Nothing wider than 2400px is requested.
 */
export function sanityImg(image: SanityImg | undefined, locale: Locale, alt?: string): Img | undefined {
  if (!image?.asset?._ref) return undefined;
  const c = image.crop ?? {};
  const fullW = image.meta?.w ?? 1600;
  const fullH = image.meta?.h ?? 1000;
  const croppedW = fullW * (1 - (c.left ?? 0) - (c.right ?? 0));
  const croppedH = fullH * (1 - (c.top ?? 0) - (c.bottom ?? 0));
  const width = Math.round(Math.min(croppedW, 2400));
  return {
    src: builder.image(image).width(width).auto("format").url(),
    width,
    height: Math.round((croppedH * width) / croppedW),
    alt: alt ?? pickStr(image.alt, locale),
    lqip: image.meta?.lqip,
    focus: image.hotspot?.x != null && image.hotspot.y != null ? { x: image.hotspot.x, y: image.hotspot.y } : undefined,
  };
}

/** The share image at exactly 1200×630, cropped around the hotspot. */
export function sanityShareImage(image: SanityImg | undefined): string | undefined {
  if (!image?.asset?._ref) return undefined;
  return builder.image(image).width(1200).height(630).fit("crop").format("png").url();
}
