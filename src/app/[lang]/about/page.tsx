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
import { localType } from "@/types/local";
import { useDictionary } from "@/dictionaries";

export const metadata: Metadata = {
  title: "Vito Mohagheghian • About",
};

async function About({ params: { lang } }: { params: { lang: string } }) {
  const local: localType = await useDictionary(lang);
  return (
    <Layout local={local}>
      <AboutLanding local={local.about} />

      <AutoBiography local={local.about} />

      <Skills local={local.skills} />

      <Languages local={local.languages} />

      <Github local={local.github} />

      <Testimonials local={local.testimonials} />
    </Layout>
  );
}

export default About;
