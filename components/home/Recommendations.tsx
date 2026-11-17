import { getTranslations } from "next-intl/server";
import { MoreLink } from "@/components/ui/MoreLink";
import { SectionHead } from "@/components/ui/SectionHead";
import type { Locale } from "@/i18n/routing";
import type { Recommendation } from "@/lib/content";
import { formatIndex } from "@/lib/format";
import { RecommendationCarousel } from "./RecommendationCarousel";

export async function Recommendations({
  locale,
  recommendations,
  index,
}: {
  locale: Locale;
  recommendations: Recommendation[];
  index: number;
}) {
  if (recommendations.length === 0) return null;
  const t = await getTranslations({ locale, namespace: "recommendations" });

  return (
    <section id="recommendations" aria-labelledby="recommendations-title" className="relative z-1 py-(--space-section)">
      <SectionHead
        index={formatIndex(index, locale)}
        eyebrow={t("eyebrow")}
        title={t("title")}
        titleId="recommendations-title"
      />
      <RecommendationCarousel
        items={recommendations}
        indexes={recommendations.map((_, i) => formatIndex(i + 1, locale))}
        labels={{
          prev: t("prev"),
          next: t("next"),
          of: t("of"),
          onLinkedIn: t("onLinkedIn"),
          original: locale === "en" ? undefined : t("original"),
        }}
      />
      <div className="grid-12 mt-10">
        <MoreLink href="/recommendations" label={t("all")} className="col-span-full justify-self-start md:col-start-4" />
      </div>
    </section>
  );
}
