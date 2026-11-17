import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import type { SiteSettings } from "@/lib/content";

export async function Hero({ locale, site }: { locale: Locale; site: SiteSettings }) {
  const t = await getTranslations({ locale, namespace: "hero" });
  const [first, ...rest] = site.name.split(" ");
  const last = rest.join(" ");

  return (
    <section id="top" className="relative z-1 flex min-h-svh flex-col justify-end pt-(--header-h) pb-6">
      <div className="grid-12 mb-[4vh] gap-y-3">
        <p className="intro-fade text-label col-span-full md:col-span-6" style={{ "--d": "0.5s" } as React.CSSProperties}>
          {site.tagline}
        </p>
        <p
          className="intro-fade text-label col-span-full md:col-span-4 md:col-start-9 md:text-end"
          style={{ "--d": "0.55s" } as React.CSSProperties}
        >
          {site.location}
        </p>
      </div>

      <h1 className="px-gutter" aria-label={site.name}>
        <span className="intro-line hero-name block" aria-hidden>
          <span className="intro-line-inner" style={{ "--d": "0.05s" } as React.CSSProperties}>
            {first}
          </span>
        </span>
        <span className="intro-line hero-name block text-end" aria-hidden>
          <span className="intro-line-inner" style={{ "--d": "0.16s" } as React.CSSProperties}>
            {last}
          </span>
        </span>
      </h1>

      <div className="grid-12 rule mt-[3vh] gap-y-8 pt-6">
        <div className="col-span-full flex flex-col gap-6 md:col-span-6">
          <p className="intro-settle text-big" style={{ "--d": "0.1s" } as React.CSSProperties}>
            {site.headline}
          </p>
          <ul className="intro-fade flex flex-wrap gap-2" style={{ "--d": "0.75s" } as React.CSSProperties}>
            {site.roles.map((r) => (
              <li key={`${r.title}-${r.org}`} className="text-label flex items-center gap-2 rounded-full border border-hair px-3 py-2">
                <span className="size-1.5 rotate-45 bg-accent" aria-hidden />
                {r.href ? (
                  <a href={r.href} target="_blank" rel="noreferrer" className="hover:text-accent">
                    {t("role", { title: r.title, org: r.org })}
                  </a>
                ) : (
                  t("role", { title: r.title, org: r.org })
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-full flex flex-col gap-6 md:col-span-5 md:col-start-8">
          <p className="intro-fade text-lead text-ink-soft" style={{ "--d": "0.8s" } as React.CSSProperties}>
            {site.positioning}
          </p>
          <div className="intro-fade flex flex-wrap items-center gap-3" style={{ "--d": "0.9s" } as React.CSSProperties}>
            <a
              href="#contact"
              className="text-label rounded-full bg-accent px-5 py-3.5 text-night transition-colors duration-500 ease-house hover:bg-ink hover:text-paper"
            >
              {t("talk")}
            </a>
            <a
              href="#work"
              className="text-label rounded-full border border-ink/25 px-5 py-3.5 transition-colors duration-500 ease-house hover:border-ink"
            >
              {t("work")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
