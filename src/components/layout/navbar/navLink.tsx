import React from "react";

import Link from "next/link";

type Props = {
  item: {
    title: string;
    path: string;
  };
  lang: string;
  path: string | null;
};

function NavLink({ item, path, lang }: Props) {
  const languageLastIndex = path!.lastIndexOf("/");

  const requiredPath = path!
    .substring(languageLastIndex)
    .replace("fa", "")
    .replace("en", "");

  return (
    <li className="relative md:h-14 flex items-center">
      <Link
        href={`/${lang}/${item.path}`}
        className={`text-xl hover:text-brand ${
          item.path === requiredPath ? "text-brand" : " text-text"
        }`}
      >
        {item.title}
        <span
          className={`${
            item.path === requiredPath ? "md:absolute" : "hidden"
          } left-[50%] bottom-0 translate-x-[-50%] w-full h-1 bg-brand rounded-tl-lg rounded-tr-lg growth`}
        ></span>
      </Link>
    </li>
  );
}

export default NavLink;
