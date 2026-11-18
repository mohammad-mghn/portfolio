import { getTranslations } from "next-intl/server";
import { SectionHead } from "@/components/ui/SectionHead";
import { WorkList } from "@/components/deferred";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { ProjectSummary } from "@/lib/content";
import { formatIndex, formatNumber, localizeDigits } from "@/lib/format";

export async function SelectedWork({ locale, projects, index }: { locale: Locale; projects: ProjectSummary[]; index: number }) {
  const t = await getTranslations({ locale, namespace: "work" });
  const featured = projects.filter((p) => p.featured);

  return (
    <section id="work" aria-labelledby="work-title" className="relative z-1 py-(--space-section)">
      <SectionHead index={formatIndex(index, locale)} eyebrow={t("eyebrow")} title={t("title")} titleId="work-title" />
      <div className="mt-(--space-section-sm)">
        <WorkList
          openLabel={t("open")}
          rows={featured.map((p, i) => ({ ...p, index: formatIndex(i + 1, locale), yearLabel: localizeDigits(p.year, locale) }))}
        />
      </div>
      <div className="grid-12 mt-10">
        <Link
          href="/work"
          data-cursor="go"
          className="text-label col-span-full flex items-center gap-3 justify-self-start rounded-full border border-ink/25 px-5 py-3.5 transition-colors duration-500 ease-house hover:border-ink md:col-start-6"
          data-reveal
        >
          {t("all")} ({formatNumber(projects.length, locale)})
          <span aria-hidden className="rtl:-scale-x-100">→</span>
        </Link>
      </div>
    </section>
  );
}
