import clsx from "clsx";
import { Link } from "@/i18n/navigation";

/** The "more →" pill every homepage section ends with, pointing at that section's own page. */
export function MoreLink({ href, label, className }: { href: string; label: string; className?: string }) {
  return (
    <Link
      href={href}
      className={clsx(
        "text-label inline-flex items-center gap-3 rounded-full border border-current/25 px-5 py-3.5 transition-colors duration-500 ease-house hover:border-accent hover:text-accent",
        className,
      )}
      data-reveal
    >
      {label}
      <span aria-hidden className="rtl:-scale-x-100">
        →
      </span>
    </Link>
  );
}
