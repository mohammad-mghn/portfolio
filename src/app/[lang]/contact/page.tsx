import React from "react";
import { Metadata } from "next";

import Contact from "@/components/contact";

import { localType } from "@/types/local";
import { useDictionary } from "@/dictionaries";

export const metadata: Metadata = {
  title: "Vito Mohagheghian • Contact",
};

async function ContactPage({ params: { lang } }: { params: { lang: string } }) {
  const local: localType = await useDictionary(lang);

  return <Contact local={local.contact} />;
}

export default ContactPage;
