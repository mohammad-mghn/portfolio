import React from "react";

import { styles } from "@/styles";
import ProjectPreview from "./projectPreview";

function SelectedProjects() {
  return (
    <>
      <section className="px-2">
        <h1 className="text-secondary font-semibold text-2xl">Selected Projects</h1>

        <div className="ml-3 mt-3 grid grid-cols-3 gap-4">
          <ProjectPreview />
          <ProjectPreview />
          <ProjectPreview />
        </div>
      </section>

      <div className={styles.divider} />
    </>
  );
}

export default SelectedProjects;
