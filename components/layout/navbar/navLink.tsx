import Link from "next/link";
import React from "react";

type Props = {
  item: {
    title: string;
    path: string;
  };
  path: string | null;
};

function NavLink({ item, path }: Props) {
  return (
    <li>
      <Link href={item.path} className={`h-full text-xl ${item.path === path ? "text-brand" : " text-text"}`}>
        {item.title}
      </Link>
    </li>
  );
}

export default NavLink;
