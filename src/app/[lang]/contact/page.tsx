import { Metadata } from "next";

import Contact from "@/components/contact";

import { useDictionary } from "@/dictionaries";

import { localType } from "@/types";

export const metadata: Metadata = {
  title: "Mohammad Mohagheghian • Contact",
  keywords: [
    "Mohammad Mohagheghian contact",
    "Mohammad mohagheghian social media",
    "محمد محققیان درباره",
    "mohammad mohagheghian] contact",
    "mohammad mohagheghian social media",
  ],
  description:
    "contact with mohammad mohagheghian a software engineer currently developing skills in Front-end",
};

async function ContactPage({ params: { lang } }: { params: { lang: string } }) {
  const local: localType = await useDictionary(lang);

  return <Contact local={local.contact} />;
}

export default ContactPage;
