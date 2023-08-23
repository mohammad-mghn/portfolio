import React from "react";
import { Metadata } from "next";

import Github from "@/components/home/github";
import {
  Skills,
  Languages,
  AboutLanding,
  AutoBiography,
  Testimonials,
} from "@/components/about";

import { localType } from "@/types/local";
import { useDictionary } from "@/dictionaries";

export const metadata: Metadata = {
  title: "Vito Mohagheghian • About",
};

async function AboutPage({ params: { lang } }: { params: { lang: string } }) {
  const local: localType = await useDictionary(lang);

  return (
    <>
      <AboutLanding local={local.about} />

      <AutoBiography local={local.about} />

      <Skills local={local.skills} />

      <Languages local={local.languages} />

      <Github local={local.github} />

      <Testimonials local={local.testimonials} />
    </>
  );
}

export default AboutPage;
