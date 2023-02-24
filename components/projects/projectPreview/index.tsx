import React from "react";

import Slider from "./slider";

import { project } from "@/types/project";

import "swiper/swiper.min.css";
import "swiper/swiper-bundle.css";
import "swiper/swiper-bundle.min.css";
import Link from "next/link";
import Image from "next/image";

function ProjectPreview({ title, media, date, description, links, tags }: project) {
  return (
    <div className="rounded-lg border-2 border-border-darker overflow-hidden">
      <div className="h-64 flex items-center justify-center bg-gradient-to-b from-brand to-transparent">
        <Slider media={media} />
      </div>

      <div className="mt-2 ml-3 pb-5">
        <div className="pr-3 flex items-center gap-x-2">
          <span className="inline-block h-5 w-1 bg-brand rounded-lg" />
          <h1 className="text-text text-lg font-semibold three-dots">{title}</h1>
        </div>

        <div className="pt-1 px-3">
          <p className="pr-1 h-36 overflow-y-auto text-justify text-sm text-text opacity-90 customize-scrollbar">
            {description} sdf sdfsdfsdf sdf sdf sd fsf sd sdf sdfsdf sdf sdf sdf
          </p>

          <div className="mt-2 relative flex items-center gap-x-2 overflow-hidden">
            {tags.map((item, index) => (
              <div className="flex items-center gap-x-2" key={index}>
                <span className="inline-block h-4 w-1 bg-darker-text rounded-lg" />
                <span className="text-darker-text text-xs font-bold">{item}</span>
              </div>
            ))}
            <span className="inline-block absolute right-0 w-5 h-4 bg-gradient-to-r from-transparent to-primary" />
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-x-2">
              {links.map((item, index) => (
                <Link href={item.link} key={index}>
                  <Image src={item.icon} alt="" />
                </Link>
              ))}
            </div>

            <time className="text-darker-text text-xs font-semibold">{date}</time>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectPreview;
