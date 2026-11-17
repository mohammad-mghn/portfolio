import { routing, type Locale } from "@/i18n/routing";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001").replace(/\/$/, "");

/** Locale-prefixed path for as-needed routing: "/" + path for English, "/fa" + path for Persian. */
export const localePath = (locale: Locale, path = "/") => {
  const clean = path === "/" ? "" : path;
  return locale === routing.defaultLocale ? clean || "/" : `/${locale}${clean}`;
};

/** hreflang alternates + canonical for a path that exists in every locale. */
export const alternatesFor = (locale: Locale, path = "/") => ({
  canonical: localePath(locale, path),
  languages: {
    ...Object.fromEntries(routing.locales.map((l) => [l === "fa" ? "fa-IR" : "en", localePath(l, path)])),
    "x-default": localePath(routing.defaultLocale, path),
  },
});
