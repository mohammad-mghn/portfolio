"use client";

import { useEffect, useRef, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { Menu, type MenuData } from "./Menu";

type Props = MenuData & {
  shortName: string;
  labels: { menu: string; close: string; language: string; languageLabel: string; home: string };
};

/**
 * Fixed editorial header: logo · language · menu. Hides on scroll down.
 * Its text is white with `mix-blend-mode: difference` (see .site-header), so it always contrasts
 * with whatever is behind it, even when a word sits half on a light and half on a dark area.
 * The orange diamond is drawn in its own layer above, otherwise the blend would recolour it.
 */
export function Header(props: Props) {
  const { shortName, locale, labels } = props;
  const pathname = usePathname();
  // Explicit /en prefix so the locale cookie is updated (as-needed routing would otherwise bounce back).
  const switchHref = `/${locale === "fa" ? "en" : "fa"}${pathname === "/" ? "" : pathname}`;
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const last = useRef(0);

  useEffect(() => {
    // Lenis scrolls the window, so native scroll events cover both smooth and reduced-motion modes.
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - last.current;
      if (Math.abs(delta) > 6) {
        setHidden(delta > 0 && y > 160);
        last.current = y;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        data-hidden={hidden && !open ? "" : undefined}
        className="site-header fixed inset-x-0 top-0 z-50 flex h-(--header-h) items-center justify-between gap-6 px-gutter transition-[translate,opacity,color] duration-700 ease-house data-hidden:-translate-y-full data-hidden:opacity-0"
      >
        <Link href="/" className="text-label -mx-3 flex min-h-[44px] items-center gap-2 px-3 font-semibold tracking-[0.18em]" aria-label={`${shortName} — ${labels.home}`}>
          {/* Room for the diamond, which lives in the layer below this header. */}
          <span className="inline-block size-2" aria-hidden />
          {shortName}
        </Link>

        <div className="-me-4 flex items-center">
          <a
            href={switchHref}
            hrefLang={locale === "fa" ? "en" : "fa"}
            className="text-label flex min-h-[44px] min-w-[44px] items-center justify-center px-3 transition-opacity duration-300 hover:opacity-60"
            aria-label={labels.languageLabel}
          >
            {labels.language}
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="site-menu"
            className="text-label group flex min-h-[44px] items-center gap-2 px-4 transition-opacity duration-300 hover:opacity-60"
          >
            {labels.menu}
            <span className="flex flex-col gap-[3px]" aria-hidden>
              <span className="block h-px w-5 bg-current transition-transform duration-500 ease-house group-hover:scale-x-75" />
              <span className="block h-px w-5 bg-current" />
            </span>
          </button>
        </div>
      </header>
      <span
        aria-hidden
        data-hidden={hidden && !open ? "" : undefined}
        className="pointer-events-none fixed start-0 top-0 z-50 flex h-(--header-h) items-center ps-(--page-pad) transition-[translate,opacity] duration-700 ease-house data-hidden:-translate-y-full data-hidden:opacity-0"
      >
        <span className="inline-block size-2 rotate-45 bg-accent" />
      </span>
      <Menu
        {...props}
        open={open}
        onClose={() => setOpen(false)}
        top={{
          shortName,
          homeLabel: labels.home,
          language: labels.language,
          languageLabel: labels.languageLabel,
          switchHref,
          hrefLang: locale === "fa" ? "en" : "fa",
        }}
      />
    </>
  );
}
