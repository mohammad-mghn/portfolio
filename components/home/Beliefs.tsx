import { getTranslations } from "next-intl/server";
import { MoreLink } from "@/components/ui/MoreLink";
import { SectionHead } from "@/components/ui/SectionHead";
import type { Locale } from "@/i18n/routing";
import type { Belief, Quote } from "@/lib/content";
import { formatIndex } from "@/lib/format";
import { DarkSection } from "./DarkSection";

/** Mohammad's three rules (his own words) and the founder and engineering quotes he stands behind, each sourced. */
export async function Beliefs({
  locale,
  beliefs,
  quotes,
  index,
  kinds = ["founder", "engineering"],
  more = true,
  heading,
}: {
  locale: Locale;
  beliefs: Belief[];
  quotes: Quote[];
  index: number;
  /** Which quote groups to show; the Founding page shows founders only. */
  kinds?: Quote["kind"][];
  /** The "more" link points at /founding, so the Founding page turns it off. */
  more?: boolean;
  /** Override the section head, e.g. on /engineering where only quotes are shown. */
  heading?: { eyebrow: string; title: string };
}) {
  if (beliefs.length === 0 && quotes.length === 0) return null;
  const t = await getTranslations({ locale, namespace: "beliefs" });
  const groups = [
    { key: "founder" as const, label: t("founders"), items: quotes.filter((q) => q.kind === "founder") },
    { key: "engineering" as const, label: t("engineers"), items: quotes.filter((q) => q.kind === "engineering") },
  ].filter((g) => kinds.includes(g.key));

  return (
    <DarkSection id="beliefs" labelledBy="beliefs-title" className="py-(--space-section)">
      <SectionHead
        index={formatIndex(index, locale)}
        eyebrow={heading?.eyebrow ?? t("eyebrow")}
        title={heading?.title ?? t("title")}
        titleId="beliefs-title"
      />

      {beliefs.length ? (
        <ol className="mt-(--space-section-sm)">
        {beliefs.map((b, i) => (
          <li key={b.text} className="grid-12 gap-y-3 border-t border-[#2c2d29] py-8 last:border-b" data-reveal>
            <p className="text-label col-span-full opacity-60 md:col-span-3">
              {formatIndex(i + 1, locale)} — {t("mine")}
            </p>
            <p className="text-statement col-span-full md:col-span-9">{b.text}</p>
          </li>
        ))}
        </ol>
      ) : null}

      <div className="grid-12 mt-(--space-section-sm) gap-y-14">
        {groups.map((g) =>
          g.items.length ? (
            <section key={g.key} className={groups.length === 1 ? "col-span-full" : "col-span-full md:col-span-6"} aria-label={g.label}>
              <p className="text-label mb-6 opacity-60" data-reveal>
                {g.label}
              </p>
              <ul className={groups.length === 1 ? "grid gap-x-8 md:grid-cols-3" : "flex flex-col"}>
                {g.items.map((q) => (
                  <li key={q.text} className="border-t border-[#2c2d29] py-6" data-reveal>
                    <blockquote className="text-lead">
                      <span aria-hidden className="accent text-accent">“</span>
                      {q.text}
                      <span aria-hidden className="accent text-accent">”</span>
                    </blockquote>
                    <p className="text-label mt-3 opacity-60">
                      {q.author}
                      {q.source ? ` · ${q.source}` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null,
        )}
      </div>

      {more ? (
        <div className="grid-12 mt-12">
          <MoreLink href="/founding" label={t("more")} className="col-span-full justify-self-start md:col-start-4" />
        </div>
      ) : null}
    </DarkSection>
  );
}
