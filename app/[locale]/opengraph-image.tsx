import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { getSiteSettings } from "@/lib/content";
import { ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Mohammad Mohagheghian";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = hasLocale(routing.locales, raw) ? raw : routing.defaultLocale;
  const site = await getSiteSettings(locale);
  if (site.shareImageUrl) {
    const res = await fetch(site.shareImageUrl);
    if (res.ok) return new Response(await res.arrayBuffer(), { headers: { "content-type": contentType } });
  }
  return ogImage({
    locale,
    eyebrow: site.headline,
    title: site.name,
    footer: site.tagline,
  });
}
