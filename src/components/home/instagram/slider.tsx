"use client";

import Link from "next/link";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";

import { socials } from "@/data";
import { generateRandomNum } from "@/modules";

import { FirstPost, SercondPost, ThirdPost } from "@/../public/instagram-posts";

function InstagramSlider() {
  return (
    <section>
      <Swiper
        loop
        speed={500}
        slidesPerView={"auto"}
        className="relative swiper"
        pagination={{
          clickable: true,
        }}
        autoplay={{
          disableOnInteraction: true,
          delay: generateRandomNum(4000, 8000),
        }}
      >
        <SwiperSlide className="px-3 !w-full sm:!w-[32.5%]">
          <Link
            href={socials.instagram}
            className="w-full flex items-center justify-center"
          >
            <Image
              src={FirstPost}
              alt="vito.mohagheghian instagram post"
              className="w-full h-full border-2 border-border-darker rounded-lg shadow-dark-400 shrink-0 snap-center"
            />
          </Link>
        </SwiperSlide>
        <SwiperSlide className="px-3 !w-full sm:!w-[32.5%]">
          <Link
            href={socials.instagram}
            className="w-full flex items-center justify-center"
          >
            <Image
              src={SercondPost}
              alt="vito.mohagheghian instagram post"
              className="w-full h-full border-2 border-border-darker rounded-lg shadow-dark-400 shrink-0 snap-center"
            />
          </Link>
        </SwiperSlide>
        <SwiperSlide className="px-3 !w-full sm:!w-[32.5%]">
          <Link
            href={socials.instagram}
            className="w-full flex items-center justify-center"
          >
            <Image
              src={ThirdPost}
              alt="vito.mohagheghian instagram post"
              className="w-full h-full border-2 border-border-darker rounded-lg shadow-dark-400 shrink-0 snap-center"
            />{" "}
          </Link>
        </SwiperSlide>
      </Swiper>
    </section>
  );
}

export default InstagramSlider;
