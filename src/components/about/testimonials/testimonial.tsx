import React from "react";
import Link from "next/link";

import { testimonialType } from "@/types/testimonails";

function Testimonial({ link, name, text, socialMedia }: testimonialType) {
  return (
    <div
      className="p-3 rounded-lg border-2 border-border-darker shadow-dark-200"
      data-aos="zoom-out-up"
    >
      <Link
        href={link}
        className="text-text text-xs sm:text-sm opacity-70 hover:text-brand hover:opacity-100 transition-colors duration-300"
      >
        {socialMedia}
      </Link>

      <Link
        href={link}
        className="mt-2 max-w-xs block text-text text-sm sm:text-base opacity-80 hover:text-brand hover:opacity-100 transition-colors duration-300 overflow-hidden text-ellipsis whitespace-nowrap"
      >
        {name}
      </Link>

      <p className="mt-3 text-text">
        <span className="mr-2 translate-y-1 inline-block h-5 w-1 bg-brand rounded-lg" />
        <span className="-pt-4 text-base sm:text-base">{text}</span>
      </p>
    </div>
  );
}

export default Testimonial;
