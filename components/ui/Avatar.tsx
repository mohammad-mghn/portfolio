import clsx from "clsx";
import Image from "next/image";
import type { Img } from "@/lib/content/types";
import { imgProps } from "@/lib/img";

/** A person's portrait as a square, black-and-white tile, or their initials when there is no photo. */
export function Avatar({ name, portrait, className }: { name: string; portrait?: Img; className?: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  return (
    <span
      aria-hidden
      className={clsx(
        "text-label relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-[2px] bg-ink text-paper",
        className,
      )}
    >
      {portrait ? (
        <Image src={portrait.src} alt="" fill sizes="96px" className="object-cover grayscale contrast-110" {...imgProps(portrait)} />
      ) : (
        initials
      )}
    </span>
  );
}
