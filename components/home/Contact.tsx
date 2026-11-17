import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { SiteSettings } from "@/lib/content";
import { formatIndex, localizeDigits } from "@/lib/format";
import { CopyEmail } from "./CopyEmail";
import { DarkSection } from "./DarkSection";

export async function Contact({
  locale,
  site,
  index,
  onContactPage = false,
}: {
  locale: Locale;
  site: SiteSettings;
  index?: number;
  /** On /contact itself the "contact page" link would point at the page you are on. */
  onContactPage?: boolean;
}) {
  const t = await getTranslations({ locale, namespace: "contact" });
  const year = localizeDigits(String(new Date().getFullYear()), locale);
  const linkedin = site.socials.find((s) => s.label === "LinkedIn");

  return (
    <DarkSection id="contact" labelledBy="contact-title" className="flex flex-col justify-between pt-(--space-section) pb-6">
      <div className="grid-12 gap-y-10">
        {index ? (
          <p className="text-label col-span-full flex gap-3 opacity-70" data-reveal>
            <span>{formatIndex(index, locale)}</span>
            <span aria-hidden>—</span>
            <span>{t("eyebrow")}</span>
          </p>
        ) : null}
        <h2 id="contact-title" className="text-mega col-span-full">
          <span className="block" data-split>
            {t("titleA")}
          </span>
          <span className="accent block text-accent" data-split>
            {t("titleB")}
          </span>
        </h2>
        <div className="col-span-full flex flex-col gap-6 md:col-span-5" data-reveal>
          <p className="text-lead opacity-80">{t("lead")}</p>
          {site.openTo.length ? (
            <div>
              <p className="text-label mb-3 opacity-60">{t("openTo")}</p>
              <ul className="flex flex-wrap gap-2">
                {site.openTo.map((x) => (
                  <li key={x} className="text-label rounded-full border border-[#2f302b] px-3 py-2">
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
        <div className="col-span-full flex flex-col items-start gap-4 md:col-span-6 md:col-start-7" data-reveal>
          <a href={`mailto:${site.email}`} className="text-statement [overflow-wrap:anywhere] hover:text-accent" dir="ltr">
            {site.email}
          </a>
          <div className="flex flex-wrap gap-3">
            <CopyEmail email={site.email} label={t("copy")} copiedLabel={t("copied")} />
            {linkedin ? (
              <a
                href={linkedin.href}
                target="_blank"
                rel="noreferrer"
                className="text-label rounded-full border border-current/30 px-4 py-2.5 transition-colors duration-500 ease-house hover:border-accent hover:text-accent"
              >
                LinkedIn ↗
              </a>
            ) : null}
            <Link
              href="/resume"
              className="text-label rounded-full border border-current/30 px-4 py-2.5 transition-colors duration-500 ease-house hover:border-accent hover:text-accent"
            >
              {t("resume")}
            </Link>
          </div>
        </div>
      </div>

      <div className="grid-12 mt-(--space-section-sm) gap-y-8">
        <div className="col-span-2 md:col-span-8" data-reveal>
          <p className="text-label mb-3 opacity-60">{t("elsewhere")}</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {site.socials.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noreferrer" className="text-label hover:text-accent">
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
        {onContactPage ? null : (
          <div className="col-span-2 flex md:col-span-4 md:justify-end" data-reveal>
            <Link href="/contact" className="text-label hover:text-accent">
              {t("contactPage")}{" "}
              <span aria-hidden className="inline-block rtl:-scale-x-100">
                →
              </span>
            </Link>
          </div>
        )}
      </div>

      <footer className="grid-12 mt-10 border-t border-[#2c2d29] pt-5">
        <p className="text-label col-span-2 opacity-60 md:col-span-4">
          © {year} {site.name}. {t("rights")}
        </p>
        <p className="text-label col-span-2 hidden opacity-60 md:col-span-4 md:block">{t("made")}</p>
        <a href="#top" className="text-label col-span-2 text-end hover:text-accent md:col-span-4">
          {t("backTop")} ↑
        </a>
      </footer>
    </DarkSection>
  );
}
