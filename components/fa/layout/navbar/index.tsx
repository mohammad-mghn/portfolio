"use client";

import React, { useState } from "react";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import NavLink from "./navLink";
import NavbarResponsive from "./responsive";

import { socials } from "@/data/social";

import { VIcon } from "@/public";
import { MenuIcon } from "@/public/icons";

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

        <Link href={"/"} className="ml-2 w-5 hidden md:block">
          <svg
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 group transition-all duration-300"
          >
            <g clip-path="url(#clip0_996_4)">
              <path
                className="text-darker-text group-hover:text-brand fill-current w-8 h-8"
                d="M6.56207 21C6.25807 21 6.02374 20.9177 5.85907 20.753C5.6944 20.5883 5.61207 20.354 5.61207 20.05V8.555C5.61207 8.251 5.6944 8.01667 5.85907 7.852C6.02374 7.68733 6.25807 7.605 6.56207 7.605H13.5541C13.7947 7.605 13.9784 7.66833 14.1051 7.795C14.2444 7.909 14.3141 8.08 14.3141 8.308C14.3141 8.54867 14.2444 8.73233 14.1051 8.859C13.9784 8.98567 13.7947 9.049 13.5541 9.049H7.32207V13.476H13.1551C13.3957 13.476 13.5794 13.5393 13.7061 13.666C13.8327 13.7927 13.8961 13.97 13.8961 14.198C13.8961 14.4387 13.8327 14.6223 13.7061 14.749C13.5794 14.863 13.3957 14.92 13.1551 14.92H7.32207V19.556H13.5541C13.7947 19.556 13.9784 19.6193 14.1051 19.746C14.2444 19.86 14.3141 20.0373 14.3141 20.278C14.3141 20.5187 14.2444 20.7023 14.1051 20.829C13.9784 20.943 13.7947 21 13.5541 21H6.56207ZM17.3719 21.133C17.1059 21.133 16.8969 21.057 16.7449 20.905C16.5929 20.753 16.5169 20.5313 16.5169 20.24V12.488C16.5169 12.1967 16.5929 11.9813 16.7449 11.842C16.8969 11.69 17.1059 11.614 17.3719 11.614C17.6379 11.614 17.8405 11.69 17.9799 11.842C18.1319 11.9813 18.2079 12.1967 18.2079 12.488V14.046L17.9989 13.761C18.2649 13.039 18.6955 12.4943 19.2909 12.127C19.8989 11.7597 20.5892 11.576 21.3619 11.576C22.1092 11.576 22.7235 11.709 23.2049 11.975C23.6862 12.241 24.0472 12.6463 24.2879 13.191C24.5286 13.7357 24.6489 14.426 24.6489 15.262V20.24C24.6489 20.5313 24.5729 20.753 24.4209 20.905C24.2815 21.057 24.0725 21.133 23.7939 21.133C23.5152 21.133 23.2999 21.057 23.1479 20.905C22.9959 20.753 22.9199 20.5313 22.9199 20.24V15.357C22.9199 14.5337 22.7615 13.932 22.4449 13.552C22.1282 13.172 21.6215 12.982 20.9249 12.982C20.1142 12.982 19.4619 13.2353 18.9679 13.742C18.4865 14.236 18.2459 14.9073 18.2459 15.756V20.24C18.2459 20.8353 17.9545 21.133 17.3719 21.133Z"
              />
            </g>
            <defs>
              <clipPath id="clip0_996_4">
                <rect width="30" height="30" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </Link>

        <button title="منو" className="md:hidden" onClick={responsiveNavbarHandler}>
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
