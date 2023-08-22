import React from "react";
import { Metadata } from "next";

import Layout from "@/components/layout";
import Projects from "@/components/projects/projects";

export const metadata: Metadata = {
  title: "Vito Mohagheghian • Projects",
};

function About() {
  return (
    <Layout>
      <Projects />
    </Layout>
  );
}

export default About;
