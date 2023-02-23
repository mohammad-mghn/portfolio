"use client";

import React from "react";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Keyboard, Autoplay } from "swiper";

import Sample from "../../public/project-sample.png";

import "swiper/swiper.min.css";
import "swiper/swiper-bundle.css";
import "swiper/swiper-bundle.min.css";

SwiperCore.use([Autoplay, Navigation]);

function ProjectPreview() {
  const generateRandom = (maxLimit = 8000, minLimit = 3000) => {
    // generate a floating number which is in range of 1 to 0
    // to so to make it between zero to our maximum limit multiply it to our maximum number.
    let randomNum = Math.random() * maxLimit;

    // but still it's floating, so floor method makes it integer number which is needed
    // however floating is cool but to for css processing.
    randomNum = Math.floor(randomNum);

    if (randomNum < minLimit) {
      return minLimit;
    }

    return randomNum;
  };

  return (
    <div className="h-[28rem] rounded-lg border-2 border-border-darker overflow-hidden">
      <div className="h-64 flex items-center justify-center bg-gradient-to-b from-brand to-transparent">
        {/* <Image src={Sample} alt="" className=" w-fit h-fit" /> */}
        <Swiper
          cssMode={true}
          navigation={true}
          pagination={true}
          keyboard={true}
          modules={[Navigation, Keyboard]}
          className="swiper"
          // loop={true}
          // autoplay={{
          //   delay: generateRandom(7000, 4000),
          //   disableOnInteraction: true,
          // }}
        >
          <SwiperSlide>
            <Image src={Sample} alt="" />
          </SwiperSlide>
          <SwiperSlide>
            <Image src={Sample} alt="" />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
}

export default ProjectPreview;
