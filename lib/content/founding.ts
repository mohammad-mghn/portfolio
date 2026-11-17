import "server-only";
import { cache } from "react";
import { ventures } from "@/content/seed/founding";
import { pick, pickStr, toImg } from "./localize";
import type { Img, Locale } from "./types";

export type Venture = {
  slug: string;
  name: string;
  role: string;
  since: string;
  partner: string;
  traction: string;
  summary: string;
  facts: string[];
  note: string[];
  links: { label: string; href: string }[];
  cover?: Img;
};

/** Ventures for the Founding page. Seed-only: long-form story copy that rarely changes. */
export const getVentures = cache(async (locale: Locale): Promise<Venture[]> =>
  ventures.map((v) => ({
    slug: v.slug,
    name: pickStr(v.name, locale),
    role: pickStr(v.role, locale),
    since: v.since,
    partner: pickStr(v.partner, locale),
    traction: pickStr(v.traction, locale),
    summary: pickStr(v.summary, locale),
    facts: pick(v.facts, locale, []),
    note: pick(v.note, locale, []),
    links: v.links,
    cover: toImg(v.cover, locale),
  })),
);
