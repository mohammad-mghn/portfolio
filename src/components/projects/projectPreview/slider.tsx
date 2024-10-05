"use client";

import Link from "next/link";
import Image from "next/image";
import SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import { generateRandomNum } from "@/modules";

SwiperCore.use([Autoplay, Navigation]);

type Props = {
  media: any[];
  link: string;
};

function Slider({ media, link }: Props) {
  return (
    <Swiper
      speed={750}
      loop={true}
      cssMode={true}
      keyboard={true}
      navigation={true}
      pagination={true}
      modules={[Navigation]}
      className="swiper !h-[14rem]"
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
            <Image
              src={item}
              width={360}
              height={260}
              className="max-w-[90%] max-h-[14rem]"
              alt="Mohammad Mohagheghian project preview"
            />
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default Slider;
