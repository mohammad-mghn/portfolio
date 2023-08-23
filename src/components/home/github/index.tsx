import React from "react";

import Link from "next/link";

import Header from "@/components/elements/header";

import { socials } from "@/data/social";

import { styles } from "@/styles";
import { localType } from "@/types/local";

function Github({ local }: { local: localType["github"] }) {
  return (
    <>
      <section className="px-2 pb-3">
        <Header>{local.github}</Header>

        <div className="mt-3 ml-3">
          <div className="w-full flex items-baseline justify-between flex-wrap gap-x-2 gap-y-4">
            <h2
              className="text-sm md:text-xl text-text opacity-80"
              data-aos="fade-right"
            >
              {local.quote}{" "}
              <span className="text-darker-text text-xs">
                {local.quote_owner}
              </span>
            </h2>

            <Link
              target={"_blank"}
              href={socials.github}
              className={`${styles.button} px-4 py-2 md:px-6 md:py-3 border-[3px] border-brand`}
              data-aos="fade-left"
            >
              {local.github}
            </Link>
          </div>
        </div>
      </section>

      <div className={styles.divider} />
    </>
  );
}

export default Github;
