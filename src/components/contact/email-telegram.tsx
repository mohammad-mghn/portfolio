"use client";

import Link from "next/link";

import { socials } from "@/data";

import { EmailIcon, TelegramIcon } from "../../../public/icons/socials";

function EmailAndTelegram() {
  return (
    <div className="mt-4 flex items-center justify-between sm:justify-center sm:gap-x-6">
      <button
        title="copy email address"
        className="flex rtl:flex-row-reverse items-center gap-1 sm:gap-2 social-svg lighter"
        onClick={() => {
          try {
            navigator.clipboard.writeText("vito.mohagheghian@gmail.com");

            alert("Email address copied into your clipboard! 🤙");
          } catch {
            window.open("mailto:vito.mohagheghian@gmail.com");
          }
        }}
      >
        <span className="w-4 sm:w-5">
          <EmailIcon />
        </span>

        <h1 className="text-[3.25vw] lg:text-base text-text">
          vito.mohagheghian@gmail.com
        </h1>
      </button>

      <Link
        target={"_blank"}
        href={socials.telegram}
        className="flex rtl:flex-row-reverse items-center gap-1 sm:gap-2 social-svg lighter"
      >
        <span className="w-4 sm:w-5">
          <TelegramIcon />
        </span>

        <h1 className="text-[3.45vw] lg:text-base text-text">hereisvito</h1>
      </Link>
    </div>
  );
}

export default EmailAndTelegram;
