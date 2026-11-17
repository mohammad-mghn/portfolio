import { Archivo, Geist_Mono, Instrument_Serif, Vazirmatn } from "next/font/google";

/** Display + body. The `wdth` axis gives condensed (62) → expanded (125) cuts from one file. */
export const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

/** Labels, eyebrows, counters. */
export const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

/** Prestige accent words (English only — no Persian glyphs). */
export const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
  preload: false,
});

/** Persian display + body. */
export const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
  preload: false,
});

export const fontVariables = [
  archivo.variable,
  geistMono.variable,
  instrumentSerif.variable,
  vazirmatn.variable,
].join(" ");
