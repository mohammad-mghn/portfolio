import { imgProps } from "@/lib/img";
import clsx from "clsx";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import type { Project, ProjectSummary } from "@/lib/content";
import { formatIndex, localizeDigits } from "@/lib/format";
import { NextProject } from "./NextProject";
import { RichText } from "./RichText";

/**
 * Case study body shared by the full page and the overlay. `reveal` adds scroll-reveal hooks
 * (window-scrolled page only — the overlay scrolls its own container).
 */
export async function CaseStudy({
  locale,
  project,
  next,
  position,
  total,
  reveal,
  inOverlay,
  titleId,
}: {
  locale: Locale;
  project: Project;
  next: ProjectSummary | null;
  position: number;
  total: number;
  reveal: boolean;
  inOverlay: boolean;
  titleId: string;
}) {
  const t = await getTranslations({ locale, namespace: "case" });
  const r = reveal ? { "data-reveal": "" } : {};
  const sp = reveal ? { "data-split": "" } : {};

  // Co-founded products name the partner, job projects name the company, freelance work says so.
  const origin: [string, string] = project.partner
    ? [t("founding"), project.partner]
    : project.builtAt?.type === "employee"
      ? [t("builtAt"), project.builtAt.company]
      : [t("client"), project.client ?? (project.builtAt?.type === "freelance" ? t("freelance") : "—")];

  const meta: [string, string][] = [
    origin,
    [t("sector"), project.sector],
    [t("scope"), project.scope.join(", ")],
    [t("year"), localizeDigits(project.year, locale)],
    [t("role"), project.role],
    [t("location"), project.location ?? "—"],
  ];

  const chapters = [
    { key: "problem", label: t("problem"), value: project.problem },
    { key: "decision", label: t("decision"), value: project.decision },
    { key: "result", label: t("result"), value: project.result },
  ].filter((c) => c.value.length > 0);

  // Only a site that is still online is worth sending people to from the pictures.
  const live = project.status === "live" ? project.links.live : undefined;

  const links = [
    live && { href: live, label: t("visit") },
    project.links.repo && { href: project.links.repo, label: t("repo") },
    project.links.figma && { href: project.links.figma, label: t("figma") },
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <article className="relative" style={{ "--c": project.color } as React.CSSProperties}>
      <header className={clsx("grid-12 gap-y-8", inOverlay ? "pt-24" : "pt-(--space-page)")}>
        <p className="text-label col-span-full flex flex-wrap gap-3 text-muted" {...r}>
          <span>
            {formatIndex(position, locale)} / {formatIndex(total, locale)}
          </span>
          <span aria-hidden>—</span>
          <span>{t("caseStudy")}</span>
          <span aria-hidden>·</span>
          <span>{project.kind}</span>
        </p>
        <h1 id={titleId} className="text-mega col-span-full" {...sp}>
          {project.title}
        </h1>
        <p className="text-statement col-span-full md:col-span-8" {...r}>
          {project.summary}
        </p>
        <dl className="col-span-full grid grid-cols-2 gap-x-(--gutter) gap-y-6 border-t border-hair pt-6 md:grid-cols-6" {...r}>
          {meta.map(([k, v]) => (
            <div key={k}>
              <dt className="text-label text-muted">{k}</dt>
              <dd className="mt-1.5 leading-snug">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="col-span-full flex flex-wrap items-center justify-between gap-4" {...r}>
          <ul className="flex flex-wrap gap-1.5">
            {project.stack.map((s) => (
              <li key={s} className="text-label rounded-full border border-hair px-3 py-1.5">
                {s}
              </li>
            ))}
          </ul>
          <ul className="flex flex-wrap gap-3">
            {links.map((l, i) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className={clsx(
                    "inline-flex items-center rounded-full transition-colors duration-500 ease-house",
                    // The first link is the main action (the live site when there is one): clearly bigger.
                    i === 0
                      ? "gap-3 bg-ink px-8 py-4.5 font-mono text-[0.9rem] tracking-[0.08em] text-paper uppercase hover:bg-accent"
                      : "text-label gap-2 border border-ink/25 px-5 py-3.5 hover:border-ink",
                  )}
                >
                  {l.label} <span aria-hidden>↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </header>

      {project.cover ? (
        <figure className="mt-(--space-section-sm) px-gutter" {...r}>
          <Shot href={live} label={`${t("visit")}: ${project.title}`} hint={t("visit")} className="rounded-[3px] p-[clamp(12px,3vw,48px)]" style={{ background: project.color }}>
            <Image
              src={project.cover.src}
              {...imgProps(project.cover)}
              alt={project.cover.alt}
              width={project.cover.width}
              height={project.cover.height}
              sizes="(max-width: 767px) 100vw, 90vw"
              priority={!inOverlay}
              quality={90}
              className="w-full rounded-[2px] shadow-2xl"
            />
          </Shot>
        </figure>
      ) : null}

      <div className="mt-(--space-section-sm) flex flex-col gap-(--space-section-sm)">
        {chapters.map((c, i) => (
          <section key={c.key} className="grid-12 gap-y-5" aria-label={c.label}>
            <p className="text-label col-span-full flex gap-3 border-t border-hair pt-4 md:col-span-3" {...r}>
              <span>{formatIndex(i + 1, locale)}</span>
              <span>{c.label}</span>
            </p>
            <RichText
              value={c.value}
              className={clsx(
                "col-span-full flex flex-col gap-5 md:col-span-8 md:col-start-5 md:border-t md:border-hair md:pt-4",
                c.key === "decision" ? "text-lead [&>p]:border-s-2 [&>p]:border-(--c) [&>p]:ps-4" : "text-statement",
              )}
            />
          </section>
        ))}
      </div>

      {project.gallery.length ? (
        <section className="grid-12 mt-(--space-section-sm) gap-y-(--gutter)" aria-label={t("gallery")}>
          {project.gallery.map((g, i) => (
            <figure key={g.src} className={clsx("col-span-full", i % 3 === 0 ? "" : "md:col-span-6")} {...r}>
              <Shot href={live} label={`${t("visit")}: ${project.title}`} hint={t("visit")} className="rounded-[3px]">
                <Image
                  src={g.src}
                  {...imgProps(g)}
                  alt={g.alt}
                  width={g.width}
                  height={g.height}
                  sizes={i % 3 === 0 ? "100vw" : "(max-width: 767px) 100vw, 50vw"}
                  className="w-full rounded-[3px] border border-hair"
                />
              </Shot>
            </figure>
          ))}
        </section>
      ) : null}

      <div className="mt-(--space-band)">
        {next ? (
          <NextProject
            slug={next.slug}
            title={next.title}
            color={next.color}
            label={t("next")}
            index={`${formatIndex(position === total ? 1 : position + 1, locale)} / ${formatIndex(total, locale)}`}
            replace={inOverlay}
          />
        ) : null}
      </div>
    </article>
  );
}

/**
 * A project picture. When the project's site is online the whole picture is a link to it, with a
 * small "Visit site" chip on hover; otherwise it is just the frame.
 */
function Shot({
  href,
  label,
  hint,
  className,
  style,
  children,
}: {
  href?: string;
  label: string;
  hint: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  if (!href) {
    return (
      <div className={clsx("overflow-hidden", className)} style={style}>
        {children}
      </div>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className={clsx("group/shot relative block overflow-hidden", className)}
      style={style}
    >
      {children}
      <span
        aria-hidden
        className="text-label pointer-events-none absolute end-4 bottom-4 flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-paper opacity-0 transition-opacity duration-500 ease-house group-hover/shot:opacity-100 group-focus-visible/shot:opacity-100"
      >
        {hint} ↗
      </span>
    </a>
  );
}
