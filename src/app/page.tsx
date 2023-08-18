import React from "react";
import type { Metadata } from "next";

import Layout from "@/components/layout";
import Contact from "@/components/contact";
import Github from "@/components/home/github";
import Support from "@/components/home/support";
import { SelectedProjects } from "@/components/projects";
import { Blog, Hero, Instagram } from "@/components/home";
import {
  Skills,
  Languages,
  AboutLanding,
  Testimonials,
  AutoBiography,
} from "@/components/about";

export const metadata: Metadata = {
  title: "Vito Mohagheghian",
  description: "vito mohagheghian portfolio, web developer(Front-end)",
  keywords: `Vito Mohagehghian, front-end developer, web developer, programmer Esfahan, Iran , ReactJs and Nextjs developer`,
  openGraph: {
    type: "profile",
    url: "https://vito-dev.ir/",
    siteName: "Vito Mohagheghian Portfolio",
    images: [
      "https://raw.githubusercontent.com/vito-mohagheghian/portfolio/images-db/portfolio/1.png",
      "https://raw.githubusercontent.com/vito-mohagheghian/portfolio/images-db/portfolio/2.png",
    ],
  },
};


async function Page() {
  return (
    <Layout>
      <Hero />

      <AboutLanding />

      <AutoBiography />

      <Skills />

      <Languages />

      <Github />

      <SelectedProjects />

      <Testimonials />

      <Instagram />

      <Blog />

      <Contact />

      <Support />
    </Layout>
  );
}

export default Page;
