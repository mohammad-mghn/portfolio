import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // Docker builds set BUILD_STANDALONE=1 to get a self-contained server; Vercel builds stay as they are.
  output: process.env.BUILD_STANDALONE ? "standalone" : undefined,
  // Cache Components stays off for v1: content freshness comes from
  // next-sanity's <SanityLive/> plus an on-demand revalidation webhook.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
    qualities: [75, 90],
  },
  // Nobar and RCOINX are jobs, not projects: their old /work pages point at the role on /engineering.
  async redirects() {
    return ["nobar", "rcoinx"].flatMap((slug) => [
      { source: `/work/${slug}`, destination: `/engineering#${slug}`, permanent: true },
      { source: `/:locale(en|fa)/work/${slug}`, destination: `/:locale/engineering#${slug}`, permanent: true },
    ]);
  },
  experimental: {
    // Two root layouts (app/[locale] and app/studio) → one global 404.
    globalNotFound: true,
  },
  turbopack: {
    rules: {
      // Tailwind only for our global stylesheets; CSS Modules keep native scoping.
      "*.css": {
        condition: { all: [{ not: "foreign" }, { not: { path: "*.module.css" } }] },
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default withNextIntl(nextConfig);
