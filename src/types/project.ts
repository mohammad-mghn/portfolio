export type project = {
  date: string;
  title: string;
  demo?: string;
  tags: string[];
  description: string;
  media: string[] | any[];
  links: { icon: () => JSX.Element; link: string }[];
};
