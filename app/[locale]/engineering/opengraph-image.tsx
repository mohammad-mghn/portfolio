import { ogSize } from "@/lib/og";
import { localeParams, pageOgImage } from "@/lib/page-og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Engineering · Mohammad Mohagheghian";
export const generateStaticParams = localeParams;

export default function Image({ params }: { params: Promise<{ locale: string }> }) {
  return pageOgImage(params, "engineering");
}
