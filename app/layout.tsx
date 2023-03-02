import { Nunito } from "@next/font/google";

import Navbar from "@/components/layout/navbar";
import ScrollToTop from "@/components/scrollToTop";

import "../styles/globals.css";

const nunito = Nunito({
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head />

      <body className={`${nunito.className} bg-primary customize-scrollbar fat-scrollber`}>
   

       {children}

        <ScrollToTop />
      </body>
    </html>
  );
}
