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
        <div className="w-full lg:w-[70%]">
          <Header>Autobiography</Header>

          <p className="mt-4 md:px-3 text-text text-sm lg:text-base text-justify leading-relaxed opacity-80">
            My name is Mohammad Mohagehghian, but most people call me Vito. I’m a junior web developer looking to join a
            development team. I’m an accomplished coder and programmer, and I enjoy using my skills to contribute to
            exciting technological advances and turn ideas into reality. I’m currently 17 years old and studying in high
            school. While in school, I learned web development as well as JavaScript. Currently, I’m living in Isfahan,
            Iran where I was born. Although I have limited experience, I’ve tried to make the most of it. In 2020, one
            of my friends called me and started talking about programming and Python. I was interested in programming
            all the time so I searched about Python and after a while, I learned Flask as a back-end framework as an
            introduction to Django. However, I was more passionate about styling and interface so I became a front-end
            developer after. Currently I'm learning some advanced topics of JS, And Front-end techs.
          </p>
        </div>

        <div className="my-6 lg:my-0 h-1 w-full lg:h-[16rem] lg:w-1 bg-border rounded-lg" />

        <div className="w-full lg:w-[25%]">
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
