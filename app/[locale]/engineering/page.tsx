import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Beliefs } from "@/components/home/Beliefs";
import { Contact } from "@/components/home/Contact";
import { ExperienceTimeline } from "@/components/pages/ExperienceTimeline";
import { PageLinks } from "@/components/pages/PageLinks";
import { PageHero } from "@/components/ui/PageHero";
import { routing } from "@/i18n/routing";
import { getAbout, getExperience, getPageCopy, getSiteSettings } from "@/lib/content";
import { alternatesFor } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[locale]/engineering">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const [t, copy] = await Promise.all([
    getTranslations({ locale, namespace: "engineering" }),
    getPageCopy(locale, "engineering"),
  ]);
  return { title: t("title"), description: copy.statement, alternates: alternatesFor(locale, "/engineering") };
}

export default async function EngineeringPage({ params }: PageProps<"/[locale]/engineering">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const copy = await getPageCopy(locale, "engineering");

  const [site, about, experience, t, tb] = await Promise.all([
    getSiteSettings(locale),
    getAbout(locale),
    getExperience(locale),
    getTranslations({ locale, namespace: "engineering" }),
    getTranslations({ locale, namespace: "beliefs" }),
  ]);
  const now = site.roles[0];
  const meta = [
    t("metaSince"),
    t("metaRoles", { count: experience.length }),
    ...(now ? [t("metaNow", { role: now.title, org: now.org })] : []),
    site.location,
  ];

  return (
    <main id="main" className="relative z-1">
      <PageHero eyebrow={t("eyebrow")} title={t("title")} statement={copy.statement} meta={meta} />
      <ExperienceTimeline locale={locale} experience={experience} index={1} />
      <Beliefs
        locale={locale}
        beliefs={[]}
        quotes={about.quotes}
        kinds={["engineering"]}
        more={false}
        index={2}
        heading={{ eyebrow: tb("engineers"), title: t("quotesTitle") }}
      />
      <PageLinks
        links={[
          { href: "/work", label: t("work") },
          { href: "/resume", label: t("resume") },
        ]}
      />
      <Contact locale={locale} site={site} page="engineering" />
    </main>
  );
}
