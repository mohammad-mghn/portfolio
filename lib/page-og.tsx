import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getSiteSettings } from "@/lib/content";
import { ogImage } from "@/lib/og";

/** Static params for a per-page share image: one per locale. */
export const localeParams = () => routing.locales.map((locale) => ({ locale }));

/**
 * Share image for an inner page: the name as eyebrow, the page title huge, the tagline as footer.
 * `namespace` is the page's message namespace (it must have a `title` key).
 */
export async function pageOgImage(params: Promise<{ locale: string }>, namespace: string) {
  const { locale: raw } = await params;
  const locale = hasLocale(routing.locales, raw) ? raw : routing.defaultLocale;
  const [site, t] = await Promise.all([getSiteSettings(locale), getTranslations({ locale, namespace })]);
  return ogImage({ locale, eyebrow: site.name, title: t("title"), footer: site.tagline });
}
