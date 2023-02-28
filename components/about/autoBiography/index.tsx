import React from "react";

import Detail from "./detail";

import { styles } from "@/styles";

function AutoBiography() {
  return (
    <>
      <section className="px-2 flex items-center justify-between flex-col lg:flex-row">
        <div className="w-full lg:w-[70%]">
          <h1 className="text-secondary font-semibold text-2xl">Autobiography</h1>

          <p className="mt-4 md:px-3 text-text text-sm lg:text-base text-justify leading-relaxed opacity-80">
            My name is Mohammad Mohagehghian, however, they usually call me as Vito and I am a Junior Web Developer,
            tending to find the development team. I am an accomplished coder and programmer, and I enjoy using my skills
            to contribute to the exciting technological advances and convert ideas to reality. I’m 16 years old, so I’m
            studying in high school. While in school, I learned web development as well as JavaScript. Currently, I’m
            living in Esfahan, Iran as I was born there. Although I have a short experience, I tried to make this
            experience as useful as it could be. My story: In 2020, one of my friends make a call and started to talk
            about programming, and the Python, I was interested in programming all time so just searched about Python,
            and after a while, I learned the Flax as a back-end framework to be an introduction to Django, however, I
            was more passionate in styling and interface, so I became a front-end developer, after learning HTML, CSS,
            and Js, React, and Next.js. I’m interested in Redux as well so it’s in my plans.
          </p>
        </div>

        <div className="my-6 lg:my-0 h-1 w-full lg:h-[16rem] lg:w-1 bg-border rounded-lg" />

        <div className="w-full lg:w-[25%]">
          <h2 className="mb-2 text-secondary font-semibold text-2xl">Details</h2>

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
