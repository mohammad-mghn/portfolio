import Link from "next/link";

import { socials } from "@/data";

import { styles } from "@/styles";
import Header from "@/components/common/header";
import { localType } from "@/types";
import { Divider } from "@/components/common";

function Support({ local }: { local: localType["support"] }) {
  return (
    <>
      <section className="px-2 pb-3">
        <Header>{local.header}</Header>

        <div className="mt-3 ml-3 space-y-4">
          <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between flex-wrap gap-x-2 gap-y-4">
            <h2
              className="text-sm md:text-xl text-text opacity-80"
              data-aos="fade-right"
            >
              {local.buy_me_a_coffee}
            </h2>

            <Link
              target={"_blank"}
              href={socials.buyMeACoffee}
              className={`${styles.button} px-4 py-2 md:px-6 md:py-3 border-[3px] border-brand`}
              data-aos="fade-left"
            >
              {local.coffee_be_de_button}
            </Link>
          </div>
          <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between flex-wrap gap-x-2 gap-y-4">
            <h2
              className="text-sm md:text-xl text-text opacity-80"
              data-aos="fade-right"
            >
              {local.tether}
            </h2>

            <Link
              target="_blank"
              href={socials.wallet}
              className={`${styles.button} px-4 py-2 md:px-6 md:py-3 border-[3px] border-brand`}
              data-aos="fade-left"
            >
              {local.wallet_address}
            </Link>
          </div>
        </div>
      </section>

      <Divider />
    </>
  );
}

export default Support;
