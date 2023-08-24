import Skill from "../skill";
import Header from "@/components/common/header";

import { skills } from "@/data";

import { localType } from "@/types";

function Skills({ local }: { local: localType["skills"] }) {
  return (
    <section className="px-2">
      <Header>{local.header}</Header>

      <div className="mt-1 rtl:mt-3 md:mt-3 md:ml-3">
        <h2
          className="text-xs md:text-base text-text rtl:leading-loose opacity-80"
          data-aos="fade-up"
        >
          {local.description}
        </h2>

        <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
          {skills.map((skill, index) => (
            <Skill skill={skill} index={index} key={index} />
          ))}

          <p
            className="py-2 text-xs sm:text-base text-darker-text select-none"
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
