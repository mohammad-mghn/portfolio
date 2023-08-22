"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import Testimonial from "./testimonial";

import { Pagination } from "swiper/modules";
import { testimonials } from "@/data/testimonials";

import "swiper/css";
import "swiper/css/pagination";

function TestimonialsSlider() {
  return (
    <section className="mt-10 ">
      <Swiper
        loop
        speed={500}
        spaceBetween={0}
        modules={[Pagination]}
        slidesPerView={"auto"}
        className="!pb-11 relative swiper"
        pagination={{
          clickable: true,
        }}
        breakpoints={{
          640: {
            spaceBetween: 20,
          },
        }}
      >
        {testimonials.map((item, index) => (
          <SwiperSlide
            className="px-4 sm:px-0 !w-fit !max-w-full sm:!w-[calc(50%-20px)]"
            key={index}
          >
            <Testimonial {...item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default TestimonialsSlider;
