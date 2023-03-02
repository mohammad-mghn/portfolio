import React from "react";
import Link from "next/link";
import Image from "next/image";

import NavLink from "./navLink";

import { CloseIcon, EnglishIcon } from "@/public/icons";

import { styles } from "@/styles";

type Props = {
  path: string | null;
  responsiveNavbar: boolean;
  responsiveNavbarHandler: (e: any) => void;
  links: { title: string; path: string }[];
};

function NavbarResponsive({ responsiveNavbar, responsiveNavbarHandler, links, path }: Props) {
  return (
    <>
      {responsiveNavbar && (
        <div className={`fixed top-0 left-0 w-full h-full md:hidden`} onClick={responsiveNavbarHandler} />
      )}

      {responsiveNavbar && (
        <nav
          className={`fixed left-0 w-36 py-10 h-full md:hidden flex flex-col items-center justify-between slide-in z-10 ${styles.box}`}
        >
          <button onClick={responsiveNavbarHandler}>
            <Image src={CloseIcon} alt="clsoe icon" className="w-7" />
          </button>

          <ul className="flex flex-col items-center gap-y-3">
            {links.map((item) => (
              <NavLink item={item} path={path} key={item.title} />
            ))}
          </ul>

          <Link href="/" className="w-5">
            <Image src={EnglishIcon} alt="language icon" />
          </Link>
        </nav>
      )}
    </>
  );
}

export default NavbarResponsive;
