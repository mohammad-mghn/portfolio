import React from "react";

import Github from "@/components/home/gtihub";
import Footer from "@/components/layout/footer";
import { AboutLanding, AutoBiography, Charts } from "@/components/about";

function About() {
  return (
    <main>
      <AboutLanding />

      <AutoBiography />

      <Charts />

      <Github />

      <Footer />
    </main>
  );
}

export default About;
