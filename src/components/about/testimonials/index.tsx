import TestimonialsSlider from "./slider";
import { Header, Divider } from "@/components/common";

import { localType } from "@/types";

function Testimonials({ local }: { local: localType["testimonials"] }) {
  return (
    <section className="px-2">
      <Header>{local.header}</Header>

      <div className="mt-1 rtl:mt-3 md:mt-3 md:ml-3">
        <h2
          className="text-xs md:text-base text-text rtl:leading-loose opacity-80"
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

      <Divider />
    </section>
  );
}

export default Testimonials;
