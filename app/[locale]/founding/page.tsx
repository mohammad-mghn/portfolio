import { imgProps } from "@/lib/img";
import type { Metadata } from "next";
import Image from "next/image";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Beliefs } from "@/components/home/Beliefs";
import { Contact } from "@/components/home/Contact";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHead } from "@/components/ui/SectionHead";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getAbout, getPageCopy, getProjectSlugs, getSiteSettings, getVentures } from "@/lib/content";
import { formatIndex, formatMonth } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/founding">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const [t, copy] = await Promise.all([
    getTranslations({ locale, namespace: "founding" }),
    getPageCopy(locale, "founding"),
  ]);
  return pageMetadata(locale, "/founding", t("title"), copy.statement);
}

const pill =
  "text-label inline-flex items-center gap-2 rounded-full border border-current/25 px-4 py-2.5 transition-colors duration-500 ease-house hover:border-accent hover:text-accent";

export default async function FoundingPage({ params }: PageProps<"/[locale]/founding">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const copy = await getPageCopy(locale, "founding");

  const [site, about, ventures, slugs, t] = await Promise.all([
    getSiteSettings(locale),
    getAbout(locale),
    getVentures(locale),
    getProjectSlugs(),
    getTranslations({ locale, namespace: "founding" }),
  ]);
  const meta = ventures.flatMap((v) => [`${v.name} · ${t("since")} ${formatMonth(v.since, locale)}`, v.traction]);

  return (
    <main id="main" className="relative z-1">
      <PageHero eyebrow={t("eyebrow")} title={t("title")} statement={copy.statement} meta={meta} />

      <section id="companies" aria-labelledby="companies-title" className="relative z-1 py-(--space-section)">
        <SectionHead index={formatIndex(1, locale)} eyebrow={t("companiesEyebrow")} title={t("companiesTitle")} titleId="companies-title" />
        <div className="mt-(--space-section-sm) flex flex-col gap-(--space-section)">
          {ventures.map((v, i) => (
            <article key={v.slug} className="grid-12 gap-y-10" aria-labelledby={`venture-${v.slug}`}>
              <div className="col-span-full md:col-span-5" data-reveal>
                <p className="text-label text-muted">({formatIndex(i + 1, locale)})</p>
                <h3 id={`venture-${v.slug}`} className="text-huge mt-3">
                  {v.name}
                </h3>
                <p className="text-lead mt-6 max-w-md">{v.summary}</p>
              </div>
              <div className="col-span-full md:col-span-6 md:col-start-7" data-reveal>
                <dl className="grid grid-cols-2 border-t border-hair">
                  {[
                    [t("role"), v.role],
                    [t("since"), formatMonth(v.since, locale)],
                    [t("partner"), v.partner],
                    [t("traction"), v.traction],
                  ].map(([k, val]) => (
                    <div key={k} className="border-b border-hair py-4 pe-4">
                      <dt className="text-label text-muted">{k}</dt>
                      <dd className="mt-1.5">{val}</dd>
                    </div>
                  ))}
                </dl>
                {v.facts.length ? (
                  <ul className="mt-8 flex flex-col gap-3">
                    {v.facts.map((f) => (
                      <li key={f} className="flex gap-3 leading-relaxed text-ink-soft">
                        <span className="mt-2.5 size-1.5 shrink-0 rotate-45 bg-accent" aria-hidden />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <div className="mt-8 flex flex-wrap gap-3">
                  {v.links.map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className={pill}>
                      {t("visit")} <span dir="ltr">{l.label}</span> ↗
                    </a>
                  ))}
                  {slugs.includes(v.slug) ? (
                    <Link href={`/work/${v.slug}`} className={pill}>
                      {t("caseStudy")} <span aria-hidden className="rtl:-scale-x-100">→</span>
                    </Link>
                  ) : null}
                </div>
              </div>
              {v.cover ? (
                <figure className="col-span-full mt-4 overflow-hidden rounded-sm border border-hair bg-paper-2" data-reveal>
                  <Image
                    src={v.cover.src}
                    {...imgProps(v.cover)}
                    alt={v.cover.alt}
                    width={v.cover.width}
                    height={v.cover.height}
                    sizes="(max-width: 767px) 100vw, 92vw"
                    className="h-auto w-full"
                  />
                </figure>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section id="story" aria-labelledby="story-title" className="relative z-1 py-(--space-section)">
        <SectionHead index={formatIndex(2, locale)} eyebrow={t("storyEyebrow")} title={t("storyTitle")} titleId="story-title" />
        <div className="mt-(--space-section-sm)">
          {ventures.map((v) =>
            v.note.length ? (
              <article key={v.slug} className="grid-12 gap-y-6 border-t border-hair py-12 last:border-b" aria-label={v.name}>
                <div className="col-span-full md:col-span-3" data-reveal>
                  <p className="text-statement">{v.name}</p>
                  <p className="text-label mt-3 text-muted">
                    {t("since")} {formatMonth(v.since, locale)}
                  </p>
                </div>
                <div className="col-span-full flex max-w-[42rem] flex-col gap-6 md:col-span-7 md:col-start-5">
                  {v.note.map((p, j) => (
                    <p key={j} className={j === 0 ? "text-lead" : "text-lead text-ink-soft"} data-reveal>
                      {p}
                    </p>
                  ))}
                </div>
              </article>
            ) : null,
          )}
        </div>
      </section>

      <Beliefs locale={locale} beliefs={about.beliefs} quotes={about.quotes} kinds={["founder"]} more={false} index={3} />
      <Contact locale={locale} site={site} page="founding" />
    </main>
  );
}
