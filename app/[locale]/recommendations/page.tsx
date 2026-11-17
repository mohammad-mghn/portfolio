import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Contact } from "@/components/home/Contact";
import { PageHero } from "@/components/ui/PageHero";
import { routing } from "@/i18n/routing";
import { getRecommendations, getSiteSettings } from "@/lib/content";
import { formatIndex } from "@/lib/format";
import { alternatesFor } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[locale]/recommendations">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "recommendationsPage" });
  return { title: t("title"), description: t("statement"), alternates: alternatesFor(locale, "/recommendations") };
}

/** All five LinkedIn recommendations, verbatim and in English on both locales, with who wrote them first. */
export default async function RecommendationsPage({ params }: PageProps<"/[locale]/recommendations">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const [site, recommendations, t, tr] = await Promise.all([
    getSiteSettings(locale),
    getRecommendations(locale),
    getTranslations({ locale, namespace: "recommendationsPage" }),
    getTranslations({ locale, namespace: "recommendations" }),
  ]);
  const meta = [t("metaCount", { count: recommendations.length }), t("metaSource"), t("metaUnedited")];

  return (
    <main id="main" className="relative z-1">
      <PageHero eyebrow={t("eyebrow")} title={t("title")} statement={t("statement")} meta={meta}>
        {locale === "en" ? null : (
          <p className="text-label col-span-full text-muted" data-reveal>
            {tr("original")}
          </p>
        )}
      </PageHero>

      <section aria-label={t("title")} className="relative z-1 pb-(--space-section)">
        <ol>
          {recommendations.map((r, i) => (
            <li key={r.id} id={r.id} className="grid-12 gap-y-8 border-t border-hair py-14 last:border-b">
              <div className="col-span-full md:col-span-4" data-reveal>
                <div className="md:sticky md:top-[calc(var(--header-h)+2rem)]">
                  <p className="text-label text-muted">({formatIndex(i + 1, locale)})</p>
                  <p className="text-statement mt-4 rtl:text-right" lang="en" dir="ltr">
                    {r.name}
                  </p>
                  <p className="mt-3 max-w-xs leading-snug text-ink-soft rtl:text-right" lang="en" dir="ltr">
                    {r.headline}
                  </p>
                  <p className="text-label mt-5 text-muted">
                    {r.relationship} · {r.date}
                  </p>
                  {r.href ? (
                    <a
                      href={r.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-label mt-5 inline-flex items-center gap-2 hover:text-accent"
                    >
                      {t("read")} ↗
                    </a>
                  ) : null}
                </div>
              </div>
              <div className="col-span-full md:col-span-8" lang="en" dir="ltr">
                <blockquote className="text-statement" data-reveal>
                  <span aria-hidden className="accent text-accent">“</span>
                  {r.highlight}
                  <span aria-hidden className="accent text-accent">”</span>
                </blockquote>
                <div className="mt-10 flex max-w-[44rem] flex-col gap-5">
                  {r.paragraphs.map((p, j) => (
                    <p key={j} className="leading-relaxed text-ink-soft" data-reveal>
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <Contact locale={locale} site={site} />
    </main>
  );
}
