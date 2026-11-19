import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { SwarmBox } from "@/components/deferred";
import { About } from "@/components/home/About";
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
import { homeSectionIndex as n } from "@/lib/sections";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const [site, about, projects, recommendations, ts] = await Promise.all([
    getSiteSettings(locale),
    getAbout(locale),
    getProjects(locale),
    getRecommendations(locale),
    getTranslations({ locale, namespace: "swarm" }),
  ]);

  return (
    <main id="main">
      <Hero locale={locale} site={site} />
      {/* Order and numbers follow lib/sections.ts. */}
      <Pillars locale={locale} pillars={about.pillars} index={n("pillars")} />
      <About locale={locale} about={about} index={n("about")} />
      <Numbers locale={locale} numbers={about.numbers} />
      <Recommendations locale={locale} recommendations={recommendations} index={n("recommendations")} />
      <SelectedWork locale={locale} projects={projects} index={n("work")} />
      <JourneySection locale={locale} index={n("journey")} />
      <Social locale={locale} socials={site.socials} index={n("social")} />
      <Contact locale={locale} site={site} page="home" index={n("contact")} />
      <SwarmBox
        locale={locale}
        labels={{
          levels: ts.raw("levels"),
          again: ts.raw("again"),
          stop: ts("stop"),
          tour: ts("tour"),
          pause: ts("pause"),
          tourHint: ts("tourHint"),
          // Raw: the numbers are filled in on the client while the mode runs.
          counter: ts.raw("counter"),
          hint: ts("hint"),
        }}
      />
    </main>
  );
}
