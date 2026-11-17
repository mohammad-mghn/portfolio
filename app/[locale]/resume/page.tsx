import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Contact } from "@/components/home/Contact";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { formatMonth, localizeDigits } from "@/lib/format";
import { getResume } from "@/lib/resume";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/resume">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const [t, { site }] = await Promise.all([getTranslations({ locale, namespace: "resume" }), getResume(locale)]);
  return pageMetadata(locale, "/resume", t("title"), site.headline);
}

function Block({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="grid-12 gap-y-4 border-t border-hair py-10" aria-label={label}>
      <h2 className="text-label col-span-full text-accent-ink md:col-span-3" data-reveal>
        {label}
      </h2>
      <div className="col-span-full flex flex-col gap-8 md:col-span-9">{children}</div>
    </section>
  );
}

function Dots({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 flex flex-col gap-2">
      {items.map((b) => (
        <li key={b} className="flex gap-3 leading-relaxed text-ink-soft">
          <span className="mt-2.5 size-1.5 shrink-0 rotate-45 bg-accent" aria-hidden />
          <span>{b}</span>
        </li>
      ))}
    </ul>
  );
}

/** The web resume. Same data as /resume.pdf (see lib/resume.ts). */
export default async function ResumePage({ params }: PageProps<"/[locale]/resume">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const [{ site, about, experience, projects, links }, t] = await Promise.all([
    getResume(locale),
    getTranslations({ locale, namespace: "resume" }),
  ]);
  const month = (m?: string) => (m ? formatMonth(m, locale) : t("present"));
  const year = (m: string) => localizeDigits(m.slice(0, 4), locale);

  return (
    <main id="main" className="relative z-1">
      <section className="relative z-1 pt-(--space-page) pb-(--space-section)">
        <div className="grid-12 gap-y-8">
          <p className="intro-fade text-label col-span-full">[ {t("eyebrow")} ]</p>
          <h1 className="intro-settle text-huge col-span-full">{site.name}</h1>
          <p className="intro-settle text-statement col-span-full md:col-span-8" style={{ "--d": "0.08s" } as React.CSSProperties}>
            {site.headline}
          </p>
          <div
            className="intro-fade col-span-full flex flex-wrap items-center justify-between gap-6 border-t border-hair pt-5"
            style={{ "--d": "0.3s" } as React.CSSProperties}
          >
            <ul className="text-label flex flex-wrap gap-x-6 gap-y-2 text-muted">
              <li>
                <a href={`mailto:${site.email}`} className="hover:text-accent" dir="ltr">
                  {site.email}
                </a>
              </li>
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noreferrer" className="hover:text-accent">
                    {l.label} ↗
                  </a>
                </li>
              ))}
              <li>{site.location}</li>
            </ul>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="text-label inline-flex items-center gap-3 rounded-full bg-ink px-5 py-3.5 text-paper transition-colors duration-500 ease-house hover:bg-accent"
            >
              {t("pdf")} <span aria-hidden>↓</span>
            </a>
          </div>
        </div>
      </section>

      <div className="relative z-1 py-(--space-section)">
        <Block label={t("summary")}>
          <div className="flex max-w-[44rem] flex-col gap-4">
            <p className="text-lead">{site.positioning}</p>
            {about.bio[0] ? <p className="leading-relaxed text-ink-soft">{about.bio[0]}</p> : null}
          </div>
        </Block>

        <Block label={t("experience")}>
          {experience.map((e) => (
            <article key={e.id} data-reveal>
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className="text-lead font-semibold">
                  {e.role}, {e.company}
                </h3>
                <p className="text-label text-muted">
                  {month(e.start)} – {month(e.end)}
                  {e.workplace ? ` · ${e.workplace}` : ""}
                </p>
              </div>
              <Dots items={e.bullets} />
            </article>
          ))}
        </Block>

        <Block label={t("projects")}>
          {projects.map((p) => (
            <article key={p.slug} data-reveal>
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className="text-lead font-semibold">
                  <Link href={`/work/${p.slug}`} className="hover:text-accent">
                    {p.title}
                  </Link>
                </h3>
                <p className="text-label text-muted">
                  {p.kind} · {localizeDigits(p.year, locale)}
                </p>
              </div>
              <p className="mt-2 max-w-[44rem] leading-relaxed text-ink-soft">{p.summary}</p>
            </article>
          ))}
        </Block>

        <Block label={t("education")}>
          {about.education.map((e) => (
            <article key={e.school} data-reveal>
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className="text-lead font-semibold">{e.school}</h3>
                <p className="text-label text-muted">
                  {year(e.start)} – {year(e.end)}
                </p>
              </div>
              <p className="mt-1 text-ink-soft">{e.degree}</p>
              {e.note ? <p className="mt-1 text-ink-soft">{e.note}</p> : null}
            </article>
          ))}
        </Block>

        {about.volunteering.length ? (
          <Block label={t("volunteering")}>
            {about.volunteering.map((v) => (
              <article key={v.role} data-reveal>
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h3 className="text-lead font-semibold">
                    {v.role}, {v.org}
                  </h3>
                  <p className="text-label text-muted">{month(v.date)}</p>
                </div>
                <Dots items={v.bullets} />
              </article>
            ))}
          </Block>
        ) : null}

        <Block label={t("skills")}>
          <ul className="flex flex-wrap gap-2" data-reveal>
            {about.tools.map((tool) => (
              <li key={tool} className="rounded-full border border-hair px-3 py-1.5">
                {tool}
              </li>
            ))}
          </ul>
        </Block>

        <Block label={t("languages")}>
          <ul className="flex flex-wrap gap-x-10 gap-y-3" data-reveal>
            {about.languages.map((l) => (
              <li key={l.name}>
                <span className="font-semibold">{l.name}</span> <span className="text-ink-soft">· {l.level}</span>
              </li>
            ))}
          </ul>
        </Block>
      </div>
      <Contact locale={locale} site={site} page="resume" />
    </main>
  );
}
