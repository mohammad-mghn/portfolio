import Skill from "./skill";
import { Divider, Header } from "../common";

import { languages } from "@/data";

import { localType } from "@/types";

function Languages({ local }: { local: localType["languages"] }) {
  return (
    <section className="mt-5 px-2">
      <Header>{local.header}</Header>
      <div className="mt-1 md:mt-3 md:ml-3">
        <h2
          className="text-xs md:text-base text-text rtl:leading-loose opacity-80"
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

      <Divider />
    </section>
  );
}

export default Languages;
