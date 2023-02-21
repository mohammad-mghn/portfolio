import React from "react";
import Image from "next/image";

import { Info } from "@/public";
import { styles } from "@/styles";
import { DownloadIcon } from "@/public/icons";

function Header() {
  return (
    <>
      <section className="flex flex-col items-center justify-between py-6 lg:flex-row gap-y-14">
        <div className="flex flex-col justify-center py-16">
          <p className="text-sm opacity-75 text-text md:text-xl">hi I’m</p>

          <h1 className="text-3xl font-medium text-lighter-text md:text-5xl lg:text-7xl md:leading-tight lg:leading-snug">
            Vito
            <br />
            Mohagheghian<span className="text-4xl md:text-7xl text-brand">.</span>
          </h1>

          <p className="mt-2 max-w-[18rem] md:max-w-[25rem] text-text text-sm md:text-xl leading-relaxed opacity-90">
            In which I’m really passionate in learning and coding. in which I’m really passionate in learning and
            coding. learning and coding.
          </p>

          <div className="flex items-center mt-5 gap-x-4">
            <button className={`px-4 py-2 md:px-6 md:py-3 ${styles.button}`}>
              Resume
              <Image src={DownloadIcon} alt="download icon" className="w-4 md:w-6" />
            </button>

            <button
              className={`px-3 py-2 md:px-5 md:py-3 text-text text-sm md:text-[1.125rem] font-semibold hover:underline`}
            >
              Get in touch
            </button>
          </div>
        </div>

        <Image src={Info} alt="Vito Mohagheghian Info" className="w-[25rem]" />
      </section>

      <div className="mt-6 flex items-center justify-between gap-x-3 md:gap-x-5">
        <div className="bg-border h-[3px] flex-1 rounded-lg" />

        <a href="#id" className="text-md text-center text-border hover:text-text font-bold transition-all duration-300">
          Scroll to down
        </a>

        <div className="bg-border h-[3px] flex-1 rounded-lg" />
      </div>
    </>
  );
}

export default Header;
