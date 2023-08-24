import Link from "next/link";

import { socials } from "@/data";

import {
  DevToIcon,
  GithubIcon,
  DiscordIcon,
  XIcon,
  CodeWarsIcon,
  LinkedInIcon,
  InstagramIcon,
  stackOverFlowIcon,
} from "../../../public/icons/socials";

function SocialMedias() {
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
      link: socials.codewars,
      icon: CodeWarsIcon,
    },
    {
      link: socials.instagram,
      icon: InstagramIcon,
    },
    {
      link: socials.devto,
      icon: DevToIcon,
    },
    {
      link: socials.x,
      icon: XIcon,
    },
    {
      link: socials.stackOverFlow,
      icon: stackOverFlowIcon,
    },
    {
      link: socials.discord,
      icon: DiscordIcon,
    },
  ];

  return (
    <div className="mt-3 flex items-center justify-between sm:justify-center sm:gap-x-6">
      <span className="inline-block h-6 w-1 bg-brand rounded-lg" />

      {socialsMediasLinks.map((socialMedia, index) => (
        <Link
          key={index}
          target={"_blank"}
          href={socialMedia.link}
          className="w-5 sm:w-[22px] social-svg lighter"
        >
          <socialMedia.icon />
        </Link>
      ))}
    </div>
  );
}

export default SocialMedias;
