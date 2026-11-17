import { getTranslations } from "next-intl/server";
import { MoreLink } from "@/components/ui/MoreLink";
import { SectionHead } from "@/components/ui/SectionHead";
import type { Locale } from "@/i18n/routing";
import type { Recommendation } from "@/lib/content";
import { formatIndex } from "@/lib/format";
import { RecommendationCarousel } from "@/components/deferred";
// Same reason as the journey: the row's code is deferred, its styles are not.
import "./Recommendations.module.css";

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

  // The client component renders the section itself: on desktop it pins and scrolls sideways.
  return (
    <RecommendationCarousel
      items={recommendations}
      indexes={recommendations.map((_, i) => formatIndex(i + 1, locale))}
      labels={{
        region: t("region"),
        prev: t("prev"),
        next: t("next"),
        of: t("of"),
        readFull: t("readFull"),
        oldSite: t("oldSite"),
        original: locale === "en" ? undefined : t("original"),
      }}
      header={
        <SectionHead
          index={formatIndex(index, locale)}
          eyebrow={t("eyebrow")}
          title={t("title")}
          titleId="recommendations-title"
        />
      }
      footer={
        <div className="grid-12">
          <MoreLink href="/recommendations" label={t("all")} className="col-span-full justify-self-start" />
        </div>
      }
    />
  );
}
