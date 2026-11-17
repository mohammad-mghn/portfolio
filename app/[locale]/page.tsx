import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ProgressRail } from "@/components/chrome/ProgressRail";
import { About } from "@/components/home/About";
import { Beliefs } from "@/components/home/Beliefs";
import { Contact } from "@/components/home/Contact";
import { Hero } from "@/components/home/Hero";
import { Numbers } from "@/components/home/Numbers";
import { Pillars } from "@/components/home/Pillars";
import { Recommendations } from "@/components/home/Recommendations";
import { SelectedWork } from "@/components/home/SelectedWork";
import { Social } from "@/components/home/Social";
import { JourneySection } from "@/components/journey/JourneySection";
import { routing } from "@/i18n/routing";
import { getAbout, getProjects, getRecommendations, getSiteSettings } from "@/lib/content";
import { formatIndex } from "@/lib/format";
import { homeSections } from "@/lib/sections";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const [site, about, projects, recommendations, t] = await Promise.all([
    getSiteSettings(locale),
    getAbout(locale),
    getProjects(locale),
    getRecommendations(locale),
    getTranslations({ locale, namespace: "nav" }),
  ]);

  const rail = homeSections.map((s, i) => ({ id: s.id, label: t(s.key), index: formatIndex(i, locale) }));

  return (
    <main id="main">
      <Hero locale={locale} site={site} />
      <Pillars locale={locale} pillars={about.pillars} index={1} />
      <Recommendations locale={locale} recommendations={recommendations} index={2} />
      <Numbers locale={locale} numbers={about.numbers} index={3} />
      <JourneySection locale={locale} index={4} />
      <SelectedWork locale={locale} projects={projects} index={5} />
      <Beliefs locale={locale} beliefs={about.beliefs} quotes={about.quotes} index={6} />
      <About locale={locale} about={about} index={7} />
      <Social locale={locale} socials={site.socials} index={8} />
      <Contact locale={locale} site={site} index={9} />
      <ProgressRail items={rail} />
    </main>
  );
}
