import { Nunito } from "next/font/google";

import AOSWrapper from "@/components/aos/wrapper";
import ScrollToTop from "@/components/scrollToTop";
import { Footer, Navbar } from "@/components/layout";

import { IranYekan } from "@/../public/fonts";

import { useDictionary } from "@/dictionaries";

import "../../styles/globals.css";

// ! it's not working anymore
const nunito = Nunito({
  subsets: ["latin"],
});

type props = {
  children: React.ReactNode;
  params: { lang: string };
};

export default async function RootLayout({
  children,
  params: { lang },
}: props) {
  const local = await useDictionary(lang);

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
          lang === "fa" ? IranYekan.className : "nunito"
        } bg-primary customize-scrollbar fat-scrollbar`}
      >
        <Navbar local={local.navbar} />

        <main className="pt-24 px-6 md:px-12 mx-auto xl:max-w-[85rem]">
          <AOSWrapper>{children}</AOSWrapper>
        </main>

        <Footer local={local!.footer} />

        <ScrollToTop />
      </body>
    </html>
  );
}
