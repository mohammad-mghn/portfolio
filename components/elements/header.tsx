import React, { ReactNode } from "react";

function Header({ children }: { children: ReactNode }) {
  return (
    <h1 className="w-fit text-secondary text-2xl font-semibold relative group duration-500">
      <span>{children}</span>
      <span className="absolute bottom-1 -left-1 -right-1 w-0 h-2 bg-darker-text transition-all duration-500 group-hover:w-[calc(100%+.5rem)] -z-10" />
    </h1>
  );
}

export default Header;
