import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getProject, getProjectSlugs } from "@/lib/content";
import { ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Case study";

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  const locale = hasLocale(routing.locales, raw) ? raw : routing.defaultLocale;
  const [project, t] = await Promise.all([getProject(locale, slug), getTranslations({ locale, namespace: "case" })]);
  return ogImage({
    locale,
    eyebrow: `${t("caseStudy")} · ${project?.year ?? ""}`,
    title: project?.title ?? slug,
    footer: project?.sector ?? "",
    background: project?.color ?? "#151412",
    ink: "#f4f2ec",
  });
}
