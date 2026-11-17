import clsx from "clsx";
import type { ReactNode } from "react";

/**
 * Top of every inner page: a bracketed eyebrow, the page name set huge, one statement
 * on the right, then a hairline meta row. Children render under the meta row.
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
        <p className="text-label col-span-full flex gap-3" data-reveal>
          <span>[ {eyebrow} ]</span>
        </p>
        <h1 className="text-huge col-span-full" data-split data-split-now>
          {title}
        </h1>
        {statement ? (
          <p className="text-statement col-span-full md:col-span-8 md:col-start-5" data-split>
            {statement}
          </p>
        ) : null}
        {meta?.length ? (
          <ul className="text-label col-span-full flex flex-wrap gap-x-8 gap-y-2 border-t border-hair pt-4 text-muted" data-reveal>
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
