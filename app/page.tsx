import React from "react";

import { Header } from "@/components/home";
import Charts from "@/components/about/charts";
import { SelectedProjects } from "@/components/projects";
import { AboutLanding, AutoBiography } from "@/components/about";

async function Page() {
  return (
    <main>
      <Header />

      <AboutLanding />

      <AutoBiography />

      <Charts />

      <SelectedProjects />
    </main>
  );
}

export default Page;
