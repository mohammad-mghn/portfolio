"use client";

import React, { useState } from "react";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import NavLink from "./navLink";
import NavbarResponsive from "./responsive";

import { socials } from "@/data/social";

import { VIcon } from "@/../public";
import { MenuIcon } from "@/../public/icons";

import { styles } from "@/styles";
import { localType } from "@/types/local";

function Navbar({ local }: { local: localType["navbar"] }) {
  const links = [
    { path: "/", title: local.links.home },
    {
      path: "/about",
      title: local.links.about,
    },
    {
      path: "/contact",
      title: local.links.contact,
    },
    {
      path: "/projects",
      title: local.links.projects,
    },
    {
      path: socials.devto,
      title: local.links.blog,
    },
  ];

  const otherLangPath: `/${string}` = `/${local.other_lang.toLocaleLowerCase()}`;

  const path = usePathname();

  const [responsiveNavbar, setResponsiveNavbar] = useState(false);

  const responsiveNavbarHandler = () => {
    setResponsiveNavbar((prevValue) => !prevValue);
  };

  return (
    <>
      <nav
        className={`fixed top-4 sm:top-6 left-[50%] translate-x-[-50%] h-14 w-full max-w-[calc(100%-1.75rem)] md:max-w-[calc(100%-6rem)] xl:max-w-[80rem] px-3 mx-auto flex items-center justify-between rounded-lg border-2 border-border-darker z-10 ${styles.box}`}
      >
        <div className="flex items-center gap-x-4">
          <Link href={`/${local.lang}`}>
            <Image src={VIcon} alt="vito logo" className="w-10" />
          </Link>

          <ul className="hidden md:flex gap-x-3">
            {links.map((item) => (
              <NavLink
                item={item}
                path={path}
                key={item.title}
                lang={local.lang}
              />
            ))}
          </ul>
        </div>

        <Link
          href={otherLangPath}
          className="mr-2 hidden md:block text-lg text-text hover:text-brand transition-colors duration-300"
        >
          {local.other_lang}
        </Link>

        <button
          title="menu"
          className="md:hidden"
          onClick={responsiveNavbarHandler}
        >
          <Image src={MenuIcon} alt="menu icon" className="w-8" />
        </button>
      </nav>

      <NavbarResponsive
        path={path}
        links={links}
        lang={local.lang}
        otherLang={local.other_lang}
        otherLangPath={otherLangPath}
        responsiveNavbar={responsiveNavbar}
        responsiveNavbarHandler={responsiveNavbarHandler}
      />
    </>
  );
}

export default Navbar;
