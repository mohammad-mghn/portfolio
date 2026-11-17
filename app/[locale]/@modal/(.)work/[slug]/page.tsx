import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { CaseOverlay } from "@/components/work/CaseOverlay";
import { CaseStudy } from "@/components/work/CaseStudy";
import { routing } from "@/i18n/routing";
import { getProject, getProjects } from "@/lib/content";
import { projectNeighbours } from "@/lib/content/navigation";

/** Intercepted soft navigation to /work/[slug]: render the case study as an overlay over the current page. */
export default async function WorkOverlay({ params }: PageProps<"/[locale]/work/[slug]">) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const [project, projects, t] = await Promise.all([
    getProject(locale, slug),
    getProjects(locale),
    getTranslations({ locale, namespace: "case" }),
  ]);
  if (!project) notFound();
  const { position, next } = projectNeighbours(projects, slug);

  return (
    <CaseOverlay key={slug} closeLabel={t("close")} titleId="overlay-title">
      <CaseStudy
        locale={locale}
        project={project}
        next={next}
        position={position}
        total={projects.length}
        reveal={false}
        inOverlay
        titleId="overlay-title"
      />
    </CaseOverlay>
  );
}
