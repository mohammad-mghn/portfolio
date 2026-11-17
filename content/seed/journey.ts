/**
 * Seed content: the 3D journey (2021 → now) and the full experience timeline.
 * Source of truth: LinkedIn, read 17 Nov 2026. Experience text is word for word.
 * Journey stops mix jobs, own products, client work, side projects and open source;
 * 2025–2026 stops are `weight: "major"` and drawn bigger.
 * Persian for experience bullets comes in the Persian copy pass (falls back to English).
 */
import type { L } from "@/lib/content/types";
import type { SeedImage } from "./site";

type SeedMilestone = {
  _id: string;
  _type: "milestone";
  order: number;
  year: L;
  kind: "roots" | "career" | "venture" | "now";
  weight: "major" | "minor";
  title: L;
  outcome: L;
  tags: string[];
  media?: SeedImage;
  sceneBreak: boolean;
  placement: "auto" | "start" | "end";
};

export const milestones: SeedMilestone[] = [
  {
    _id: "milestone.2021",
    _type: "milestone",
    order: 1,
    year: { en: "2021", fa: "۲۰۲۱" },
    kind: "career",
    weight: "minor",
    title: { en: "First client work", fa: "اولین کار برای مشتری" },
    outcome: {
      en: "Freelance from July 2021. On Lusyman, an online shop, I led 2 junior developers; the site reached about 1,000 daily users and 100,000+ monthly visits.",
      fa: "فریلنس از تیر ۱۴۰۰. در لوسیمن، یک فروشگاه آنلاین، دو توسعه‌دهندهٔ جونیور را هدایت کردم؛ سایت به حدود ۱٬۰۰۰ کاربر روزانه و بیش از ۱۰۰ هزار بازدید ماهانه رسید.",
    },
    tags: ["Client", "Redux", "React Query"],
    sceneBreak: false,
    placement: "auto",
  },
  {
    _id: "milestone.2022",
    _type: "milestone",
    order: 2,
    year: { en: "2022", fa: "۲۰۲۲" },
    kind: "career",
    weight: "minor",
    title: { en: "Windows 11, in a browser tab", fa: "ویندوز ۱۱ در یک تب مرورگر" },
    outcome: {
      en: "An open-source Windows 11 simulation in React and Redux, now at 140+ GitHub stars. The same year: Devs Event, my first project on a remote team.",
      fa: "شبیه‌سازی متن‌باز ویندوز ۱۱ با React و Redux که حالا بیش از ۱۴۰ ستاره در گیت‌هاب دارد. همان سال Devs Event، اولین پروژه‌ام در یک تیم دورکار.",
    },
    tags: ["Open source", "React", "Redux"],
    media: { src: "/work/windows-11/1.png", width: 2079, height: 1309, alt: { en: "Windows 11 On Web", fa: "Windows 11 On Web" } },
    sceneBreak: false,
    placement: "auto",
  },
  {
    _id: "milestone.2024",
    _type: "milestone",
    order: 3,
    year: { en: "2024", fa: "۲۰۲۴" },
    kind: "career",
    weight: "minor",
    title: { en: "Clients in the UAE and Germany", fa: "مشتری‌هایی در امارات و آلمان" },
    outcome: {
      en: "At Pishgaman Farda: SaleCar, a car marketplace for the UAE, and shared UIs for clients in Germany and the UAE, reaching 5,000+ users according to the client. Then led the Sinkara CEM frontend.",
      fa: "در پیشگامان فردا: SaleCar، بازارگاه خودرو برای امارات، و رابط‌های مشترک برای مشتری‌هایی در آلمان و امارات که به گفتهٔ مشتری به بیش از ۵٬۰۰۰ کاربر رسیدند. بعد هم راهبری فرانت‌اند Sinkara CEM.",
    },
    tags: ["Client", "Next.js", "Lead"],
    media: { src: "/work/salecar/cover.png", width: 1600, height: 1000, alt: { en: "SaleCar", fa: "SaleCar" } },
    sceneBreak: false,
    placement: "auto",
  },
  {
    _id: "milestone.2025-nobar",
    _type: "milestone",
    order: 4,
    year: { en: "2025", fa: "۲۰۲۵" },
    kind: "career",
    weight: "major",
    title: { en: "Founding frontend at Nobar", fa: "فرانت‌اند بنیان‌گذار در نوبر" },
    outcome: {
      en: "Took a B2B cloud product from an early prototype to production across the website, user console and dashboard, on a design system of 100+ components.",
      fa: "یک محصول ابری B2B را از نمونهٔ اولیه به محصول نهایی رساندم؛ در وب‌سایت، کنسول کاربر و داشبورد، روی دیزاین سیستمی با بیش از ۱۰۰ کامپوننت.",
    },
    tags: ["Nobar", "Design system", "B2B cloud"],
    sceneBreak: true,
    placement: "auto",
  },
  {
    _id: "milestone.2025-rooza",
    _type: "milestone",
    order: 5,
    year: { en: "2025", fa: "۲۰۲۵" },
    kind: "venture",
    weight: "major",
    title: { en: "From an open-source PR to co-founding Rooza", fa: "از یک مشارکت متن‌باز تا هم‌بنیان‌گذاری روزا" },
    outcome: {
      en: "A design-system contribution to Widgetify led Mahdi Khodadadi to offer me paid work or equity. I chose equity, and we built Rooza: 3,000+ users on Chrome and Firefox.",
      fa: "مشارکتم در دیزاین سیستم Widgetify باعث شد مهدی خدادادی پیشنهاد کار پولی یا سهم بدهد. سهم را انتخاب کردم و روزا را ساختیم: بیش از ۳٬۰۰۰ کاربر روی کروم و فایرفاکس.",
    },
    tags: ["Founding", "Open source", "Extension"],
    media: { src: "/work/rooza/1.jpg", width: 1672, height: 941, alt: { en: "Rooza", fa: "روزا" } },
    sceneBreak: false,
    placement: "auto",
  },
  {
    _id: "milestone.2026-agent-assist",
    _type: "milestone",
    order: 6,
    year: { en: "2026", fa: "۲۰۲۶" },
    kind: "venture",
    weight: "major",
    title: { en: "Agent Assist, with Hassan Faraji", fa: "Agent Assist، با حسن فرجی" },
    outcome: {
      en: "A browser extension that brings approved replies into helpdesks, CRMs and email. 100+ support agents use it at companies including Digikala and Mobinnet.",
      fa: "افزونه‌ای که پاسخ‌های تأییدشده را به هلپ‌دسک، CRM و ایمیل می‌آورد. بیش از ۱۰۰ کارشناس پشتیبانی در شرکت‌هایی مثل دیجی‌کالا و مبین‌نت از آن استفاده می‌کنند.",
    },
    tags: ["Founding", "Extension", "B2B"],
    media: { src: "/work/agent-assist/1.png", width: 2078, height: 1239, alt: { en: "Agent Assist", fa: "Agent Assist" } },
    sceneBreak: false,
    placement: "auto",
  },
  {
    _id: "milestone.2026-captcha",
    _type: "milestone",
    order: 7,
    year: { en: "2026", fa: "۲۰۲۶" },
    kind: "career",
    weight: "major",
    title: { en: "A captcha product, from scratch", fa: "یک محصول کپچا، از صفر" },
    outcome: {
      en: "Built Nobar's captcha, including its checkbox and challenge frames, as a monorepo of 4 npm packages with 99%+ test coverage.",
      fa: "کپچای نوبر را با فریم‌های چک‌باکس و چالش، به‌صورت مونوریپویی از ۴ پکیج npm و پوشش تست بیش از ۹۹٪ ساختم.",
    },
    tags: ["Nobar", "Monorepo", "Testing"],
    sceneBreak: false,
    placement: "auto",
  },
  {
    _id: "milestone.now",
    _type: "milestone",
    order: 8,
    year: { en: "Now", fa: "اکنون" },
    kind: "now",
    weight: "major",
    title: { en: "Engineer first: into the backend", fa: "اول مهندسی: رفتن به سمت بک‌اند" },
    outcome: {
      en: "Software Engineer at Nobar since September 2026, on a large microservice system with FastAPI, OpenStack and OpenShift, building features across the full stack.",
      fa: "از شهریور ۱۴۰۵ مهندس نرم‌افزار در نوبر؛ روی یک سیستم بزرگ میکروسرویسی با FastAPI، OpenStack و OpenShift، و ساختن فیچرها در کل استک.",
    },
    tags: ["Backend", "FastAPI", "Cloud"],
    sceneBreak: false,
    placement: "auto",
  },
];

type SeedExperience = {
  _id: string;
  _type: "experience";
  needsReview: true;
  order: number;
  company: L;
  companyNote?: L;
  url?: string;
  role: L;
  type: "founder" | "employee" | "freelance" | "community";
  start: string;
  end?: string;
  workplace?: L;
  location?: L;
  summary: L;
  bullets: L<string[]>;
  tech: string[];
  /** Spec block on /engineering: leads with what was built. */
  spec: { built: L; outcome?: L };
};

const remote = { en: "Remote", fa: "دورکاری" };
const hybrid = { en: "Hybrid", fa: "ترکیبی" };

/** Every role on LinkedIn, newest first, word for word. Dates are "YYYY-MM". */
export const experience: SeedExperience[] = [
  {
    _id: "experience.nobar-software-engineer",
    _type: "experience",
    needsReview: true,
    order: 1,
    company: { en: "Nobar", fa: "نوبر" },
    companyNote: { en: "B2B cloud company", fa: "شرکت ابری B2B" },
    role: { en: "Software Engineer", fa: "مهندس نرم‌افزار" },
    type: "employee",
    start: "2026-09",
    workplace: remote,
    summary: {
      en: "Moved from frontend to backend to take on larger-scale work and more responsibility on the infrastructure side of Nobar's cloud products.",
      fa: "از فرانت‌اند به بک‌اند رفتم تا کارهای بزرگ‌تر و مسئولیت بیشتری در بخش زیرساخت محصولات ابری نوبر بر عهده بگیرم.",
    },
    bullets: {
      en: [
        "Contribute to a large microservice system using FastAPI, OpenStack and OpenShift",
        "Apply my cloud and infrastructure knowledge directly in implementation",
        "Build features full stack, breaking business needs down across frontend panels, the user console, backend services and the website",
      ],
      fa: [
        "روی یک سیستم بزرگ میکروسرویسی با FastAPI، OpenStack و OpenShift کار می‌کنم",
        "دانش ابری و زیرساختی‌ام را مستقیم در پیاده‌سازی به کار می‌برم",
        "فیچرها را فول‌استک می‌سازم و نیازهای کسب‌وکار را بین پنل‌های فرانت‌اند، کنسول کاربر، سرویس‌های بک‌اند و وب‌سایت تقسیم می‌کنم"
      ],
    },
    tech: ["FastAPI", "Python", "OpenStack", "OpenShift"],
    spec: { built: { en: "Backend features on a large microservice system", fa: "فیچرهای بک‌اند روی یک سیستم بزرگ میکروسرویسی" }, outcome: { en: "Moved from frontend to backend, building across panels, console, services and website", fa: "رفتن از فرانت‌اند به بک‌اند و ساختن در پنل‌ها، کنسول، سرویس‌ها و وب‌سایت" } },
  },
  {
    _id: "experience.nobar-senior-frontend",
    _type: "experience",
    needsReview: true,
    order: 2,
    company: { en: "Nobar", fa: "نوبر" },
    companyNote: { en: "B2B cloud company", fa: "شرکت ابری B2B" },
    role: { en: "Senior Frontend Engineer", fa: "مهندس ارشد فرانت‌اند" },
    type: "employee",
    start: "2026-05",
    end: "2026-08",
    workplace: hybrid,
    summary: {
      en: "Owned frontend architecture, quality and performance, and built a captcha product from scratch.",
      fa: "مسئول معماری، کیفیت و عملکرد فرانت‌اند بودم و یک محصول کپچا را از صفر ساختم.",
    },
    bullets: {
      en: [
        "Built the captcha, including its checkbox and challenge frames, as a monorepo of 4 npm packages with 99%+ test coverage",
        "Cut development time to about a quarter by moving shared code into reusable packages",
        "Refactored the codebase to improve performance, load times and visual consistency",
        "Reviewed and oversaw an outsourced frontend project",
      ],
      fa: [
        "کپچا را با فریم‌های چک‌باکس و چالش، به‌صورت مونوریپویی از ۴ پکیج npm با پوشش تست بیش از ۹۹٪ ساختم",
        "با انتقال کدهای مشترک به پکیج‌های قابل استفادهٔ مجدد، زمان توسعه را تقریباً به یک‌چهارم رساندم",
        "کدبیس را برای بهتر شدن عملکرد، سرعت بارگذاری و یکدستی ظاهری ریفکتور کردم",
        "یک پروژهٔ فرانت‌اند برون‌سپاری‌شده را بازبینی کردم و بر آن نظارت داشتم"
      ],
    },
    tech: ["TypeScript", "Monorepo", "npm packages", "Testing"],
    spec: { built: { en: "A captcha product, as a monorepo of 4 npm packages", fa: "یک محصول کپچا، به‌صورت مونوریپویی از ۴ پکیج npm" }, outcome: { en: "Development time cut to about a quarter, with 99%+ test coverage", fa: "زمان توسعه تقریباً یک‌چهارم شد، با پوشش تست بیش از ۹۹٪" } },
  },
  {
    _id: "experience.nobar-founding-frontend",
    _type: "experience",
    needsReview: true,
    order: 3,
    company: { en: "Nobar", fa: "نوبر" },
    companyNote: { en: "B2B cloud company", fa: "شرکت ابری B2B" },
    role: { en: "Founding Frontend Engineer", fa: "مهندس فرانت‌اند بنیان‌گذار" },
    type: "employee",
    start: "2025-08",
    end: "2026-08",
    workplace: remote,
    summary: {
      en: "Built the frontend foundation of a B2B cloud product, taking it from an early prototype to a production platform across the website, user console and dashboard.",
      fa: "پایهٔ فرانت‌اند یک محصول ابری B2B را ساختم و آن را از نمونهٔ اولیه به پلتفرمی آمادهٔ استفاده در وب‌سایت، کنسول کاربر و داشبورد رساندم.",
    },
    bullets: {
      en: [
        "Built a design system of 100+ reusable components, matching the design team's specs closely",
        "Wrote a clean initial codebase that made it easier for later developers to work on and extend the product",
        "Created one consistent, smooth experience across the website, console and dashboard",
        "Acted as the final check across infrastructure, backend and design, making sure every part fit together and worked",
        "Worked directly with founders, designers and customers to improve the user experience",
      ],
      fa: [
        "دیزاین سیستمی با بیش از ۱۰۰ کامپوننت قابل استفادهٔ مجدد ساختم که دقیقاً با طراحی تیم دیزاین هماهنگ بود",
        "کدبیس اولیه‌ای تمیز نوشتم که کار روی محصول و گسترش آن را برای توسعه‌دهنده‌های بعدی آسان‌تر کرد",
        "تجربه‌ای یکدست و روان در وب‌سایت، کنسول و داشبورد ساختم",
        "آخرین حلقهٔ کنترل بین زیرساخت، بک‌اند و طراحی بودم تا همهٔ بخش‌ها با هم جور باشند و درست کار کنند",
        "برای بهتر کردن تجربهٔ کاربری، مستقیم با بنیان‌گذاران، طراحان و مشتری‌ها کار کردم"
      ],
    },
    tech: ["Next.js", "React", "TypeScript", "Design system"],
    spec: { built: { en: "A 100+ component design system and the first frontend codebase", fa: "دیزاین سیستمی با بیش از ۱۰۰ کامپوننت و اولین کدبیس فرانت‌اند" }, outcome: { en: "From early prototype to production, across website, console and dashboard", fa: "از نمونهٔ اولیه تا محصول نهایی، در وب‌سایت، کنسول و داشبورد" } },
  },
  {
    _id: "experience.rooza",
    _type: "experience",
    needsReview: true,
    order: 4,
    company: { en: "Rooza", fa: "روزا" },
    url: "https://rooza.space",
    role: { en: "Co-Founder & Software Engineer", fa: "هم‌بنیان‌گذار و مهندس نرم‌افزار" },
    type: "founder",
    start: "2025-09",
    workplace: remote,
    summary: {
      en: "Co-founded Rooza with product designer Mahdi Khodadadi and took it from a basic project to a live browser extension with 3,000+ users.",
      fa: "روزا را با مهدی خدادادی، طراح محصول، هم‌بنیان‌گذاری کردم و آن را از یک پروژهٔ ساده به افزونه‌ای منتشرشده با بیش از ۳٬۰۰۰ کاربر رساندم.",
    },
    bullets: {
      en: [
        "Built a customizable new-tab dashboard with widgets, bookmarks, three calendars (Gregorian, Jalali, Hijri), and full English and Persian support",
        "Built the admin dashboard for advertising: ad submission, review and approval, scheduling, and a timeline showing advertisers everything from impression to click",
        "Added analytics on background choices to improve suggested backgrounds over time",
        "Published on the Chrome Web Store and Firefox Add-ons, and ship regular updates based on user feedback",
      ],
      fa: [
        "داشبورد تب جدیدی قابل شخصی‌سازی ساختم با ویجت‌ها، بوکمارک‌ها، سه تقویم (میلادی، شمسی و قمری) و پشتیبانی کامل از فارسی و انگلیسی",
        "داشبورد مدیریت تبلیغات را ساختم: ثبت تبلیغ، بررسی و تأیید، زمان‌بندی، و تایم‌لاینی که همه‌چیز را از نمایش تا کلیک به تبلیغ‌دهنده نشان می‌دهد",
        "آنالیتیکس انتخاب پس‌زمینه را اضافه کردم تا پس‌زمینه‌های پیشنهادی به‌مرور بهتر شوند",
        "افزونه را در کروم وب‌استور و افزونه‌های فایرفاکس منتشر کردم و بر اساس بازخورد کاربران مرتب به‌روزرسانی می‌دهم"
      ],
    },
    tech: ["WXT", "React", "TypeScript", "Node.js", "MongoDB", "Docker"],
    spec: { built: { en: "The new-tab extension, an ad platform and background analytics", fa: "افزونهٔ تب جدید، پلتفرم تبلیغات و آنالیتیکس پس‌زمینه‌ها" }, outcome: { en: "3,000+ users on Chrome and Firefox", fa: "بیش از ۳٬۰۰۰ کاربر روی کروم و فایرفاکس" } },
  },
  {
    _id: "experience.amcsui-technical-lead",
    _type: "experience",
    needsReview: true,
    order: 5,
    company: { en: "AMCSUI", fa: "انجمن علمی علوم کامپیوتر دانشگاه اصفهان" },
    companyNote: {
      en: "The computer science student association at the University of Isfahan",
      fa: "انجمن علمی دانشجویی علوم کامپیوتر دانشگاه اصفهان",
    },
    role: { en: "Technical Lead", fa: "مسئول فنی" },
    type: "community",
    start: "2025-07",
    workplace: remote,
    summary: {
      en: "Lead the technical team at AMCSUI, the computer science student association at the University of Isfahan: 7 developers, 2 designers and 2 illustrators.",
      fa: "راهبری تیم فنی AMCSUI، انجمن علمی علوم کامپیوتر دانشگاه اصفهان، با من است: ۷ توسعه‌دهنده، ۲ طراح و ۲ تصویرساز.",
    },
    bullets: {
      en: [
        "Oversee web apps, system integrations and game projects built with TypeScript, Next.js, React, REST APIs and Sanity in a monorepo",
        "Act as product manager, setting roadmaps and priorities with Trello, Notion and Figma",
        "Provide technical guidance and mentor team members",
      ],
      fa: [
        "بر وب‌اپ‌ها، یکپارچه‌سازی‌های سیستمی و پروژه‌های بازی که با TypeScript، Next.js، React، REST API و Sanity در یک مونوریپو ساخته می‌شوند نظارت می‌کنم",
        "نقش مدیر محصول را دارم و با Trello، Notion و Figma نقشهٔ راه و اولویت‌ها را مشخص می‌کنم",
        "به اعضای تیم راهنمایی فنی می‌دهم و منتورشان هستم"
      ],
    },
    tech: ["TypeScript", "Next.js", "React", "Sanity"],
    spec: { built: { en: "Web apps, integrations and games in one monorepo", fa: "وب‌اپ‌ها، یکپارچه‌سازی‌ها و بازی‌ها در یک مونوریپو" }, outcome: { en: "A team of 7 developers, 2 designers and 2 illustrators", fa: "تیمی از ۷ توسعه‌دهنده، ۲ طراح و ۲ تصویرگر" } },
  },
  {
    _id: "experience.amcsui-frontend",
    _type: "experience",
    needsReview: true,
    order: 6,
    company: { en: "AMCSUI", fa: "انجمن علمی علوم کامپیوتر دانشگاه اصفهان" },
    role: { en: "Frontend Developer", fa: "توسعه‌دهندهٔ فرانت‌اند" },
    type: "community",
    start: "2024-11",
    end: "2025-06",
    workplace: hybrid,
    summary: {
      en: "Built tools and products for events at my university's computer science association.",
      fa: "برای رویدادهای انجمن علمی علوم کامپیوتر دانشگاهم ابزار و محصول ساختم.",
    },
    bullets: {
      en: [
        "Built an authentication test system for the VAST coding competition",
        "Mentored students learning frontend, backend and other stacks",
      ],
      fa: [
        "یک سیستم تست احراز هویت برای مسابقهٔ برنامه‌نویسی VAST ساختم",
        "منتور دانشجوهایی بودم که فرانت‌اند، بک‌اند و استک‌های دیگر یاد می‌گرفتند"
      ],
    },
    tech: ["Next.js", "React"],
    spec: { built: { en: "The authentication test system for the VAST coding competition", fa: "سیستم آزمون احراز هویت برای مسابقهٔ برنامه‌نویسی VAST" }, outcome: { en: "Mentored students across frontend, backend and other stacks", fa: "منتورینگ دانشجوها در فرانت‌اند، بک‌اند و استک‌های دیگر" } },
  },
  {
    _id: "experience.rcoinx",
    _type: "experience",
    needsReview: true,
    order: 7,
    company: { en: "RCOINX", fa: "RCOINX" },
    companyNote: { en: "Cryptocurrency exchange", fa: "صرافی رمزارز" },
    role: { en: "Frontend Developer", fa: "توسعه‌دهندهٔ فرانت‌اند" },
    type: "employee",
    start: "2025-03",
    end: "2025-05",
    workplace: remote,
    summary: {
      en: "Frontend developer on a cryptocurrency exchange platform, working as part of a larger team.",
      fa: "توسعه‌دهندهٔ فرانت‌اند یک پلتفرم صرافی ارز دیجیتال، در کنار یک تیم بزرگ‌تر.",
    },
    bullets: {
      en: [
        "Built and maintained trading pages, wallets and dashboards",
        "Handled frontend tasks from implementation through maintenance and support, with most of my time on development",
      ],
      fa: [
        "صفحه‌های معامله، کیف پول‌ها و داشبوردها را ساختم و نگهداری کردم",
        "کارهای فرانت‌اند را از پیاده‌سازی تا نگهداری و پشتیبانی انجام دادم و بیشتر وقتم صرف توسعه شد"
      ],
    },
    tech: [],
    spec: { built: { en: "Trading pages, wallets and dashboards for a crypto exchange", fa: "صفحات معاملات، کیف پول‌ها و داشبوردهای یک صرافی رمزارز" } },
  },
  {
    _id: "experience.pishgaman-senior",
    _type: "experience",
    needsReview: true,
    order: 8,
    company: { en: "Pishgaman Farda", fa: "پیشگامان فردا" },
    role: { en: "Senior Frontend Engineer", fa: "مهندس ارشد فرانت‌اند" },
    type: "employee",
    start: "2024-12",
    end: "2025-03",
    workplace: remote,
    summary: {
      en: "Led frontend development of the Sinkara CEM platform, building its core structure and components from scratch with JavaScript.",
      fa: "توسعهٔ فرانت‌اند پلتفرم Sinkara CEM را رهبری کردم و ساختار اصلی و کامپوننت‌هایش را از صفر با JavaScript ساختم.",
    },
    bullets: {
      en: [
        "Led and mentored 2 developers, including code reviews",
        "Researched and applied improvements to the frontend user experience",
        "Wrote technical documentation to support future development",
      ],
      fa: [
        "دو توسعه‌دهنده را هدایت کردم و منتورشان بودم، از جمله با کد ریویو",
        "روی بهبود تجربهٔ کاربری فرانت‌اند تحقیق کردم و بهبودها را پیاده کردم",
        "برای پشتیبانی از توسعهٔ آینده، مستندات فنی نوشتم"
      ],
    },
    tech: ["JavaScript"],
    spec: { built: { en: "The Sinkara CEM frontend, from scratch", fa: "فرانت‌اند Sinkara CEM، از صفر" }, outcome: { en: "Led and mentored 2 developers", fa: "راهبری و منتورینگ دو توسعه‌دهنده" } },
  },
  {
    _id: "experience.pishgaman-frontend",
    _type: "experience",
    needsReview: true,
    order: 9,
    company: { en: "Pishgaman Farda", fa: "پیشگامان فردا" },
    role: { en: "Frontend Engineer", fa: "مهندس فرانت‌اند" },
    type: "employee",
    start: "2024-07",
    end: "2024-12",
    workplace: remote,
    summary: {
      en: "Built web platforms for clients in the UAE, Germany and Iran, reaching 5,000+ users across the UAE and Germany, according to the client.",
      fa: "برای مشتری‌هایی در امارات، آلمان و ایران پلتفرم وب ساختم که به گفتهٔ مشتری در امارات و آلمان به بیش از ۵٬۰۰۰ کاربر رسید.",
    },
    bullets: {
      en: [
        "SaleCar (UAE): built car listings, sales tracking, payments, buyer and seller dashboards, an admin panel, and search and filtering",
        "German startup: built a shared UI for clients including Rahansa (Germany), Kenrove (UAE) and Pishgaman Tose Tejarat Farda (Iran), with multilingual support",
        "Venus: worked on a B2B technology website",
      ],
      fa: [
        "SaleCar (امارات): آگهی‌های خودرو، پیگیری فروش، پرداخت، داشبورد خریدار و فروشنده، پنل ادمین و جست‌وجو و فیلتر را ساختم",
        "استارتاپ آلمانی: یک رابط کاربری مشترک و چندزبانه برای مشتری‌هایی مثل Rahansa (آلمان)، Kenrove (امارات) و پیشگامان توسعه تجارت فردا (ایران) ساختم",
        "Venus: روی یک وب‌سایت فناوری B2B کار کردم"
      ],
    },
    tech: ["Next.js", "React"],
    spec: { built: { en: "The SaleCar marketplace and a shared multilingual UI", fa: "بازارگاه SaleCar و یک رابط مشترک چندزبانه" }, outcome: { en: "5,000+ users across the UAE and Germany, according to the client", fa: "به گفتهٔ مشتری، بیش از ۵٬۰۰۰ کاربر در امارات و آلمان" } },
  },
  {
    _id: "experience.freelance",
    _type: "experience",
    needsReview: true,
    order: 10,
    company: { en: "Freelance", fa: "فریلنس" },
    role: { en: "Frontend Web Developer", fa: "توسعه‌دهندهٔ وب فرانت‌اند" },
    type: "freelance",
    start: "2021-07",
    end: "2024-06",
    workplace: remote,
    summary: {
      en: "Built web applications for clients as a freelance developer.",
      fa: "به‌عنوان توسعه‌دهندهٔ فریلنس برای مشتری‌ها وب‌اپلیکیشن ساختم.",
    },
    bullets: {
      en: [
        "Lusyman (online shop): led 2 junior developers building the website and dashboard frontend from the employer's designs, using Redux and React Query",
        "Lusyman: the site reached about 1,000 daily users and 100,000+ monthly visits",
        "Iran Trade Coaching (trading education platform, not launched): built the platform with Next.js, Redux and JWT authentication, including a custom content editor and a dashboard for courses and blogs",
        "Iran Trade Coaching: used SSR and SSG for SEO and performance, and designed the UI from scratch",
      ],
      fa: [
        "لوسیمن (فروشگاه آنلاین): دو توسعه‌دهندهٔ جونیور را در ساخت فرانت‌اند وب‌سایت و داشبورد، بر اساس طراحی‌های کارفرما و با Redux و React Query، هدایت کردم",
        "لوسیمن: سایت به حدود ۱٬۰۰۰ کاربر روزانه و بیش از ۱۰۰ هزار بازدید ماهانه رسید",
        "Iran Trade Coaching (پلتفرم آموزش معامله‌گری که منتشر نشد): پلتفرم را با Next.js، Redux و احراز هویت JWT ساختم؛ همراه با یک ویرایشگر محتوای اختصاصی و داشبورد دوره‌ها و بلاگ",
        "Iran Trade Coaching: برای سئو و عملکرد از SSR و SSG استفاده کردم و رابط کاربری را از صفر طراحی کردم"
      ],
    },
    tech: ["Next.js", "Redux", "React Query", "JWT"],
    spec: { built: { en: "Lusyman's shop and dashboard, and the Iran Trade Coaching platform", fa: "فروشگاه و داشبورد لوسیمن، و پلتفرم Iran Trade Coaching" }, outcome: { en: "Lusyman: about 1,000 daily users and 100,000+ monthly visits", fa: "لوسیمن: حدود ۱٬۰۰۰ کاربر روزانه و بیش از ۱۰۰ هزار بازدید ماهانه" } },
  },
];
