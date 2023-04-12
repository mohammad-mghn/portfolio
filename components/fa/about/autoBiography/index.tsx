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

          <p className="mt-4 md:px-3 text-text text-sm lg:text-base text-justify leading-relaxed opacity-80">
            اسم من محمد محققیان است اما بیشتر مردم من را ویتو صدا می زنند. من یک توسعه دهنده وب جوان هستم که به دنبال
            پیوستن به یک تیم توسعه. من یک کدنویس و برنامه نویس ماهر هستم و از استفاده از مهارت هایم برای مشارکت در آن
            لذت می برم پیشرفت های فن آوری هیجان انگیز و تبدیل ایده ها به واقعیت. من در حال حاضر 17 سال دارم و در مقطع
            عالی تحصیل می کنم مدرسه در دوران مدرسه، توسعه وب و همچنین جاوا اسکریپت را یاد گرفتم. در حال حاضر ساکن اصفهان
            هستم ایران محل تولدم اگرچه تجربه محدودی دارم، اما سعی کردم از آن نهایت استفاده را ببرم. در سال 2020، یک از
            دوستانم با من تماس گرفتند و شروع به صحبت در مورد برنامه نویسی و پایتون کردند. من به برنامه نویسی علاقه داشتم
            من همیشه در مورد Python جستجو کردم و بعد از مدتی Flask را به عنوان یک فریم ورک back-end به عنوان یک فریمورک
            یاد گرفتم. آشنایی با جنگو با این حال، من بیشتر به سبک و رابط کاربری علاقه داشتم، بنابراین تبدیل به یک فرانت
            اند شدم توسعه دهنده پس از در حال حاضر من در حال یادگیری برخی از موضوعات پیشرفته JS و فن آوری های Front-end
            هستم.
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
