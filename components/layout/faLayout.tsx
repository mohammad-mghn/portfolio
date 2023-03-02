import React, { ReactNode } from "react";

import Navbar from "../fa/layout/navbar";

import { IranYekan } from "@/public/fonts";
import Footer from "../fa/layout/footer";

function FaLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${IranYekan.className} rtl`}>
      <Navbar />

      <main className="pt-24 px-4 sm:px-6 md:px-12 mx-auto xl:max-w-[85rem]">
        {children}

        <Footer />
      </main>
    </div>
  );
}

export default FaLayout;
