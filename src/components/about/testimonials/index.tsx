import React from "react";

import TestimonialsSlider from "./slider";
import Header from "@/components/elements/header";

import { styles } from "@/styles";

function Testimonials() {
  return (
    <section className="px-2">
      <Header>Hmmm, a little brag</Header>
      <div className="mt-1 md:mt-3 md:ml-3">
        <h2
          className="text-xs md:text-base text-text opacity-80"
          data-aos="fade-up"
        >
         Colleague&apos;s opinion about working with me in a FEW words.
          <span className="text-darker-text select-none">
            {" - "} swipe for more.
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
