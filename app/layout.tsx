import { Nunito } from "@next/font/google";

import "../styles/globals.css";

import Navbar from "@/components/layout/navbar";

const nunito = Nunito({
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />

      <body className={`bg-primary ${nunito.className}`}>
        <Navbar />

        <div className="pt-24 px-6 mx-auto md:px-12 xl:max-w-[85rem]">{children}</div>
      </body>
    </html>
  );
}
