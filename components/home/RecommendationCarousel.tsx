"use client";

import { useState } from "react";
import type { Recommendation } from "@/lib/content/types";

type Labels = { prev: string; next: string; of: string; onLinkedIn: string; original?: string };

/**
 * One LinkedIn recommendation at a time: the highlight line big, the full verbatim text below,
 * then who wrote it and how they worked together. Quotes stay in English (dir/lang set) on every locale.
 */
export function RecommendationCarousel({
  items,
  indexes,
  labels,
}: {
  items: Recommendation[];
  /** Pre-formatted "01", "02"… in the page's digits. */
  indexes: string[];
  labels: Labels;
}) {
  const [i, setI] = useState(0);
  const r = items[i];
  const go = (d: number) => setI((n) => (n + d + items.length) % items.length);

  return (
    <div
      className="grid-12 mt-(--space-section-sm) gap-y-10"
      role="region"
      aria-roledescription="carousel"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(document.dir === "rtl" ? -1 : 1);
        if (e.key === "ArrowLeft") go(document.dir === "rtl" ? 1 : -1);
      }}
    >
      <div className="col-span-full flex items-center justify-between md:col-span-3" data-reveal>
        <p className="text-label text-muted" aria-live="polite">
          {indexes[i]} {labels.of} {indexes[items.length - 1]}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label={labels.prev}
            className="flex size-11 items-center justify-center rounded-full border border-ink/25 transition-colors duration-500 ease-house hover:border-ink hover:bg-ink hover:text-paper"
          >
            <span aria-hidden className="rtl:-scale-x-100">←</span>
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label={labels.next}
            className="flex size-11 items-center justify-center rounded-full border border-ink/25 transition-colors duration-500 ease-house hover:border-ink hover:bg-ink hover:text-paper"
          >
            <span aria-hidden className="rtl:-scale-x-100">→</span>
          </button>
        </div>
      </div>

      <figure key={r.id} className="rec-enter col-span-full md:col-span-9">
        <blockquote lang="en" dir="ltr" className="text-start">
          <p className="text-statement">
            <span aria-hidden className="accent me-1 text-accent">
              “
            </span>
            {r.highlight}
            <span aria-hidden className="accent text-accent">
              ”
            </span>
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {r.paragraphs.map((p, n) => (
              <p key={n} className="leading-relaxed text-ink-soft">
                {p}
              </p>
            ))}
          </div>
        </blockquote>
        {labels.original ? <p className="text-label mt-6 text-muted">{labels.original}</p> : null}

        <figcaption className="rule mt-10 grid gap-4 pt-5 md:grid-cols-3">
          <div className="flex items-center gap-3">
            <span aria-hidden className="text-label flex size-11 shrink-0 items-center justify-center rounded-full bg-ink text-paper">
              {r.name
                .split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("")}
            </span>
            <span className="text-lead font-medium">{r.name}</span>
          </div>
          <p className="text-label leading-relaxed text-muted" lang="en" dir="ltr">
            {r.headline}
          </p>
          <p className="text-label flex flex-col gap-1 text-muted md:items-end">
            <span>{r.relationship}</span>
            <span>{r.date}</span>
            {r.href ? (
              <a href={r.href} target="_blank" rel="noreferrer" className="hover:text-accent">
                {labels.onLinkedIn} ↗
              </a>
            ) : null}
          </p>
        </figcaption>
      </figure>
    </div>
  );
}
