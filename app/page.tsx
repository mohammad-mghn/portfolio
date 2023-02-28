import React from "react";

import Contact from "@/components/contact";
import Github from "@/components/home/gtihub";
import Footer from "@/components/layout/footer";
import Support from "@/components/home/support";
import { SelectedProjects } from "@/components/projects";
import { Blog, Header, Instagram } from "@/components/home";
import { AboutLanding, AutoBiography, Charts } from "@/components/about";

async function Page() {
  return (
    <main>
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

      <Footer />
    </main>
  );
}

export default Page;
