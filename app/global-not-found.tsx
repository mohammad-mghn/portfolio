import type { Metadata } from "next";
import Link from "next/link";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "404 — Not found",
  description: "This page does not exist.",
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <body className="grain">
        <main className="grid-12 min-h-svh content-center gap-y-8">
          <p className="text-label col-span-full text-muted">Error 404 — Off the map</p>
          <h1 className="text-mega col-span-full">
            Lost <span className="accent">the thread</span>
          </h1>
          <Link href="/" className="text-label col-span-full underline underline-offset-4">
            ← Back to the start
          </Link>
        </main>
      </body>
    </html>
  );
}
