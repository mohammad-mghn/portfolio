"use client";

import { Link, useRouter } from "@/i18n/navigation";
import { startWipe } from "@/components/motion/PageWipe";

/** Bottom panel in the next project's colour; click → colour wipe → navigate (replace inside the overlay). */
export function NextProject({
  slug,
  title,
  color,
  label,
  index,
  replace,
}: {
  slug: string;
  title: string;
  color: string;
  label: string;
  index: string;
  replace?: boolean;
}) {
  const router = useRouter();
  const href = `/work/${slug}`;

  return (
    <Link
      href={href}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        router.prefetch(href);
        startWipe({
          color,
          title,
          label: `${label} — ${index}`,
          done: () => (replace ? router.replace(href, { scroll: false }) : router.push(href)),
        });
      }}
      className="group relative z-1 flex min-h-[60svh] flex-col justify-between overflow-hidden p-(--gutter) text-[#f4f2ec]"
      style={{ background: color }}
    >
      <span className="text-label flex justify-between opacity-80">
        <span>{label}</span>
        <span>{index}</span>
      </span>
      <span className="flex items-end justify-between gap-6">
        <span className="text-mega transition-transform duration-700 ease-house group-hover:-translate-y-2">{title}</span>
        <span aria-hidden className="text-huge transition-transform duration-700 ease-house group-hover:translate-x-3 rtl:-scale-x-100">
          →
        </span>
      </span>
    </Link>
  );
}
