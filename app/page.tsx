import { AboutLanding, AutoBiography } from "@/components/about";
import { Header } from "@/components/home";
import React from "react";

async function Page() {
  return (
    <main>
      <Header />

      <AboutLanding />

      <AutoBiography />
    </main>
  );
}

export default Page;
