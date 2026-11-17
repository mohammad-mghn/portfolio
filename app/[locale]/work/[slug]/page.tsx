import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Contact } from "@/components/home/Contact";
import { CaseStudy } from "@/components/work/CaseStudy";
import { routing } from "@/i18n/routing";
import { getProject, getProjects, getProjectSlugs, getSiteSettings } from "@/lib/content";
import { projectNeighbours } from "@/lib/content/navigation";
import { alternatesFor } from "@/lib/site";

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/work/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const project = await getProject(locale, slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: alternatesFor(locale, `/work/${slug}`),
    openGraph: { type: "article", title: project.title, description: project.summary },
  };
}

export default async function WorkPage({ params }: PageProps<"/[locale]/work/[slug]">) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const [project, projects, site] = await Promise.all([getProject(locale, slug), getProjects(locale), getSiteSettings(locale)]);
  if (!project) notFound();
  const { position, next } = projectNeighbours(projects, slug);

  return (
    <main id="main" className="relative z-1">
      <CaseStudy
        locale={locale}
        project={project}
        next={next}
        position={position}
        total={projects.length}
        reveal
        inOverlay={false}
        titleId="case-title"
      />
      <Contact locale={locale} site={site} page="work" />
    </main>
  );
}
