import React from "react";

import Link from "next/link";

import { socials } from "@/data/social";

import { styles } from "@/styles";
import Header from "@/components/elements/header";

function Support() {
  return (
    <>
      <section className="px-2 pb-3">
        <Header>Support me</Header>

        <div className="mt-3 ml-3 space-y-4">
          <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between flex-wrap gap-x-2 gap-y-4">
            <h2
              className="text-sm md:text-xl text-text opacity-80"
              data-aos="fade-right"
            >
              Buy me a coffee (coffee be de)
            </h2>

            <Link
              target={"_blank"}
              href={socials.buyMeACoffee}
              className={`${styles.button} px-4 py-2 md:px-6 md:py-3 border-[3px] border-brand`}
              data-aos="fade-left"
            >
              Coffee Be De
            </Link>
          </div>
          <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between flex-wrap gap-x-2 gap-y-4">
            <h2
              className="text-sm md:text-xl text-text opacity-80"
              data-aos="fade-right"
            >
              Send me Tether
            </h2>

            <Link
              target="_blank"
              href={socials.wallet}
              className={`${styles.button} px-4 py-2 md:px-6 md:py-3 border-[3px] border-brand`}
              data-aos="fade-left"
            >
              Wallet Address
            </Link>
          </div>
        </div>
      </section>

      <div className={styles.divider} />
    </>
  );
}

export default Support;
