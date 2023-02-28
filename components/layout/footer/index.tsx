import React from "react";
import Link from "next/link";

import { GithubIcon, InstagramIcon, LinkedInIcon, TwitterIcon } from "@/public/icons/socials";

function Footer() {
  return (
    <footer className="mb-5 flex flex-col md:flex-row items-center justify-between">
      <h1 className="text-xs md:text-md text-text font-bold">
        © Made with ❤️ and lots of ☕ from 2020 - {new Date().getFullYear()}
      </h1>

      <div className="mt-2 flex items-center gap-x-4">
        <Link href="" className="w-5 social-svg lighter">
          <LinkedInIcon />
        </Link>
        <Link href="" className="w-5 social-svg lighter">
          <GithubIcon />
        </Link>
        <Link href="" className="w-5 social-svg lighter">
          <InstagramIcon />
        </Link>
        <Link href="" className="w-5 social-svg lighter">
          <TwitterIcon />
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
