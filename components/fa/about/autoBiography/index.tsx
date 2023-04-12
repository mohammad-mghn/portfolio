import React from "react";

import Detail from "./detail";

import { styles } from "@/styles";
import Header from "@/components/elements/header";

function AutoBiography() {
  return (
    <>
      <section className="px-2 flex items-center justify-between flex-col lg:flex-row">
        <div className="w-full lg:w-[70%]">
          <Header>خود زندگینامه</Header>

          <p className="mt-4 md:px-3 text-text text-sm lg:text-base text-justify leading-relaxed opacity-80"> من محمد محققیان هستم، اما معمولاً من را ویتو  محققیان صدا می زنند و من یک توسعه دهنده وب جوان هستم و به دنبال
            یافتن تیم توسعه هستم. من یک کدنویس و برنامه نویس ماهر هستم و از استفاده از مهارت هایم برای کمک به پیشرفت های
            فن آوری هیجان انگیز و تبدیل ایده ها به واقعیت لذت می برم. من 16 ساله هستم، بنابراین در دبیرستان درس می
            خوانم. در دوران مدرسه، توسعه وب و همچنین جاوا اسکریپت را یاد گرفتم. در حال حاضر، من در اصفهان، ایران زندگی
            می کنم، زیرا در آنجا متولد شده ام. با اینکه تجربه کوتاهی دارم، اما سعی کردم تا جایی که می‌توانم این تجربه را
            مفید کنم. داستان من: در سال 2020، یکی از دوستانم تماس گرفت و شروع به صحبت در مورد برنامه نویسی و پایتون کرد،
            من همیشه به برنامه نویسی علاقه داشتم، بنابراین فقط در مورد Python جستجو کردم و بعد از مدتی Flax را به عنوان
            پشتیبان یاد گرفتم- فریم ورک end مقدمه ای برای جنگو است، با این حال، من در سبک و رابط کاربری اشتیاق بیشتری
            داشتم، بنابراین پس از یادگیری HTML، CSS، و Js، React و Next.js به یک توسعه دهنده front-end تبدیل شدم. من به
            Redux نیز علاقه مند هستم، بنابراین در برنامه های من است.
          </p>
        </div>

        <div className="my-6 lg:my-0 h-1 w-full lg:h-[16rem] lg:w-1 bg-border rounded-lg" />

        <div className="w-full lg:w-[25%]">
          <Header>جزئیات</Header>

          <Detail title="اسم مستعار" value="ویتو - Vito" />
          <Detail title="محل زندگی" value="اصفهان, ایران, اسیا, زمین" />
          <Detail title="اسم" value="محمد محققیان" />
        </div>
      </section>

      <div className={styles.divider} />
    </>
  );
}

export default AutoBiography;
