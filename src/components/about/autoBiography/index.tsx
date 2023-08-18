/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";

import Detail from "./detail";
import Header from "@/components/elements/header";

import { styles } from "@/styles";

function AutoBiography() {
  return (
    <>
      <section className="px-2 flex items-center justify-between flex-col lg:flex-row">
        <div
          className="w-full lg:w-[70%]"
          data-aos="zoom-in-down"
          data-aos-once="true"
        >
          <Header>Autobiography</Header>

          <p className="mt-4 md:px-3 text-text text-sm lg:text-base text-justify leading-relaxed opacity-80">
            Mohammad Mohagheghian, a junior web developer, but you can call me
            Vito. I specialize in front-end development and software engineering
            in small cases. I thoroughly enjoy utilizing my skills to contribute
            to technological advancements and transform ideas into reality. My
            programming journey began during high school when I got introduced
            to Python. I grasped the basics of programming and found joy in
            creating various projects without limitations. However, I
            encountered a challenge. I constantly desired my applications to
            boast a captivating UI. Using basic GUI libraries with numerous
            styling issues hindered my creativity. As a result, I transitioned
            into front-end development and JavaScript. The deeper I delved into
            front-end development, the more my affection for programming grew. I
            also developed a keen interest in startup ecosystems. Presently, I
            reside in my hometown, Isfahan, Iran. These days, I am accumulating
            experiences and acquiring new skills. My goal is to implement ideas
            just only limited by my imagination. Feel free to explore my skills,
            projects, and also the experiences of others who have collaborated
            with me.
          </p>
        </div>

        <div className="my-6 lg:my-0 h-1 w-full lg:h-[16rem] lg:w-1 bg-border rounded-lg" />

        <div
          className="w-full lg:w-[25%]"
          data-aos="zoom-in-left"
          data-aos-once="true"
        >
          <Header>Details</Header>

          <Detail title="Nickname" value="Vito" />
          <Detail title="Location" value="Esfahan, Iran, Asia, Earth" />
          <Detail title="Name" value="Mohammad Mohagheghian" />
        </div>
      </section>

      <div className={styles.divider} />
    </>
  );
}

export default AutoBiography;
