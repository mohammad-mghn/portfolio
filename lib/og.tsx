import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { Locale } from "@/i18n/routing";
import { shapeFa, wrapWords } from "@/lib/og-fa";
import { siteUrl } from "@/lib/site";

export const ogSize = { width: 1200, height: 630 };

const PAPER = "#edeae3";
const INK = "#151412";
const ACCENT = "#ff5a1f";
const PAD = 56;

/**
 * Text that may be Persian. English goes through untouched; Persian is broken into lines here
 * (the renderer cannot wrap right-to-left text), then each line is shaped and ordered by shapeFa
 * and drawn as plain text against the right edge.
 */
function Text({ value, rtl, chars = Infinity }: { value: string; rtl: boolean; chars?: number }) {
  if (!rtl) return <>{value}</>;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
      {wrapWords(value, chars).map((line, i) => (
        <span key={i}>{shapeFa(line)}</span>
      ))}
    </div>
  );
}

// The site's own faces as static files (the web build uses variable fonts, which the image renderer cannot read).
const font = (file: string) => readFile(join(process.cwd(), "assets/fonts", file));
const fonts = Promise.all([
  font("Archivo-Condensed-Bold.woff"),
  font("GeistMono-Regular.woff"),
  font("InstrumentSerif-Italic.woff"),
  font("Vazirmatn-ExtraBold.woff"),
  font("Vazirmatn-Regular.woff"),
]);

/**
 * Title size. A short title is set on one line as big as fits; a longer one wraps, sized so its
 * longest word still fits the content width. The per-character widths are measured averages for
 * uppercase condensed Archivo Bold and for Vazirmatn ExtraBold (with a little safety margin).
 */
function titleSize(title: string, rtl: boolean) {
  const width = ogSize.width - PAD * 2;
  const perChar = rtl ? 0.6 : 0.58;
  const oneLine = Math.floor(width / (title.length * perChar));
  const longest = Math.max(...title.split(/\s+/).map((w) => w.length));
  const wrapped = Math.floor(width / (longest * perChar));
  return Math.min(rtl ? 170 : 232, oneLine >= 120 ? oneLine : wrapped);
}

/** "mghn.info" from the site URL; nothing while the site only runs locally. */
const domain = () => {
  const host = new URL(siteUrl).host;
  return host.startsWith("localhost") ? "" : host.replace(/^www\./, "");
};

/**
 * The share card, in the site's own look: paper (or a project's colour) with the 12-column
 * hairlines, the diamond and MGHN mark, mono labels, one huge condensed title, and a ruled footer.
 * `accent` is an optional line under the title in the orange serif italic.
 */
export async function ogImage({
  locale,
  eyebrow,
  title,
  accent,
  footer,
  background = PAPER,
  ink = INK,
}: {
  locale: Locale;
  eyebrow: string;
  title: string;
  accent?: string;
  footer: string;
  background?: string;
  ink?: string;
}) {
  const [archivo, mono, serif, vazirBold, vazir] = await fonts;
  const rtl = locale === "fa";
  const label = {
    fontFamily: rtl ? "VazirmatnRegular" : "GeistMono",
    fontSize: rtl ? 24 : 20,
    letterSpacing: rtl ? 0 : 2.4,
    textTransform: rtl ? ("none" as const) : ("uppercase" as const),
  };
  const row = { display: "flex", flexDirection: rtl ? ("row-reverse" as const) : ("row" as const), alignItems: "center", justifyContent: "space-between" };

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background, color: ink }}>
        {/* The editorial grid behind everything */}
        <div style={{ position: "absolute", top: 0, bottom: 0, left: PAD, right: PAD, display: "flex", gap: 16 }}>
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} style={{ flex: 1, borderLeft: `1px solid ${ink}`, borderRight: `1px solid ${ink}`, opacity: 0.07 }} />
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", padding: PAD }}>
          <div style={row}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 15, height: 15, background: ACCENT, transform: "rotate(45deg)" }} />
              <span style={{ fontFamily: "GeistMono", fontSize: 22, letterSpacing: 6 }}>MGHN</span>
            </div>
            <div style={{ display: "flex", opacity: 0.72, ...label }}>
              <Text value={rtl ? eyebrow : `[ ${eyebrow} ]`} rtl={rtl} />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "flex-end", paddingBottom: 30 }}>
            <div
              style={{
                display: "flex",
                justifyContent: rtl ? "flex-end" : "flex-start",
                fontFamily: rtl ? "Vazirmatn" : "Archivo",
                fontSize: titleSize(title, rtl),
                lineHeight: rtl ? 1.14 : 0.86,
                letterSpacing: rtl ? 0 : "-0.035em",
                textTransform: rtl ? "none" : "uppercase",
              }}
            >
              <Text value={title} rtl={rtl} chars={Math.floor((ogSize.width - PAD * 2) / (titleSize(title, rtl) * 0.6))} />
            </div>
            {accent ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: rtl ? "flex-end" : "flex-start",
                  marginTop: rtl ? 8 : 18,
                  color: ACCENT,
                  fontFamily: rtl ? "Vazirmatn" : "InstrumentSerif",
                  fontStyle: rtl ? "normal" : "italic",
                  fontSize: rtl ? 38 : 46,
                  lineHeight: 1.1,
                }}
              >
                <Text value={accent} rtl={rtl} chars={52} />
              </div>
            ) : null}
          </div>

          <div style={{ ...row, borderTop: `1px solid ${ink}`, paddingTop: 20 }}>
            <div style={{ display: "flex", opacity: 0.8, ...label }}>
              <Text value={footer} rtl={rtl} />
            </div>
            <span style={{ fontFamily: "GeistMono", fontSize: 20, letterSpacing: 2.4, opacity: 0.8 }}>{domain()}</span>
          </div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Archivo", data: archivo, weight: 700, style: "normal" },
        { name: "GeistMono", data: mono, weight: 400, style: "normal" },
        { name: "InstrumentSerif", data: serif, weight: 400, style: "italic" },
        { name: "Vazirmatn", data: vazirBold, weight: 800, style: "normal" },
        { name: "VazirmatnRegular", data: vazir, weight: 400, style: "normal" },
      ],
    },
  );
}
