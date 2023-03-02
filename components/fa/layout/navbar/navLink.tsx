import React from "react";

import Link from "next/link";

type Props = {
  item: {
    title: string;
    path: string;
  };
  path: string | null;
};

function NavLink({ item, path }: Props) {
  return (
    <li className="relative md:h-14 flex items-center">
      <Link href={item.path} className={`text-xl ${item.path === path ? "text-brand" : " text-text"}`}>
        {item.title}
        <span
          className={`${
            item.path === path ? "md:absolute" : "hidden"
          } left-[50%] bottom-0 translate-x-[-50%] w-full h-1 bg-brand rounded-tl-lg rounded-tr-lg growth`}
        ></span>
      </Link>
    </li>
  );
}

export default NavLink;
