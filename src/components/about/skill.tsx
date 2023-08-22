import React from "react";
import Link from "next/link";
import Image from "next/image";

import { SkillType } from "@/types/skill";

type Props = { skill: SkillType; index: number };

function Skill({ skill, index }: Props) {

  return (
    <Link
      href={""}
      className="p-1 pr-2 flex items-center gap-x-2 sm:gap-x-3 rounded-lg border-2 border-border-darker shadow-dark-200 group"
      aria-label="see projects"
      data-aos="fade-up"
      data-aos-delay={(50 * index).toString()}
    >
      <Image
        src={skill.icon}
        alt={skill.title}
        className="w-6 md:w-8 h-6 md:h-8 rounded-md"
      />
      <h3 className="text-text text-sm md:text-base group-hover:text-brand transition-colors duration-300">
        {skill.title}
      </h3>
    </Link>
  );
}

export default Skill;
