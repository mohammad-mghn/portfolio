"use client";

import Image from "next/image";
import React, { useState } from "react";
import { usePathname } from "next/navigation";

import NavLink from "./navLink";
import NavbarResponsive from "./responsive";

import { VIcon } from "@/public";
import { styles } from "@/styles";
import { FarsiIcon, LightIcon, MenuIcon } from "@/public/icons";

function Navbar() {
  const path = usePathname();

  const [responsiveNavbar, setResponsiveNavbar] = useState(false);

  const responsiveNavbarHandler = (e: any) => {
    setResponsiveNavbar((prevValue) => !prevValue);
  };

  const links = [
    { path: "/", title: "Home" },
    {
      path: "/about",
      title: "About",
    },
    {
      path: "/contact",
      title: "Contact",
    },
    {
      path: "/projects",
      title: "Projects",
    },
    {
      path: "https://dev.to/vitomohagheghian",
      title: "Blog",
    },
  ];

  return (
    <>
      <nav
        className={`fixed top-6 left-[50%] translate-x-[-50%]
                    h-14 w-full 
                    max-w-[calc(100%-3rem)] md:max-w-[calc(100%-6rem)] xl:max-w-[80rem] 
                    px-3 mx-auto
                    flex items-center justify-between 
                    rounded-lg border-2 border-border-darker
                    z-10
                    ${styles.box}`}
      >
        <div className="flex items-center gap-x-4">
          <Image src={VIcon} alt="vito logo" className="w-10" />

          <ul className="hidden md:flex gap-x-3">
            {links.map((item) => (
              <NavLink item={item} path={path} key={item.title} />
            ))}
          </ul>
        </div>

        <div className="items-center hidden md:flex gap-x-3">
          <button className="w-5">
            <Image src={FarsiIcon} alt="language icon" />
          </button>
          <button className="w-5">
            <Image src={LightIcon} alt="language icon" />
          </button>
        </div>

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
