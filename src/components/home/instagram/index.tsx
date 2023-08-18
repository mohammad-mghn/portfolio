import React from "react";

import Link from "next/link";
import Image from "next/image";

import Header from "@/components/elements/header";

import { socials } from "@/data/social";

import { styles } from "@/styles";
import InstagramSlider from "./slider";

function Instagram() {
  return (
    <>
      <section className="px-2">
        <Header>My Instagram</Header>

        <h2
          className="md:mt-3 ml-3 text-xs md:text-base text-text opacity-80"
          data-aos="fade-up"
        >
          Tech geek sharing cool stuff on Instagram. Let&apos;s connect!{" "}
          <Link href={socials.instagram} className="text-brand">
            @vito.mohagheghian
          </Link>
        </h2>

        <div className="mt-5 relative flex flex-col md:flex-row items-center justify-center gap-3 flex-wrap snap-x">
          <InstagramSlider />
        </div>

        <Link
          href={socials.instagram}
          className={`mx-auto my-8 px-4 py-2 md:px-6 md:py-3 w-fit border-[3px] border-brand ${styles.button}`}
        >
          Check My Page
        </Link>
      </section>

      <div className={styles.divider} />
    </>
  );
}

export default Instagram;
