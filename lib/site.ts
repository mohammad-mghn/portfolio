import { routing, type Locale } from "@/i18n/routing";

/**
 * Where the site lives: canonical links, the sitemap and share images are built from it.
 * Set NEXT_PUBLIC_SITE_URL to override. Without it a production build uses the real domain, so a
 * deploy that forgot the variable never publishes links to localhost. It is the "www" address
 * because that is where the domain itself sends visitors (mghn.info redirects to www.mghn.info).
 */
const defaultSiteUrl = process.env.NODE_ENV === "production" ? "https://www.mghn.info" : "http://localhost:3001";
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || defaultSiteUrl).replace(/\/$/, "");

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
