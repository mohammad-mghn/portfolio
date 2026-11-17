import { PortableText, type PortableTextComponents } from "next-sanity";
import type { RichText as RichTextValue } from "@/lib/content/types";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc ps-5">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal ps-5">{children}</ol>,
  },
  marks: {
    link: ({ children, value }) => (
      <a href={value?.href} target="_blank" rel="noreferrer" className="underline decoration-accent underline-offset-4">
        {children}
      </a>
    ),
  },
};

export function RichText({ value, className }: { value: RichTextValue; className?: string }) {
  return (
    <div className={className}>
      <PortableText value={value} components={components} />
    </div>
  );
}
