import React from "react";

import Link from "next/link";

import { socials } from "@/data/social";

import { styles } from "@/styles";

function Support() {
  return (
    <>
      <section className="px-2 pb-3">
        <h1 className="text-secondary text-2xl font-semibold">Support me</h1>

        <div className="mt-3 ml-3 space-y-4">
          <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between flex-wrap gap-x-2 gap-y-4">
            <h2 className="text-sm md:text-xl text-text opacity-80">Buy me a coffee (coffee be de)</h2>

            <button className={`${styles.button} px-4 py-2 md:px-6 md:py-3 border-[3px] border-brand`}>
              Dev to Profile
            </button>
          </div>
          <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between flex-wrap gap-x-2 gap-y-4">
            <h2 className="text-sm md:text-xl text-text opacity-80">Send me Tether</h2>

            <Link
              href={socials.devto}
              className={`${styles.button} px-4 py-2 md:px-6 md:py-3 border-[3px] border-brand`}
            >
              Dev to Profile
            </Link>
          </div>
        </div>
      </section>

      <div className={styles.divider} />
    </>
  );
}

export default Support;
