import { Metadata } from "next";

import Contact from "@/components/contact";

import { useDictionary } from "@/dictionaries";

import { localType } from "@/types";

export const metadata: Metadata = {
  title: "Vito Mohagheghian • Contact",
  keywords:
    "vito Mohagheghian contact, vito mohagheghian social media , محمد محققیان درباره, ویتو محققیان درباره, mohammad mohagheghian contact, mohammad mohagheghian social media",
  description:
    "contact with vito mohagheghian a software engineer currently developing skills in Front-end",
};

async function ContactPage({ params: { lang } }: { params: { lang: string } }) {
  const local: localType = await useDictionary(lang);

  return <Contact local={local.contact} />;
}

export default ContactPage;
