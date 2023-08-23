import React from "react";
import { Metadata } from "next";

import Projects from "@/components/projects/projects";

export const metadata: Metadata = {
  title: "Vito Mohagheghian • Projects",
};

function ProjectsPage() {
  return <Projects />;
}

export default ProjectsPage;
