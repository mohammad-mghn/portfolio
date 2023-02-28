import { GithubIcon, InstagramIcon, TwitterIcon } from "@/public/icons/socials";
import { styles } from "@/styles";
import { project } from "@/types/project";
import React from "react";
import ProjectPreview from "./projectPreview";
import Sample from "../../public/project-sample.png";
function Projects() {
  const projects: project[] = [
    {
      media: [Sample, Sample],
      title: "Whether web app",
      date: "Edited on: Feb, 2023",
      tags: ["NextJs", "TailWindCSS", "TypeScript"],
      description: `My own portfolio and blog with projects, blog, about, contact, and home page. You can email me on the contact page, check my other social
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
          icon: InstagramIcon,
          link: "",
        },
      ],
    },
    {
      media: [Sample, Sample],
      title: "Whether web app",
      date: "Edited on: Feb, 2023",
      tags: ["NextJs", "TailWindCSS", "TypeScript"],
      description: `My own portfolio and blog with projects, blog, about, contact, and home page. You can email me on the contact page, check my other social media, check my projects with a , check my projects with a  , check my projects with a   projects with a  projects with a  projects with a  ojects, blog, about, contact, and home page. You can email me on the contact
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
          icon: InstagramIcon,
          link: "",
        },
      ],
    },
    {
      media: [Sample, Sample],
      title: "Whether web app",
      date: "Edited on: Feb, 2023",
      tags: ["NextJs", "TailWindCSS", "TypeScript"],
      description: `My own portfolio and blog with projects, blog, about, contact, and home page. You can email me on the contact page, check my other social media, check my projects with a , check my projects with a  , check my projects with a   projects with a  projects with a  projects with a  ojects, blog, about, contact, and home page. You can email me on the contact
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
          icon: InstagramIcon,
          link: "",
        },
      ],
    },
    {
      media: [Sample, Sample],
      title: "Whether web app",
      date: "Edited on: Feb, 2023",
      tags: ["NextJs", "TailWindCSS", "TypeScript"],
      description: `My own portfolio and blog with projects, blog, about, contact, and home page. You can email me on the contact page, check my other social media, check my projects with a , check my projects with a  , check my projects with a   projects with a  projects with a  projects with a  ojects, blog, about, contact, and home page. You can email me on the contact
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
          icon: InstagramIcon,
          link: "",
        },
      ],
    },
    {
      media: [Sample, Sample],
      title: "Whether web app",
      date: "Edited on: Feb, 2023",
      tags: ["NextJs", "TailWindCSS", "TypeScript"],
      description: `My own portfolio and blog with projects, blog, about, contact, and home page. You can email me on the contact page, check my other social media, check my projects with a , check my projects with a  , check my projects with a   projects with a  projects with a  projects with a  ojects, blog, about, contact, and home page. You can email me on the contact
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
          icon: InstagramIcon,
          link: "",
        },
      ],
    },
    {
      media: [Sample, Sample],
      title: "Whether web app",
      date: "Edited on: Feb, 2023",
      tags: ["NextJs", "TailWindCSS", "TypeScript"],
      description: `My own portfolio and blog with projects, blog, about, contact, and home page. You can email me on the contact page, check my other social media, check my projects with a , check my projects with a  , check my projects with a   projects with a  projects with a  projects with a  ojects, blog, about, contact, and home page. You can email me on the contact
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
          icon: InstagramIcon,
          link: "",
        },
      ],
    },
  ];

  return (
    <>
      <section className="md:px-2">
        <div className="md:ml-3 mt-5 flex flex-wrap flex-col lg:flex-row justify-center items-center gap-4">
          {projects.map((item: project, index: number) => (
            <ProjectPreview {...item} key={index} />
          ))}
        </div>
      </section>

      <div className={styles.divider} />

      
    </>
  );
}

export default Projects;
