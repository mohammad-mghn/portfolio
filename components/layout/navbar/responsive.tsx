import React from "react";
import Image from "next/image";

import { styles } from "@/styles";
import { CloseIcon, FarsiIcon } from "@/public/icons";
import NavLink from "./navLink";

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
        <div className={`fixed top-0 right-0 w-full h-full md:hidden`} onClick={responsiveNavbarHandler} />
      )}

      {responsiveNavbar && (
        <nav
          className={`fixed right-0 w-36 py-10 h-full md:hidden flex flex-col items-center justify-between slide-in z-10 ${styles.box}`}
        >
          <button onClick={responsiveNavbarHandler}>
            <Image src={CloseIcon} alt="clsoe icon" className="w-7" />
          </button>

          <ul className="flex flex-col items-center gap-y-3">
            {links.map((item) => (
              <NavLink item={item} path={path} key={item.title} />
            ))}
          </ul>

          <button className="w-5">
            <Image src={FarsiIcon} alt="language icon" />
          </button>
        </nav>
      )}
    </>
  );
}

export default NavbarResponsive;
