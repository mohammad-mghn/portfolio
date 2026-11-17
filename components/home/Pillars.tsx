import { getTranslations } from "next-intl/server";
import { MoreLink } from "@/components/ui/MoreLink";
import { SectionHead } from "@/components/ui/SectionHead";
import type { Locale } from "@/i18n/routing";
import type { Pillar } from "@/lib/content";
import { formatIndex } from "@/lib/format";

/** Engineering → Founding → Product building, in that order, each with one line of proof and its own page. */
export async function Pillars({ locale, pillars, index }: { locale: Locale; pillars: Pillar[]; index: number }) {
  if (pillars.length === 0) return null;
  const t = await getTranslations({ locale, namespace: "pillars" });

  return (
    <section id="pillars" aria-labelledby="pillars-title" className="relative z-1 py-(--space-section)">
      <SectionHead index={formatIndex(index, locale)} eyebrow={t("eyebrow")} title={t("title")} titleId="pillars-title" />
      <div className="grid-12 mt-(--space-section-sm) gap-y-14">
        {pillars.map((p, i) => (
          <article key={p.key} className="rule col-span-full flex flex-col gap-5 pt-5 md:col-span-4" data-reveal>
            <p className="text-label flex justify-between text-muted">
              <span>({formatIndex(i + 1, locale)})</span>
              <span>{t(`kinds.${p.key}`)}</span>
            </p>
            <h3 className="text-big">{p.title}</h3>
            <p className="text-lead text-ink-soft">{p.proof}</p>
            <ul className="mt-2 flex flex-col">
              {p.points.map((point) => (
                <li key={point} className="text-label flex items-center gap-3 border-t border-hair py-3">
                  <span className="size-1.5 rotate-45 bg-accent" aria-hidden />
                  {point}
                </li>
              ))}
            </ul>
            <MoreLink href={p.href} label={t(`more.${p.key}`)} className="mt-auto self-start" />
          </article>
        ))}
      </div>
    </section>
  );
}
