import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import type { Stat } from "@/lib/content";
import { formatIndex } from "@/lib/format";

/** Five real numbers from LinkedIn, big. No adjectives. */
export async function Numbers({ locale, numbers, index }: { locale: Locale; numbers: Stat[]; index?: number }) {
  if (numbers.length === 0) return null;
  const t = await getTranslations({ locale, namespace: "numbers" });

  return (
    <section
      id="numbers"
      aria-labelledby="numbers-title"
      className={index ? "relative z-1 py-(--space-section)" : "relative z-1 pb-(--space-section)"}
    >
      <div className="grid-12 gap-y-4">
        <p className="text-label col-span-full flex gap-3 pt-3" data-reveal>
          {index ? (
            <>
              <span>{formatIndex(index, locale)}</span>
              <span aria-hidden>—</span>
            </>
          ) : null}
          <span id="numbers-title">{t("eyebrow")}</span>
        </p>
      </div>
      <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 px-gutter md:grid-cols-5">
        {numbers.map((s) => (
          <div key={s.label} className="rule flex flex-col gap-3 pt-4" data-reveal>
            <dt className="text-label order-2 text-muted">{s.label}</dt>
            <dd className="text-big order-1 whitespace-nowrap">{s.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
