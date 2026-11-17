/**
 * Seed content: projects. Facts come from Mohammad's LinkedIn (experience, projects and
 * recommendations, read 17 Nov 2026) plus the products' own repos for stack details.
 * No invented metrics. Order = homepage and /work order: co-founded products, client projects, open source.
 * Full-time jobs (Nobar, RCOINX, Pishgaman Farda) are experience roles in journey.ts, not projects; a client
 * project that was built inside a job or as a freelancer points at that role with `builtAt`.
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
  /** cofounded = products Mohammad co-founded, client = client projects, personal = open source and personal. */
  group: "cofounded" | "client" | "personal";
  /** The experience role (`_id` in journey.ts) this was built in: a full-time job or the freelance years. */
  builtAt?: string;
  /** Who it was co-founded with, e.g. "Co-founded with Mahdi Khodadadi". */
  partner?: L;
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
  // ── Co-founded products ─────────────────────────────────────────────────────────
  {
    _id: "project.rooza",
    _type: "project",
    needsReview: true,
    slug: "rooza",
    order: 1,
    featured: true,
    group: "cofounded",
    caseStudy: true,
    title: { en: "Rooza", fa: "روزا" },
    year: "2025",
    sector: { en: "Productivity", fa: "بهره‌وری" },
    kind: { en: "New-tab extension & platform", fa: "افزونهٔ تب جدید و پلتفرم" },
    scope: { en: ["Co-founder", "Extension", "Back-end", "Ad platform"], fa: ["هم‌بنیان‌گذار", "افزونه", "بک‌اند", "پلتفرم تبلیغات"] },
    status: "live",
    color: "#7E1418",
    role: { en: "Co-founder & software engineer", fa: "هم‌بنیان‌گذار و مهندس نرم‌افزار" },
    partner: { en: "Co-founded with Mahdi Khodadadi", fa: "هم‌بنیان‌گذار: مهدی خدادادی" },
    summary: {
      en: "A bilingual new-tab browser extension with 3,000+ users, three calendars, widgets and its own ad platform. Co-founded with Mahdi Khodadadi.",
      fa: "افزونهٔ دوزبانهٔ تب جدید مرورگر با بیش از ۳٬۰۰۰ کاربر، سه تقویم، ویجت و پلتفرم تبلیغات خودش. با مهدی خدادادی بنیان گذاشتیم.",
    },
    problem: {
      en: [
        "The new tab is the page people open most, yet it usually shows nothing personal, and nothing in the Persian calendar.",
        "Rooza set out to turn it into a fast, personal start page in English and Persian, and to make it sustainable with an advertising model.",
      ],
      fa: [
        "تب جدید صفحه‌ای است که بیشتر از هر صفحهٔ دیگری باز می‌شود، ولی معمولاً نه چیز شخصی‌ای در آن هست و نه تقویم شمسی.",
        "می‌خواستیم روزا آن را به صفحهٔ شروعی سریع و شخصی تبدیل کند، به فارسی و انگلیسی، و با یک مدل تبلیغاتی روی پای خودش بایستد.",
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
        "یک داشبورد تب جدیدِ قابل‌شخصی‌سازی؛ با ویجت، بوکمارک، سه تقویم (شمسی، میلادی و قمری) و پشتیبانی کامل از فارسی و انگلیسی در چیدمان راست‌به‌چپ و چپ‌به‌راست.",
        "یک داشبورد مدیریت تبلیغات: ثبت تبلیغ، بررسی و تأیید، زمان‌بندی، و تایم‌لاینی که از نمایش تا کلیک همه‌چیز را به تبلیغ‌دهنده نشان می‌دهد.",
        "تحلیل انتخاب پس‌زمینه‌ها، تا پس‌زمینه‌های پیشنهادی به‌مرور بهتر شوند.",
        "افزونه با WXT و بر پایهٔ MV3 ساخته شده، API با Node و MongoDB، و کل استک با Docker Compose بالا می‌آید."
      ],
    },
    result: {
      en: ["Live on the Chrome Web Store and Firefox Add-ons with 3,000+ users, shipping regular updates based on user feedback."],
      fa: ["روی Chrome Web Store و Firefox Add-ons منتشر شده، بیش از ۳٬۰۰۰ کاربر دارد و با بازخورد کاربرها مرتب به‌روز می‌شود."],
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
    group: "cofounded",
    caseStudy: true,
    title: { en: "Agent Assist", fa: "Agent Assist" },
    year: "2026",
    sector: { en: "Customer support", fa: "پشتیبانی مشتری" },
    kind: { en: "Browser extension", fa: "افزونهٔ مرورگر" },
    scope: { en: ["Co-founder", "Extension", "Front-end"], fa: ["هم‌بنیان‌گذار", "افزونه", "فرانت‌اند"] },
    status: "live",
    color: "#1F2A44",
    role: { en: "Co-founder & software engineer", fa: "هم‌بنیان‌گذار و مهندس نرم‌افزار" },
    partner: { en: "Co-founded with Hassan Faraji", fa: "هم‌بنیان‌گذار: حسن فرجی" },
    summary: {
      en: "A browser extension used by 100+ support agents at companies including Digikala and Mobinnet: type / or # to insert an approved reply without switching tabs. Co-founded with Hassan Faraji.",
      fa: "افزونهٔ مرورگری که بیش از ۱۰۰ کارشناس پشتیبانی در شرکت‌هایی مثل دیجی‌کالا و مبین‌نت از آن استفاده می‌کنند: با تایپ / یا # پاسخ تأییدشده را می‌نویسند، بدون این‌که تب عوض کنند. با حسن فرجی بنیان گذاشتیم.",
    },
    problem: {
      en: [
        "Support, sales and operations teams send the same messages all day.",
        "Copy-pasting from docs is slow, and switching tabs to find the right reply breaks the flow of a conversation.",
      ],
      fa: [
        "تیم‌های پشتیبانی، فروش و عملیات تمام روز همان پیام‌های تکراری را می‌فرستند.",
        "کپی کردن از فایل‌ها کند است و هر بار رفتن به یک تب دیگر برای پیدا کردن پاسخ درست، رشتهٔ گفت‌وگو را از دست آدم می‌برد.",
      ],
    },
    decision: {
      en: [
        "Two triggers for two workflows: /name for team-approved snippets grouped in categories, #name for quick temporary replies.",
        "Works in any text field, so it fits helpdesks, CRMs, chat widgets and email without a single integration.",
        "JSON import and export to share libraries between agents, and a built-in test panel to try triggers before a live ticket.",
      ],
      fa: [
        "دو میان‌بر برای دو جور کار: \u200e/name برای پاسخ‌های تأییدشدهٔ تیم که دسته‌بندی شده‌اند، و \u200e#name برای پاسخ‌های سریع و موقت.",
        "در هر فیلد متنی کار می‌کند؛ برای همین بدون اتصال به هیچ سیستمی، در هلپ‌دسک، CRM، ویجت چت و ایمیل جواب می‌دهد.",
        "ورود و خروجی JSON برای این‌که کارشناس‌ها مجموعهٔ پاسخ‌هایشان را با هم به اشتراک بگذارند، و یک پنل تست برای امتحان کردن میان‌برها قبل از تیکت واقعی."
      ],
    },
    result: {
      en: ["Used by 100+ support agents at companies including Digikala and Mobinnet, and free for anyone to use."],
      fa: ["بیش از ۱۰۰ کارشناس پشتیبانی در شرکت‌هایی مثل دیجی‌کالا و مبین‌نت از آن استفاده می‌کنند و برای همه رایگان است."],
    },
    stack: ["WXT", "React", "TypeScript", "Tailwind CSS", "Next.js"],
    links: { live: "https://agentboost.ir/en", repo: "https://github.com/mohammad-mghn/agent-assist" },
    cover: { src: "/work/agent-assist/live.jpg", width: 2000, height: 1250, alt: { en: "Agent Assist website", fa: "وب‌سایت Agent Assist" } },
    gallery: [
      shot("agent-assist", 1, 2078, 1239, "Agent Assist dashboard", "داشبورد Agent Assist"),
      shot("agent-assist", 2, 2078, 1228, "Agent Assist in Persian", "Agent Assist به فارسی"),
      shot("agent-assist", 3, 2078, 1246, "Inline snippet menu", "منوی پاسخ‌ها هنگام تایپ"),
    ],
  },

  // ── Client work ──────────────────────────────────────────────────────────
  {
    _id: "project.salecar",
    _type: "project",
    needsReview: true,
    slug: "salecar",
    order: 3,
    featured: true,
    group: "client",
    caseStudy: true,
    builtAt: "experience.pishgaman-frontend",
    title: { en: "SaleCar", fa: "SaleCar" },
    year: "2024",
    sector: { en: "Automotive marketplace", fa: "مارکت‌پلیس خودرو" },
    kind: { en: "Marketplace", fa: "مارکت‌پلیس" },
    scope: { en: ["Front-end", "UI/UX", "Dashboards"], fa: ["فرانت‌اند", "UI/UX", "داشبورد"] },
    status: "live",
    color: "#14302F",
    location: { en: "United Arab Emirates", fa: "امارات متحدهٔ عربی" },
    role: { en: "Frontend engineer", fa: "مهندس فرانت‌اند" },
    summary: {
      en: "A car marketplace for the UAE: listings, sales tracking, payments, buyer and seller dashboards, an admin panel, and search and filtering.",
      fa: "مارکت‌پلیس خودرو برای بازار امارات: آگهی، پیگیری فروش، پرداخت، داشبورد خریدار و فروشنده، پنل ادمین و جست‌وجو و فیلتر.",
    },
    problem: {
      en: ["SaleCar, the largest project at Pishgaman Farda, needed a full marketplace for buying and selling cars in the UAE market."],
      fa: [
        "SaleCar بزرگ‌ترین پروژهٔ پیشگامان فردا بود و یک مارکت‌پلیس کامل برای خرید و فروش خودرو در بازار امارات لازم داشت."
      ],
    },
    decision: {
      en: [
        "Built car listings, sales tracking, payments, buyer and seller dashboards, an admin panel, and search and filtering.",
        "Many of the UI/UX improvements were my own suggestions, shipped through changing requirements.",
      ],
      fa: [
        "آگهی خودرو، پیگیری فروش، پرداخت، داشبورد خریدار و فروشنده، پنل ادمین و جست‌وجو و فیلتر را ساختم.",
        "خیلی از بهبودهای UI/UX پیشنهاد خودم بود و با وجود تغییر مدام نیازمندی‌ها، همه را به نتیجه رساندم."
      ],
    },
    result: {
      en: [
        "Part of the platforms that reached 5,000+ users across the UAE and Germany, according to the client.",
        "“His contributions to the UI/UX of salecar.ae went far beyond coding.” Mohammad Shahi, backend developer on the project.",
      ],
      fa: [
        "یکی از پلتفرم‌هایی که به گفتهٔ مشتری، در امارات و آلمان روی هم به بیش از ۵٬۰۰۰ کاربر رسیدند.",
        "«کار او روی UI/UX سایت salecar.ae خیلی فراتر از کدنویسی بود.» Mohammad Shahi، توسعه‌دهندهٔ بک‌اند پروژه، در توصیه‌نامه‌اش (ترجمه)."
      ],
    },
    stack: ["Next.js", "React"],
    links: { live: "https://salecar.ae" },
    cover: cover("salecar", "SaleCar home page", "صفحهٔ اصلی SaleCar"),
    gallery: [],
  },
  {
    _id: "project.lusyman",
    _type: "project",
    needsReview: true,
    slug: "lusyman",
    order: 4,
    featured: true,
    group: "client",
    caseStudy: true,
    builtAt: "experience.freelance",
    title: { en: "Lusyman", fa: "لوسیمن" },
    year: "2021",
    sector: { en: "E-commerce", fa: "فروشگاه اینترنتی" },
    kind: { en: "Online shop", fa: "فروشگاه آنلاین" },
    scope: { en: ["Front-end lead", "Dashboard"], fa: ["لید فرانت‌اند", "داشبورد"] },
    status: "live",
    color: "#5A3B2E",
    role: { en: "Front-end lead (freelance)", fa: "لید فرانت‌اند (فریلنس)" },
    summary: {
      en: "An online shop whose website and dashboard I built with 2 junior developers. It reached about 1,000 daily users and 100,000+ monthly visits.",
      fa: "فروشگاه آنلاینی که وب‌سایت و داشبوردش را با ۲ توسعه‌دهندهٔ جونیور ساختم. به حدود ۱٬۰۰۰ کاربر روزانه و بیش از ۱۰۰ هزار بازدید ماهانه رسید.",
    },
    problem: {
      en: ["The shop needed a website and an admin dashboard built from the employer's designs."],
      fa: [
        "فروشگاه یک وب‌سایت و یک داشبورد مدیریت می‌خواست که از روی طراحی کارفرما ساخته شود."
      ],
    },
    decision: {
      en: ["Led 2 junior developers building the website and dashboard frontend, using Redux and React Query."],
      fa: [
        "۲ توسعه‌دهندهٔ جونیور را هدایت کردم تا فرانت‌اند وب‌سایت و داشبورد را با Redux و React Query بسازیم."
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
    order: 5,
    featured: false,
    group: "client",
    caseStudy: true,
    builtAt: "experience.pishgaman-senior",
    title: { en: "Sinkara CEM", fa: "Sinkara CEM" },
    year: "2024",
    sector: { en: "Customer experience", fa: "تجربهٔ مشتری" },
    kind: { en: "CEM platform", fa: "پلتفرم CEM" },
    scope: { en: ["Front-end lead", "Architecture", "Mentoring"], fa: ["لید فرانت‌اند", "معماری", "منتورینگ"] },
    status: "offline",
    color: "#2E4A3F",
    role: { en: "Senior frontend engineer", fa: "مهندس ارشد فرانت‌اند" },
    summary: {
      en: "Led the frontend of the Sinkara CEM platform, building its core structure and components from scratch and mentoring 2 developers.",
      fa: "فرانت‌اند پلتفرم Sinkara CEM را هدایت کردم: ساختار اصلی و کامپوننت‌ها را از صفر ساختم و منتور ۲ توسعه‌دهنده بودم.",
    },
    problem: {
      en: ["A new platform needed its frontend structure and components built from scratch."],
      fa: [
        "یک پلتفرم تازه بود و باید ساختار و کامپوننت‌های فرانت‌اندش از صفر ساخته می‌شد."
      ],
    },
    decision: {
      en: [
        "Built the core structure and components from scratch with JavaScript.",
        "Led and mentored 2 developers, including code reviews, and wrote technical documentation to support future development.",
      ],
      fa: [
        "ساختار اصلی و کامپوننت‌ها را از صفر با JavaScript ساختم.",
        "۲ توسعه‌دهنده را هدایت کردم، منتورشان بودم و کدهایشان را ریویو کردم. برای توسعهٔ بعدی هم مستندات فنی نوشتم."
      ],
    },
    result: {
      en: ["Researched and applied improvements to the frontend user experience."],
      fa: [
        "برای بهتر شدن تجربهٔ کاربری تحقیق کردم و نتیجه‌اش را در فرانت‌اند پیاده کردم."
      ],
    },
    stack: ["JavaScript"],
    links: {},
    gallery: [],
  },
  {
    _id: "project.rehansa",
    _type: "project",
    needsReview: true,
    slug: "rehansa",
    order: 6,
    featured: false,
    group: "client",
    caseStudy: false,
    builtAt: "experience.pishgaman-frontend",
    title: { en: "Rehansa", fa: "رهانسا" },
    year: "2024",
    sector: { en: "Technology services", fa: "خدمات فناوری" },
    kind: { en: "Company site", fa: "وب‌سایت شرکتی" },
    scope: { en: ["Shared UI", "Multilingual"], fa: ["رابط کاربری مشترک", "چندزبانه"] },
    status: "live",
    color: "#1D2A6B",
    client: { en: "Rehansa", fa: "رهانسا" },
    location: { en: "Germany", fa: "آلمان" },
    role: { en: "Frontend engineer", fa: "مهندس فرانت‌اند" },
    summary: {
      en: "A multilingual company site for a German client, part of the shared UI I built for a German startup's clients.",
      fa: "وب‌سایت شرکتی چندزبانه برای یک مشتری آلمانی؛ بخشی از رابط کاربری مشترکی که برای مشتری‌های یک استارتاپ آلمانی ساختم.",
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
    order: 7,
    featured: false,
    group: "client",
    caseStudy: false,
    builtAt: "experience.pishgaman-frontend",
    title: { en: "Pishgaman Tose Tejarat Farda", fa: "پیشگامان توسعه تجارت فردا" },
    year: "2024",
    sector: { en: "Technology services", fa: "خدمات فناوری" },
    kind: { en: "Company site", fa: "وب‌سایت شرکتی" },
    scope: { en: ["Shared UI", "Multilingual"], fa: ["رابط کاربری مشترک", "چندزبانه"] },
    status: "live",
    color: "#0A5C52",
    location: { en: "Iran", fa: "ایران" },
    role: { en: "Frontend engineer", fa: "مهندس فرانت‌اند" },
    summary: {
      en: "A multilingual company site in Persian and English, part of the same shared UI.",
      fa: "وب‌سایت شرکتی به فارسی و انگلیسی؛ بخشی از همان رابط کاربری مشترک.",
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
    order: 8,
    featured: false,
    group: "client",
    caseStudy: false,
    builtAt: "experience.pishgaman-frontend",
    title: { en: "Venus", fa: "ونوس" },
    year: "2024",
    sector: { en: "IT consultancy", fa: "مشاورهٔ IT" },
    kind: { en: "B2B website", fa: "وب‌سایت B2B" },
    scope: { en: ["Front-end"], fa: ["فرانت‌اند"] },
    status: "live",
    color: "#0E6B5C",
    role: { en: "Frontend engineer", fa: "مهندس فرانت‌اند" },
    summary: {
      en: "A B2B technology website, built at Pishgaman Farda.",
      fa: "یک وب‌سایت B2B در حوزهٔ فناوری که در پیشگامان فردا ساختم.",
    },
    problem: { en: [] },
    decision: { en: [] },
    result: { en: [] },
    stack: ["Next.js", "React"],
    links: { live: "https://www.venus-itc.com/" },
    cover: cover("venus-itc", "Venus home page", "صفحهٔ اصلی ونوس"),
    gallery: [],
  },

  // ── Open source and personal (IRTC, last, is a freelance client project) ────────────────────────────────────────────────────────
  {
    _id: "project.windows-11",
    _type: "project",
    needsReview: true,
    slug: "windows-11",
    order: 10,
    featured: true,
    group: "personal",
    caseStudy: false,
    title: { en: "Windows 11 On Web", fa: "Windows 11 On Web" },
    year: "2022",
    sector: { en: "Open source", fa: "متن‌باز" },
    kind: { en: "Web OS", fa: "سیستم‌عامل در مرورگر" },
    scope: { en: ["Open source", "React", "Redux"], fa: ["متن‌باز", "React", "Redux"] },
    status: "live",
    color: "#0B4F8A",
    role: { en: "Solo builder", fa: "سازنده، تک‌نفره" },
    summary: {
      en: "A Windows 11 simulation that runs in the browser, built with React and Redux. 140+ GitHub stars.",
      fa: "شبیه‌ساز ویندوز ۱۱ که در مرورگر اجرا می‌شود؛ با React و Redux. بیش از ۱۴۰ ستاره در گیت‌هاب.",
    },
    problem: { en: [] },
    decision: { en: [] },
    result: { en: ["Open source with 140+ GitHub stars, live at wins11.ir."], fa: ["متن‌باز، با بیش از ۱۴۰ ستاره در گیت‌هاب. روی wins11.ir در دسترس است."] },
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
    _id: "project.widgetify",
    _type: "project",
    needsReview: true,
    slug: "widgetify",
    order: 11,
    featured: false,
    group: "personal",
    caseStudy: false,
    title: { en: "Widgetify", fa: "ویجتیفای" },
    year: "2025",
    sector: { en: "Open source", fa: "متن‌باز" },
    kind: { en: "New-tab extension", fa: "افزونهٔ تب جدید" },
    scope: { en: ["Open-source contributor", "UI", "Design system"], fa: ["مشارکت متن‌باز", "رابط کاربری", "دیزاین سیستم"] },
    status: "live",
    color: "#1B2550",
    role: { en: "Contributor", fa: "مشارکت‌کننده" },
    // Numbers are from GitHub (pull requests by mohammad-mghn in widgetify-app/widgetify-extension, read 18 Nov 2026).
    summary: {
      en: "An open-source new-tab extension by Sajjad Isvand that I contributed to in summer 2025: 27 merged pull requests that gave its widgets one consistent look and added a notification centre, an analog clock and a hide mode.",
      fa: "افزونهٔ متن‌باز تب جدید، ساختهٔ Sajjad Isvand، که تابستان ۲۰۲۵ در آن مشارکت کردم: ۲۷ پول‌ریکوئستِ مرج‌شده که ظاهر ویجت‌ها را یکدست کرد و مرکز اعلان‌ها، ساعت عقربه‌ای و حالت مخفی را اضافه کرد.",
    },
    problem: { en: [] },
    decision: { en: [] },
    result: {
      en: ["27 of my 29 pull requests were merged between June and August 2025. This work is what led to Rooza."],
      fa: ["از ۲۹ پول‌ریکوئست من، ۲۷ تا بین ژوئن و اوت ۲۰۲۵ مرج شد. روزا از دل همین کار بیرون آمد."],
    },
    stack: ["WXT", "React", "TypeScript", "Tailwind CSS"],
    links: { live: "https://widgetify.ir/", repo: "https://github.com/widgetify-app/widgetify-extension" },
    cover: shot("widgetify", 1, 1600, 1000, "Widgetify website", "وب‌سایت ویجتیفای"),
    gallery: [],
  },
  {
    _id: "project.devs-event",
    _type: "project",
    needsReview: true,
    slug: "devs-event",
    order: 12,
    featured: false,
    group: "personal",
    caseStudy: false,
    title: { en: "Devs Event", fa: "Devs Event" },
    year: "2022",
    sector: { en: "Community", fa: "جامعهٔ برنامه‌نویس‌ها" },
    kind: { en: "Events website", fa: "وب‌سایت رویدادها" },
    scope: { en: ["Front-end", "Remote team"], fa: ["فرانت‌اند", "تیم دورکار"] },
    status: "offline",
    color: "#3A3F1F",
    role: { en: "Front-end developer, with Mahdi Nazari", fa: "توسعه‌دهندهٔ فرانت‌اند، با مهدی نظری" },
    summary: {
      en: "A community website for people who want to join programming events. My first project on a remote team.",
      fa: "وب‌سایتی برای کسانی که می‌خواهند در رویدادهای برنامه‌نویسی شرکت کنند. اولین پروژه‌ام در یک تیم دورکار بود.",
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
    group: "personal",
    caseStudy: false,
    title: { en: "Dev Tab", fa: "Dev Tab" },
    year: "2022",
    sector: { en: "Developer tools", fa: "ابزار برنامه‌نویس‌ها" },
    kind: { en: "News dashboard", fa: "داشبورد خبر" },
    scope: { en: ["Full-stack", "Scraping"], fa: ["فول‌استک", "وب‌اسکرپینگ"] },
    status: "live",
    color: "#2B2B2B",
    role: { en: "Full-stack developer", fa: "توسعه‌دهندهٔ فول‌استک" },
    summary: {
      en: "A dashboard for developer news, tools, jobs and events, with web scraping to collect content and customizable fields.",
      fa: "داشبوردی برای اخبار، ابزارها، فرصت‌های شغلی و رویدادهای برنامه‌نویسی؛ محتوا را با وب‌اسکرپینگ جمع می‌کند و بخش‌هایش قابل‌تنظیم است.",
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
    order: 9,
    featured: false,
    group: "client",
    caseStudy: false,
    builtAt: "experience.freelance",
    title: { en: "IRTC", fa: "IRTC" },
    year: "2023",
    sector: { en: "Education", fa: "آموزش" },
    kind: { en: "Learning platform", fa: "پلتفرم آموزشی" },
    scope: { en: ["Front-end", "Admin panel"], fa: ["فرانت‌اند", "پنل ادمین"] },
    status: "offline",
    color: "#5B2A86",
    role: { en: "Front-end developer", fa: "توسعه‌دهندهٔ فرانت‌اند" },
    summary: {
      en: "Frontend for a learning platform for students and educators (client project, not launched): admin panel with roles, discussions, Excel export and JWT auth.",
      fa: "فرانت‌اند یک پلتفرم آموزشی برای دانشجوها و مدرس‌ها (پروژهٔ مشتری که منتشر نشد): پنل ادمین با سطح دسترسی، بخش گفت‌وگو، خروجی اکسل و احراز هویت JWT.",
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
