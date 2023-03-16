import React from "react";

import Link from "next/link";
import Image from "next/image";

import Header from "@/components/elements/header";

import { socials } from "@/data/social";

import { FirstPost, SercondPost, ThirdPost } from "@/public/instagram-posts";

import { styles } from "@/styles";

function Instagram() {
  return (
    <>
      <section className="px-2">
        <Header>اینستاگرام من</Header>

        <div className="md:mt-3 ml-3">
          <h2 className="text-xs md:text-lg text-text opacity-80">
            لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت .{" "}
            <Link href={socials.instagram} className="text-brand">
              vito.moheghaghian@
            </Link>
          </h2>

          <div className="mt-5 relative flex flex-col md:flex-row items-center justify-center gap-3 flex-wrap snap-x">
            <Image
              src={FirstPost}
              alt="vito.mohagheghian instagram post"
              className="w-full max-w-[20rem] lg:max-w-fit  lg:w-[32%] border-2 border-border-darker rounded-lg shadow-dark shrink-0 snap-center"
            />
            <Image
              src={SercondPost}
              alt="vito.mohagheghian instagram post"
              className="w-full max-w-[20rem] lg:max-w-fit lg:w-[32%] border-2 border-border-darker rounded-lg shadow-dark shrink-0 snap-center"
            />
            <Image
              src={ThirdPost}
              alt="vito.mohagheghian instagram post"
              className="w-full max-w-[20rem] lg:max-w-fit lg:w-[32%] border-2 border-border-darker rounded-lg shadow-dark shrink-0 snap-center"
            />
          </div>
        </div>

        <Link
          href={socials.instagram}
          className={`mx-auto my-8 px-4 py-2 md:px-6 md:py-3 w-fit border-[3px] border-brand ${styles.button}`}
        >
          از پیجم دیدن کنید
        </Link>
      </section>

      <div className={styles.divider} />
    </>
  );
}

export default Instagram;
