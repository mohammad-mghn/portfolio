import React from "react";

import Layout from "@/components/layout";
import Github from "@/components/home/github";
import { AboutLanding, AutoBiography, Charts } from "@/components/about";

function About() {
  return (
    <Layout>
      <AboutLanding />

      <AutoBiography />

      <Charts />

      <Github />
    </Layout>
  );
}

export default About;
