import React from "react";

import Link from "next/link";

import Header from "@/components/elements/header";

import { socials } from "@/data/social";

import { styles } from "@/styles";

function Github() {
  return (
    <>
      <section className="px-2 pb-3">
        <Header>My GitHub page</Header>

        <div className="mt-3 ml-3">
          <div className="w-full flex items-center justify-between flex-wrap gap-x-2 gap-y-4">
            <h2
              className="text-sm md:text-xl text-text opacity-80"
              data-aos="fade-right"
            >
              Talk is cheap, Show me the code.{" "}
              <span className="text-darker-text text-xs">Linus Torvalds</span>
            </h2>

            <Link
              target={"_blank"}
              href={socials.github}
              className={`${styles.button} px-4 py-2 md:px-6 md:py-3 border-[3px] border-brand`}
              data-aos="fade-left"
            >
              Github Page
            </Link>
          </div>
        </div>
      </section>

      <div className={styles.divider} />
    </>
  );
}

export default Github;
