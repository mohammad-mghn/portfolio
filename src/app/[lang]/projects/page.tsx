import { Metadata } from "next";

import Projects from "@/components/projects/projects";

export const metadata: Metadata = {
  keywords:
    "vito Mohagheghian projects, محمد محققیان درباره, ویتو محققیان درباره, mohammad mohagheghian projects",
  description:
    "see vito mohagheghian projects a software engineer currently developing skills in Front-end",
};

function ProjectsPage() {
  return <Projects />;
}

export default ProjectsPage;
