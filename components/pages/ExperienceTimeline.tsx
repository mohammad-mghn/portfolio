import { getTranslations } from "next-intl/server";
import { SectionHead } from "@/components/ui/SectionHead";
import type { Experience, Locale } from "@/lib/content";
import { formatIndex, formatMonth } from "@/lib/format";

type Group = { company: string; companyNote?: string; url?: string; type: Experience["type"]; roles: Experience[] };

/** Consecutive roles at the same company render under one company heading (Nobar, AMCSUI, Pishgaman Farda). */
function groupByCompany(list: Experience[]): Group[] {
  const out: Group[] = [];
  for (const e of list) {
    const last = out.at(-1);
    if (last && last.company === e.company) last.roles.push(e);
    else out.push({ company: e.company, companyNote: e.companyNote, url: e.url, type: e.type, roles: [e] });
  }
  return out;
}

/** Roles from 2025 on are the ones that matter now; earlier ones are set smaller. */
const isRecent = (e: Experience) => e.start >= "2025";

/** The full LinkedIn experience list, grouped by company, each role with a small spec block. */
export async function ExperienceTimeline({
  locale,
  experience,
  index,
}: {
  locale: Locale;
  experience: Experience[];
  index: number;
}) {
  if (experience.length === 0) return null;
  const [t, tb] = await Promise.all([
    getTranslations({ locale, namespace: "engineering" }),
    getTranslations({ locale, namespace: "building" }),
  ]);
  const month = (m?: string) => (m ? formatMonth(m, locale) : t("present"));

  return (
    <section id="experience" aria-labelledby="experience-title" className="relative z-1 py-(--space-section)">
      <SectionHead
        index={formatIndex(index, locale)}
        eyebrow={t("timelineEyebrow")}
        title={t("timelineTitle")}
        titleId="experience-title"
      />
      <ol className="mt-(--space-section-sm)">
        {groupByCompany(experience).map((g, gi) => {
          const recent = isRecent(g.roles[0]);
          const first = g.roles.at(-1)!.start;
          const last = g.roles.some((r) => !r.end) ? undefined : g.roles.map((r) => r.end!).sort().at(-1);
          return (
            <li key={`${g.company}-${gi}`} className="grid-12 gap-y-8 border-t border-hair py-12 last:border-b">
              <div className="col-span-full md:col-span-4">
                <div className="md:sticky md:top-[calc(var(--header-h)+2rem)]" data-reveal>
                  <p className="text-label flex flex-wrap gap-x-3 text-muted">
                    <span>{formatIndex(gi + 1, locale)}</span>
                    <span>{tb(`types.${g.type}`)}</span>
                    {recent ? null : <span>· {t("earlier")}</span>}
                  </p>
                  <h3 className={recent ? "text-big mt-4" : "text-statement mt-4"}>
                    {g.url ? (
                      <a href={g.url} target="_blank" rel="noreferrer" className="hover:text-accent">
                        {g.company}
                      </a>
                    ) : (
                      g.company
                    )}
                  </h3>
                  {g.companyNote ? <p className="mt-3 max-w-xs text-ink-soft">{g.companyNote}</p> : null}
                  <p className="text-label mt-4 text-muted">
                    {month(first)} – {month(last)}
                  </p>
                </div>
              </div>

              <ol className="col-span-full flex flex-col gap-16 md:col-span-8">
                {g.roles.map((e) => (
                  <li key={e.id} data-reveal>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                      <h4 className={recent ? "text-statement" : "text-lead font-semibold"}>{e.role}</h4>
                      <p className="text-label text-muted">
                        {month(e.start)} – {month(e.end)}
                        {e.workplace ? ` · ${e.workplace}` : ""}
                        {e.location ? ` · ${e.location}` : ""}
                      </p>
                    </div>
                    {e.summary ? <p className="text-lead mt-4 text-ink-soft">{e.summary}</p> : null}

                    <div className="mt-6">
                      <p className="text-label mb-2 text-muted">{t("spec")}</p>
                      <dl className="border-t border-hair text-[0.95rem]">
                        <SpecRow label={t("built")} value={e.spec.built} strong />
                        {e.spec.outcome ? <SpecRow label={t("outcome")} value={e.spec.outcome} /> : null}
                        {e.tech.length ? <SpecRow label={t("stack")} value={e.tech.join(" · ")} mono /> : null}
                      </dl>
                    </div>

                    {e.bullets.length ? (
                      <ul className="mt-6 flex flex-col gap-3">
                        {e.bullets.map((b) => (
                          <li key={b} className="flex gap-3 leading-relaxed text-ink-soft">
                            <span className="mt-2.5 size-1.5 shrink-0 rotate-45 bg-accent" aria-hidden />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ol>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function SpecRow({ label, value, strong, mono }: { label: string; value: string; strong?: boolean; mono?: boolean }) {
  return (
    <div className="grid grid-cols-[6.5rem_1fr] gap-4 border-b border-hair py-3">
      <dt className="text-label pt-0.5 text-muted">{label}</dt>
      <dd className={mono ? "text-label pt-0.5" : strong ? "font-medium" : "text-ink-soft"}>
        {value}
      </dd>
    </div>
  );
}
