import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getProjectSlugs } from "@/lib/content";
import { localePath, siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getProjectSlugs();
  const pages = ["/engineering", "/founding", "/work", "/content", "/about", "/recommendations", "/contact", "/resume"];
  const paths = ["/", ...pages, ...slugs.map((s) => `/work/${s}`)];
  const now = new Date();

  return paths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${siteUrl}${localePath(locale, path)}`,
      lastModified: now,
      changeFrequency: path === "/" ? ("monthly" as const) : ("yearly" as const),
      priority: path === "/" ? 1 : pages.includes(path) ? 0.8 : 0.6,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l === "fa" ? "fa-IR" : "en", `${siteUrl}${localePath(l, path)}`]),
        ),
      },
    })),
  );
}
