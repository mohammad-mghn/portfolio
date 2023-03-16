import Link from "next/link";

import Slider from "./slider";

import { project } from "@/types/project";

import "swiper/swiper.min.css";
import "swiper/swiper-bundle.css";
import "swiper/swiper-bundle.min.css";

function ProjectPreview({ title, media, date, description, links, tags }: project) {
  return (
    <div className="w-full md:w-[25rem] rounded-lg border-2 border-border-darker overflow-hidden shadow-dark hover:-mt-4 transition-all duration-700">
      <div className="py-4 md:py-5 max-h-64 flex items-center justify-center bg-gradient-to-b from-brand to-transparent">
        <Slider media={media} />
      </div>

      <div className="mt-2 ml-3 pb-3">
        <div className="pr-3 flex items-center gap-x-2">
          <span className="inline-block h-5 w-1 bg-brand rounded-lg" />
          <h1 className="text-text text-md md:text-lg font-semibold three-dots">{title}</h1>
        </div>

        <div className="pt-1 px-3">
          <p className="pr-1 h-fit md:h-24 overflow-y-auto text-justify text-xs md:text-sm text-text leading-5 opacity-90 customize-scrollbar">
            {description}
          </p>

          <div className="mt-3 relative flex items-center gap-x-2 overflow-hidden">
            {tags.map((item, index) => (
              <div className="flex items-center gap-x-2" key={index}>
                <span className="inline-block h-4 w-1 bg-darker-text rounded-lg" />
                <span className="text-darker-text text-[.65rem] md:text-xs font-bold whitespace-nowrap">{item}</span>
              </div>
            ))}
            <span className="inline-block absolute right-0 w-5 h-4 bg-gradient-to-r from-transparent to-primary" />
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-x-2">
              {links.map((item, index) => (
                <Link target={"_blank"} href={item.link} className="w-5 h-5 social-svg" key={index}>
                  <item.icon />
                </Link>
              ))}
            </div>

            <time className="text-darker-text text-[.65rem] md:text-xs font-semibold">{date}</time>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectPreview;
