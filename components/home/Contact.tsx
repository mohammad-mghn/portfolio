import { DisplaceText } from "@/components/ui/DisplaceText";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getPageCopy, type PageKey, type SiteSettings } from "@/lib/content";
import { formatIndex, localizeDigits } from "@/lib/format";
import { CopyEmail } from "./CopyEmail";
import { DarkSection } from "@/components/deferred";

export async function Contact({
  locale,
  site,
  page,
  index,
}: {
  locale: Locale;
  site: SiteSettings;
  /** Which page this closes: each page has its own title and lead (see content/seed/pages.ts). */
  page: PageKey;
  index?: number;
}) {
  const [t, tn, copy] = await Promise.all([
    getTranslations({ locale, namespace: "contact" }),
    getTranslations({ locale, namespace: "nav" }),
    getPageCopy(locale, page),
  ]);
  // The same pages as the menu, small, for people who reach the end of a page.
  const pages = (["engineering", "founding", "work", "content", "about", "recommendations", "resume"] as const).map((key) => ({
    href: `/${key}`,
    label: tn(key),
  }));
  // On /contact itself the "contact page" link would point at the page you are on.
  const onContactPage = page === "contact";
  const year = localizeDigits(String(new Date().getFullYear()), locale);
  const linkedin = site.socials.find((s) => s.label === "LinkedIn");

  return (
    <DarkSection id="contact" labelledBy="contact-title" className="flex flex-col justify-between border-t border-[#2c2d29] pt-(--space-band) pb-6">
      <div className="grid-12 gap-y-10">
        {index ? (
          <p className="text-label col-span-full flex gap-3 opacity-70" data-reveal>
            <span>{formatIndex(index, locale)}</span>
            <span aria-hidden>—</span>
            <span>{t("eyebrow")}</span>
          </p>
        ) : null}
        <DisplaceText id="contact-title" className="text-mega col-span-full">
          <span className="block" data-split>
            {copy.contact.titleA}
          </span>
          <span className="accent block text-accent" data-split>
            {copy.contact.titleB}
          </span>
        </DisplaceText>
        <div className="col-span-full flex flex-col gap-6 md:col-span-5" data-reveal>
          <p className="text-lead opacity-80">{copy.contact.lead}</p>
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
            {site.bookingUrl ? (
              <a
                href={site.bookingUrl}
                target="_blank"
                rel="noreferrer"
                className="text-label rounded-full bg-accent px-4 py-2.5 text-night transition-colors duration-500 ease-house hover:bg-[#ece8df]"
              >
                {t("book")} ↗
              </a>
            ) : null}
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
        <div className="col-span-full md:col-span-5" data-reveal>
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
        <nav className="col-span-full md:col-span-5" aria-label={t("pages")} data-reveal>
          <p className="text-label mb-3 opacity-60">{t("pages")}</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {pages.map((p) => (
              <li key={p.href}>
                <Link href={p.href} className="text-label hover:text-accent">
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {onContactPage ? null : (
          <div className="col-span-full flex md:col-span-2 md:justify-end" data-reveal>
            <Link href="/contact" className="text-label hover:text-accent">
              {t("contactPage")}{" "}
              <span aria-hidden className="inline-block rtl:-scale-x-100">
                →
              </span>
            </Link>
          </div>
        )}
      </div>

      <footer className="grid-12 mt-10 border-t border-[#2c2d29] pt-5" data-swarm="frame">
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
