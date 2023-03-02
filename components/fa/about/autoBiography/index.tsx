import React from "react";

import Detail from "./detail";

import { styles } from "@/styles";

function AutoBiography() {
  return (
    <>
      <section className="px-2 flex items-center justify-between flex-col lg:flex-row">
        <div className="w-full lg:w-[70%]">
          <h1 className="text-secondary text-2xl font-semibold">خود زندگینامه</h1>

          <p className="mt-4 md:px-3 text-text text-sm lg:text-base text-justify leading-relaxed opacity-80">
            لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون
            بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع
            با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه
            و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ
            پیشرو در زبان فارسی ایجاد کرد. در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و
            شرایط سخت تایپ به پایان رسد وزمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای
            موجود طراحی اساسا مورد استفاده قرار گیرد. لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با
            استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای
            شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارها اصلی و جوابگوی سوالات پیوسته اهل دنیای
            موجود طراحی اساسا مورد استفاده قرار گیرد.
          </p>
        </div>

        <div className="my-6 lg:my-0 h-1 w-full lg:h-[16rem] lg:w-1 bg-border rounded-lg" />

        <div className="w-full lg:w-[25%]">
          <h2 className="mb-2 text-secondary text-2xl font-semibold">جزئیات</h2>

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
