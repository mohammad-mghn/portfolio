import type { Locale } from "@/i18n/routing";

const numberLocale = (locale: Locale) => (locale === "fa" ? "fa-IR" : "en-US");

/** "01", "02" … in the locale's digits. */
export const formatIndex = (n: number, locale: Locale) =>
  new Intl.NumberFormat(numberLocale(locale), { minimumIntegerDigits: 2, useGrouping: false }).format(n);

export const formatNumber = (n: number, locale: Locale) => new Intl.NumberFormat(numberLocale(locale)).format(n);

/** Replace ASCII digits inside a string with the locale's digits (e.g. years in copy). */
export const localizeDigits = (value: string, locale: Locale) =>
  locale === "fa" ? value.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]) : value;

export const formatDate = (iso: string, locale: Locale) =>
  new Intl.DateTimeFormat(locale === "fa" ? "fa-IR-u-ca-gregory" : "en-US", {
    year: "numeric",
    month: "short",
  }).format(new Date(iso));

/** "2026-09" → "Sep 2026" (or the Persian equivalent, Gregorian calendar). */
export const formatMonth = (yyyyMm: string, locale: Locale) => formatDate(`${yyyyMm}-01`, locale);
