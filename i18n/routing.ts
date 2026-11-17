import { defineRouting } from "next-intl/routing";

export const locales = ["en", "fa"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  // English lives at "/", Persian at "/fa".
  localePrefix: "as-needed",
});

export const rtlLocales: readonly Locale[] = ["fa"];
export const dirFor = (locale: Locale) => (rtlLocales.includes(locale) ? "rtl" : "ltr");
