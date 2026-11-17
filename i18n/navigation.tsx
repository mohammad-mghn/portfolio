"use client";

import NextLink from "next/link";
import { useParams, usePathname as useNextPathname, useRouter as useNextRouter } from "next/navigation";
import { useMemo, type ComponentProps } from "react";
import { defaultLocale, withLocale } from "./locales";

/**
 * Locale-aware links and router for the app, written in terms of the page's path only
 * ("/work"), never the locale. The locale comes from the URL segment.
 *
 * These are a few lines on top of next/link on purpose: next-intl's own navigation helpers need
 * its provider in the browser, and with it the whole message formatter (tens of KB) that this
 * site never uses there, since every translated string is rendered on the server.
 */
function useLocale(): string {
  const { locale } = useParams<{ locale?: string }>();
  return locale ?? defaultLocale;
}

export function Link({ href, ...props }: Omit<ComponentProps<typeof NextLink>, "href"> & { href: string }) {
  const locale = useLocale();
  return <NextLink href={withLocale(locale, href)} {...props} />;
}

/** The current path without its locale prefix: "/fa/work" → "/work". */
export function usePathname(): string {
  const pathname = useNextPathname();
  const locale = useLocale();
  if (pathname === `/${locale}`) return "/";
  return pathname.startsWith(`/${locale}/`) ? pathname.slice(locale.length + 1) : pathname;
}

export function useRouter() {
  const router = useNextRouter();
  const locale = useLocale();
  return useMemo(
    () => ({
      back: () => router.back(),
      refresh: () => router.refresh(),
      prefetch: (href: string) => router.prefetch(withLocale(locale, href)),
      push: (href: string, options?: { scroll?: boolean }) => router.push(withLocale(locale, href), options),
      replace: (href: string, options?: { scroll?: boolean }) => router.replace(withLocale(locale, href), options),
    }),
    [router, locale],
  );
}
