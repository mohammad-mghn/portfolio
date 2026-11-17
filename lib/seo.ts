import "server-only";
import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";
import { getAbout, getSiteSettings } from "@/lib/content";
import { alternatesFor, localePath, siteUrl } from "@/lib/site";

const ogLocale = (locale: Locale) => (locale === "fa" ? "fa_IR" : "en_US");

/**
 * Metadata for one page: its title and description, the canonical URL with both language
 * versions, and the same title and description for link previews (Open Graph and X).
 * A page that sets `openGraph` replaces the layout's whole block, so the shared fields are
 * repeated here. The preview image comes from the page's own opengraph-image file.
 */
export async function pageMetadata(locale: Locale, path: string, title: string, description?: string): Promise<Metadata> {
  const site = await getSiteSettings(locale);
  const shareTitle = `${title} · ${site.name}`;
  const text = description || site.seoDescription;
  return {
    title,
    description: text,
    alternates: alternatesFor(locale, path),
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: ogLocale(locale),
      title: shareTitle,
      description: text,
      url: localePath(locale, path),
    },
    twitter: { card: "summary_large_image", title: shareTitle, description: text },
  };
}

/**
 * Structured data (schema.org) for search engines: who the site is about and the site itself.
 * Everything comes from the same content the pages show.
 */
export async function siteJsonLd(locale: Locale) {
  const [site, about] = await Promise.all([getSiteSettings(locale), getAbout(locale)]);
  const person = `${siteUrl}/#person`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: site.name,
        description: site.seoDescription,
        inLanguage: ["en", "fa-IR"],
        publisher: { "@id": person },
      },
      {
        "@type": "Person",
        "@id": person,
        name: site.name,
        url: siteUrl,
        description: site.seoDescription,
        jobTitle: site.roles[0]?.title,
        worksFor: site.roles.map((r) => ({ "@type": "Organization", name: r.org, ...(r.href ? { url: r.href } : {}) })),
        ...(about.portrait ? { image: new URL(about.portrait.src, siteUrl).href } : {}),
        email: `mailto:${site.email}`,
        sameAs: site.socials.map((s) => s.href),
        knowsLanguage: about.languages.map((l) => l.name),
      },
    ],
  };
}
