import React from "react";
import Link from "next/link";
import Image from "next/image";

import { resumeLink } from "@/data/header";

import { Info } from "@/public";

import { styles } from "@/styles";

function Header() {
  return (
    <>
      <section className="flex flex-col sm:items-center justify-between py-6 lg:flex-row gap-y-14">
        <div className="flex flex-col items-start justify-center py-16">
          <p className="text-sm opacity-75 text-text md:text-xl">hi I’m</p>

          <h1 className="font-medium text-lighter-text text-4xl md:text-5xl lg:text-5xl xl:text-6xl md:leading-tight lg:leading-snug xl:leading-normal">
            Vito
            <br />
            Mohagheghian<span className="text-4xl md:text-7xl text-brand">.</span>
          </h1>

          <p className="mt-2 max-w-[18rem] md:max-w-[25rem] text-text text-sm md:text-xl leading-relaxed opacity-90">
            In which I’m really passionate in learning and coding. in which I’m really passionate in learning and
            coding. learning and coding.
          </p>

          <div className="flex items-center mt-5 gap-x-4">
            <Link className={`px-4 py-2 md:px-6 md:py-3 border-[3px] border-brand ${styles.button}`} href={resumeLink}>
              Resume
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  className="group-hover:fill-current group-hover:text-primary transition-all duration-300"
                  d="M9.41016 13.5586C9.28274 13.4256 9.19623 13.2588 9.16091 13.0781C9.12559 12.8973 9.14295 12.7102 9.21094 12.5391C9.28085 12.3662 9.40069 12.2182 9.55516 12.1138C9.70963 12.0095 9.8917 11.9535 10.0781 11.9531H14.0625V4.6875C14.0625 4.43886 14.1613 4.2004 14.3371 4.02459C14.5129 3.84877 14.7514 3.75 15 3.75C15.2486 3.75 15.4871 3.84877 15.6629 4.02459C15.8387 4.2004 15.9375 4.43886 15.9375 4.6875V11.9531H19.9219C20.1083 11.9535 20.2904 12.0095 20.4448 12.1138C20.5993 12.2182 20.7192 12.3662 20.7891 12.5391C20.857 12.7102 20.8744 12.8973 20.8391 13.0781C20.8038 13.2588 20.7173 13.4256 20.5898 13.5586L15.668 18.4805C15.4888 18.6537 15.2493 18.7506 15 18.7506C14.7507 18.7506 14.5112 18.6537 14.332 18.4805L9.41016 13.5586ZM25.3125 16.875C25.0639 16.875 24.8254 16.9738 24.6496 17.1496C24.4738 17.3254 24.375 17.5639 24.375 17.8125V24.375H5.625V17.8125C5.625 17.5639 5.52623 17.3254 5.35041 17.1496C5.1746 16.9738 4.93614 16.875 4.6875 16.875C4.43886 16.875 4.2004 16.9738 4.02459 17.1496C3.84877 17.3254 3.75 17.5639 3.75 17.8125V24.375C3.75 24.8723 3.94754 25.3492 4.29917 25.7008C4.65081 26.0525 5.12772 26.25 5.625 26.25H24.375C24.8723 26.25 25.3492 26.0525 25.7008 25.7008C26.0525 25.3492 26.25 24.8723 26.25 24.375V17.8125C26.25 17.5639 26.1512 17.3254 25.9754 17.1496C25.7996 16.9738 25.5611 16.875 25.3125 16.875Z"
                  fill="#FF9F1C"
                />
              </svg>
            </Link>

            <Link
              href="/contact"
              className={`px-3 py-2 md:px-5 md:py-3 text-text text-sm md:text-[1.125rem] font-semibold hover:underline`}
            >
              Get in touch
            </Link>
          </div>
        </div>

        <Image src={Info} alt="Vito Mohagheghian Info" className="w-[25rem]" />
      </section>

      <div className="mt-6 flex items-center justify-between gap-x-3 md:gap-x-5">
        <div className="bg-border h-[3px] flex-1 rounded-lg" />

        <a
          href="#about"
          className="text-md text-center text-border hover:text-text font-bold transition-all duration-300"
        >
          Scroll to down
        </a>

        <div className="bg-border h-[3px] flex-1 rounded-lg" />
      </div>
    </>
  );
}

export default Header;
