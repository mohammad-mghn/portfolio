import React from "react";

import Github from "@/components/fa/home/github";
import { AboutLanding, AutoBiography, Charts } from "@/components/fa/about";

function Page() {
  return (
    <>
      <AboutLanding />

      <AutoBiography />

      <Charts />

      <Github />
    </>
  );
}

export default Page;
