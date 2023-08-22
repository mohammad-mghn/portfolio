import React from "react";

import Link from "next/link";

import { socials } from "@/data/social";

import {
  GithubIcon,
  InstagramIcon,
  LinkedInIcon,
  TwitterIcon,
} from "@/public/icons/socials";
import { useDictionary } from "@/dictionaries";
import { localType } from "@/types/local";

async function Footer({ local }: { local: localType["footer"] }) {
  return (
    <footer className="mb-5 flex items-center justify-between flex-col md:flex-row  gap-y-3">
      <h1 className="text-xs md:text-base text-text font-bold">
        {local.copyright} - {new Date().getFullYear()}
      </h1>

      <div className="flex items-center gap-x-4">
        <Link
          target={"_blank"}
          href={socials.linkedin}
          className="w-5 social-svg lighter"
        >
          <LinkedInIcon />
        </Link>
        <Link
          target={"_blank"}
          href={socials.github}
          className="w-5 social-svg lighter"
        >
          <GithubIcon />
        </Link>
        <Link
          target={"_blank"}
          href={socials.instagram}
          className="w-5 social-svg lighter"
        >
          <InstagramIcon />
        </Link>
        <Link
          target={"_blank"}
          href={socials.x}
          className="w-5 social-svg lighter"
        >
          <TwitterIcon />
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
