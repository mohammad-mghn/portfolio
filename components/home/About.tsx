import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { MoreLink } from "@/components/ui/MoreLink";
import { SectionHead } from "@/components/ui/SectionHead";
import type { Locale } from "@/i18n/routing";
import type { About as AboutData } from "@/lib/content";
import { formatIndex } from "@/lib/format";

/** Portrait + the short LinkedIn About. The full story lives on /about. */
export async function About({ locale, about, index }: { locale: Locale; about: AboutData; index: number }) {
  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <section id="about" aria-labelledby="about-title" className="relative z-1 py-(--space-section)">
      <SectionHead index={formatIndex(index, locale)} eyebrow={t("eyebrow")} title={t("title")} titleId="about-title" />

      <div className="grid-12 mt-(--space-section-sm) gap-y-12">
        {about.portrait ? (
          <figure className="col-span-2 md:col-span-3" data-reveal>
            <div className="relative aspect-[4/5] overflow-hidden bg-paper-2">
              <Image
                src={about.portrait.src}
                alt={about.portrait.alt}
                fill
                sizes="(max-width: 767px) 45vw, 22vw"
                className="object-cover grayscale contrast-110"
              />
            </div>
          </figure>
        ) : null}

        <div className="col-span-full md:col-span-8 md:col-start-5">
          <p className="text-statement" data-split>
            {about.statement}
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {about.bio.map((p, i) => (
              <p key={i} className="leading-relaxed text-ink-soft" data-reveal>
                {p}
              </p>
            ))}
          </div>
          {about.outside.length ? (
            <div className="mt-12" data-reveal>
              <p className="text-label mb-3 text-muted">{t("outside")}</p>
              <ul className="flex flex-col">
                {about.outside.map((item) => (
                  <li key={item} className="flex gap-3 border-t border-hair py-3 last:border-b">
                    <span className="mt-2 size-1.5 shrink-0 rotate-45 bg-accent" aria-hidden />
                    <span className="text-ink-soft">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <MoreLink href="/about" label={t("more")} className="mt-10" />
        </div>
      </div>

      {about.tools.length ? (
        <div className="grid-12 mt-(--space-section-sm)">
          <div className="marquee-host rule col-span-full flex flex-col gap-6 overflow-hidden pt-4" data-reveal>
            <p className="text-label flex justify-between text-muted">
              <span>{t("tools")}</span>
              <span className="hidden md:inline">{t("toolsHint")}</span>
            </p>
            <div className="overflow-hidden" dir="ltr">
              <ul className="marquee gap-3">
                {[...about.tools, ...about.tools].map((tool, i) => (
                  <li
                    key={`${tool}-${i}`}
                    aria-hidden={i >= about.tools.length}
                    className="text-lead whitespace-nowrap rounded-full border border-hair px-4 py-2"
                  >
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
