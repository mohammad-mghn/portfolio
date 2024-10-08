import type { Metadata } from "next";

import Contact from "@/components/contact";
import { SelectedProjects } from "@/components/projects";
import { Blog, Github, Hero, Instagram, Support } from "@/components/home";
import {
  Skills,
  Languages,
  AboutLanding,
  Testimonials,
  AutoBiography,
} from "@/components/about";

import { useDictionary } from "@/dictionaries";

import { localType } from "@/types";

export const metadata: Metadata = {
  title: "Mohammad Mohagheghian",
  description:
    "Mohammad Mohagheghian portfolio a software engineer currently developing skills in Front-end",
  keywords: [
    "Mohammad Mohagehghian",
    "Mohagheghian",
    "front-end developer",
    "web developer",
    "programmer Isfahan, Iran",
    "ReactJs and Nextjs developer",
  ],

  openGraph: {
    type: "profile",
    url: "https://vito-dev.ir/",
    siteName: "Mohammad Mohagheghian Portfolio",
    images: [
      "https://raw.githubusercontent.com/mohammad-mghn/portfolio/images-db/portfolio/1.png",
      "https://raw.githubusercontent.com/mohammad-mghn/portfolio/images-db/portfolio/2.png",
    ],
  },
};

async function HomePage({ params: { lang } }: { params: { lang: string } }) {
  const local: localType = await useDictionary(lang);

  return (
    <>
      <Hero local={local.hero} />

      <AboutLanding local={local.about} />

      <AutoBiography local={local.about} />

      <Skills local={local.skills} />

      <Languages local={local.languages} />

      <Github local={local.github} />

      <SelectedProjects local={local.selected_projects} />

      <Testimonials local={local.testimonials} />

      <Instagram local={local.instagram} />

      <Blog local={local.devto} />

      <Contact local={local.contact} />

      <Support local={local.support} />
    </>
  );
}

export default HomePage;
