import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Contact } from "@/components/home/Contact";
import { ChannelCards, ProfileList } from "@/components/home/Social";
import { PageHero } from "@/components/ui/PageHero";
import { routing } from "@/i18n/routing";
import { getSiteSettings } from "@/lib/content";
import { alternatesFor } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[locale]/content">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "content" });
  return { title: t("title"), description: t("statement"), alternates: alternatesFor(locale, "/content") };
}

/** The channels Mohammad makes content on, then everywhere else he can be found. */
export default async function ContentPage({ params }: PageProps<"/[locale]/content">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const [site, t, ts] = await Promise.all([
    getSiteSettings(locale),
    getTranslations({ locale, namespace: "content" }),
    getTranslations({ locale, namespace: "social" }),
  ]);
  const channels = site.socials.filter((s) => s.group === "content");

  return (
    <main id="main" className="relative z-1">
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        statement={t("statement")}
        meta={[t("metaLanguage"), t("metaTopics"), channels.map((c) => c.label).join(" · ")]}
      />
      <section aria-label={t("channels")} className="relative z-1 pb-(--space-section-sm)">
        <ChannelCards
          channels={channels}
          locale={locale}
          labels={{ persian: ts("persian"), watch: ts("watch"), follow: ts("follow") }}
        />
      </section>
      <section aria-label={ts("elsewhere")} className="relative z-1 pb-(--space-section)">
        <ProfileList profiles={site.socials.filter((s) => s.group === "professional")} label={ts("elsewhere")} />
      </section>
      <Contact locale={locale} site={site} />
    </main>
  );
}
