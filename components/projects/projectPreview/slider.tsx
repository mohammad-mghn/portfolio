"use client";

import React from "react";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Keyboard, Autoplay } from "swiper";

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
      modules={[Navigation, Keyboard]}
      autoplay={{
        disableOnInteraction: true,
        delay: generateRandomNum(7500, 2500),
      }}
    >
      {media.map((item, index) => (
        <SwiperSlide className="!flex !items-center !justify-center" key={index}>
          <Image src={item} alt="" className="max-w-[75%] md:max-w-[80%] max-h-[13rem]" />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default Slider;
