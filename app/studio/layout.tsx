export { metadata, viewport } from "next-sanity/studio";

/** Separate root layout for the embedded Studio — no site CSS, fonts or chrome. */
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
