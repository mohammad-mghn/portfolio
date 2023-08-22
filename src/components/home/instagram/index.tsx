import React from "react";

import Link from "next/link";
import Image from "next/image";

import Header from "@/components/elements/header";

import { socials } from "@/data/social";

import { styles } from "@/styles";
import InstagramSlider from "./slider";
import { localType } from "@/types/local";

function Instagram({ local }: { local: localType["instagram"] }) {
  return (
    <>
      <section className="px-2">
        <Header>{local.header}</Header>

        <h2
          className="md:mt-3 ml-3 text-xs md:text-base text-text opacity-80"
          data-aos="fade-up"
        >
          {local.description}{" "}
          <Link href={socials.instagram} className="text-brand">
            @{local.id}
          </Link>
        </h2>

        <div className="mt-5 relative flex flex-col md:flex-row items-center justify-center gap-3 flex-wrap snap-x">
          <InstagramSlider />
        </div>

        <Link
          href={socials.instagram}
          className={`mx-auto my-8 px-4 py-2 md:px-6 md:py-3 w-fit border-[3px] border-brand ${styles.button}`}
        >
          {local.check_my_page}
        </Link>
      </section>

      <div className={styles.divider} />
    </>
  );
}

export default Instagram;
