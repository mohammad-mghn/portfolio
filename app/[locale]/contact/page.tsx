import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Contact } from "@/components/home/Contact";
import { PageHero } from "@/components/ui/PageHero";
import { routing } from "@/i18n/routing";
import { getSiteSettings } from "@/lib/content";
import { formatIndex } from "@/lib/format";
import { alternatesFor } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "contactPage" });
  return { title: t("title"), description: t("statement"), alternates: alternatesFor(locale, "/contact") };
}

const paths = ["engineering", "partnership", "client"] as const;

/** Three ways to work together, each opening an email with the right subject, then the shared contact band. */
export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const [site, t] = await Promise.all([getSiteSettings(locale), getTranslations({ locale, namespace: "contactPage" })]);

  return (
    <main id="main" className="relative z-1">
      <PageHero eyebrow={t("eyebrow")} title={t("title")} statement={t("statement")} meta={[site.email, site.location]} />

      <section aria-label={t("pathsEyebrow")} className="relative z-1 py-(--space-section)">
        <div className="grid-12 gap-y-6">
          <p className="text-label col-span-full text-muted" data-reveal>
            {t("pathsEyebrow")}
          </p>
          {paths.map((key, i) => (
            <a
              key={key}
              href={`mailto:${site.email}?subject=${encodeURIComponent(t(`paths.${key}.subject`))}`}
              className="group col-span-full flex min-h-[20rem] flex-col justify-between gap-10 rounded-sm border border-hair p-6 transition-colors duration-500 ease-house hover:border-ink hover:bg-ink hover:text-paper md:col-span-4"
              data-reveal
            >
              <p className="text-label opacity-70">({formatIndex(i + 1, locale)})</p>
              <div>
                <h2 className="text-statement">{t(`paths.${key}.title`)}</h2>
                <p className="mt-4 leading-relaxed opacity-80">{t(`paths.${key}.body`)}</p>
              </div>
              <p className="text-label inline-flex items-center gap-2">
                {t(`paths.${key}.cta`)}
                <span aria-hidden className="transition-transform duration-500 ease-house group-hover:translate-x-1 rtl:-scale-x-100">
                  →
                </span>
              </p>
            </a>
          ))}
        </div>
      </section>
      <Contact locale={locale} site={site} onContactPage />
    </main>
  );
}
