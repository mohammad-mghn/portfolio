import type { Img } from "@/lib/content/types";

/**
 * Extra <Image> props an image from the CMS brings with it: a blurred preview while it loads,
 * and the focal point the editor picked (used wherever the frame crops the picture).
 * Local images have neither, so this adds nothing for them.
 */
export function imgProps(img: Img) {
  return {
    ...(img.lqip ? { placeholder: "blur" as const, blurDataURL: img.lqip } : {}),
    ...(img.focus ? { style: { objectPosition: `${img.focus.x * 100}% ${img.focus.y * 100}%` } } : {}),
  };
}
