import React, { ReactNode } from "react";

function Header({ children }: { children: ReactNode }) {
  return (
    <h1
      className="w-fit text-secondary text-2xl rtl:text-xl font-semibold relative group duration-500"
      data-aos="zoom-out-right"
    >
      <span>{children}</span>

      <span className="absolute bottom-1 -left-2 -right-2 w-0 h-2 bg-darker-text transition-all duration-500 group-hover:w-[calc(100%+1rem)] rounded-sm -z-10" />
    </h1>
  );
}

export default Header;
