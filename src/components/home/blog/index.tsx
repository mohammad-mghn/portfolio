import React from "react";

import Link from "next/link";

import Header from "@/components/elements/header";

import { socials } from "@/data/social";

import { styles } from "@/styles";
import { localType } from "@/types/local";

function Blog({ local }: { local: localType["devto"] }) {
  return (
    <>
      <section className="px-2 pb-3">
        <Header>{local.header}</Header>

        <div className="mt-3 ml-3">
          <div className="w-full flex items-center justify-between flex-wrap gap-x-2 gap-y-4">
            <h2
              className="text-xs md:text-lg text-text opacity-80"
              data-aos="fade-right"
            >
              {local.description}
            </h2>

            <Link
              target={"_blank"}
              href={socials.devto}
              className={`${styles.button} px-4 py-2 md:px-6 md:py-3 border-[3px] border-brand`}
              data-aos="fade-left"
            >
              {local.profile}
            </Link>
          </div>
        </div>
      </section>

      <div className={styles.divider} />
    </>
  );
}

export default Blog;
