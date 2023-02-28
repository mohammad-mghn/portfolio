import { StaticImageData } from "next/image";
import { ReactNode } from "react";

export type project = {
  date: string;
  title: string;
  tags: string[];
  description: string;
  media: string[] | any[];
  links: { icon: () => JSX.Element; link: string }[];
};
