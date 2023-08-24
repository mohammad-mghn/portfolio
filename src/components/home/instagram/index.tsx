import Link from "next/link";

import InstagramSlider from "./slider";
import { Header, Divider } from "@/components/common";

import { socials } from "@/data";

import { styles } from "@/styles";

import { localType } from "@/types";

function Instagram({ local }: { local: localType["instagram"] }) {
  return (
    <>
      <section className="px-2">
        <Header>{local.header}</Header>

        <h2
          className="md:mt-3 rtl:mt-3 ml-3 text-xs md:text-base text-text rtl:leading-loose opacity-80"
          data-aos="fade-up"
        >
          {local.description}{" "}
          <Link href={socials.instagram} className="text-brand">
            @{local.id}
          </Link>
        </h2>

        <div className="mt-5 relative flex flex-col md:flex-row items-center justify-center gap-3 flex-wrap snap-x">
          <InstagramSlider />
        </div>

        <Link
          href={socials.instagram}
          className={`mx-auto my-8 px-4 py-2 md:px-6 md:py-3 w-fit border-[3px] border-brand ${styles.button}`}
        >
          {local.check_my_page}
        </Link>
      </section>

      <Divider />
    </>
  );
}

export default Instagram;
