import React from "react";
import Link from "next/link";

import Header from "@/components/elements/header";
import ProjectPreview from "../../projects/projectPreview/";

import { projects } from "@/data/projects";

import { styles } from "@/styles";

import { project } from "@/types/project";

function SelectedProjects() {
  return (
    <>
      <section className="md:px-2">
        <Header>پروژه ها انتخابی</Header>

        <div className="md:ml-3 mt-5 flex flex-wrap flex-col lg:flex-row justify-center items-center gap-4 ltr">
          {projects.slice(0, 6).map((item: project, index: number) => (
            <ProjectPreview {...item} key={index} />
          ))}
        </div>

        <Link
          href="/projects"
          aria-label="projets page"
          className={`${styles.button} mx-auto my-8 px-4 py-2 md:px-6 md:py-3 w-fit border-[3px] border-brand`}
        >
          دیدن بیشتر
        </Link>
      </section>

      <div className={styles.divider} />
    </>
  );
}

export default SelectedProjects;
