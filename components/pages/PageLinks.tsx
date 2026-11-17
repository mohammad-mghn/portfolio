import { MoreLink } from "@/components/ui/MoreLink";

/** A row of "more →" pills that closes an inner page, pointing at the next pages worth reading. */
export function PageLinks({ links }: { links: { href: string; label: string }[] }) {
  return (
    <section className="relative z-1 py-(--space-section)">
      <div className="grid-12">
        <div className="col-span-full flex flex-wrap gap-3 border-t border-hair pt-8">
          {links.map((l) => (
            <MoreLink key={l.href} href={l.href} label={l.label} />
          ))}
        </div>
      </div>
    </section>
  );
}
