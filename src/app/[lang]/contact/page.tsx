import React from "react";
import { Metadata } from "next";

import Layout from "@/components/layout";
import Contact from "@/components/contact";
import { useDictionary } from "@/dictionaries";
import { localType } from "@/types/local";

export const metadata: Metadata = {
  title: "Vito Mohagheghian • Contact",
};

async function About({ params: { lang } }: { params: { lang: string } }) {
  const local: localType = await useDictionary(lang);

  return (
    <Layout local={local}>
      <Contact local={local.contact} />
    </Layout>
  );
}

export default About;
