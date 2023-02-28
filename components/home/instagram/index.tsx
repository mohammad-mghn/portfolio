import React from "react";
import Link from "next/link";
import Image from "next/image";

import { styles } from "@/styles";

import { FirstPost, SercondPost, ThirdPost } from "@/public/instagram-posts";

function Instagram() {
  return (
    <>
      <section className="px-2">
        <h1 className="text-secondary font-semibold text-2xl">My Instagram</h1>

        <div className="md:mt-3 ml-3">
          <h2 className="text-xs md:text-lg text-text opacity-80">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit.{" "}
            <Link href={"https://instagram.com/vito.mohagheghian"} className="text-brand">
              @vito.moheghaghian
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

        <button className={`${styles.button} mx-auto my-8 px-4 py-2 md:px-6 md:py-3 border-[3px] border-brand`}>
          Check My Page
        </button>
      </section>

      <div className={styles.divider} />
    </>
  );
}

export default Instagram;
