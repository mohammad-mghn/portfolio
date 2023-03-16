"use client";

import React, { useRef, useState } from "react";

import Link from "next/link";
import Image from "next/image";

import Input from "./input";
import Header from "@/components/elements/header";

import emailjs from "emailjs-com";

import { socials } from "@/data/social";

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

import { MapImage } from "@/public";

import { styles } from "@/styles";

function Contact() {
  // for getting data from form tag
  const form: any = useRef();

  const sendEmail = (e: any) => {
    e.preventDefault();
    if (
      form.current![0].value !== "" &&
      form.current![1].value !== "" &&
      form.current![2].value !== "" &&
      form.current![3].value !== ""
    ) {
      // setNotification("Email sent successfully.");
      emailjs.sendForm("service_a0qmb0i", "template_ik1gq7f", form.current, "user_O2XZdT1Nlt7VuHJBaXWyF").then(
        (result) => {
          if (result.text === "OK") {
            form.current[1].value = "";
            form.current[3].value = "";
            // setNotification("Email sent successfully.");
          } else {
            // setNotification("Sorry, Email didn't send turn on VPN");
          }
        },
        () => {
          // setNotification("Sorry, Email didn't send turn on VPN");
        }
      );
    } else {
      // setNotification("Please fill out all inputs.");
    }
  };

  return (
    <>
      <section className="px-2">
        <Header>باهم در تماس باش</Header>

        <h2 className="mt-3 ml-3 text-xs md:text-lg text-text opacity-80">
          لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون
          بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است{" "}
        </h2>
        <div className="md:ml-3">
          <div className="mt-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-y-8">
            <form className="md:w-[26rem] flex flex-wrap gap-x-4 gap-y-2" ref={form}>
              <Input type="text" name="title" label="عنوان" placeholder="م.ث: من میخوام..." />
              <Input type="text" name="from_name" label="اسم" placeholder="م.ث: علی حاجی پور" />
              <Input type="email" name="from_email" label="ایمیل" placeholder="e.g: vito.mohagheghian@gmail.com" />
              <label htmlFor="text" className="block text-text">
                متن
              </label>
              <textarea
                id="text"
                name="message"
                className="py-2 px-3 w-full min-h-[15rem] text-md text-text placeholder:text-darker-text rounded-lg bg-[#3D3D3D40] outline-none"
                placeholder="م.ث: چند روزه که ..."
              />
              <button title="ارسال" className={`mt-2 w-full py-3 flex justify-center ${styles.button}`} onClick={sendEmail}>
                ارسال
              </button>
            </form>

            <div className="w-full md:w-[40%] ltr">
              <Image src={MapImage} alt="map image" />

              <div className="mt-4 flex items-center justify-between sm:justify-center sm:gap-x-5">
                <button
                title="کپی ادرس ایمیل"
                  className="flex items-center gap-1 sm:gap-2 social-svg lighter"
                  onClick={() => {
                    try {
                      navigator.clipboard.writeText("vito.mohagheghian@gmail.com");
                      alert("ادرس ایمیل در کلیپبورد شما کپی شد! 🤙");
                    } catch {
                      window.open("mailto:vito.mohagheghian@gmail.com");
                    }
                  }}
                >
                  <span className="w-4 sm:w-5">
                    <EmailIcon />
                  </span>

                  <h1 className="text-[.8rem] lg:text-[.95rem] text-text">vito.mohagheghian@gmail.com</h1>
                </button>

                <Link
                  target={"_blank"}
                  href={socials.telegram}
                  className="flex items-center gap-1 sm:gap-2 social-svg lighter"
                >
                  <span className="w-4 sm:w-5">
                    <TelegramIcon />
                  </span>

                  <h1 className="text-[.8rem] lg:text-[.95rem] text-text">Hereisvito</h1>
                </Link>
              </div>

              <div className="mt-2 flex items-center justify-between sm:justify-center sm:gap-x-6">
                <span className="inline-block h-5 w-1 bg-brand rounded-lg" />

                <Link target={"_blank"} href={socials.linkedin} className="w-5 social-svg lighter">
                  <LinkedInIcon />
                </Link>
                <Link target={"_blank"} href={socials.github} className="w-5 social-svg lighter">
                  <GithubIcon />
                </Link>
                <Link target={"_blank"} href={socials.codewars} className="w-5 social-svg lighter">
                  <CodewarsIcon />
                </Link>
                <Link target={"_blank"} href={socials.instagram} className="w-5 social-svg lighter">
                  <InstagramIcon />
                </Link>
                <Link target={"_blank"} href={socials.devto} className="w-5 social-svg lighter">
                  <DevToIcon />
                </Link>
                <Link target={"_blank"} href={socials.twitter} className="w-5 social-svg lighter">
                  <TwitterIcon />
                </Link>
                <Link target={"_blank"} href={socials.stackoverflow} className="w-5 social-svg lighter">
                  <StackoverflowIcon />
                </Link>
                <Link target={"_blank"} href={socials.discord} className="w-5 social-svg lighter">
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
