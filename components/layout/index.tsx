import React, { ReactNode } from "react";
import Footer from "./footer";

import Navbar from "./navbar";

function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />

      <main className="pt-24 px-4 sm:px-6 md:px-12 mx-auto xl:max-w-[85rem]">
        {children}

        <Footer />
      </main>
    </>
  );
}

export default Layout;
