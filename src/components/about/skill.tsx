import Image from "next/image";

import { SkillType } from "@/types";

type Props = { skill: SkillType; index: number };

function Skill({ skill, index }: Props) {
  return (
    <div
      className="p-1 pr-2 flex items-center gap-x-2 sm:gap-x-3 rounded-lg border-2 border-border-darker shadow-dark-200 group"
      data-aos="fade-up"
      aria-label="see projects"
      data-aos-delay={"150"}
      data-aos-duration={"750"}
      data-aos-once={true}
    >
      <Image
        src={skill.icon}
        alt={skill.title}
        className="w-6 md:w-8 h-6 md:h-8 rounded-md"
      />
      <h3 className="text-text group-hover:text-brand text-sm md:text-base transition-colors duration-300">
        {skill.title}
      </h3>
    </div>
  );
}

export default Skill;
