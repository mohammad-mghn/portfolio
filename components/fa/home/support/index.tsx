import React from "react";

import Link from "next/link";

import Header from "@/components/elements/header";

import { socials } from "@/data/social";

import { styles } from "@/styles";

function Support() {
  return (
    <>
      <section className="px-2 pb-3">
        <Header>حمایت از من</Header>

        <div className="mt-3 ml-3 space-y-4">
          <div className="w-full flex flex-row items-center md:items-center justify-between flex-wrap gap-x-2 gap-y-4">
            <h2 className="text-sm md:text-xl text-text opacity-80">کافی بده</h2>

            <Link
              target="_blank"
              href={socials.buyMeACoffee}
              className={`${styles.button} px-4 py-2 md:px-6 md:py-3 border-[3px] border-brand`}
            >
              کافی بده
            </Link>
          </div>
          <div className="w-full flex flex-row items-center md:items-center justify-between flex-wrap gap-x-2 gap-y-4">
            <h2 className="text-sm md:text-xl text-text opacity-80">تتر بده</h2>

            <Link
              target="_blank"
              href={socials.wallet}
              className={`${styles.button} px-4 py-2 md:px-6 md:py-3 border-[3px] border-brand`}
            >
              ادرس ولت
            </Link>
          </div>
        </div>
      </section>

      <div className={styles.divider} />
    </>
  );
}

export default Support;
