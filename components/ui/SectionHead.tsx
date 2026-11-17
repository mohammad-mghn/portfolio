import clsx from "clsx";

/** Numbered editorial section head: mono eyebrow on the left, huge title spanning the rest. */
export function SectionHead({
  index,
  eyebrow,
  title,
  className,
  titleId,
}: {
  index: string;
  eyebrow: string;
  title: string;
  className?: string;
  titleId?: string;
}) {
  return (
    <div className={clsx("grid-12 gap-y-5", className)}>
      <p className="text-label col-span-full flex gap-3 pt-3 md:col-span-3" data-reveal>
        <span>{index}</span>
        <span aria-hidden>—</span>
        <span>{eyebrow}</span>
      </p>
      <h2 id={titleId} className="text-huge col-span-full md:col-span-9" data-split>
        {title}
      </h2>
    </div>
  );
}
