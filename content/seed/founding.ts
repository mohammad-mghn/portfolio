/**
 * Founding page content: the ventures as companies, and the founder's story.
 * Facts come from LinkedIn (projects, experience, the Rooza post and Hassan Faraji's Agent Assist post).
 * Seed-only for now: the story is long-form copy that changes rarely.
 */
import type { L } from "@/lib/content/types";
import type { SeedImage } from "./site";

export type SeedVenture = {
  slug: string;
  name: L;
  role: L;
  since: string;
  partner: L;
  traction: L;
  summary: L;
  facts: L<string[]>;
  note: L<string[]>;
  links: { label: string; href: string }[];
  cover?: SeedImage;
};

export const ventures: SeedVenture[] = [
  {
    slug: "rooza",
    name: { en: "Rooza", fa: "روزا" },
    role: { en: "Co-founder & software engineer", fa: "هم‌بنیان‌گذار و مهندس نرم‌افزار" },
    since: "2025-09",
    partner: { en: "With Mahdi Khodadadi, product designer", fa: "با مهدی خدادادی، طراح محصول" },
    traction: { en: "3,000+ users", fa: "بیش از ۳٬۰۰۰ کاربر" },
    summary: {
      en: "A bilingual new-tab browser extension: widgets, bookmarks, three calendars and its own ad platform.",
      fa: "افزونهٔ دوزبانهٔ تب جدید مرورگر: ویجت‌ها، بوکمارک‌ها، سه تقویم و پلتفرم تبلیغاتی اختصاصی.",
    },
    facts: {
      en: [
        "On the Chrome Web Store and Firefox Add-ons",
        "Gregorian, Jalali and Hijri calendars, in English and Persian",
        "An ad platform with submission, review, approval and scheduling",
        "A timeline that shows advertisers everything from impression to click",
        "Analytics on background choices that improve suggestions over time",
      ],
      fa: [
        "در کروم وب‌استور و افزونه‌های فایرفاکس",
        "تقویم میلادی، شمسی و قمری، به فارسی و انگلیسی",
        "پلتفرم تبلیغات با ثبت، بررسی، تأیید و زمان‌بندی",
        "تایم‌لاینی که همه‌چیز را از نمایش تا کلیک به تبلیغ‌دهنده نشان می‌دهد",
        "آنالیتیکس انتخاب پس‌زمینه که پیشنهادها را به‌مرور بهتر می‌کند",
      ],
    },
    note: {
      en: [
        "Rooza started with a pull request. A few days before the 12-day war, I cloned Widgetify, my friend Sajjad Isvand's open-source new-tab project, and spent the next twelve days contributing to it, mostly unifying its design system. Sajjad merged it.",
        "I wrote a LinkedIn post about it. Mahdi Khodadadi, who was building something similar, read it and messaged me with two options: paid work, or building it together for equity. I needed the money at the time, but I chose equity. The product could be worth far more than a fee.",
        "Getting to a first version was hard. Personal, work and emotional problems piled up, and later the war and the internet shutdowns stopped our work completely. I brought in Hadis, a self-taught friend from university, to keep the project moving. I'd learned not to fight what I can't control, and to find a way to keep going inside it.",
        "So I refactored. A basic project became a product: a fast dashboard, a full ad platform with review, approval and scheduling, a timeline that shows advertisers everything from impression to click, and analytics that improve suggested backgrounds over time. The Chrome Web Store review held the launch back by about two months; Firefox Add-ons was smooth.",
        "Today Rooza has 3,000+ users, and Mahdi and I keep shipping updates from their feedback.",
      ],
      fa: [
        "روزا با یک مشارکت متن‌باز شروع شد. چند روز قبل از جنگ ۱۲ روزه، Widgetify، پروژهٔ متن‌باز تب جدیدِ رفیقم Sajjad Isvand، را کلون کردم و دوازده روز رویش کار کردم؛ بیشترش یکپارچه کردن دیزاین سیستمش بود. Sajjad هم مرجش کرد.",
        "دربارهٔ همین کار در لینکدین پست گذاشتم. مهدی خدادادی که روی محصول مشابهی کار می‌کرد، پست را دید و دو پیشنهاد داد: یا پروژه‌ای در ازای پول، یا ساختنش با هم در ازای سهم. آن موقع به آن پول نیاز داشتم، اما سهم را انتخاب کردم؛ این محصول می‌توانست خیلی بیشتر از یک دستمزد ارزش داشته باشد.",
        "رسیدن به نسخهٔ اول سخت بود. مشکلات شخصی، کاری و روحی پشت هم آمدند و بعدتر جنگ و قطعی اینترنت کارمان را کاملاً متوقف کرد. حدیث، دوست خودآموزم از دانشگاه، را به تیم آوردم تا پروژه نخوابد. یاد گرفته بودم با چیزی که کنترلش دست من نیست نجنگم و همان وسط راهی برای ادامه دادن پیدا کنم.",
        "پس نشستم پای ریفکتور. یک پروژهٔ ساده به محصول تبدیل شد: داشبوردی سریع، پلتفرم کامل تبلیغات با بررسی، تأیید و زمان‌بندی، تایم‌لاینی که همه‌چیز را از نمایش تا کلیک به تبلیغ‌دهنده نشان می‌دهد، و آنالیتیکسی که پس‌زمینه‌های پیشنهادی را به‌مرور بهتر می‌کند. بررسی کروم وب‌استور حدود دو ماه انتشار را عقب انداخت؛ افزونه‌های فایرفاکس اما روان بود.",
        "امروز روزا بیش از ۳٬۰۰۰ کاربر دارد و من و مهدی بر اساس بازخورد همین کاربرها به‌روزرسانی منتشر می‌کنیم.",
      ],
    },
    links: [
      { label: "rooza.space", href: "https://rooza.space" },
    ],
    cover: { src: "/work/rooza/1.jpg", width: 1672, height: 941, alt: { en: "Rooza", fa: "روزا" } },
  },
  {
    slug: "agent-assist",
    name: { en: "Agent Assist", fa: "Agent Assist" },
    role: { en: "Built with Hassan Faraji", fa: "ساخته‌شده با حسن فرجی" },
    since: "2026-06",
    partner: { en: "With Hassan Faraji, customer experience lead", fa: "با حسن فرجی، متخصص تجربهٔ مشتری" },
    traction: { en: "100+ support agents", fa: "بیش از ۱۰۰ کارشناس پشتیبانی" },
    summary: {
      en: "A browser extension that brings approved replies into helpdesks, CRMs, chat widgets and email.",
      fa: "افزونه‌ای که پاسخ‌های تأییدشده را به هلپ‌دسک، CRM، ویجت چت و ایمیل می‌آورد.",
    },
    facts: {
      en: [
        "Used by 100+ support agents at companies including Digikala and Mobinnet",
        "Type / for team snippets or # for quick temporary replies",
        "Works in any text field, with no integration",
        "Free for anyone to use",
      ],
      fa: [
        "مورد استفادهٔ بیش از ۱۰۰ کارشناس پشتیبانی در شرکت‌هایی مثل دیجی‌کالا و مبین‌نت",
        "/ برای پاسخ‌های تیمی و # برای پاسخ‌های موقت",
        "در هر فیلد متنی، بدون هیچ یکپارچه‌سازی",
        "رایگان برای همه",
      ],
    },
    note: {
      en: [
        "Hassan Faraji has spent years running contact centres. Agents there type the same replies all day, and anything typed in a hurry ends up incomplete or inconsistent in the CRM.",
        "We built Agent Assist so an agent types a short trigger and gets the full, standardised reply, without switching tabs. It started as an extension, and it's free.",
      ],
      fa: [
        "حسن فرجی سال‌ها در مراکز تماس کار کرده است. کارشناس‌ها آن‌جا هر روز همان پاسخ‌ها را تایپ می‌کنند و هر چیزی که با عجله وارد شود، در CRM ناقص یا ناهماهنگ ثبت می‌شود.",
        "Agent Assist را ساختیم تا کارشناس با یک تریگر کوتاه، پاسخ کامل و استاندارد را بگیرد، بدون عوض کردن تب. کار را با یک افزونه شروع کردیم و رایگان است.",
      ],
    },
    links: [{ label: "agentboost.ir", href: "https://agentboost.ir/en" }],
    cover: { src: "/work/agent-assist/1.png", width: 2078, height: 1239, alt: { en: "Agent Assist dashboard", fa: "داشبورد Agent Assist" } },
  },
];
