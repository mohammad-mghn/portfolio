/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation, Autoplay } from "swiper/modules";

import { generateRandomNum } from "@/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type Props = {
  media: any[];
  link: string;
};

SwiperCore.use([Autoplay, Navigation]);

function Slider({ media, link }: Props) {
  return (
    <Swiper
      speed={750}
      loop={true}
      cssMode={true}
      keyboard={true}
      navigation={true}
      pagination={true}
      className="swiper !h-[14rem]"
      modules={[Navigation]}
      autoplay={{
        disableOnInteraction: true,
        delay: generateRandomNum(8000, 3000),
      }}
    >
      {media.map((item, index) => (
        <SwiperSlide
          className="!flex !items-center !justify-center !h-[14rem]"
          key={index}
        >
          <Link
            href={link}
            className={"mx-auto flex items-center justify-center w-full"}
          >
            <img
              src={item}
              alt=""
              className="max-w-[90%] max-h-[14rem]"
              loading="lazy"
            />
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default Slider;
