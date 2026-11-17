/**
 * Seed content: the full experience list (word for word from LinkedIn, read 17 Nov 2026) and the
 * 3D journey on the home page.
 *
 * The journey follows work experience, oldest first. A stop only points at things that already
 * exist: experience roles, a venture, or 1–3 projects. Names, dates and covers are read from those,
 * so nothing is typed twice. Roles are the big stops; the projects built there follow as small cards.
 * The one exception is a "note": a free-text stop, used for the closing "Now" card.
 */
import type { L } from "@/lib/content/types";
import type { SeedImage } from "./site";

type StopOverrides = {
  /** "major" stops (2025 on) are drawn bigger and hold longer than "minor" ones. */
  weight: "major" | "minor";
  /** The scene turns from paper to night at the first stop that sets this. */
  sceneBreak?: boolean;
  media?: SeedImage;
  /** Up to 3 short "what I built" lines. Defaults to each role's spec.built. */
  highlights?: L<string[]>;
  /** Overrides the link (default: the company's anchor on /engineering or the venture on /founding). */
  href?: string;
};

export type SeedJourneyStop =
  | {
      _key: string;
      _type: "journeyNote";
      /** Shown big where a role shows its year, e.g. "Now". */
      label: L;
      title: L;
      /** Up to 3 short lines in his own words. */
      lines: L<string[]>;
      weight: "major" | "minor";
      href?: string;
    }
  | ({ _key: string; _type: "journeyRole"; /** experience `_id`s at one company */ roles: string[] } & StopOverrides)
  | ({ _key: string; _type: "journeyVenture"; /** venture `_id` */ venture: string } & StopOverrides)
  | { _key: string; _type: "journeyProject"; /** 1–3 project `_id`s shown on one small card */ projects: string[] };

export const journey: { _id: "journey"; _type: "journey"; stops: SeedJourneyStop[] } = {
  _id: "journey",
  _type: "journey",
  stops: [
    // 2021 — freelance years, and the open-source work from the same time
    { _key: "freelance", _type: "journeyRole", roles: ["experience.freelance"], weight: "minor" },
    { _key: "p-lusyman", _type: "journeyProject", projects: ["project.lusyman"] },
    { _key: "p-windows-11", _type: "journeyProject", projects: ["project.windows-11"] },
    { _key: "p-dev-tools", _type: "journeyProject", projects: ["project.dev-tab", "project.devs-event"] },
    { _key: "p-irtc", _type: "journeyProject", projects: ["project.irtc"] },

    // 2024 — Pishgaman Farda (full-time) and the client projects built there
    {
      _key: "pishgaman-farda",
      _type: "journeyRole",
      roles: ["experience.pishgaman-frontend", "experience.pishgaman-senior"],
      weight: "minor",
    },
    { _key: "p-salecar", _type: "journeyProject", projects: ["project.salecar"] },
    { _key: "p-sinkara", _type: "journeyProject", projects: ["project.sinkara"] },
    { _key: "p-company-sites", _type: "journeyProject", projects: ["project.rehansa", "project.venus-itc", "project.pttfco"] },

    // 2024 — university association
    { _key: "amcsui", _type: "journeyRole", roles: ["experience.amcsui-frontend", "experience.amcsui-technical-lead"], weight: "minor" },

    // 2025 — RCOINX (full-time)
    {
      _key: "rcoinx",
      _type: "journeyRole",
      roles: ["experience.rcoinx"],
      weight: "minor",
      media: { src: "/work/rcoinx/1.jpg", width: 1280, height: 681, alt: { en: "RCOINX home page", fa: "صفحهٔ اصلی RCOINX" } },
    },

    // 2025 — Nobar (full-time), three roles
    {
      _key: "nobar",
      _type: "journeyRole",
      roles: ["experience.nobar-founding-frontend", "experience.nobar-senior-frontend", "experience.nobar-software-engineer"],
      weight: "major",
      sceneBreak: true,
      highlights: {
        en: ["A design system of 100+ components", "A captcha product in 4 npm packages", "Backend services for the cloud platform"],
        fa: ["دیزاین سیستمی با بیش از ۱۰۰ کامپوننت", "سرویس کپچا در ۴ پکیج npm", "سرویس‌های بک‌اند پلتفرم ابری"],
      },
    },

    // 2025 — Rooza (co-founder)
    { _key: "rooza", _type: "journeyVenture", venture: "venture.rooza", weight: "major" },
    { _key: "p-rooza", _type: "journeyProject", projects: ["project.rooza"] },

    // 2026 — Agent Assist (co-founder)
    { _key: "agent-assist", _type: "journeyVenture", venture: "venture.agent-assist", weight: "major" },
    { _key: "p-agent-assist", _type: "journeyProject", projects: ["project.agent-assist"] },

    // Now — where the journey is heading, in his own words
    {
      _key: "now",
      _type: "journeyNote",
      weight: "major",
      label: { en: "Now", fa: "امروز" },
      title: { en: "What I'm doing now", fa: "این روزها" },
      lines: {
        en: ["Hunting for the next opportunities", "Taking learning very seriously", "Building my personal brand"],
        fa: ["فرصت‌ها را شکار می‌کنم", "یادگیری را خیلی جدی پیش می‌برم", "روی پرسنال برندم کار می‌کنم"],
      },
      href: "/contact",
    },
  ],
};

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

const remote = { en: "Remote", fa: "دورکار" };
const hybrid = { en: "Hybrid", fa: "هیبرید" };

/** Every role on LinkedIn, newest first, word for word. Dates are "YYYY-MM". */
export const experience: SeedExperience[] = [
  {
    _id: "experience.nobar-software-engineer",
    _type: "experience",
    needsReview: true,
    order: 1,
    company: { en: "Nobar", fa: "نوبر" },
    companyNote: { en: "B2B cloud company", fa: "شرکت خدمات ابری B2B" },
    role: { en: "Software Engineer", fa: "مهندس نرم‌افزار" },
    type: "employee",
    start: "2026-09",
    workplace: remote,
    summary: {
      en: "Moved from frontend to backend to take on larger-scale work and more responsibility on the infrastructure side of Nobar's cloud products.",
      fa: "از فرانت‌اند به بک‌اند آمدم تا در مقیاس بزرگ‌تری کار کنم و مسئولیت بیشتری در بخش زیرساختِ محصولات ابری نوبر داشته باشم.",
    },
    bullets: {
      en: [
        "Contribute to a large microservice system using FastAPI, OpenStack and OpenShift",
        "Apply my cloud and infrastructure knowledge directly in implementation",
        "Build features full stack, breaking business needs down across frontend panels, the user console, backend services and the website",
      ],
      fa: [
        "در یک سیستم بزرگ میکروسرویسی با FastAPI، OpenStack و OpenShift کار می‌کنم",
        "دانش ابری و زیرساختی‌ام را مستقیم در پیاده‌سازی به کار می‌گیرم",
        "فیچرها را فول‌استک می‌سازم: نیاز کسب‌وکار را بین پنل‌های فرانت‌اند، کنسول کاربر، سرویس‌های بک‌اند و وب‌سایت خرد می‌کنم"
      ],
    },
    tech: ["FastAPI", "Python", "OpenStack", "OpenShift"],
    spec: { built: { en: "Backend features on a large microservice system", fa: "فیچرهای بک‌اند در یک سیستم بزرگ میکروسرویسی" }, outcome: { en: "Moved from frontend to backend, building across panels, console, services and website", fa: "از فرانت‌اند به بک‌اند آمدم و حالا در پنل‌ها، کنسول، سرویس‌ها و وب‌سایت می‌سازم" } },
  },
  {
    _id: "experience.nobar-senior-frontend",
    _type: "experience",
    needsReview: true,
    order: 2,
    company: { en: "Nobar", fa: "نوبر" },
    companyNote: { en: "B2B cloud company", fa: "شرکت خدمات ابری B2B" },
    role: { en: "Senior Frontend Engineer", fa: "مهندس ارشد فرانت‌اند" },
    type: "employee",
    start: "2026-05",
    end: "2026-08",
    workplace: hybrid,
    summary: {
      en: "Owned frontend architecture, quality and performance, and built a captcha product from scratch.",
      fa: "مسئول معماری، کیفیت و پرفورمنس فرانت‌اند بودم و یک سرویس کپچا را از صفر ساختم.",
    },
    bullets: {
      en: [
        "Built the captcha, including its checkbox and challenge frames, as a monorepo of 4 npm packages with 99%+ test coverage",
        "Cut development time to about a quarter by moving shared code into reusable packages",
        "Refactored the codebase to improve performance, load times and visual consistency",
        "Reviewed and oversaw an outsourced frontend project",
      ],
      fa: [
        "کپچا را با فریم‌های چک‌باکس و چالشش ساختم؛ یک مونوریپو با ۴ پکیج npm و پوشش تست بالای ۹۹٪",
        "کدهای مشترک را به پکیج‌های جدا بردم و زمان توسعه را تقریباً به یک‌چهارم رساندم",
        "کدبیس را ریفکتور کردم تا پرفورمنس، سرعت لود و یکدستی ظاهری بهتر شود",
        "یک پروژهٔ فرانت‌اند برون‌سپاری‌شده را بازبینی و سرپرستی کردم"
      ],
    },
    tech: ["TypeScript", "Monorepo", "npm packages", "Testing"],
    spec: { built: { en: "A captcha product, as a monorepo of 4 npm packages", fa: "یک سرویس کپچا؛ مونوریپویی با ۴ پکیج npm" }, outcome: { en: "Development time cut to about a quarter, with 99%+ test coverage", fa: "زمان توسعه تقریباً یک‌چهارم شد، با پوشش تست بالای ۹۹٪" } },
  },
  {
    _id: "experience.nobar-founding-frontend",
    _type: "experience",
    needsReview: true,
    order: 3,
    company: { en: "Nobar", fa: "نوبر" },
    companyNote: { en: "B2B cloud company", fa: "شرکت خدمات ابری B2B" },
    role: { en: "Founding Frontend Engineer", fa: "اولین مهندس فرانت‌اند" },
    type: "employee",
    start: "2025-08",
    end: "2026-08",
    workplace: remote,
    summary: {
      en: "Built the frontend foundation of a B2B cloud product, taking it from an early prototype to a production platform across the website, user console and dashboard.",
      fa: "پایهٔ فرانت‌اند یک محصول ابری B2B را ساختم و آن را از یک پروتوتایپ اولیه به پلتفرمی واقعی رساندم؛ در وب‌سایت، کنسول کاربر و داشبورد.",
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
        "دیزاین سیستمی با بیش از ۱۰۰ کامپوننت ساختم که مو به مو با طراحی تیم دیزاین می‌خواند",
        "کدبیس اولیه را تمیز نوشتم تا توسعه‌دهنده‌های بعدی راحت‌تر روی محصول کار کنند و گسترشش بدهند",
        "تجربه‌ای یکدست و روان در وب‌سایت، کنسول و داشبورد ساختم",
        "آخرین ایستگاه کنترل بین زیرساخت، بک‌اند و دیزاین بودم تا مطمئن شوم همه‌چیز کنار هم درست کار می‌کند",
        "برای بهتر شدن تجربهٔ کاربری، مستقیم با بنیان‌گذارها، طراح‌ها و مشتری‌ها کار کردم"
      ],
    },
    tech: ["Next.js", "React", "TypeScript", "Design system"],
    spec: { built: { en: "A 100+ component design system and the first frontend codebase", fa: "دیزاین سیستمی با بیش از ۱۰۰ کامپوننت و اولین کدبیس فرانت‌اند" }, outcome: { en: "From early prototype to production, across website, console and dashboard", fa: "از پروتوتایپ اولیه تا محصول واقعی؛ در وب‌سایت، کنسول و داشبورد" } },
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
      fa: "روزا را با مهدی خدادادی، طراح محصول، راه انداختیم و آن را از یک پروژهٔ ساده به افزونه‌ای با بیش از ۳٬۰۰۰ کاربر رساندم.",
    },
    bullets: {
      en: [
        "Built a customizable new-tab dashboard with widgets, bookmarks, three calendars (Gregorian, Jalali, Hijri), and full English and Persian support",
        "Built the admin dashboard for advertising: ad submission, review and approval, scheduling, and a timeline showing advertisers everything from impression to click",
        "Added analytics on background choices to improve suggested backgrounds over time",
        "Published on the Chrome Web Store and Firefox Add-ons, and ship regular updates based on user feedback",
      ],
      fa: [
        "داشبورد تب جدیدِ قابل‌شخصی‌سازی ساختم؛ با ویجت، بوکمارک، سه تقویم (شمسی، میلادی و قمری) و پشتیبانی کامل از فارسی و انگلیسی",
        "داشبورد مدیریت تبلیغات را ساختم: ثبت تبلیغ، بررسی و تأیید، زمان‌بندی، و تایم‌لاینی که از نمایش تا کلیک همه‌چیز را به تبلیغ‌دهنده نشان می‌دهد",
        "تحلیل انتخاب پس‌زمینه‌ها را اضافه کردم تا پس‌زمینه‌های پیشنهادی به‌مرور بهتر شوند",
        "افزونه را روی Chrome Web Store و Firefox Add-ons منتشر کردم و با بازخورد کاربرها مرتب به‌روزرسانی می‌دهم"
      ],
    },
    tech: ["WXT", "React", "TypeScript", "Node.js", "MongoDB", "Docker"],
    spec: { built: { en: "The new-tab extension, an ad platform and background analytics", fa: "افزونهٔ تب جدید، پلتفرم تبلیغات و تحلیل پس‌زمینه‌ها" }, outcome: { en: "3,000+ users on Chrome and Firefox", fa: "بیش از ۳٬۰۰۰ کاربر روی کروم و فایرفاکس" } },
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
    role: { en: "Technical Lead", fa: "لید فنی" },
    type: "community",
    start: "2025-07",
    workplace: remote,
    summary: {
      en: "Lead the technical team at AMCSUI, the computer science student association at the University of Isfahan: 7 developers, 2 designers and 2 illustrators.",
      fa: "تیم فنی AMCSUI، انجمن علمی علوم کامپیوتر دانشگاه اصفهان، را هدایت می‌کنم: ۷ توسعه‌دهنده، ۲ طراح و ۲ تصویرگر.",
    },
    bullets: {
      en: [
        "Oversee web apps, system integrations and game projects built with TypeScript, Next.js, React, REST APIs and Sanity in a monorepo",
        "Act as product manager, setting roadmaps and priorities with Trello, Notion and Figma",
        "Provide technical guidance and mentor team members",
      ],
      fa: [
        "سرپرستی وب‌اپ‌ها، اتصال سیستم‌ها و پروژه‌های بازی با من است؛ همه با TypeScript، Next.js، React، REST API و Sanity در یک مونوریپو",
        "نقش مدیر محصول را هم دارم: نقشهٔ راه و اولویت‌ها را با Trello، Notion و Figma می‌چینم",
        "اعضای تیم را از نظر فنی راهنمایی می‌کنم و منتورشان هستم"
      ],
    },
    tech: ["TypeScript", "Next.js", "React", "Sanity"],
    spec: { built: { en: "Web apps, integrations and games in one monorepo", fa: "وب‌اپ، اتصال سیستم‌ها و بازی؛ همه در یک مونوریپو" }, outcome: { en: "A team of 7 developers, 2 designers and 2 illustrators", fa: "تیمی با ۷ توسعه‌دهنده، ۲ طراح و ۲ تصویرگر" } },
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
        "برای مسابقهٔ برنامه‌نویسی VAST یک سیستم تست احراز هویت ساختم",
        "منتور دانشجوهایی بودم که فرانت‌اند، بک‌اند و حوزه‌های دیگر را یاد می‌گرفتند"
      ],
    },
    tech: ["Next.js", "React"],
    spec: { built: { en: "The authentication test system for the VAST coding competition", fa: "سیستم تست احراز هویت مسابقهٔ برنامه‌نویسی VAST" }, outcome: { en: "Mentored students across frontend, backend and other stacks", fa: "منتورینگ دانشجوها در فرانت‌اند، بک‌اند و حوزه‌های دیگر" } },
  },
  {
    _id: "experience.rcoinx",
    _type: "experience",
    needsReview: true,
    order: 7,
    company: { en: "RCOINX", fa: "RCOINX" },
    companyNote: { en: "Cryptocurrency exchange", fa: "صرافی ارز دیجیتال" },
    role: { en: "Frontend Developer", fa: "توسعه‌دهندهٔ فرانت‌اند" },
    type: "employee",
    start: "2025-03",
    end: "2025-05",
    workplace: remote,
    summary: {
      en: "Frontend developer on a cryptocurrency exchange platform, working as part of a larger team.",
      fa: "توسعه‌دهندهٔ فرانت‌اند یک صرافی ارز دیجیتال، در دل یک تیم بزرگ‌تر.",
    },
    bullets: {
      en: [
        "Built and maintained trading pages, wallets and dashboards",
        "Handled frontend tasks from implementation through maintenance and support, with most of my time on development",
      ],
      fa: [
        "صفحه‌های معامله، کیف پول و داشبوردها را ساختم و نگه‌داری کردم",
        "کارهای فرانت‌اند را از پیاده‌سازی تا نگه‌داری و پشتیبانی انجام دادم؛ بیشتر وقتم صرف توسعه بود"
      ],
    },
    tech: [],
    spec: { built: { en: "Trading pages, wallets and dashboards for a crypto exchange", fa: "صفحه‌های معامله، کیف پول و داشبوردهای یک صرافی ارز دیجیتال" } },
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
      fa: "فرانت‌اند پلتفرم Sinkara CEM را هدایت کردم و ساختار اصلی و کامپوننت‌هایش را از صفر با JavaScript ساختم.",
    },
    bullets: {
      en: [
        "Led and mentored 2 developers, including code reviews",
        "Researched and applied improvements to the frontend user experience",
        "Wrote technical documentation to support future development",
      ],
      fa: [
        "۲ توسعه‌دهنده را هدایت کردم، منتورشان بودم و کدهایشان را ریویو کردم",
        "برای بهتر شدن تجربهٔ کاربری تحقیق کردم و نتیجه‌اش را در فرانت‌اند پیاده کردم",
        "مستندات فنی نوشتم تا توسعهٔ بعدی راحت‌تر شود"
      ],
    },
    tech: ["JavaScript"],
    spec: { built: { en: "The Sinkara CEM frontend, from scratch", fa: "فرانت‌اند Sinkara CEM، از صفر" }, outcome: { en: "Led and mentored 2 developers", fa: "هدایت و منتورینگ ۲ توسعه‌دهنده" } },
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
      fa: "برای مشتری‌هایی در امارات، آلمان و ایران پلتفرم وب ساختم. به گفتهٔ مشتری، این پلتفرم‌ها در امارات و آلمان به بیش از ۵٬۰۰۰ کاربر رسیدند.",
    },
    bullets: {
      en: [
        "SaleCar (UAE): built car listings, sales tracking, payments, buyer and seller dashboards, an admin panel, and search and filtering",
        "German startup: built a shared UI for clients including Rahansa (Germany), Kenrove (UAE) and Pishgaman Tose Tejarat Farda (Iran), with multilingual support",
        "Venus: worked on a B2B technology website",
      ],
      fa: [
        "SaleCar (امارات): آگهی خودرو، پیگیری فروش، پرداخت، داشبورد خریدار و فروشنده، پنل ادمین و جست‌وجو و فیلتر را ساختم",
        "استارتاپ آلمانی: یک رابط کاربری مشترک و چندزبانه ساختم برای مشتری‌هایی مثل Rahansa (آلمان)، Kenrove (امارات) و پیشگامان توسعه تجارت فردا (ایران)",
        "Venus: روی یک وب‌سایت B2B در حوزهٔ فناوری کار کردم"
      ],
    },
    tech: ["Next.js", "React"],
    spec: { built: { en: "The SaleCar marketplace and a shared multilingual UI", fa: "مارکت‌پلیس SaleCar و یک رابط کاربری مشترک و چندزبانه" }, outcome: { en: "5,000+ users across the UAE and Germany, according to the client", fa: "به گفتهٔ مشتری، بیش از ۵٬۰۰۰ کاربر در امارات و آلمان" } },
  },
  {
    _id: "experience.freelance",
    _type: "experience",
    needsReview: true,
    order: 10,
    company: { en: "Freelance", fa: "فریلنس" },
    role: { en: "Frontend Web Developer", fa: "توسعه‌دهندهٔ فرانت‌اند وب" },
    type: "freelance",
    start: "2021-07",
    end: "2024-06",
    workplace: remote,
    summary: {
      en: "Built web applications for clients as a freelance developer.",
      fa: "به‌صورت فریلنس برای مشتری‌ها وب‌اپلیکیشن ساختم.",
    },
    bullets: {
      en: [
        "Lusyman (online shop): led 2 junior developers building the website and dashboard frontend from the employer's designs, using Redux and React Query",
        "Lusyman: the site reached about 1,000 daily users and 100,000+ monthly visits",
        "Iran Trade Coaching (trading education platform, not launched): built the platform with Next.js, Redux and JWT authentication, including a custom content editor and a dashboard for courses and blogs",
        "Iran Trade Coaching: used SSR and SSG for SEO and performance, and designed the UI from scratch",
      ],
      fa: [
        "لوسیمن (فروشگاه آنلاین): ۲ توسعه‌دهندهٔ جونیور را هدایت کردم تا فرانت‌اند وب‌سایت و داشبورد را از روی طراحی کارفرما بسازیم؛ با Redux و React Query",
        "لوسیمن: سایت به حدود ۱٬۰۰۰ کاربر روزانه و بیش از ۱۰۰ هزار بازدید ماهانه رسید",
        "Iran Trade Coaching (پلتفرم آموزش ترید که منتشر نشد): پلتفرم را با Next.js، Redux و احراز هویت JWT ساختم؛ با یک ادیتور محتوای اختصاصی و داشبوردی برای دوره‌ها و بلاگ",
        "Iran Trade Coaching: برای سئو و پرفورمنس از SSR و SSG استفاده کردم و رابط کاربری را از صفر طراحی کردم"
      ],
    },
    tech: ["Next.js", "Redux", "React Query", "JWT"],
    spec: { built: { en: "Lusyman's shop and dashboard, and the Iran Trade Coaching platform", fa: "فروشگاه و داشبورد لوسیمن، و پلتفرم Iran Trade Coaching" }, outcome: { en: "Lusyman: about 1,000 daily users and 100,000+ monthly visits", fa: "لوسیمن: حدود ۱٬۰۰۰ کاربر روزانه و بیش از ۱۰۰ هزار بازدید ماهانه" } },
  },
];
