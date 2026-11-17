import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/content";

/** Web app manifest: name, colours and icons for "Add to home screen" and browser UI. */
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const site = await getSiteSettings("en");
  return {
    name: site.name,
    short_name: site.shortName,
    description: site.seoDescription,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#edeae3",
    theme_color: "#edeae3",
    lang: "en",
    dir: "ltr",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
