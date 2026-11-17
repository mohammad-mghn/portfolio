import { imgProps } from "@/lib/img";
import type { Metadata } from "next";
import Image from "next/image";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Contact } from "@/components/home/Contact";
import { Numbers } from "@/components/home/Numbers";
import { PageLinks } from "@/components/pages/PageLinks";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHead } from "@/components/ui/SectionHead";
import { routing } from "@/i18n/routing";
import { getAbout, getSiteSettings } from "@/lib/content";
import { formatIndex, formatMonth, localizeDigits } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const [t, about] = await Promise.all([getTranslations({ locale, namespace: "aboutPage" }), getAbout(locale)]);
  return pageMetadata(locale, "/about", t("title"), about.statement);
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const [site, about, t, ta, tn] = await Promise.all([
    getSiteSettings(locale),
    getAbout(locale),
    getTranslations({ locale, namespace: "aboutPage" }),
    getTranslations({ locale, namespace: "about" }),
    getTranslations({ locale, namespace: "nav" }),
  ]);
  const year = (yyyyMm: string) => localizeDigits(yyyyMm.slice(0, 4), locale);

  return (
    <main id="main" className="relative z-1">
      <PageHero eyebrow={t("eyebrow")} title={t("title")} statement={about.statement} meta={[site.headline, site.location]} />

      <section id="story" aria-label={t("story")} className="relative z-1 py-(--space-section)">
        <div className="grid-12 gap-y-12">
          {about.portrait ? (
            <figure className="col-span-2 md:col-span-4">
              <div className="relative aspect-[4/5] overflow-hidden bg-paper-2 md:sticky md:top-[calc(var(--header-h)+2rem)]">
                <Image
                  src={about.portrait.src}
                  {...imgProps(about.portrait)}
                  alt={about.portrait.alt}
                  fill
                  sizes="(max-width: 767px) 45vw, 30vw"
                  className="object-cover grayscale contrast-110"
                  priority
                />
              </div>
            </figure>
          ) : null}
          <div className="col-span-full flex max-w-[44rem] flex-col gap-8 md:col-span-7 md:col-start-6">
            <p className="text-label text-muted" data-reveal>
              {t("story")}
            </p>
            {about.bio.map((p, i) => (
              <p key={i} className={i === 0 ? "text-lead" : "text-lead text-ink-soft"} data-reveal>
                {p}
              </p>
            ))}
            {about.outside.length ? (
              <div data-reveal>
                <p className="text-label mb-3 text-muted">{ta("outside")}</p>
                <ul className="flex flex-col">
                  {about.outside.map((item) => (
                    <li key={item} className="flex gap-3 border-t border-hair py-3 last:border-b">
                      <span className="mt-2 size-1.5 shrink-0 rotate-45 bg-accent" aria-hidden />
                      <span className="text-ink-soft">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {about.closing ? (
              <p className="text-statement" data-reveal>
                {about.closing}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <Numbers locale={locale} numbers={about.numbers} index={1} />

      <section id="background" aria-labelledby="background-title" className="relative z-1 py-(--space-section)">
        <SectionHead index={formatIndex(2, locale)} eyebrow={t("backgroundEyebrow")} title={t("backgroundTitle")} titleId="background-title" />
        <div className="grid-12 mt-(--space-section-sm) gap-y-12">
          {about.education.length ? (
            <div className="col-span-full md:col-span-4" data-reveal>
              <h3 className="text-label border-b border-hair pb-3 text-muted">{t("education")}</h3>
              {about.education.map((e) => (
                <div key={e.school} className="pt-5">
                  <p className="text-lead font-semibold">{e.school}</p>
                  <p className="mt-1 text-ink-soft">{e.degree}</p>
                  <p className="text-label mt-2 text-muted">
                    {year(e.start)} – {year(e.end)}
                  </p>
                  {e.note ? <p className="mt-3 text-ink-soft">{e.note}</p> : null}
                </div>
              ))}
            </div>
          ) : null}
          {about.volunteering.length ? (
            <div className="col-span-full md:col-span-4" data-reveal>
              <h3 className="text-label border-b border-hair pb-3 text-muted">{t("volunteering")}</h3>
              {about.volunteering.map((v) => (
                <div key={v.role} className="pt-5">
                  <p className="text-lead font-semibold">{v.role}</p>
                  <p className="mt-1 text-ink-soft">{v.org}</p>
                  <p className="text-label mt-2 text-muted">{formatMonth(v.date, locale)}</p>
                  {v.summary ? <p className="mt-3 text-ink-soft">{v.summary}</p> : null}
                  {v.bullets.length ? (
                    <ul className="mt-3 flex flex-col gap-2">
                      {v.bullets.map((b) => (
                        <li key={b} className="flex gap-3 text-ink-soft">
                          <span className="mt-2.5 size-1.5 shrink-0 rotate-45 bg-accent" aria-hidden />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
          {about.languages.length ? (
            <div className="col-span-full md:col-span-4" data-reveal>
              <h3 className="text-label border-b border-hair pb-3 text-muted">{t("languages")}</h3>
              <dl>
                {about.languages.map((l) => (
                  <div key={l.name} className="border-b border-hair py-5">
                    <dt className="text-lead font-semibold">{l.name}</dt>
                    <dd className="mt-1 text-ink-soft">{l.level}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
        </div>

        {about.tools.length ? (
          <div className="grid-12 mt-(--space-section-sm) gap-y-4">
            <h3 className="text-label col-span-full border-b border-hair pb-3 text-muted" data-reveal>
              {t("tools")}
            </h3>
            <ul className="col-span-full flex flex-wrap gap-2" data-reveal>
              {about.tools.map((tool) => (
                <li key={tool} className="text-lead rounded-full border border-hair px-4 py-2">
                  {tool}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <PageLinks
        links={[
          { href: "/engineering", label: tn("engineering") },
          { href: "/founding", label: tn("founding") },
          { href: "/recommendations", label: tn("recommendations") },
        ]}
      />
      <Contact locale={locale} site={site} page="about" />
    </main>
  );
}
