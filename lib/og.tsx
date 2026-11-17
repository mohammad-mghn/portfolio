import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { Locale } from "@/i18n/routing";

export const ogSize = { width: 1200, height: 630 };

/**
 * Satori shapes Arabic script but has no bidi reordering, so RTL runs come out left-to-right.
 * Lay out words (and ZWNJ-separated segments, which Satori treats as break points) in reverse.
 */
function Text({ value, rtl, gap = "0.28em", full = true }: { value: string; rtl: boolean; gap?: string; full?: boolean }) {
  if (!rtl) return <>{value}</>;
  return (
    <div style={{ display: "flex", flexDirection: "row-reverse", flexWrap: "wrap", columnGap: gap, width: full ? "100%" : "auto" }}>
      {value.split(/\s+/).map((word, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "row-reverse" }}>
          {word.split("\u200c").map((seg, j) => (
            <span key={j}>{seg}</span>
          ))}
        </div>
      ))}
    </div>
  );
}

const fonts = Promise.all([
  readFile(join(process.cwd(), "assets/fonts/ArchivoBlack.woff")),
  readFile(join(process.cwd(), "assets/fonts/Vazirmatn-ExtraBold.woff")),
  readFile(join(process.cwd(), "assets/fonts/Vazirmatn-Regular.woff")),
]);

/**
 * Title size that keeps the longest word on one line inside the 1072px content width
 * ("RECOMMENDATIONS" would otherwise run off the card). Per-character widths are rough
 * averages for uppercase Archivo and for Vazirmatn ExtraBold.
 */
function titleSize(title: string, rtl: boolean) {
  const longest = Math.max(...title.split(/\s+/).map((w) => w.length));
  const fit = Math.floor(1072 / (longest * (rtl ? 0.62 : 0.74)));
  return Math.min(title.length > 18 ? 104 : 148, fit);
}

/** Shared editorial OG card: paper (or project colour), mono-ish eyebrow, huge title, footer line. */
export async function ogImage({
  locale,
  eyebrow,
  title,
  footer,
  background = "#edeae3",
  ink = "#151412",
}: {
  locale: Locale;
  eyebrow: string;
  title: string;
  footer: string;
  background?: string;
  ink?: string;
}) {
  const [archivo, vazirBold, vazir] = await fonts;
  const rtl = locale === "fa";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background,
          color: ink,
          fontFamily: rtl ? "Vazirmatn" : "Archivo",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: rtl ? "row-reverse" : "row",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 24,
            opacity: 0.75,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 16, height: 16, background: "#ff5a1f", transform: "rotate(45deg)" }} />
            <span style={{ fontFamily: "Archivo", letterSpacing: 4 }}>MGHN</span>
          </div>
          <Text value={eyebrow} rtl={rtl} full={false} />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: rtl ? "flex-end" : "flex-start",
            fontSize: titleSize(title, rtl),
            lineHeight: rtl ? 1.15 : 0.9,
            letterSpacing: rtl ? 0 : -4,
            textTransform: rtl ? "none" : "uppercase",
          }}
        >
          <Text value={title} rtl={rtl} />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: rtl ? "flex-end" : "flex-start",
            fontSize: 28,
            fontFamily: rtl ? "VazirmatnRegular" : "Archivo",
            opacity: 0.8,
          }}
        >
          <Text value={footer} rtl={rtl} />
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Archivo", data: archivo, weight: 400, style: "normal" },
        { name: "Vazirmatn", data: vazirBold, weight: 800, style: "normal" },
        { name: "VazirmatnRegular", data: vazir, weight: 400, style: "normal" },
      ],
    },
  );
}
