import Link from "next/link";
import Image from "next/image";

import NavLink from "./navLink";
import ToggleAnimate from "@/components/toggleAnimate";

import { CloseIcon } from "@/../public/icons";

type Props = {
  lang: string;
  path: string | null;
  otherLang: "En" | "Fa";
  responsiveNavbar: boolean;
  otherLangPath: `/${string}`;
  responsiveNavbarHandler: (e: any) => void;
  links: { title: string; path: string }[];
};

function NavbarResponsive(props: Props) {
  const {
    path,
    links,
    lang,
    otherLang,
    otherLangPath,
    responsiveNavbar,
    responsiveNavbarHandler,
  } = props;

  const ltr = lang === "en";

  return (
    <>
      {responsiveNavbar && (
        <div
          className={`fixed top-0 right-0 w-full h-full md:hidden`}
          onClick={responsiveNavbarHandler}
        />
      )}

      <ToggleAnimate
        toggle={responsiveNavbar}
        className={ltr ? "navbar" : "fa-navbar"}
      >
        <nav
          className={`fixed ${
            ltr ? "right-0" : "left-0"
          } w-36 py-10 h-full md:hidden bg-primary flex flex-col items-center justify-between ${
            ltr ? "slide-in" : "slide-in-fa"
          } border-border-darker z-10`}
        >
          <button title="close menu" onClick={responsiveNavbarHandler}>
            <Image src={CloseIcon} alt="close icon" className="w-7" />
          </button>

          <ul className="flex flex-col items-center gap-y-3">
            {links.map((item) => (
              <NavLink item={item} path={path} key={item.title} lang={lang} />
            ))}
          </ul>

          <Link
            href={otherLangPath}
            className="mr-2 text-lg text-text hover:text-brand transition-colors duration-300"
          >
            {otherLang}
          </Link>
        </nav>
      </ToggleAnimate>
    </>
  );
}

export default NavbarResponsive;
