import { Metadata } from "next";

import Projects from "@/components/projects/projects";

export const metadata: Metadata = {
  keywords: ["Mohammad Mohagheghian projects", "محمد محققیان درباره"],
  description:
    "see mohammad mohagheghian projects a software engineer currently developing skills in Front-end",
};

function ProjectsPage() {
  return <Projects />;
}

export default ProjectsPage;
