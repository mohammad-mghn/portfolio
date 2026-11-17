import { getTranslations } from "next-intl/server";
import { MoreLink } from "@/components/ui/MoreLink";
import { dirFor, type Locale } from "@/i18n/routing";
import { getMilestones } from "@/lib/content";
import { formatIndex } from "@/lib/format";
import { Journey3D } from "./Journey3D";

export async function JourneySection({ locale, index }: { locale: Locale; index: number }) {
  const [milestones, t] = await Promise.all([
    getMilestones(locale),
    getTranslations({ locale, namespace: "journey" }),
  ]);
  if (milestones.length === 0) return null;

  return (
    <>
      <Journey3D
        milestones={milestones}
        dir={dirFor(locale)}
        numbers={milestones.map((_, i) => formatIndex(i + 1, locale))}
        labels={{
          eyebrow: `${formatIndex(index, locale)} — ${t("eyebrow")}`,
          title: t("title"),
          hint: t("hint"),
          kinds: { roots: t("kinds.roots"), career: t("kinds.career"), venture: t("kinds.venture"), now: t("kinds.now") },
        }}
      />
      <div className="grid-12 relative z-1 py-10">
        <MoreLink href="/engineering" label={t("more")} className="col-span-full justify-self-start" />
      </div>
    </>
  );
}
