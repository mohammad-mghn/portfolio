import { Metadata } from "next";

import Github from "@/components/home/github";
import {
  Skills,
  Languages,
  AboutLanding,
  Testimonials,
} from "@/components/about";

import AutoBiography from "@/components/about/autobiography";

import { useDictionary } from "@/dictionaries";

import { localType } from "@/types";

export const metadata: Metadata = {
  title: "Vito Mohagheghian • About",
  keywords:
    "vito Mohagheghian about, محمد محققیان درباره, ویتو محققیان درباره, mohammad mohagheghian about",
  description:
    "read about vito mohagheghian a software engineer currently developing skills in Front-end",
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
