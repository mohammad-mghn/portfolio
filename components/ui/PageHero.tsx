import clsx from "clsx";
import type { ReactNode } from "react";

/**
 * Top of every inner page: a bracketed eyebrow, the page name set huge, one statement
 * on the right, then a hairline meta row. Children render under the meta row.
 * Nothing here waits for JavaScript: the title and statement are in the first paint and settle
 * into place with CSS (see "Intro" in globals.css); only the two small label rows fade in.
 */
export function PageHero({
  eyebrow,
  title,
  statement,
  meta,
  children,
  className,
}: {
  eyebrow: string;
  title: string;
  statement?: string;
  meta?: string[];
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={clsx("relative z-1 pt-(--space-page) pb-(--space-section)", className)}>
      <div className="grid-12 gap-y-8">
        <p className="intro-fade text-label col-span-full flex gap-3">
          <span>[ {eyebrow} ]</span>
        </p>
        <h1 className="intro-settle text-huge col-span-full">{title}</h1>
        {statement ? (
          <p
            className="intro-settle text-statement col-span-full md:col-span-8 md:col-start-5"
            style={{ "--d": "0.08s" } as React.CSSProperties}
          >
            {statement}
          </p>
        ) : null}
        {meta?.length ? (
          <ul
            className="intro-fade text-label col-span-full flex flex-wrap gap-x-8 gap-y-2 border-t border-hair pt-4 text-muted"
            style={{ "--d": "0.3s" } as React.CSSProperties}
          >
            {meta.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        ) : null}
        {children}
      </div>
    </section>
  );
}
