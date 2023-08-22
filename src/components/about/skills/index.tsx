import React from "react";

import Skill from "../skill";
import Header from "@/components/elements/header";

import { skills } from "@/data/skills";
import { localType } from "@/types/local";

function Skills({ local }: { local: localType["skills"] }) {
  return (
    <section className="px-2">
      <Header>{local.header}</Header>
      <div className="mt-1 md:mt-3 md:ml-3">
        <h2
          className="text-xs md:text-base text-text opacity-80"
          data-aos="fade-up"
        >
          {local.description}
        </h2>

        <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
          {skills.map((skill, index) => (
            <Skill skill={skill} index={index} key={index} />
          ))}

          <p
            className="py-2 text-darker-text select-none"
            data-aos="fade-left"
            data-aos-delay="10000"
          >
            {local.pov}
          </p>
        </div>
      </div>
    </section>
  );
}

export default Skills;
