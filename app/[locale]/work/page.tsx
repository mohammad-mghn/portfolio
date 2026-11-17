import { imgProps } from "@/lib/img";
import type { Metadata } from "next";
import Image from "next/image";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Contact } from "@/components/home/Contact";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getProjects, getSiteSettings } from "@/lib/content";
import type { ProjectGroup, ProjectSummary } from "@/lib/content";
import { formatIndex, localizeDigits } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/work">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "archive" });
  return pageMetadata(locale, "/work", t("title"));
}

const statusTone: Record<string, string> = {
  live: "bg-[#0ba954]",
  nda: "bg-accent",
  offline: "bg-muted",
  archived: "bg-hair",
};

/** Co-founded products first, then client projects, then open source and personal work. */
const groupOrder: ProjectGroup[] = ["cofounded", "client", "personal"];

export default async function WorkIndex({ params }: PageProps<"/[locale]/work">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const [projects, site, t] = await Promise.all([
    getProjects(locale),
    getSiteSettings(locale),
    getTranslations({ locale, namespace: "archive" }),
  ]);
  const years = projects.map((p) => Number(p.year)).filter(Boolean);
  const span = `${localizeDigits(String(Math.min(...years)), locale)} — ${localizeDigits(String(Math.max(...years)), locale)}`;
  const groups = groupOrder
    .map((key) => ({ key, items: projects.filter((p) => p.group === key) }))
    .filter((g) => g.items.length > 0);

  /** Where a project came from: the partner for co-founded products, the job or "Freelance" for client work. */
  const origin = (p: ProjectSummary) =>
    p.partner ??
    (p.builtAt ? (p.builtAt.type === "freelance" ? t("freelance") : t("builtAt", { company: p.builtAt.company })) : null);

  const status = (p: ProjectSummary) => (
    <span className="text-label inline-flex items-center gap-2">
      <span className={`size-1.5 rounded-full ${statusTone[p.status]}`} aria-hidden />
      {t(`statuses.${p.status}`)}
    </span>
  );

  return (
    <main id="main" className="relative z-1">
      <section className="pt-(--space-page) pb-(--space-section)">
        <div className="grid-12 gap-y-6">
          <p className="intro-fade text-label col-span-full flex gap-3">
            <span>[ {t("eyebrow")} ]</span>
          </p>
          <h1 className="intro-settle text-mega col-span-full">{t("title")}</h1>
          <p className="intro-fade text-label col-span-full text-muted" style={{ "--d": "0.3s" } as React.CSSProperties}>
            {t("index")}: {formatIndex(projects.length, locale).padStart(3, locale === "fa" ? "۰" : "0")} {"//"} {t("timeline")}: {span}{" "}
            {"//"} {t("status")}: {t("logged")}
          </p>
        </div>
      </section>

      {groups.map((g, gi) => {
        const rows = g.items.filter((p) => p.caseStudy);
        const cards = g.items.filter((p) => !p.caseStudy);
        return (
          <section key={g.key} id={g.key} aria-labelledby={`group-${g.key}`} className="relative z-1 py-(--space-section)">
            <div className="grid-12 gap-y-3 border-t border-ink pt-5">
              <p className="text-label col-span-full flex gap-3 md:col-span-3" data-reveal>
                <span>{formatIndex(gi + 1, locale)}</span>
                <span aria-hidden>—</span>
                <span>{t("count", { count: g.items.length })}</span>
              </p>
              <div className="col-span-full md:col-span-9">
                <h2 id={`group-${g.key}`} className="text-big" data-split>
                  {t(`groups.${g.key}`)}
                </h2>
                <p className="text-lead mt-3 text-ink-soft" data-reveal>
                  {t(`groupNotes.${g.key}`)}
                </p>
              </div>
            </div>

            {rows.length ? (
              <div className="mt-10">
                <div aria-hidden className="grid-12 text-label border-b border-hair pb-3 text-muted">
                  <span className="col-span-1">{t("year")}</span>
                  <span className="col-span-3 md:col-span-6">{t("name")}</span>
                  <span className="hidden md:col-span-3 md:block">{t("type")}</span>
                  <span className="hidden md:col-span-2 md:block">{t("status")}</span>
                </div>
                {rows.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/work/${p.slug}`}
                    scroll={false}
                    className="work-row grid-12 relative items-baseline border-b border-hair py-5"
                    style={{ "--c": p.color } as React.CSSProperties}
                    data-reveal
                  >
                    <span className="text-label relative col-span-1">
                      {localizeDigits(p.year, locale)}
                    </span>
                    <span className="relative col-span-3 md:col-span-6">
                      <span className="block text-2xl font-semibold tracking-tight">{p.title}</span>
                      {origin(p) ? <span className="text-label mt-1.5 block text-muted">{origin(p)}</span> : null}
                      <span className="mt-1 block max-w-xl text-ink-soft md:hidden">{p.kind}</span>
                    </span>
                    <span className="relative hidden text-ink-soft md:col-span-3 md:block">
                      {p.kind}
                    </span>
                    <span className="relative hidden md:col-span-2 md:flex">
                      {status(p)}
                    </span>
                  </Link>
                ))}
              </div>
            ) : null}

            {cards.length ? (
              <ul className="grid-12 mt-10 gap-y-6">
                {cards.map((p) => (
                  <li key={p.slug} className="col-span-full sm:col-span-2 md:col-span-4" data-reveal>
                    <Link
                      href={`/work/${p.slug}`}
                      scroll={false}
                      className="group flex h-full flex-col gap-5 rounded-sm border border-hair p-5 transition-colors duration-500 ease-house hover:border-ink"
                    >
                      {p.cover ? (
                        <div className="relative aspect-[16/10] overflow-hidden bg-paper-2">
                          <Image
                            src={p.cover.src}
                            {...imgProps(p.cover)}
                            alt={p.cover.alt}
                            fill
                            sizes="(max-width: 767px) 100vw, 30vw"
                            className="object-cover transition-transform duration-700 ease-house group-hover:scale-[1.03]"
                          />
                        </div>
                      ) : null}
                      <p className="text-label flex justify-between text-muted">
                        <span>
                          {p.kind} · {localizeDigits(p.year, locale)}
                        </span>
                        <span>{t("short")}</span>
                      </p>
                      <div className="flex-1">
                        <h3 className="text-statement">{p.title}</h3>
                        {origin(p) ? <p className="text-label mt-2 text-muted">{origin(p)}</p> : null}
                        <p className="mt-3 leading-relaxed text-ink-soft">{p.summary}</p>
                      </div>
                      {status(p)}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        );
      })}
      <Contact locale={locale} site={site} page="work" />
    </main>
  );
}
