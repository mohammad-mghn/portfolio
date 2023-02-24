import React from "react";

import ProjectPreview from "./projectPreview";

import { styles } from "@/styles";

import { project } from "@/types/project";

import Sample from "../../public/project-sample.png";
import { GithubIcon, instagramIcon, TwitterIcon } from "@/public/icons/socials";

function SelectedProjects() {
  const project: project = {
    media: [Sample, Sample],
    title: "Whether web app",
    date: "Edited on: Feb, 2023",
    tags: ["NextJs", "TailWindCSS", "TypeScript"],
    description: `My own portfolio and blog with projects, blog, about, contact, and home page. You can email me on the contact page, check my other social media, check my projects with a lot of features, review my skills, tools, and my language status, and you can use my own blog, too.
      My own portfolio and blog with projects, blog, about, contact, and home page. You can email me on the contact
      `,
    links: [
      {
        icon: GithubIcon,
        link: "",
      },
      {
        icon: TwitterIcon,
        link: "",
      },
      {
        icon: instagramIcon,
        link: "",
      },
    ],
  };

  return (
    <>
      <section className="px-2">
        <h1 className="text-secondary font-semibold text-2xl">Selected Projects</h1>

        <div className="ml-3 mt-3 grid grid-cols-3 gap-4">
          <ProjectPreview {...project} />
          <ProjectPreview {...project} />
          <ProjectPreview {...project} />
        </div>

        <button className={`${styles.button} mx-auto mt-8 px-7 py-3`}>See More</button>
      </section>

      <div className={styles.divider} />
    </>
  );
}

export default SelectedProjects;
