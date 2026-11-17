/** The site's languages. Kept free of any library import so both server and browser code can use it. */
export const locales = ["en", "fa"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const rtlLocales: readonly Locale[] = ["fa"];
export const dirFor = (locale: Locale) => (rtlLocales.includes(locale) ? "rtl" : "ltr");

/** "/work" → "/work" in English, "/fa/work" in Persian (English has no prefix). */
export const withLocale = (locale: string, href: string) =>
  locale === defaultLocale || !href.startsWith("/") ? href : `/${locale}${href === "/" ? "" : href}`;
