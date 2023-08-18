import React from "react";
import { Metadata } from "next";

import Layout from "@/components/layout";
import Contact from "@/components/contact";

export const metadata: Metadata = {
  title: "Vito Mohagheghian • Contact",
};

function About() {
  return (
    <Layout>
      <Contact />
    </Layout>
  );
}

export default About;
