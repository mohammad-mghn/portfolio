import { project } from "@/types/project";

import { GithubIcon, FigmaIcon, WebIcon } from "@/public/icons/socials";

export const projects: project[] = [
  {
    media: [
      "https://github.com/vito-mohagheghian/portfolio/blob/images-db/portfolio/1.png?raw=true",
      "https://github.com/vito-mohagheghian/portfolio/blob/images-db/portfolio/2.png?raw=true",
      "https://github.com/vito-mohagheghian/portfolio/blob/images-db/portfolio/3.png?raw=true",
    ],
    title: "Portfolio",
    date: "Edited on: March, 2022",
    tags: ["NextJs", "TailWindCSS", "TypeScript", "UI Design"],
    description: `My own portfolio with projects, blog, about, contact, and home page. You can see date when I’m available, and see my all social media name, you can email me on the contact page, check my other social media with direct link, check my projects with a lot of features, review my skills, tools, and my language status, and you can use my own blog, too. It’s completely responsive with the MongoDB NoSQL server. For more information, check the GitHub page.✔ MIT License ✔ Responsive ✔ is online✔ blog page ✔ comments and reply feature ✔ short link ✔ loading page ✔ open source ✔ available for all browsers ✔ light/dark theme`,
    links: [
      {
        icon: WebIcon,
        link: "https://vito.vercel.app",
      },
      {
        icon: GithubIcon,
        link: "https://github.com/vito-mohagheghian/portfolio",
      },
      {
        icon: FigmaIcon,
        link: "https://www.figma.com/file/ssjsnsmfMqpCTGLk9JbaTn/vito's-portfolio?node-id=984%3A2588&t=64qiBRnhwL0UQU83-1",
      },
    ],
  },
  {
    media: [
      "https://github.com/vito-mohagheghian/portfolio/blob/images-db/dev-tab/1.png?raw=true",
      "https://github.com/vito-mohagheghian/portfolio/blob/images-db/dev-tab/2.png?raw=true",
      "https://github.com/vito-mohagheghian/portfolio/blob/images-db/dev-tab/3.png?raw=true",
    ],
    title: "Dev tab",
    date: "Edited on: Feb, 2023",
    tags: ["NextJs", "TailWindCSS", "TypeScript", "web-scrapping", "ReactJs"],
    description: `A community for people interested in participating in programming events. able to customize background ,and topics to follow your stack news. update each 2 mins.  ✓ responisve ✓dev.to ✓stackoverflow ✓github ✓hackernews ✓able to add bookmarks.`,
    links: [
      {
        icon: WebIcon,
        link: "https://dev-tab.vercel.app/",
      },
      {
        icon: GithubIcon,
        link: "https://github.com/vito-mohagheghian/dev-tab",
      },
      {
        icon: FigmaIcon,
        link: "https://www.figma.com/file/UrrfjHCm3r8o4xx7fVQE4K/web-tab?node-id=101%3A2&t=LbcVhYhWts3Jq25m-1",
      },
      {
        icon: WebIcon,
        link: "https://dev-tab.vercel.app/dashboard",
      },
    ],
  },
  {
    media: [
      "https://github.com/vito-mohagheghian/portfolio/blob/images-db/wins-11/1.png?raw=true",
      "https://github.com/vito-mohagheghian/portfolio/blob/images-db/wins-11/2.png?raw=true",
      "https://github.com/vito-mohagheghian/portfolio/blob/images-db/wins-11/3.png?raw=true",
      "https://github.com/vito-mohagheghian/portfolio/blob/images-db/wins-11/4.png?raw=true",
      "https://github.com/vito-mohagheghian/portfolio/blob/images-db/wins-11/5.png?raw=true",
    ],
    title: "Windows 11 on web",
    date: "Edited on: May, 2022",
    tags: ["ReactJs", "Scss", "ReduxJs", "TypeScript"],
    description: `Creating this kind of big projects on web with technoglies like ReactJs and Redux is containing lots of problems, and bugs that trying to fix them is really good way to improve our programming skills.`,
    links: [
      {
        icon: GithubIcon,
        link: "https://github.com/vito-mohagheghian/wins-11",
      },
      {
        icon: WebIcon,
        link: "https://wins-11.vercel.app/",
      },
    ],
  },
];
