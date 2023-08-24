import Image from "next/image";

import Form from "./form";
import SocialMedias from "./socialMedias";
import { Header, Divider } from "../common";
import EmailAndTelegram from "./email-telegram";

import { MapImage } from "@/../public";

import { localType } from "@/types";

function Contact({ local }: { local: localType["contact"] }) {
  return (
    <>
      <section className="px-2">
        <Header>{local.header}</Header>

        <h2
          className="mt-3 ml-3 text-xs md:text-base text-text rtl:leading-loose opacity-80"
          data-aos="fade-up"
        >
          {local.description}
        </h2>
        <div className="md:ml-3" data-aos="fade-right">
          <div className="mt-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-y-8">
            <Form local={local.form} />

            <div className="w-full md:w-[40%]" data-aos="fade-left">
              <Image src={MapImage} alt="map image" />

              <EmailAndTelegram />

              <SocialMedias />
            </div>
          </div>
        </div>
      </section>

      <Divider />
    </>
  );
}

export default Contact;
