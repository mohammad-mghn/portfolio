"use client";

import React from "react";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Autoplay } from "swiper";

import { generateRandomNum } from "@/modules/generateRandomNum";

import "swiper/swiper.min.css";
import "swiper/swiper-bundle.css";
import "swiper/swiper-bundle.min.css";

type Props = {
  media: any[];
};

SwiperCore.use([Autoplay, Navigation]);

function Slider({ media }: Props) {
  return (
    <Swiper
      speed={750}
      loop={true}
      cssMode={true}
      keyboard={true}
      navigation={true}
      pagination={true}
      className="swiper"
      modules={[Navigation]}
      autoplay={{
        disableOnInteraction: true,
        delay: generateRandomNum(8000, 3000),
      }}
    >
      {media.map((item, index) => (
        <SwiperSlide className="!flex !items-center !justify-center" key={index}>
          <img src={item} alt="" className="max-w-[75%] md:max-w-[80%] h-[13rem]" loading="lazy" />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default Slider;
