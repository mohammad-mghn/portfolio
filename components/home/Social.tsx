import { getTranslations } from "next-intl/server";
import { MoreLink } from "@/components/ui/MoreLink";
import { SectionHead } from "@/components/ui/SectionHead";
import type { Locale } from "@/i18n/routing";
import type { Social as SocialLink } from "@/lib/content";
import { formatIndex } from "@/lib/format";

type Labels = { persian: string; watch: string; follow: string };

/** Big cards for the channels Mohammad publishes on (YouTube, Instagram). Shared by the homepage and /content. */
export function ChannelCards({ channels, locale, labels }: { channels: SocialLink[]; locale: Locale; labels: Labels }) {
  if (channels.length === 0) return null;
  return (
    <div className="grid-12 gap-y-6">
      {channels.map((c, i) => (
        <a
          key={c.href}
          href={c.href}
          data-cursor="open"
          target="_blank"
          rel="noreferrer"
          className="group col-span-full flex min-h-[18rem] flex-col justify-between gap-10 rounded-sm border border-hair p-6 transition-colors duration-500 ease-house hover:border-ink hover:bg-ink hover:text-paper md:col-span-6"
          data-reveal
        >
          <p className="text-label flex justify-between opacity-70">
            <span>({formatIndex(i + 1, locale)})</span>
            <span>{labels.persian}</span>
          </p>
          <div>
            <p className="text-huge">{c.label}</p>
            {c.blurb ? <p className="text-lead mt-4 max-w-md opacity-80">{c.blurb}</p> : null}
          </div>
          <p className="text-label flex items-center justify-between">
            <span dir="ltr">{c.handle}</span>
            <span className="inline-flex items-center gap-2">
              {c.label === "YouTube" ? labels.watch : labels.follow}
              <span aria-hidden className="transition-transform duration-500 ease-house group-hover:translate-x-1 rtl:-scale-x-100">
                ↗
              </span>
            </span>
          </p>
        </a>
      ))}
    </div>
  );
}

/** Hairline grid of professional profiles (LinkedIn, GitHub, X, Telegram). */
export function ProfileList({ profiles, label }: { profiles: SocialLink[]; label: string }) {
  if (profiles.length === 0) return null;
  return (
    <div className="grid-12 gap-y-4">
      <p className="text-label col-span-full text-muted" data-reveal>
        {label}
      </p>
      <ul className="col-span-full grid grid-cols-2 border-t border-hair md:grid-cols-4">
        {profiles.map((p) => (
          <li key={p.href} className="border-b border-hair" data-reveal>
            <a
              href={p.href}
              data-cursor="open"
              target="_blank"
              rel="noreferrer"
              className="flex flex-col gap-1 py-5 pe-4 transition-colors duration-500 ease-house hover:text-accent"
            >
              <span className="text-lead">{p.label} ↗</span>
              {p.handle ? (
                <span className="text-label text-muted" dir="ltr">
                  {p.handle}
                </span>
              ) : null}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Homepage band: channel cards for the content Mohammad makes, then his professional profiles. */
export async function Social({ locale, socials, index }: { locale: Locale; socials: SocialLink[]; index: number }) {
  if (socials.length === 0) return null;
  const t = await getTranslations({ locale, namespace: "social" });
  const labels = { persian: t("persian"), watch: t("watch"), follow: t("follow") };

  return (
    <section id="social" aria-labelledby="social-title" className="relative z-1 py-(--space-section)">
      <SectionHead index={formatIndex(index, locale)} eyebrow={t("eyebrow")} title={t("title")} titleId="social-title" />
      <div className="mt-(--space-section-sm)">
        <ChannelCards channels={socials.filter((s) => s.group === "content")} locale={locale} labels={labels} />
      </div>
      <div className="mt-(--space-section-sm)">
        <ProfileList profiles={socials.filter((s) => s.group === "professional")} label={t("elsewhere")} />
      </div>
      <div className="grid-12 mt-10">
        <MoreLink href="/content" label={t("more")} className="col-span-full justify-self-start" />
      </div>
    </section>
  );
}
