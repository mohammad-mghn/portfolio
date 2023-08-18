import React from "react";
import { Metadata } from "next";

import Layout from "@/components/layout";
import Github from "@/components/home/github";
import {
  Skills,
  Languages,
  AboutLanding,
  AutoBiography,
  Testimonials,
} from "@/components/about";

export const metadata: Metadata = {
  title: "Vito Mohagheghian • About",
};

function About() {
  return (
    <Layout>
      <AboutLanding />

      <AutoBiography />

      <Skills />

      <Languages />

      <Github />

      <Testimonials />
    </Layout>
  );
}

export default About;
