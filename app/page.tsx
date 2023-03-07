import React from "react";

import Layout from "@/components/layout";
import Contact from "@/components/contact";
import Github from "@/components/home/github";
import Support from "@/components/home/support";
import { SelectedProjects } from "@/components/projects";
import { Blog, Header, Instagram } from "@/components/home";
import { AboutLanding, AutoBiography, Charts } from "@/components/about";

async function Page() {
  return (
    <Layout>
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
    </Layout>
  );
}

export default Page;
