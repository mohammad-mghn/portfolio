/**
 * Founding page content: the ventures as companies, and the founder's story.
 * Facts come from LinkedIn (projects, experience, the Rooza post and Hassan Faraji's Agent Assist post).
 */
import type { L } from "@/lib/content/types";
import type { SeedImage } from "./site";

export type SeedVenture = {
  _id: string;
  _type: "venture";
  order: number;
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
    _id: "venture.rooza",
    _type: "venture",
    order: 1,
    slug: "rooza",
    name: { en: "Rooza", fa: "روزا" },
    role: { en: "Co-founder & software engineer", fa: "هم‌بنیان‌گذار و مهندس نرم‌افزار" },
    since: "2025-09",
    partner: { en: "With Mahdi Khodadadi, product designer", fa: "با مهدی خدادادی، طراح محصول" },
    traction: { en: "3,000+ users", fa: "بیش از ۳٬۰۰۰ کاربر" },
    summary: {
      en: "A bilingual new-tab browser extension: widgets, bookmarks, three calendars and its own ad platform.",
      fa: "افزونهٔ دوزبانهٔ تب جدید مرورگر: ویجت، بوکمارک، سه تقویم و پلتفرم تبلیغات خودش.",
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
        "منتشرشده روی Chrome Web Store و Firefox Add-ons",
        "تقویم شمسی، میلادی و قمری؛ به فارسی و انگلیسی",
        "پلتفرم تبلیغات با ثبت، بررسی، تأیید و زمان‌بندی",
        "تایم‌لاینی که از نمایش تا کلیک، همه‌چیز را به تبلیغ‌دهنده نشان می‌دهد",
        "تحلیل انتخاب پس‌زمینه‌ها که پیشنهادها را به‌مرور بهتر می‌کند",
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
        "روزا با یک پول‌ریکوئست شروع شد. چند روز قبل از جنگ ۱۲ روزه، Widgetify را کلون کردم؛ پروژهٔ متن‌باز تب جدیدِ دوستم، Sajjad Isvand. دوازده روز رویش کار کردم و بیشتر وقتم صرف یکدست کردن دیزاین سیستمش شد. سجاد هم مرجش کرد.",
        "دربارهٔ همین کار در لینکدین نوشتم. مهدی خدادادی که خودش چیز مشابهی می‌ساخت، پست را خواند و پیام داد. دو پیشنهاد داشت: یا دستمزد بگیرم و کار کنم، یا با هم بسازیمش و سهام داشته باشم. آن روزها به پول نیاز داشتم، ولی سهام را انتخاب کردم؛ این محصول می‌توانست خیلی بیشتر از یک دستمزد بیارزد.",
        "رسیدن به نسخهٔ اول سخت بود. مشکلات شخصی، کاری و روحی روی هم جمع شد و بعدتر جنگ و قطعی اینترنت کار را کاملاً خواباند. حدیث را که دوست خودآموزم در دانشگاه است به تیم آوردم تا پروژه از حرکت نایستد. یاد گرفته بودم با چیزی که دست من نیست نجنگم و وسط همان شرایط راهی برای ادامه دادن پیدا کنم.",
        "پس همه‌چیز را ریفکتور کردم. یک پروژهٔ ساده تبدیل شد به محصول: داشبوردی سریع، پلتفرم کامل تبلیغات با بررسی، تأیید و زمان‌بندی، تایم‌لاینی که از نمایش تا کلیک همه‌چیز را به تبلیغ‌دهنده نشان می‌دهد، و تحلیلی که پس‌زمینه‌های پیشنهادی را به‌مرور بهتر می‌کند. بررسی Chrome Web Store انتشار را حدود دو ماه عقب انداخت؛ Firefox Add-ons بی‌دردسر بود.",
        "امروز روزا بیش از ۳٬۰۰۰ کاربر دارد و من و مهدی با بازخورد همین کاربرها مدام به‌روزرسانی می‌دهیم.",
      ],
    },
    links: [
      { label: "rooza.space", href: "https://rooza.space" },
    ],
    cover: { src: "/work/rooza/1.jpg", width: 1672, height: 941, alt: { en: "Rooza", fa: "روزا" } },
  },
  {
    _id: "venture.agent-assist",
    _type: "venture",
    order: 2,
    slug: "agent-assist",
    name: { en: "Agent Assist", fa: "Agent Assist" },
    role: { en: "Co-founder & software engineer", fa: "هم‌بنیان‌گذار و مهندس نرم‌افزار" },
    since: "2026-06",
    partner: { en: "With Hassan Faraji, customer experience lead", fa: "با حسن فرجی، متخصص تجربهٔ مشتری" },
    traction: { en: "100+ support agents", fa: "بیش از ۱۰۰ کارشناس پشتیبانی" },
    summary: {
      en: "A browser extension that brings approved replies into helpdesks, CRMs, chat widgets and email.",
      fa: "افزونه‌ای که پاسخ‌های آماده و تأییدشده را به هلپ‌دسک، CRM، ویجت چت و ایمیل می‌آورد.",
    },
    facts: {
      en: [
        "Used by 100+ support agents at companies including Digikala and Mobinnet",
        "Type / for team snippets or # for quick temporary replies",
        "Works in any text field, with no integration",
        "Free for anyone to use",
      ],
      fa: [
        "بیش از ۱۰۰ کارشناس پشتیبانی در شرکت‌هایی مثل دیجی‌کالا و مبین‌نت از آن استفاده می‌کنند",
        "با / پاسخ‌های تیمی، با # پاسخ‌های سریع و موقت",
        "در هر فیلد متنی کار می‌کند؛ بدون اتصال به هیچ سیستمی",
        "برای همه رایگان است",
      ],
    },
    note: {
      en: [
        "Hassan Faraji has spent years running contact centres. Agents there type the same replies all day, and anything typed in a hurry ends up incomplete or inconsistent in the CRM.",
        "We built Agent Assist so an agent types a short trigger and gets the full, standardised reply, without switching tabs. It started as an extension, and it's free.",
      ],
      fa: [
        "حسن فرجی سال‌ها مرکز تماس اداره کرده است. آن‌جا کارشناس‌ها تمام روز همان پاسخ‌های تکراری را تایپ می‌کنند و هر چیزی که با عجله نوشته شود، ناقص یا ناهماهنگ در CRM ثبت می‌شود.",
        "Agent Assist را ساختیم تا کارشناس با تایپ یک میان‌بر کوتاه، پاسخ کامل و استاندارد را بگیرد؛ بدون این‌که تب عوض کند. کار را با یک افزونه شروع کردیم و رایگان است.",
      ],
    },
    links: [{ label: "agentboost.ir", href: "https://agentboost.ir/en" }],
    cover: { src: "/work/agent-assist/1.png", width: 2078, height: 1239, alt: { en: "Agent Assist dashboard", fa: "داشبورد Agent Assist" } },
  },
];
