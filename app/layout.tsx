import { Nunito } from "@next/font/google";

import Navbar from "@/components/layout/navbar";

import "../styles/globals.css";

const nunito = Nunito({
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head />

      <body className={`${nunito.className} bg-primary customize-scrollbar fat-scrollber`}>
        <Navbar />

        <div className="pt-24 px-4 sm:px-6 md:px-12 mx-auto xl:max-w-[85rem]">{children}</div>
      </body>
    </html>
  );
}
