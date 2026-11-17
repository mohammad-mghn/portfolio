"use client";

import { useLenis } from "@/lib/lenis";
import { useEffect, useRef } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { gsap, useGSAP } from "@/lib/gsap";

export type MenuData = {
  locale: string;
  email: string;
  socials: { label: string; href: string }[];
  items: { href: string; label: string; index: string }[];
  menuLabels: { title: string; contact: string; elsewhere: string; close: string };
};

type TopBar = {
  shortName: string;
  homeLabel: string;
  language: string;
  languageLabel: string;
  switchHref: string;
  hrefLang: string;
};

/**
 * Full-screen numbered menu revealed with a clip-path wipe (mirrors in RTL automatically).
 * Its top bar repeats the site header, so Close sits exactly where Menu was.
 */
export function Menu({
  open,
  onClose,
  items,
  socials,
  email,
  menuLabels,
  top,
}: MenuData & { open: boolean; onClose: () => void; top: TopBar }) {
  const root = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const pathname = usePathname();
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const el = root.current!;
      tl.current = gsap
        .timeline({ paused: true })
        .set(el, { visibility: "visible" })
        .fromTo(el, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9 })
        .from("[data-menu-item]", { yPercent: 110, duration: 0.8, stagger: 0.04 }, 0.25)
        .from("[data-menu-meta]", { autoAlpha: 0, y: 12, duration: 0.6, stagger: 0.04 }, 0.45);
    },
    { scope: root },
  );

  useEffect(() => {
    const t = tl.current;
    if (!t) return;
    if (open) {
      lenis?.stop();
      t.timeScale(1).play();
      root.current?.querySelector<HTMLElement>("[data-menu-close]")?.focus({ preventScroll: true });
    } else {
      t.timeScale(1.6).reverse();
      lenis?.start();
    }
  }, [open, lenis]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const isCurrent = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  return (
    <div
      ref={root}
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label={menuLabels.title}
      aria-hidden={!open}
      inert={!open}
      className="invisible fixed inset-0 z-[70] flex flex-col bg-night text-[#ece8df]"
    >
      <div className="flex h-(--header-h) shrink-0 items-center justify-between gap-6 px-gutter">
        <Link
          href="/"
          onClick={onClose}
          className="text-label -mx-3 flex min-h-[44px] items-center gap-2 px-3 font-semibold tracking-[0.18em] hover:text-accent"
          aria-label={`${top.shortName} — ${top.homeLabel}`}
        >
          <span className="inline-block size-2 rotate-45 bg-accent" aria-hidden />
          <span className="brand-mark">{top.shortName}</span>
        </Link>
        <div className="-me-4 flex items-center">
          <a
            href={top.switchHref}
            hrefLang={top.hrefLang}
            className="text-label lang-switch flex min-h-[44px] min-w-[44px] items-center justify-center px-3 hover:text-accent"
            aria-label={top.languageLabel}
          >
            {top.language}
          </a>
          <button type="button" onClick={onClose} data-menu-close className="text-label flex min-h-[44px] items-center gap-2 px-4 hover:text-accent">
            {menuLabels.close}
            <span aria-hidden className="relative block size-3.5">
              <span className="absolute inset-x-0 top-1/2 h-px rotate-45 bg-current" />
              <span className="absolute inset-x-0 top-1/2 h-px -rotate-45 bg-current" />
            </span>
          </button>
        </div>
      </div>

      <div data-lenis-prevent className="grid-12 min-h-0 flex-1 content-between gap-y-8 overflow-y-auto overscroll-contain pt-4 pb-6 md:content-center md:pb-10">
        <nav aria-label={menuLabels.title} className="col-span-full md:col-span-8">
          <ul className="group/menu">
            {items.map((item) => (
              <li key={item.href} className="overflow-clip border-t border-[#2c2d29] last:border-b">
                <Link
                  href={item.href}
                  onClick={onClose}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                  data-menu-item
                  className="flex items-baseline gap-3 py-2.5 transition-[opacity,translate,color] duration-500 ease-house group-hover/menu:opacity-35 hover:translate-x-3 hover:!opacity-100 hover:text-accent aria-[current=page]:text-accent md:gap-5 md:py-1.5 rtl:hover:-translate-x-3"
                >
                  <span className="text-label w-6 shrink-0 opacity-60 md:w-8">{item.index}</span>
                  <span className="text-menu min-w-0">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <aside className="col-span-full flex flex-col gap-6 md:col-span-3 md:col-start-10 md:self-end">
          <div data-menu-meta>
            <p className="text-label mb-2 opacity-60">{menuLabels.contact}</p>
            <a href={`mailto:${email}`} dir="ltr" className="text-lead [overflow-wrap:anywhere] hover:text-accent">
              {email}
            </a>
          </div>
          <div data-menu-meta>
            <p className="text-label mb-2 opacity-60">{menuLabels.elsewhere}</p>
            {/* Phones: small labels in a wrapping row. Desktop: a column of larger, full-width rows (see .menu-social). */}
            <ul className="menu-social flex flex-wrap gap-x-4 gap-y-2 md:flex-col md:gap-y-0">
              {socials.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="text-label hover:text-accent">
                    <span>{s.label}</span> <span aria-hidden className="inline-block rtl:-scale-x-100">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
