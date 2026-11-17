import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Live } from "@/components/cms/Live";
import { Header } from "@/components/chrome/Header";
import { LenisRuntime, PageWipe, ScrollReveals } from "@/components/deferred";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { dirFor, routing } from "@/i18n/routing";
import { getSiteSettings } from "@/lib/content";
import { formatIndex } from "@/lib/format";
import { siteJsonLd } from "@/lib/seo";
import { alternatesFor, localePath, siteUrl } from "@/lib/site";
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
      alternateLocale: locale === "fa" ? "en_US" : "fa_IR",
      title: site.seoTitle,
      description: site.seoDescription,
      url: localePath(locale, "/"),
    },
    twitter: {
      card: "summary_large_image",
      title: site.seoTitle,
      description: site.seoDescription,
      creator: site.socials.find((s) => s.label === "X")?.handle,
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
    formatDetection: { telephone: false },
  };
}

export default async function LocaleLayout({ children, modal, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const [site, jsonLd, t, tc, tm] = await Promise.all([
    getSiteSettings(locale),
    siteJsonLd(locale),
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
    <html lang={locale} dir={dirFor(locale)} suppressHydrationWarning>
      <head>
        {/*
          Fonts are declared in app/fonts.css; only the ones this language draws on the first screen
          are preloaded. English: the display/body face and the label face. Persian: its own face
          (Arabic script, plus its Latin part for names and numbers).
        */}
        {(locale === "fa" ? ["vazirmatn-arabic", "vazirmatn-latin"] : ["archivo-latin", "geist-mono-latin"]).map((font) => (
          <link key={font} rel="preload" href={`/fonts/${font}.woff2`} as="font" type="font/woff2" crossOrigin="anonymous" />
        ))}
        <noscript
          dangerouslySetInnerHTML={{
            __html:
              "<style>[data-reveal],[data-split]{opacity:1!important;visibility:visible!important;transform:none!important}</style>",
          }}
        />
      </head>
      <body className="grain">
        {/*
          Content below the first screen starts hidden and is revealed by the motion code, which loads
          after the first paint. If that code is slow or fails, this shows everything after 3.5s.
        */}
        <Script id="reveal-safety-net" strategy="beforeInteractive">
          {"setTimeout(function(){if(!window.__reveals)document.documentElement.classList.add('reveal-all')},3500)"}
        </Script>
        {/* Structured data for search engines. "<" is escaped so content can never close the tag. */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        {/*
          No NextIntlClientProvider: every translated string is rendered on the server and passed down
          as props, so the message formatter never has to ship to the browser. Links read the locale
          from the URL (see i18n/navigation.tsx).
        */}
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
          <LenisRuntime />
        </SmoothScroll>
        <Live />
        {/* Vercel's analytics only exist on Vercel; a Docker deploy would just log failed requests. */}
        {process.env.VERCEL ? (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        ) : null}
      </body>
    </html>
  );
}
