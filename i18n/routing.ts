import { defineRouting } from "next-intl/routing";
import { defaultLocale, locales } from "./locales";

export { dirFor, locales, rtlLocales, type Locale } from "./locales";

export const routing = defineRouting({
  locales,
  defaultLocale,
  // English lives at "/", Persian at "/fa".
  localePrefix: "as-needed",
});
