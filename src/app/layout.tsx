import { Nunito } from "next/font/google";

import AOSWrapper from "@/components/aos/wrapper";
import ScrollToTop from "@/components/scrollToTop";

import "../styles/globals.css";

const nunito = Nunito({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head />

      <body
        className={`${nunito.className} bg-primary customize-scrollbar fat-scrollber`}
      >
        <AOSWrapper>{children}</AOSWrapper>

        <ScrollToTop />
      </body>
    </html>
  );
}
