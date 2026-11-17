import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Live } from "@/components/cms/Live";
import { Header } from "@/components/chrome/Header";
import { PageWipe } from "@/components/motion/PageWipe";
import { ScrollReveals } from "@/components/motion/ScrollReveals";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { dirFor, routing } from "@/i18n/routing";
import { getSiteSettings } from "@/lib/content";
import { fontVariables } from "@/lib/fonts";
import { formatIndex } from "@/lib/format";
import { alternatesFor, siteUrl } from "@/lib/site";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export const viewport: Viewport = {
  themeColor: "#edeae3",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const site = await getSiteSettings(locale);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: site.seoTitle, template: `%s — ${site.name}` },
    description: site.seoDescription,
    applicationName: site.name,
    authors: [{ name: site.name, url: siteUrl }],
    creator: site.name,
    alternates: alternatesFor(locale, "/"),
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: locale === "fa" ? "fa_IR" : "en_US",
      title: site.seoTitle,
      description: site.seoDescription,
    },
    twitter: { card: "summary_large_image", title: site.seoTitle, description: site.seoDescription },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({ children, modal, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const [site, t, tc, tm] = await Promise.all([
    getSiteSettings(locale),
    getTranslations({ locale, namespace: "nav" }),
    getTranslations({ locale, namespace: "contact" }),
    getTranslations({ locale, namespace: "meta" }),
  ]);
  const menuItems = [
    { href: "/", label: t("home") },
    { href: "/engineering", label: t("engineering") },
    { href: "/founding", label: t("founding") },
    { href: "/work", label: t("work") },
    { href: "/content", label: t("content") },
    { href: "/about", label: t("about") },
    { href: "/recommendations", label: t("recommendations") },
    { href: "/contact", label: t("contact") },
    { href: "/resume", label: t("resume") },
  ].map((item, i) => ({ ...item, index: formatIndex(i + 1, locale) }));

  return (
    <html lang={locale} dir={dirFor(locale)} className={fontVariables} suppressHydrationWarning>
      <head>
        <noscript
          dangerouslySetInnerHTML={{
            __html:
              "<style>[data-reveal],[data-split]{opacity:1!important;visibility:visible!important;transform:none!important}</style>",
          }}
        />
      </head>
      <body className="grain">
        <NextIntlClientProvider>
          <SmoothScroll>
            <a
              href="#main"
              className="text-label fixed start-3 top-3 z-[80] -translate-y-20 rounded-full bg-ink px-4 py-2 text-paper focus:translate-y-0"
            >
              {tm("skip")}
            </a>
            <div className="grid-lines" aria-hidden>
              {Array.from({ length: 12 }, (_, i) => (
                <span key={i} className={i >= 4 ? "hidden md:block" : undefined} />
              ))}
            </div>
            <Header
              locale={locale}
              shortName={site.shortName}
              email={site.email}
              socials={site.socials}
              items={menuItems}
              labels={{
                menu: t("menu"),
                close: t("close"),
                language: t("language"),
                languageLabel: t("languageLabel"),
                home: t("home"),
              }}
              menuLabels={{
                title: t("index"),
                contact: t("contact"),
                elsewhere: tc("elsewhere"),
                close: t("close"),
              }}
            />
            {children}
            {modal}
            <PageWipe />
            <ScrollReveals />
          </SmoothScroll>
        </NextIntlClientProvider>
        <Live />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
