import React from "react";

import Link from "next/link";

import { socials } from "@/data/social";

import { GithubIcon, InstagramIcon, LinkedInIcon, TwitterIcon } from "@/public/icons/socials";

function Footer() {
  return (
    <footer className="mb-5 flex items-center justify-between flex-col md:flex-row">
      <h1 className="text-xs md:text-base text-text font-bold">
        © ساخته شده با ❤️ و کلی ☕ از 2020 - {new Date().getFullYear()}
      </h1>

      <div className="flex items-center gap-x-4">
        <Link href={socials.linkedin} className="w-5 social-svg lighter">
          <LinkedInIcon />
        </Link>
        <Link href={socials.github} className="w-5 social-svg lighter">
          <GithubIcon />
        </Link>
        <Link href={socials.instagram} className="w-5 social-svg lighter">
          <InstagramIcon />
        </Link>
        <Link href={socials.twitter} className="w-5 social-svg lighter">
          <TwitterIcon />
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
