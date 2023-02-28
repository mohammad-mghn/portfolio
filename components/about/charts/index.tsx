import { ChartType } from "@/types/chart";
import React from "react";

import ChartSection from "./section";

function Charts() {
  return (
    <>
      <ChartSection
        header="Skills"
        data={[
          { title: "ReactJs", value: 80 },
          { title: "NextJs", value: 90 },
          { title: "JavaScript", value: 75 },
          { title: "TypeScript", value: 90 },
          { title: "HTML/CSS", value: 85 },
          { title: "TailWindCSS", value: 80 },
          { title: "Sass", value: 95 },
          { title: "MongoDB", value: 30 },
          { title: "ReduxJS", value: 80 },
          { title: "Git", value: 50 },
        ]}
      />

      <ChartSection
        header="Languages"
        data={[
          { title: "Farsi - Persian", value: 100 },
          { title: "English", value: 80 },
        ]}
      />

      <ChartSection
        header="Tools"
        data={[
          { title: "VS Code", value: 100 },
          { title: "Brave", value: 100 },
          { title: "Gmail", value: 100 },
          { title: "Windows 11", value: 90 },
          { title: "Bash", value: 90 },
          { title: "Figma", value: 75 },
          { title: "Github", value: 95 },
          { title: "Spotify", value: 95 },
          { title: "Postman", value: 90 },
          { title: "Microsoft todo", value: 80 },
          { title: "Spline", value: 60 },
          { title: "DevTo", value: 95 },
          { title: "StackOverFlow", value: 75 },
        ]}
      />
    </>
  );
}

export default Charts;
