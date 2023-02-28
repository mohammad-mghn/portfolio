"use client";

import { MapImage } from "@/public";
import {
  CodewarsIcon,
  DevToIcon,
  DiscordIcon,
  EmailIcon,
  GithubIcon,
  InstagramIcon,
  LinkedInIcon,
  StackoverflowIcon,
  TelegramIcon,
  TwitterIcon,
} from "@/public/icons/socials";
import { styles } from "@/styles";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Input from "./input";

function Contact() {
  return (
    <>
      <section className="px-2">
        <h1 className="text-secondary font-semibold text-2xl">Get in touch</h1>

        <h2 className="mt-3 ml-3 text-xs md:text-lg text-text opacity-80">
          I’m interested in freelance opportunities – especially ambitious or large projects. However, if you have other
          request or question, don’t hesitate to use the form.
        </h2>
        <div className="md:ml-3">
          <div className="mt-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-y-8">
            <form className="md:w-[26rem] flex flex-wrap gap-x-4 gap-y-2">
              <Input type="text" label="Subject" placeholder="e.g: I want to..." />
              <Input type="text" label="Name" placeholder="e.g: Vito Mohagheghian" />
              <Input type="email" label="E-mail" placeholder="e.g: vito.mohagheghian@gmail.com" />
              <label htmlFor="text" className="block text-text">
                Text
              </label>
              <textarea
                id="text"
                className="py-2 px-3 w-full min-h-[15rem] text-md text-text placeholder:text-darker-text rounded-lg bg-[#3D3D3D40] outline-none"
                placeholder="e.g: I made a pull request..."
              />
              <button className={`mt-2 w-full py-3 flex justify-center ${styles.button}`}>Send</button>
            </form>

            <div className="w-full md:w-[40%]">
              <Image src={MapImage} alt="map image" />

              <div className="mt-4 flex items-center justify-between sm:justify-center sm:gap-x-5">
                <button
                  className="flex items-center gap-1 sm:gap-2 social-svg lighter"
                  onClick={() => {
                    console.log("copied");
                  }}
                >
                  <span className="w-4 sm:w-5">
                    <EmailIcon />
                  </span>

                  <h1 className="text-[.8rem] lg:text-[.95rem] text-text">vito.mohagheghian@gmail.com</h1>
                </button>

                <Link href={""} className="flex items-center gap-1 sm:gap-2 social-svg lighter">
                  <span className="w-4 sm:w-5">
                    <TelegramIcon />
                  </span>

                  <h1 className="text-[.8rem] lg:text-[.95rem] text-text">Hereisvito</h1>
                </Link>
              </div>

              <div className="mt-2 flex items-center justify-between sm:justify-center sm:gap-x-6">
                <span className="inline-block h-5 w-1 bg-brand rounded-lg" />

                <Link href="" className="w-5 social-svg lighter">
                  <LinkedInIcon />
                </Link>
                <Link href="" className="w-5 social-svg lighter">
                  <GithubIcon />
                </Link>
                <Link href="" className="w-5 social-svg lighter">
                  <CodewarsIcon />
                </Link>
                <Link href="" className="w-5 social-svg lighter">
                  <InstagramIcon />
                </Link>
                <Link href="" className="w-5 social-svg lighter">
                  <DevToIcon />
                </Link>
                <Link href="" className="w-5 social-svg lighter">
                  <TwitterIcon />
                </Link>
                <Link href="" className="w-5 social-svg lighter">
                  <StackoverflowIcon />
                </Link>
                <Link href="" className="w-5 social-svg lighter">
                  <DiscordIcon />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.divider} />
    </>
  );
}

export default Contact;
