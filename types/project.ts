import { StaticImageData } from "next/image";

export type project = {
  date: string;
  title: string;
  tags: string[];
  description: string;
  media: string[] | any[];
  links: { icon: StaticImageData; link: string }[];
};
