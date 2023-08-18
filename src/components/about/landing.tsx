import React from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

const TypingAnimation = dynamic(() => import("../typingAnimation"));

import { styles } from "@/styles";
import { AboutImage } from "@/public";

function AboutLanding() {
  return (
    <section
      className="flex flex-col sm:items-center justify-between py-20 lg:flex-row gap-y-14"
      id="about"
    >
      <div data-aos="fade-up-right">
        <h1 className="max-w-[18rem] md:max-w-[25.5rem] text-3xl font-medium text-lighter-text md:text-3xl lg:text-5xl md:leading-tight lg:leading-snug">
          Who am I and What I’m great at?
        </h1>

        <TypingAnimation
          staticText="I'm"
          content={[
            "Front-end Dev.",
            "React Dev.",
            "a Freelancer.",
            "UI designer.",
          ]}
          Typingspeed={75}
          deletingSpeed={50}
          deletePauseTime={750}
          typePauseTime={0}
          containerClassName={
            "mt-2 text-md md:text-lg lg:text-xl font-semibold text-text"
          }
          cursorClassName={"text-brand "}
        />

        <p className="mt-3 max-w-[15rem] md:max-w-[20rem] text-text text-sm md:text-xl leading-relaxed opacity-75">
          In which I’m really pasionate in learning and coding.
        </p>
        <Link
          target={"_blank"}
          href="https://github.com/vito-mohagheghian"
          className={`mt-4 px-4 py-2 md:px-6 md:py-3 w-fit border-[3px] border-brand ${styles.button}`}
        >
          Github page
        </Link>
      </div>

      <Image
        src={AboutImage}
        alt="about image"
        className="sm:px-5 w-[30rem]"
        data-aos="fade-down-left"
      />
    </section>
  );
}

export default AboutLanding;
