"use client";

import React, { useState } from "react";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import NavLink from "./navLink";
import NavbarResponsive from "./responsive";

import { socials } from "@/data/social";

import { VIcon } from "@/public";
import { EnglishIcon, MenuIcon } from "@/public/icons";

import { styles } from "@/styles";

function Navbar() {
  const links = [
    { path: "/fa", title: "خانه" },
    {
      path: "/about/fa",
      title: "درباره",
    },
    {
      path: "/contact/fa",
      title: "تماس",
    },
    {
      path: "/projects/fa",
      title: "پروژه ها",
    },
    {
      path: socials.devto,
      title: "بلاگ",
    },
  ];

  const path = usePathname();

  const [responsiveNavbar, setResponsiveNavbar] = useState(false);

  const responsiveNavbarHandler = (e: any) => {
    setResponsiveNavbar((prevValue) => !prevValue);
  };

  return (
    <>
      <nav
        className={`fixed top-6 left-[50%] translate-x-[-50%]
                    h-14 w-full 
                    max-w-[calc(100%-1.75rem)] md:max-w-[calc(100%-6rem)] xl:max-w-[80rem] 
                    px-3 mx-auto
                    flex items-center justify-between 
                    rounded-lg border-2 border-border-darker
                    z-10
                    ${styles.box}`}
      >
        <div className="flex items-center gap-x-4">
          <Link href="/fa">
            <Image src={VIcon} alt="vito logo" className="w-10" />
          </Link>

          <ul className="hidden md:flex gap-x-4">
            {links.map((item) => (
              <NavLink item={item} path={path} key={item.title} />
            ))}
          </ul>
        </div>

        <Link href={"/"} className="w-5 hidden md:block">
          <Image src={EnglishIcon} alt="language icon" />
        </Link>

        <button className="md:hidden" onClick={responsiveNavbarHandler}>
          <Image src={MenuIcon} alt="menu icon" className="w-8" />
        </button>
      </nav>

      <NavbarResponsive
        path={path}
        links={links}
        responsiveNavbar={responsiveNavbar}
        responsiveNavbarHandler={responsiveNavbarHandler}
      />
    </>
  );
}

export default Navbar;
