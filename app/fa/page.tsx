import React from "react";

import Contact from "@/components/fa/contact";
import Github from "@/components/fa/home/github";
import Header from "@/components/fa/home/header";
import Support from "@/components/fa/home/support";
import FaLayout from "@/components/layout/faLayout";
import { Blog, Instagram } from "@/components/fa/home";
import { SelectedProjects } from "@/components/fa/projects";
import { AboutLanding, AutoBiography, Charts } from "@/components/fa/about";

function Page() {
  return (
    <FaLayout>
      <Header />

      <AboutLanding />

      <AutoBiography />

      <Charts />

      <Github />

      <SelectedProjects />

      <Instagram />

      <Blog />

      <Contact />

      <Support />

    </FaLayout>
  );
}

export default Page;
