import { Nunito } from "next/font/google";

import AOSWrapper from "@/components/aos/wrapper";
import ScrollToTop from "@/components/scrollToTop";

import "../../styles/globals.css";
import { IranYekan } from "@/public/fonts";

const nunito = Nunito({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  let dir;

  switch (lang) {
    case "en":
      dir = "ltr";
      break;

    case "fa":
      dir = "rtl";
      break;

    default:
      dir = "ltr";
      break;
  }

  return (
    <html lang={lang} dir={dir} className="scroll-smooth">
      <head />

      <body
        className={`${
          lang === "fa" ? IranYekan.className : nunito.className
        } bg-primary customize-scrollbar fat-scrollbar`}
      >
        <AOSWrapper>{children}</AOSWrapper>

        <ScrollToTop />
      </body>
    </html>
  );
}
