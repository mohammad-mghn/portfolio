import React from "react";

import Link from "next/link";

import { socials } from "@/data/social";

import { styles } from "@/styles";

function Blog() {
  return (
    <>
      <section className="px-2 pb-3">
        <h1 className="text-secondary font-semibold text-2xl">وبلاگ من داخل Dev.to</h1>

        <div className="mt-3 ml-3">
          <div className="w-full flex items-center justify-between flex-wrap gap-x-2 gap-y-4">
            <h2 className="text-xs md:text-lg text-text opacity-80">
              از صنعت چاپ و با استفاده از طراحان استفاده از طراحان گرافیک است.{" "}
            </h2>

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

export default Blog;
