import { getTranslations } from "next-intl/server";
import { MoreLink } from "@/components/ui/MoreLink";
import { dirFor, type Locale } from "@/i18n/routing";
import { getJourney } from "@/lib/content";
import { formatIndex, formatMonth, localizeDigits } from "@/lib/format";
import { Journey3D, type StopView } from "./Journey3D";

/**
 * The journey on the home page: work experience, oldest first. Jobs and ventures are the big
 * stops, the projects built there follow as small cards. All text is formatted here on the
 * server (dates, digits, labels); the client scene only lays cards out and moves the camera.
 */
export async function JourneySection({ locale, index }: { locale: Locale; index: number }) {
  const [stops, t, tb] = await Promise.all([
    getJourney(locale),
    getTranslations({ locale, namespace: "journey" }),
    getTranslations({ locale, namespace: "building" }),
  ]);
  if (stops.length === 0) return null;

  const month = (m?: string) => (m ? formatMonth(m, locale) : t("present"));
  const roleCount = stops.filter((s) => s.kind === "role").length;

  // Project cards carry the number and chapter line of the role before them.
  let roleNo = 0;
  let chapter = "";
  const views: StopView[] = [];
  for (const s of stops) {
    if (s.kind === "role") {
      roleNo += 1;
      const type = tb(`types.${s.employment}`);
      // "Freelance · Freelance" would say the same thing twice.
      chapter = s.title === type ? s.title : `${s.title} · ${type}`;
      views.push({
        kind: "role",
        id: s.id,
        weight: s.weight,
        number: formatIndex(roleNo, locale),
        chapter,
        year: localizeDigits(s.year, locale),
        title: s.title,
        type,
        roles: s.roles.map((r) => ({ title: r.title, period: `${month(r.start)} – ${month(r.end)}` })),
        highlights: s.highlights,
        media: s.media,
        link: s.link,
        cta: s.link.kind === "external" ? t("visit") : s.employment === "founder" ? t("viewStory") : t("viewRole"),
        sceneBreak: s.sceneBreak,
      });
      continue;
    }
    views.push({
      kind: "project",
      id: s.id,
      weight: "project",
      number: formatIndex(Math.max(roleNo, 1), locale),
      chapter,
      attach: s.attach.kind === "builtAt" ? t("builtAt", { company: s.attach.company }) : t(`attach.${s.attach.kind}`),
      items: s.items.map((i) => ({
        slug: i.slug,
        title: i.title,
        meta: `${i.kind} · ${localizeDigits(i.year, locale)}`,
        cover: i.cover,
        link: i.link,
        cta: i.link.kind === "external" ? t("visit") : t("viewProject"),
      })),
    });
  }

  return (
    <>
      <Journey3D
        stops={views}
        dir={dirFor(locale)}
        total={formatIndex(roleCount, locale)}
        labels={{
          eyebrow: `${formatIndex(index, locale)} — ${t("eyebrow")}`,
          title: t("title"),
          hint: t("hint"),
        }}
      />
      <div className="grid-12 relative z-1 py-(--space-section)">
        <MoreLink href="/engineering" label={t("more")} className="col-span-full justify-self-start" />
      </div>
    </>
  );
}
