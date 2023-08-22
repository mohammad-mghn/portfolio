import React from "react";

import Skill from "../skill";
import Header from "@/components/elements/header";

import { languages } from "@/data/languages";

import { styles } from "@/styles";
import { localType } from "@/types/local";

function Languages({ local }: { local: localType["languages"] }) {
  return (
    <section className="mt-5 px-2">
      <Header>{local.header}</Header>
      <div className="mt-1 md:mt-3 md:ml-3">
        <h2
          className="text-xs md:text-base text-text opacity-80"
          data-aos="fade-up"
        >
          {local.description}
        </h2>

        <div className="mt-1 md:mt-3 md:ml-3">
          <div className="mt-2 flex flex-wrap gap-2 sm:gap-3">
            {languages.map((skill, index) => (
              <Skill skill={skill} index={index} key={index} />
            ))}
          </div>
        </div>
      </div>
      <div className={styles.divider} />
    </section>
  );
}

export default Languages;
