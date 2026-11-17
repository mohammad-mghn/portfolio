/**
 * Seed content: projects. Facts come from Mohammad's LinkedIn (experience, projects and
 * recommendations, read 17 Nov 2026) plus the products' own repos for stack details.
 * No invented metrics. Order = homepage and /work order: own products, Nobar, client work, side projects.
 * Persian is drafted where it shows on the homepage; the rest falls back to English until the Persian pass.
 */
import type { L } from "@/lib/content/types";
import type { SeedImage } from "./site";

type SeedProject = {
  _id: string;
  _type: "project";
  needsReview: true;
  slug: string;
  order: number;
  featured: boolean;
  /** own = Mohammad's products, nobar = Nobar work, client = client work, side = side projects. */
  group: "own" | "nobar" | "client" | "side";
  /** Full case study (true) or a short card (false). */
  caseStudy: boolean;
  title: L;
  year: string;
  sector: L;
  kind: L;
  scope: L<string[]>;
  status: "live" | "nda" | "offline" | "archived";
  color: string;
  client?: L;
  location?: L;
  role: L;
  summary: L;
  problem: L<string[]>;
  decision: L<string[]>;
  result: L<string[]>;
  stack: string[];
  links: { live?: string; repo?: string; figma?: string };
  cover?: SeedImage;
  gallery: SeedImage[];
};

const shot = (slug: string, n: number, w: number, h: number, en: string, fa: string): SeedImage => ({
  src: `/work/${slug}/${n}.png`,
  width: w,
  height: h,
  alt: { en, fa },
});
const cover = (slug: string, en: string, fa: string): SeedImage => ({
  src: `/work/${slug}/cover.png`,
  width: 1600,
  height: 1000,
  alt: { en, fa },
});

export const projects: SeedProject[] = [
  // ── Own products ─────────────────────────────────────────────────────────
  {
    _id: "project.rooza",
    _type: "project",
    needsReview: true,
    slug: "rooza",
    order: 1,
    featured: true,
    group: "own",
    caseStudy: true,
    title: { en: "Rooza", fa: "روزا" },
    year: "2025",
    sector: { en: "Productivity", fa: "بهره‌وری" },
    kind: { en: "New-tab extension & platform", fa: "افزونهٔ تب جدید و پلتفرم" },
    scope: { en: ["Co-founder", "Extension", "Back-end", "Ad platform"], fa: ["هم‌بنیان‌گذار", "افزونه", "بک‌اند", "پلتفرم تبلیغات"] },
    status: "live",
    color: "#7E1418",
    role: { en: "Co-founder & software engineer", fa: "هم‌بنیان‌گذار و مهندس نرم‌افزار" },
    client: { en: "Co-founded with Mahdi Khodadadi", fa: "هم‌بنیان‌گذاری با مهدی خدادادی" },
    summary: {
      en: "A bilingual new-tab browser extension with 3,000+ users, three calendars, widgets and its own ad platform. Co-founded with Mahdi Khodadadi.",
      fa: "افزونهٔ دوزبانهٔ تب جدید با بیش از ۳٬۰۰۰ کاربر، سه تقویم، ویجت‌ها و پلتفرم تبلیغاتی اختصاصی. هم‌بنیان‌گذاری با مهدی خدادادی.",
    },
    problem: {
      en: [
        "The new tab is the page people open most, yet it usually shows nothing personal, and nothing in the Persian calendar.",
        "Rooza set out to turn it into a fast, personal start page in English and Persian, and to make it sustainable with an advertising model.",
      ],
      fa: [
        "تب جدید پربازدیدترین صفحهٔ مرورگر است، اما معمولاً نه چیز شخصی‌ای نشان می‌دهد و نه تقویم شمسی دارد.",
        "روزا قرار بود آن را به صفحهٔ شروعی سریع و شخصی به فارسی و انگلیسی تبدیل کند و با یک مدل تبلیغاتی پایدار بماند.",
      ],
    },
    decision: {
      en: [
        "A customizable new-tab dashboard with widgets, bookmarks, three calendars (Gregorian, Jalali, Hijri), and full English and Persian support with RTL and LTR layouts.",
        "An admin dashboard for advertising: ad submission, review and approval, scheduling, and a timeline showing advertisers everything from impression to click.",
        "Analytics on background choices, so suggested backgrounds improve over time.",
        "Built as an MV3 extension with WXT, a Node and MongoDB API, and the whole stack in Docker Compose.",
      ],
      fa: [
        "داشبورد تب جدید قابل شخصی‌سازی با ویجت‌ها، بوکمارک‌ها، سه تقویم (میلادی، شمسی و قمری) و پشتیبانی کامل از فارسی و انگلیسی با چیدمان راست‌به‌چپ و چپ‌به‌راست.",
        "داشبورد مدیریت تبلیغات: ثبت تبلیغ، بررسی و تأیید، زمان‌بندی، و تایم‌لاینی که همه‌چیز را از نمایش تا کلیک به تبلیغ‌دهنده نشان می‌دهد.",
        "آنالیتیکس انتخاب پس‌زمینه، تا پس‌زمینه‌های پیشنهادی به‌مرور بهتر شوند.",
        "ساخته‌شده به‌صورت افزونهٔ MV3 با WXT، یک API با Node و MongoDB، و کل استک در Docker Compose."
      ],
    },
    result: {
      en: ["Live on the Chrome Web Store and Firefox Add-ons with 3,000+ users, shipping regular updates based on user feedback."],
      fa: ["در دسترس در کروم وب‌استور و افزونه‌های فایرفاکس با بیش از ۳٬۰۰۰ کاربر، با به‌روزرسانی‌های منظم بر اساس بازخورد کاربران."],
    },
    stack: ["WXT", "React", "TypeScript", "Node.js", "Express", "MongoDB", "Docker"],
    links: { live: "https://rooza.space" },
    cover: { src: "/work/rooza/1.jpg", width: 1672, height: 941, alt: { en: "Rooza", fa: "روزا" } },
    gallery: [
      { src: "/work/rooza/live.jpg", width: 2000, height: 1250, alt: { en: "Rooza's website, rooza.space", fa: "وب‌سایت روزا، rooza.space" } },
      {
        src: "/work/rooza/2.jpg",
        width: 1983,
        height: 793,
        alt: { en: "Rooza: smart calendar and Persian date in one new tab", fa: "روزا: تقویم هوشمند و تاریخ شمسی در یک تب جدید" },
      },
    ],
  },
  {
    _id: "project.agent-assist",
    _type: "project",
    needsReview: true,
    slug: "agent-assist",
    order: 2,
    featured: true,
    group: "own",
    caseStudy: true,
    title: { en: "Agent Assist", fa: "Agent Assist" },
    year: "2026",
    sector: { en: "Customer support", fa: "پشتیبانی مشتری" },
    kind: { en: "Browser extension", fa: "افزونهٔ مرورگر" },
    scope: { en: ["Co-builder", "Extension", "Front-end"], fa: ["هم‌سازنده", "افزونه", "فرانت‌اند"] },
    status: "live",
    color: "#1F2A44",
    role: { en: "Built with Hassan Faraji", fa: "ساخته‌شده با حسن فرجی" },
    summary: {
      en: "A browser extension used by 100+ support agents at companies including Digikala and Mobinnet: type / or # to insert an approved reply without switching tabs.",
      fa: "افزونهٔ مرورگری که بیش از ۱۰۰ کارشناس پشتیبانی در شرکت‌هایی مثل دیجی‌کالا و مبین‌نت از آن استفاده می‌کنند: با تایپ / یا # پاسخ تأییدشده را بدون عوض کردن تب وارد می‌کنند.",
    },
    problem: {
      en: [
        "Support, sales and operations teams send the same messages all day.",
        "Copy-pasting from docs is slow, and switching tabs to find the right reply breaks the flow of a conversation.",
      ],
      fa: [
        "تیم‌های پشتیبانی، فروش و عملیات هر روز همان پیام‌ها را بارها می‌فرستند.",
        "کپی کردن از مستندات کند است و رفتن به تب دیگر برای پیدا کردن پاسخ درست، رشتهٔ گفت‌وگو را پاره می‌کند.",
      ],
    },
    decision: {
      en: [
        "Two triggers for two workflows: /name for team-approved snippets grouped in categories, #name for quick temporary replies.",
        "Works in any text field, so it fits helpdesks, CRMs, chat widgets and email without a single integration.",
        "JSON import and export to share libraries between agents, and a built-in test panel to try triggers before a live ticket.",
      ],
      fa: [
        "دو تریگر برای دو روش کار: \u200e/name برای پاسخ‌های تأییدشدهٔ تیم که در دسته‌ها مرتب شده‌اند، و \u200e#name برای پاسخ‌های سریع و موقت.",
        "در هر فیلد متنی کار می‌کند؛ پس بدون حتی یک یکپارچه‌سازی، در هلپ‌دسک، CRM، ویجت چت و ایمیل جا می‌افتد.",
        "ورود و خروج JSON برای به اشتراک گذاشتن کتابخانهٔ پاسخ‌ها بین کارشناس‌ها، و یک پنل تست داخلی برای امتحان تریگرها پیش از تیکت واقعی."
      ],
    },
    result: {
      en: ["Used by 100+ support agents at companies including Digikala and Mobinnet, and free for anyone to use."],
      fa: ["مورد استفادهٔ بیش از ۱۰۰ کارشناس پشتیبانی در شرکت‌هایی مثل دیجی‌کالا و مبین‌نت، و رایگان برای همه."],
    },
    stack: ["WXT", "React", "TypeScript", "Tailwind CSS", "Next.js"],
    links: { live: "https://agentboost.ir/en", repo: "https://github.com/mohammad-mghn/agent-assist" },
    cover: { src: "/work/agent-assist/live.jpg", width: 2000, height: 1250, alt: { en: "Agent Assist website", fa: "وب‌سایت Agent Assist" } },
    gallery: [
      shot("agent-assist", 1, 2078, 1239, "Agent Assist dashboard", "داشبورد Agent Assist"),
      shot("agent-assist", 2, 2078, 1228, "Agent Assist in Persian", "Agent Assist به زبان فارسی"),
      shot("agent-assist", 3, 2078, 1246, "Inline snippet menu", "منوی درون‌خطی پاسخ‌ها"),
    ],
  },

  // ── Nobar (public screens only) ─────────────────────────────────────────
  {
    _id: "project.nobar",
    _type: "project",
    needsReview: true,
    slug: "nobar",
    order: 3,
    featured: true,
    group: "nobar",
    caseStudy: true,
    title: { en: "Nobar", fa: "نوبر" },
    year: "2025",
    sector: { en: "Cloud infrastructure", fa: "زیرساخت ابری" },
    kind: { en: "B2B cloud product", fa: "محصول ابری B2B" },
    scope: { en: ["Design system", "Captcha", "Backend"], fa: ["دیزاین سیستم", "کپچا", "بک‌اند"] },
    status: "nda",
    color: "#173A5E",
    client: { en: "Nobar", fa: "نوبر" },
    role: {
      en: "Founding frontend engineer → senior frontend → software engineer",
      fa: "فرانت‌اند بنیان‌گذار ← فرانت‌اند ارشد ← مهندس نرم‌افزار",
    },
    summary: {
      en: "A B2B cloud product taken from prototype to production: a 100+ component design system, a captcha built as 4 npm packages, and now backend microservices.",
      fa: "یک محصول ابری B2B از نمونهٔ اولیه تا محصول نهایی: دیزاین سیستمی با بیش از ۱۰۰ کامپوننت، کپچایی در ۴ پکیج npm و حالا میکروسرویس‌های بک‌اند.",
    },
    problem: {
      en: [
        "An early-stage B2B cloud product needed a frontend foundation that later developers could build on, and one consistent experience across the website, user console and dashboard.",
      ],
      fa: [
        "یک محصول ابری B2B در مراحل اولیه به پایه‌ای برای فرانت‌اند نیاز داشت که توسعه‌دهنده‌های بعدی بتوانند رویش بسازند، و به تجربه‌ای یکدست در وب‌سایت، کنسول کاربر و داشبورد."
      ],
    },
    decision: {
      en: [
        "Built a design system of 100+ reusable components, matching the design team's specs closely, and a clean initial codebase.",
        "Built a captcha product from scratch, including its checkbox and challenge frames, as a monorepo of 4 npm packages with 99%+ test coverage.",
        "Moved to backend: a large microservice system with FastAPI, OpenStack and OpenShift, building features across frontend panels, the user console, backend services and the website.",
      ],
      fa: [
        "دیزاین سیستمی با بیش از ۱۰۰ کامپوننت قابل استفادهٔ مجدد، دقیقاً مطابق طراحی تیم دیزاین، و یک کدبیس اولیهٔ تمیز ساختم.",
        "یک محصول کپچا را از صفر ساختم، با فریم‌های چک‌باکس و چالش، به‌صورت مونوریپویی از ۴ پکیج npm با پوشش تست بیش از ۹۹٪.",
        "رفتن به بک‌اند: یک سیستم بزرگ میکروسرویسی با FastAPI، OpenStack و OpenShift، و ساختن فیچرها در پنل‌های فرانت‌اند، کنسول کاربر، سرویس‌های بک‌اند و وب‌سایت."
      ],
    },
    result: {
      en: [
        "Development time cut to about a quarter by moving shared code into reusable packages, and one consistent, smooth experience across the product.",
      ],
      fa: [
        "با انتقال کدهای مشترک به پکیج‌های قابل استفادهٔ مجدد، زمان توسعه تقریباً یک‌چهارم شد و کل محصول تجربه‌ای یکدست و روان پیدا کرد."
      ],
    },
    stack: ["TypeScript", "Next.js", "React", "FastAPI", "OpenStack", "OpenShift"],
    links: {},
    gallery: [],
  },

  // ── Client work ──────────────────────────────────────────────────────────
  {
    _id: "project.salecar",
    _type: "project",
    needsReview: true,
    slug: "salecar",
    order: 4,
    featured: true,
    group: "client",
    caseStudy: true,
    title: { en: "SaleCar", fa: "SaleCar" },
    year: "2024",
    sector: { en: "Automotive marketplace", fa: "بازارگاه خودرو" },
    kind: { en: "Marketplace", fa: "بازارگاه" },
    scope: { en: ["Front-end", "UI/UX", "Dashboards"], fa: ["فرانت‌اند", "UI/UX", "داشبورد"] },
    status: "offline",
    color: "#14302F",
    client: { en: "Built at Pishgaman Farda", fa: "ساخته‌شده در پیشگامان فردا" },
    location: { en: "United Arab Emirates", fa: "امارات متحده عربی" },
    role: { en: "Frontend engineer", fa: "مهندس فرانت‌اند" },
    summary: {
      en: "A car marketplace for the UAE: listings, sales tracking, payments, buyer and seller dashboards, an admin panel, and search and filtering.",
      fa: "بازارگاه خودرو برای امارات: آگهی‌ها، پیگیری فروش، پرداخت، داشبورد خریدار و فروشنده، پنل مدیریت و جست‌وجو و فیلتر.",
    },
    problem: {
      en: ["SaleCar, the largest project at Pishgaman Farda, needed a full marketplace for buying and selling cars in the UAE market."],
      fa: [
        "SaleCar، بزرگ‌ترین پروژهٔ پیشگامان فردا، به یک بازارگاه کامل برای خرید و فروش خودرو در بازار امارات نیاز داشت."
      ],
    },
    decision: {
      en: [
        "Built car listings, sales tracking, payments, buyer and seller dashboards, an admin panel, and search and filtering.",
        "Many of the UI/UX improvements were my own suggestions, shipped through changing requirements.",
      ],
      fa: [
        "آگهی‌های خودرو، پیگیری فروش، پرداخت، داشبورد خریدار و فروشنده، پنل ادمین و جست‌وجو و فیلتر را ساختم.",
        "بسیاری از بهبودهای UI/UX پیشنهاد خودم بود و با وجود تغییر مداوم نیازمندی‌ها منتشر شد."
      ],
    },
    result: {
      en: [
        "Part of the platforms that reached 5,000+ users across the UAE and Germany, according to the client.",
        "“His contributions to the UI/UX of salecar.ae went far beyond coding.” Mohammad Shahi, backend developer on the project.",
      ],
      fa: [
        "بخشی از پلتفرم‌هایی که به گفتهٔ مشتری در امارات و آلمان به بیش از ۵٬۰۰۰ کاربر رسیدند.",
        "«سهم او در UI/UX سایت salecar.ae خیلی فراتر از کدنویسی بود.» از توصیه‌نامهٔ Mohammad Shahi، توسعه‌دهندهٔ بک‌اند پروژه (ترجمه)."
      ],
    },
    stack: ["Next.js", "React"],
    links: {},
    cover: cover("salecar", "SaleCar home page", "صفحهٔ اصلی SaleCar"),
    gallery: [],
  },
  {
    _id: "project.lusyman",
    _type: "project",
    needsReview: true,
    slug: "lusyman",
    order: 5,
    featured: false,
    group: "client",
    caseStudy: true,
    title: { en: "Lusyman", fa: "لوسیمن" },
    year: "2021",
    sector: { en: "E-commerce", fa: "فروشگاه اینترنتی" },
    kind: { en: "Online shop", fa: "فروشگاه آنلاین" },
    scope: { en: ["Front-end lead", "Dashboard"], fa: ["راهبری فرانت‌اند", "داشبورد"] },
    status: "live",
    color: "#5A3B2E",
    role: { en: "Front-end lead (freelance)", fa: "راهبر فرانت‌اند (فریلنس)" },
    summary: {
      en: "An online shop whose website and dashboard I built with 2 junior developers. It reached about 1,000 daily users and 100,000+ monthly visits.",
      fa: "فروشگاه آنلاینی که وب‌سایت و داشبوردش را با دو توسعه‌دهندهٔ جونیور ساختم و به حدود ۱٬۰۰۰ کاربر روزانه و بیش از ۱۰۰ هزار بازدید ماهانه رسید.",
    },
    problem: {
      en: ["The shop needed a website and an admin dashboard built from the employer's designs."],
      fa: [
        "فروشگاه به یک وب‌سایت و داشبورد مدیریت نیاز داشت که بر اساس طراحی‌های کارفرما ساخته شود."
      ],
    },
    decision: {
      en: ["Led 2 junior developers building the website and dashboard frontend, using Redux and React Query."],
      fa: [
        "دو توسعه‌دهندهٔ جونیور را در ساخت فرانت‌اند وب‌سایت و داشبورد با Redux و React Query هدایت کردم."
      ],
    },
    result: {
      en: ["The site reached about 1,000 daily users and 100,000+ monthly visits."],
      fa: [
        "سایت به حدود ۱٬۰۰۰ کاربر روزانه و بیش از ۱۰۰ هزار بازدید ماهانه رسید."
      ],
    },
    stack: ["React", "Redux", "React Query"],
    links: { live: "https://lusyman.com" },
    cover: { src: "/work/lusyman/1.jpg", width: 1280, height: 656, alt: { en: "Lusyman shop home page", fa: "صفحهٔ اصلی فروشگاه لوسیمن" } },
    gallery: [],
  },
  {
    _id: "project.sinkara",
    _type: "project",
    needsReview: true,
    slug: "sinkara",
    order: 6,
    featured: false,
    group: "client",
    caseStudy: true,
    title: { en: "Sinkara CEM", fa: "Sinkara CEM" },
    year: "2024",
    sector: { en: "Customer experience", fa: "تجربهٔ مشتری" },
    kind: { en: "CEM platform", fa: "پلتفرم CEM" },
    scope: { en: ["Front-end lead", "Architecture", "Mentoring"], fa: ["راهبری فرانت‌اند", "معماری", "منتورینگ"] },
    status: "offline",
    color: "#2E4A3F",
    client: { en: "Built at Pishgaman Farda", fa: "ساخته‌شده در پیشگامان فردا" },
    role: { en: "Senior frontend engineer", fa: "مهندس ارشد فرانت‌اند" },
    summary: {
      en: "Led the frontend of the Sinkara CEM platform, building its core structure and components from scratch and mentoring 2 developers.",
      fa: "راهبری فرانت‌اند پلتفرم Sinkara CEM؛ ساختن ساختار اصلی و کامپوننت‌ها از صفر و منتورینگ دو توسعه‌دهنده.",
    },
    problem: {
      en: ["A new platform needed its frontend structure and components built from scratch."],
      fa: [
        "یک پلتفرم تازه نیاز داشت ساختار و کامپوننت‌های فرانت‌اندش از صفر ساخته شود."
      ],
    },
    decision: {
      en: [
        "Built the core structure and components from scratch with JavaScript.",
        "Led and mentored 2 developers, including code reviews, and wrote technical documentation to support future development.",
      ],
      fa: [
        "ساختار اصلی و کامپوننت‌ها را از صفر با JavaScript ساختم.",
        "دو توسعه‌دهنده را هدایت کردم و منتورشان بودم، از جمله با کد ریویو، و برای توسعهٔ آینده مستندات فنی نوشتم."
      ],
    },
    result: {
      en: ["Researched and applied improvements to the frontend user experience."],
      fa: [
        "روی بهبود تجربهٔ کاربری فرانت‌اند تحقیق کردم و بهبودها را پیاده کردم."
      ],
    },
    stack: ["JavaScript"],
    links: {},
    gallery: [],
  },
  {
    _id: "project.rcoinx",
    _type: "project",
    needsReview: true,
    slug: "rcoinx",
    order: 7,
    featured: false,
    group: "client",
    caseStudy: true,
    title: { en: "RCOINX", fa: "RCOINX" },
    year: "2025",
    sector: { en: "Crypto exchange", fa: "صرافی رمزارز" },
    kind: { en: "Exchange platform", fa: "پلتفرم صرافی" },
    scope: { en: ["Front-end", "Trading UI"], fa: ["فرانت‌اند", "رابط معاملات"] },
    status: "offline",
    color: "#1E1E3F",
    role: { en: "Frontend developer", fa: "توسعه‌دهندهٔ فرانت‌اند" },
    summary: {
      en: "Trading pages, wallets and dashboards for a cryptocurrency exchange platform, as part of a larger team.",
      fa: "صفحات معاملات، کیف پول‌ها و داشبوردها برای یک پلتفرم صرافی رمزارز، در یک تیم بزرگ‌تر.",
    },
    problem: {
      en: ["A cryptocurrency exchange platform needed its trading pages, wallets and dashboards built and maintained."],
      fa: [
        "یک پلتفرم صرافی ارز دیجیتال به کسی نیاز داشت که صفحه‌های معامله، کیف پول‌ها و داشبوردهایش را بسازد و نگهداری کند."
      ],
    },
    decision: {
      en: [
        "Built and maintained trading pages, wallets and dashboards.",
        "Handled frontend tasks from implementation through maintenance and support, with most of my time on development.",
      ],
      fa: [
        "صفحه‌های معامله، کیف پول‌ها و داشبوردها را ساختم و نگهداری کردم.",
        "کارهای فرانت‌اند را از پیاده‌سازی تا نگهداری و پشتیبانی انجام دادم و بیشتر وقتم صرف توسعه شد."
      ],
    },
    result: {
      en: ["Worked as part of a larger team on an enterprise cryptocurrency exchange platform."],
      fa: [
        "به‌عنوان بخشی از یک تیم بزرگ‌تر، روی یک پلتفرم سازمانی صرافی ارز دیجیتال کار کردم."
      ],
    },
    stack: [],
    links: {},
    cover: { src: "/work/rcoinx/1.jpg", width: 1280, height: 681, alt: { en: "RCOINX home page", fa: "صفحهٔ اصلی RCOINX" } },
    gallery: [],
  },
  {
    _id: "project.rehansa",
    _type: "project",
    needsReview: true,
    slug: "rehansa",
    order: 8,
    featured: false,
    group: "client",
    caseStudy: false,
    title: { en: "Rehansa", fa: "رهانسا" },
    year: "2024",
    sector: { en: "Technology services", fa: "خدمات فناوری" },
    kind: { en: "Company site", fa: "وب‌سایت شرکتی" },
    scope: { en: ["Shared UI", "Multilingual"], fa: ["رابط مشترک", "چندزبانه"] },
    status: "live",
    color: "#1D2A6B",
    client: { en: "Rehansa", fa: "رهانسا" },
    location: { en: "Germany", fa: "آلمان" },
    role: { en: "Frontend engineer", fa: "مهندس فرانت‌اند" },
    summary: {
      en: "A multilingual company site for a German client, part of the shared UI I built for a German startup's clients.",
      fa: "وب‌سایت شرکتی چندزبانه برای مشتری‌ای در آلمان؛ بخشی از رابط مشترکی که برای مشتری‌های یک استارتاپ آلمانی ساختم.",
    },
    problem: { en: [] },
    decision: { en: [] },
    result: { en: [] },
    stack: ["Next.js", "React"],
    links: { live: "https://rehansa.org/" },
    cover: { src: "/work/rehansa/1.png", width: 360, height: 260, alt: { en: "Rehansa home page", fa: "صفحهٔ اصلی رهانسا" } },
    gallery: [],
  },
  {
    _id: "project.pttfco",
    _type: "project",
    needsReview: true,
    slug: "pttfco",
    order: 9,
    featured: false,
    group: "client",
    caseStudy: false,
    title: { en: "Pishgaman Tose Tejarat Farda", fa: "پیشگامان توسعه تجارت فردا" },
    year: "2024",
    sector: { en: "Technology services", fa: "خدمات فناوری" },
    kind: { en: "Company site", fa: "وب‌سایت شرکتی" },
    scope: { en: ["Shared UI", "Multilingual"], fa: ["رابط مشترک", "چندزبانه"] },
    status: "live",
    color: "#0A5C52",
    location: { en: "Iran", fa: "ایران" },
    role: { en: "Frontend engineer", fa: "مهندس فرانت‌اند" },
    summary: {
      en: "A multilingual company site in Persian and English, part of the same shared UI.",
      fa: "وب‌سایت شرکتی چندزبانه به فارسی و انگلیسی؛ بخشی از همان رابط مشترک.",
    },
    problem: { en: [] },
    decision: { en: [] },
    result: { en: [] },
    stack: ["Next.js", "React"],
    links: { live: "https://pttfco-com.vercel.app/" },
    cover: cover("pttfco", "Pishgaman Tose Tejarat Farda home page", "صفحهٔ اصلی پیشگامان توسعه تجارت فردا"),
    gallery: [],
  },
  {
    _id: "project.venus-itc",
    _type: "project",
    needsReview: true,
    slug: "venus-itc",
    order: 10,
    featured: false,
    group: "client",
    caseStudy: false,
    title: { en: "Venus", fa: "ونوس" },
    year: "2024",
    sector: { en: "IT consultancy", fa: "مشاورهٔ فناوری اطلاعات" },
    kind: { en: "B2B website", fa: "وب‌سایت B2B" },
    scope: { en: ["Front-end"], fa: ["فرانت‌اند"] },
    status: "live",
    color: "#0E6B5C",
    role: { en: "Frontend engineer", fa: "مهندس فرانت‌اند" },
    summary: {
      en: "A B2B technology website, built at Pishgaman Farda.",
      fa: "یک وب‌سایت فناوری B2B، ساخته‌شده در پیشگامان فردا.",
    },
    problem: { en: [] },
    decision: { en: [] },
    result: { en: [] },
    stack: ["Next.js", "React"],
    links: { live: "https://www.venus-itc.com/" },
    cover: cover("venus-itc", "Venus home page", "صفحهٔ اصلی ونوس"),
    gallery: [],
  },

  // ── Side projects ────────────────────────────────────────────────────────
  {
    _id: "project.windows-11",
    _type: "project",
    needsReview: true,
    slug: "windows-11",
    order: 11,
    featured: true,
    group: "side",
    caseStudy: false,
    title: { en: "Windows 11 On Web", fa: "Windows 11 On Web" },
    year: "2022",
    sector: { en: "Open source", fa: "متن‌باز" },
    kind: { en: "Web OS", fa: "سیستم‌عامل تحت وب" },
    scope: { en: ["Open source", "React", "Redux"], fa: ["متن‌باز", "React", "Redux"] },
    status: "live",
    color: "#0B4F8A",
    role: { en: "Solo builder", fa: "سازندهٔ مستقل" },
    summary: {
      en: "A Windows 11 simulation that runs in the browser, built with React and Redux. 140+ GitHub stars.",
      fa: "شبیه‌سازی ویندوز ۱۱ که در مرورگر اجرا می‌شود، ساخته‌شده با React و Redux. بیش از ۱۴۰ ستاره در گیت‌هاب.",
    },
    problem: { en: [] },
    decision: { en: [] },
    result: { en: ["Open source with 140+ GitHub stars, live at wins11.ir."], fa: ["متن‌باز با بیش از ۱۴۰ ستاره در گیت‌هاب، در دسترس در wins11.ir."] },
    stack: ["React", "Redux", "TypeScript", "SCSS"],
    links: { live: "https://wins11.ir/", repo: "https://github.com/mohammad-mghn/wins-11" },
    cover: shot("windows-11", 1, 2079, 1309, "Windows 11 desktop in the browser", "دسکتاپ ویندوز ۱۱ در مرورگر"),
    gallery: [
      shot("windows-11", 2, 2079, 1309, "Start menu", "منوی استارت"),
      shot("windows-11", 3, 2078, 1309, "Apps", "برنامه‌ها"),
      shot("windows-11", 4, 2078, 1309, "Windows", "پنجره‌ها"),
      shot("windows-11", 5, 2079, 1309, "Settings", "تنظیمات"),
    ],
  },
  {
    _id: "project.devs-event",
    _type: "project",
    needsReview: true,
    slug: "devs-event",
    order: 12,
    featured: false,
    group: "side",
    caseStudy: false,
    title: { en: "Devs Event", fa: "Devs Event" },
    year: "2022",
    sector: { en: "Community", fa: "جامعهٔ توسعه‌دهندگان" },
    kind: { en: "Events website", fa: "وب‌سایت رویدادها" },
    scope: { en: ["Front-end", "Remote team"], fa: ["فرانت‌اند", "تیم دورکار"] },
    status: "offline",
    color: "#3A3F1F",
    role: { en: "Front-end developer, with Mahdi Nazari", fa: "توسعه‌دهندهٔ فرانت‌اند، با مهدی نظری" },
    summary: {
      en: "A community website for people who want to join programming events. My first project on a remote team.",
      fa: "وب‌سایتی برای کسانی که می‌خواهند در رویدادهای برنامه‌نویسی شرکت کنند. اولین پروژه‌ام در یک تیم دورکار.",
    },
    problem: { en: [] },
    decision: { en: [] },
    result: { en: [] },
    stack: ["Next.js", "Tailwind CSS"],
    links: { live: "https://www.devevent.ir/", repo: "https://github.com/mohammad-mghn/devs-event" },
    cover: shot("devs-event", 1, 2078, 1309, "Devs Event home page", "صفحهٔ اصلی Devs Event"),
    gallery: [shot("devs-event", 2, 2078, 1309, "Event list", "فهرست رویدادها")],
  },
  {
    _id: "project.dev-tab",
    _type: "project",
    needsReview: true,
    slug: "dev-tab",
    order: 13,
    featured: false,
    group: "side",
    caseStudy: false,
    title: { en: "Dev Tab", fa: "Dev Tab" },
    year: "2022",
    sector: { en: "Developer tools", fa: "ابزار توسعه‌دهندگان" },
    kind: { en: "News dashboard", fa: "داشبورد اخبار" },
    scope: { en: ["Full-stack", "Scraping"], fa: ["فول‌استک", "استخراج داده"] },
    status: "live",
    color: "#2B2B2B",
    role: { en: "Full-stack developer", fa: "توسعه‌دهندهٔ فول‌استک" },
    summary: {
      en: "A dashboard for developer news, tools, jobs and events, with web scraping to collect content and customizable fields.",
      fa: "داشبوردی برای اخبار، ابزارها، فرصت‌های شغلی و رویدادهای برنامه‌نویسی، با جمع‌آوری محتوا از وب و فیلدهای قابل‌تنظیم.",
    },
    problem: { en: [] },
    decision: { en: [] },
    result: { en: [] },
    stack: ["Next.js", "Tailwind CSS"],
    links: { live: "https://devtab.vercel.app/", repo: "https://github.com/mohammad-mghn/dev-tab" },
    cover: shot("dev-tab", 1, 2078, 1308, "Dev Tab dashboard", "داشبورد Dev Tab"),
    gallery: [shot("dev-tab", 2, 2078, 1308, "Feeds", "فیدها"), shot("dev-tab", 3, 2078, 1309, "Settings", "تنظیمات")],
  },
  {
    _id: "project.irtc",
    _type: "project",
    needsReview: true,
    slug: "irtc",
    order: 14,
    featured: false,
    group: "side",
    caseStudy: false,
    title: { en: "IRTC", fa: "IRTC" },
    year: "2023",
    sector: { en: "Education", fa: "آموزش" },
    kind: { en: "Learning platform", fa: "پلتفرم آموزشی" },
    scope: { en: ["Front-end", "Admin panel"], fa: ["فرانت‌اند", "پنل مدیریت"] },
    status: "offline",
    color: "#5B2A86",
    role: { en: "Front-end developer", fa: "توسعه‌دهندهٔ فرانت‌اند" },
    summary: {
      en: "Frontend for a learning platform for students and educators (client project, not launched): admin panel with roles, discussions, Excel export and JWT auth.",
      fa: "فرانت‌اند یک پلتفرم آموزشی برای دانشجویان و مدرسان (پروژهٔ مشتری، منتشر نشد): پنل مدیریت با نقش‌ها، گفت‌وگو، خروجی اکسل و احراز هویت JWT.",
    },
    problem: { en: [] },
    decision: { en: [] },
    result: { en: [] },
    stack: ["Next.js", "Tailwind CSS", "JWT"],
    links: { repo: "https://github.com/ecommerce-six/irtc-frontend" },
    cover: shot("irtc", 1, 2770, 1744, "IRTC home page", "صفحهٔ اصلی IRTC"),
    gallery: [],
  },
];
