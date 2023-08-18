import React from "react";
import Link from "next/link";
import Image from "next/image";

import NavLink from "./navLink";

import { CloseIcon } from "@/public/icons";

import { styles } from "@/styles";
import ToggleAnimate from "@/components/toggleAnimate";

type Props = {
  path: string | null;
  responsiveNavbar: boolean;
  responsiveNavbarHandler: (e: any) => void;
  links: { title: string; path: string }[];
};

function NavbarResponsive({
  responsiveNavbar,
  responsiveNavbarHandler,
  links,
  path,
}: Props) {
  return (
    <>
      {responsiveNavbar && (
        <div
          className={`fixed top-0 right-0 w-full h-full md:hidden`}
          onClick={responsiveNavbarHandler}
        />
      )}

      <ToggleAnimate toggle={responsiveNavbar} className="navbar">
        <nav
          className={`fixed right-0 w-36 py-10 h-full md:hidden flex flex-col items-center justify-between slide-in z-10 ${styles.box}`}
        >
          <button title="close menu" onClick={responsiveNavbarHandler}>
            <Image src={CloseIcon} alt="close icon" className="w-7" />
          </button>

          <ul className="flex flex-col items-center gap-y-3">
            {links.map((item) => (
              <NavLink item={item} path={path} key={item.title} />
            ))}
          </ul>

          <Link href={"/fa"} className="w-5">
            <svg
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 group transition-all duration-300"
            >
              <g clipPath="url(#clip0_996_2)">
                <path
                  className="text-darker-text group-hover:text-brand fill-current w-6 h-6"
                  d="M12.8902 25.135C11.4502 25.135 10.3432 24.973 9.5692 24.649C8.8132 24.325 8.2912 23.821 8.0032 23.137C7.7152 22.453 7.5532 21.571 7.5172 20.491L6.9772 5.722H9.1912L9.7312 19.627C9.7672 20.509 9.8482 21.193 9.9742 21.679C10.1182 22.147 10.4242 22.471 10.8922 22.651C11.3782 22.831 12.1342 22.921 13.1602 22.921C13.5382 22.921 13.8082 23.029 13.9702 23.245C14.1502 23.443 14.2402 23.686 14.2402 23.974C14.2402 24.262 14.1142 24.532 13.8622 24.784C13.6102 25.018 13.2862 25.135 12.8902 25.135ZM12.8906 25.135L13.1606 22.921C13.6106 22.921 14.1056 22.921 14.6456 22.921C15.2036 22.903 15.7616 22.885 16.3196 22.867C16.8956 22.849 17.4266 22.813 17.9126 22.759C18.3986 22.687 18.8036 22.597 19.1276 22.489C19.7756 22.255 20.2796 21.967 20.6396 21.625C20.9996 21.265 21.2516 20.797 21.3956 20.221C21.5576 19.627 21.6386 18.871 21.6386 17.953C21.6386 17.197 21.5396 16.495 21.3416 15.847C21.1436 15.199 20.8646 14.677 20.5046 14.281C20.1446 13.885 19.7126 13.687 19.2086 13.687C18.7946 13.687 18.4166 13.849 18.0746 14.173C17.7506 14.479 17.4896 14.875 17.2916 15.361C17.1116 15.847 17.0216 16.333 17.0216 16.819C17.0216 17.197 17.0936 17.521 17.2376 17.791C17.3996 18.061 17.6606 18.277 18.0206 18.439C18.3806 18.583 18.8486 18.655 19.4246 18.655C19.9466 18.655 20.4686 18.601 20.9906 18.493C21.5306 18.385 21.9896 18.241 22.3676 18.061L22.4756 19.951C22.1876 20.149 21.8636 20.311 21.5036 20.437C21.1436 20.563 20.7656 20.653 20.3696 20.707C19.9736 20.761 19.5776 20.788 19.1816 20.788C18.2636 20.788 17.4806 20.644 16.8326 20.356C16.2026 20.05 15.7166 19.645 15.3746 19.141C15.0506 18.619 14.8886 18.025 14.8886 17.359C14.8886 16.675 14.9966 15.991 15.2126 15.307C15.4286 14.605 15.7346 13.966 16.1306 13.39C16.5266 12.814 17.0036 12.355 17.5616 12.013C18.1196 11.653 18.7406 11.473 19.4246 11.473C20.3966 11.473 21.1976 11.788 21.8276 12.418C22.4756 13.048 22.9526 13.876 23.2586 14.902C23.5826 15.91 23.7446 16.981 23.7446 18.115C23.7446 19.465 23.5106 20.626 23.0426 21.598C22.5926 22.552 21.8366 23.344 20.7746 23.974C20.3606 24.208 19.8566 24.406 19.2626 24.568C18.6866 24.712 18.0476 24.829 17.3456 24.919C16.6616 25.009 15.9416 25.063 15.1856 25.081C14.4296 25.117 13.6646 25.135 12.8906 25.135ZM18.9116 8.692C18.5336 8.692 18.2096 8.566 17.9396 8.314C17.6876 8.044 17.5616 7.729 17.5616 7.369C17.5616 7.009 17.6876 6.694 17.9396 6.424C18.2096 6.154 18.5336 6.019 18.9116 6.019C19.2716 6.019 19.5776 6.154 19.8296 6.424C20.0996 6.694 20.2346 7.009 20.2346 7.369C20.2346 7.729 20.0996 8.044 19.8296 8.314C19.5776 8.566 19.2716 8.692 18.9116 8.692Z"
                />
              </g>
              <defs>
                <clipPath id="clip0_996_2">
                  <rect width="30" height="30" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </Link>
        </nav>
      </ToggleAnimate>
    </>
  );
}

export default NavbarResponsive;
