import Link from "next/link";

import { socials } from "@/data";

import {
  GithubIcon,
  XIcon,
  LinkedInIcon,
  InstagramIcon,
} from "@/../public/icons/socials";

import { localType } from "@/types";

async function Footer({ local }: { local: localType["footer"] }) {
  const socialsMediasLinks = [
    {
      link: socials.linkedin,
      icon: LinkedInIcon,
    },
    {
      link: socials.github,
      icon: GithubIcon,
    },
    {
      link: socials.instagram,
      icon: InstagramIcon,
    },
    {
      link: socials.x,
      icon: XIcon,
    },
  ];

  return (
    <footer className="mb-5 px-6 md:px-12 mx-auto xl:max-w-[85rem] flex items-center justify-between flex-col md:flex-row gap-y-3">
      <h1 className="text-xs md:text-base text-text font-bold">
        {local.copyright} - <span>{new Date().getFullYear()}</span>
      </h1>

      <div className="flex items-center gap-x-4">
        {socialsMediasLinks.map((socialMedia, index) => (
          <Link
            key={index}
            target={"_blank"}
            href={socialMedia.link}
            className="w-5 social-svg lighter"
          >
            <socialMedia.icon />
          </Link>
        ))}
      </div>
    </footer>
  );
}

export default Footer;
