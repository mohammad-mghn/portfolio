import Detail from "./autobiography/detail";
import { Header, Divider } from "@/components/common";

import { localType } from "@/types";

function AutoBiography({ local }: { local: localType["about"] }) {
  return (
    <>
      <section className="px-2 flex items-center justify-between flex-col lg:flex-row">
        <div
          className="w-full lg:w-[70%]"
          data-aos="zoom-in-down"
          data-aos-once="true"
        >
          <Header>{local.autobiography_header}</Header>

          <p
            className="mt-4 md:px-3 text-text text-sm lg:text-base text-justify leading-relaxed rtl:!leading-loose sm:rtl:!leading-relaxed opacity-80"
            data-aos="fade-up"
          >
            {local.autobiography}
          </p>
        </div>

        <div className="my-6 lg:my-0 h-1 w-full lg:h-[16rem] lg:w-1 bg-border rounded-lg" />

        <div
          className="w-full lg:w-[25%]"
          data-aos="zoom-in-left"
          data-aos-once="true"
        >
          <Header>{local.details_header}</Header>

          <Detail
            title={local.details.nick_name.header}
            value={local.details.nick_name.value}
          />
          <Detail
            title={local.details.location.header}
            value={local.details.location.value}
          />
          <Detail
            title={local.details.name.header}
            value={local.details.name.value}
          />
        </div>
      </section>

      <Divider />
    </>
  );
}

export default AutoBiography;
