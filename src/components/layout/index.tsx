import React, { ReactNode } from "react";
import Footer from "./footer";

import Navbar from "./navbar";
import { localType } from "@/types/local";

function Layout({
  children,
  local,
}: {
  children: ReactNode;
  local?: localType;
}) {
  return (
    <>
      <Navbar />

      <main className="pt-24 px-6 md:px-12 mx-auto xl:max-w-[85rem]">
        {children}

        <Footer local={local!.footer} />
      </main>
    </>
  );
}

export default Layout;
