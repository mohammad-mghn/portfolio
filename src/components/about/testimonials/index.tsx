import React from "react";

import TestimonialsSlider from "./slider";
import Header from "@/components/elements/header";

import { styles } from "@/styles";
import { localType } from "@/types/local";

function Testimonials({ local }: { local: localType["testimonials"] }) {
  return (
    <section className="px-2">
      <Header>{local.header}</Header>
      <div className="mt-1 md:mt-3 md:ml-3">
        <h2
          className="text-xs md:text-base text-text opacity-80"
          data-aos="fade-up"
        >
          {local.description}
          <span className="text-darker-text select-none">
            {" - "} {local.pov}
          </span>
        </h2>

        <div className="mt-4">
          <TestimonialsSlider />
        </div>
      </div>
      <div className={styles.divider} />
    </section>
  );
}

export default Testimonials;
