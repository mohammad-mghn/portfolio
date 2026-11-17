/**
 * Seed content: site settings, about (pillars, numbers, beliefs, quotes) and recommendations.
 * Source of truth: Mohammad's LinkedIn profile, read 17 Nov 2026
 * (~/Documents/Personal Brand /LinkedIn/account/profile-snapshot.md + profile-refresh-2026-11-17.md).
 * Recommendations are verbatim and stay in English on both locales.
 */
import type { L } from "@/lib/content/types";

export type SeedImage = { src: string; width: number; height: number; alt: L };

export const siteSettings = {
  _id: "siteSettings",
  _type: "siteSettings",
  needsReview: true,
  name: { en: "Mohammad Mohagheghian", fa: "محمد محققیان" },
  /** The text of the logo in the header and the menu. */
  shortName: "The Mohammad M.",
  tagline: { en: "Engineering · Founding · Product building", fa: "مهندسی · بنیان‌گذاری · محصول‌سازی" },
  headline: {
    en: "Software engineer, founder and product builder.",
    fa: "مهندس نرم‌افزار، بنیان‌گذار و محصول‌ساز.",
  },
  positioning: {
    en: "I build products end to end, from the interface to the backend and cloud behind it.",
    fa: "محصول را از صفر تا صد می‌سازم؛ از رابط کاربری تا بک‌اند و زیرساخت ابری.",
  },
  roles: [
    { title: { en: "Software Engineer", fa: "مهندس نرم‌افزار" }, org: { en: "Nobar", fa: "نوبر" } },
    { title: { en: "Co-founder", fa: "هم‌بنیان‌گذار" }, org: { en: "Rooza", fa: "روزا" }, href: "https://rooza.space" },
  ],
  location: { en: "Remote, worldwide", fa: "دورکار، از هر کجای دنیا" },
  email: "vito.mohagheghian@gmail.com",
  /** Google Calendar booking page. Leave empty to hide the "Book a call" button. */
  bookingUrl: "" as string,
  socials: [
    {
      label: "YouTube",
      href: "https://www.youtube.com/@mohammadmghn",
      handle: "@mohammadmghn",
      group: "content",
      blurb: {
        en: "Videos in Persian about engineering and building products.",
        fa: "ویدیوهای فارسی دربارهٔ مهندسی نرم‌افزار و محصول‌سازی.",
      },
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/mohammad.mohaghghian/",
      handle: "@mohammad.mohaghghian",
      group: "content",
      blurb: {
        en: "Short videos in Persian about tech and building in public.",
        fa: "ویدیوهای کوتاه فارسی دربارهٔ تکنولوژی و پشت‌صحنهٔ ساختن محصول‌هایم.",
      },
    },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/mohammad-mohagheghian/", handle: "mohammad-mohagheghian", group: "professional" },
    { label: "GitHub", href: "https://github.com/mohammad-mghn", handle: "mohammad-mghn", group: "professional" },
    { label: "X", href: "https://x.com/mohammadmghn", handle: "@mohammadmghn", group: "professional" },
    { label: "Telegram", href: "https://t.me/mohammadmghn", handle: "@mohammadmghn", group: "professional" },
  ],
  openTo: {
    en: ["Engineering roles", "Co-founding and partnerships", "Client projects"],
    fa: ["موقعیت‌های مهندسی", "هم‌بنیان‌گذاری و شراکت", "پروژه‌های سفارشی"],
  },
  seoTitle: {
    en: "Mohammad Mohagheghian · Software engineer, founder and product builder",
    fa: "محمد محققیان · مهندس نرم‌افزار، بنیان‌گذار و محصول‌ساز",
  },
  seoDescription: {
    en: "Software engineer at Nobar and co-founder of Rooza. I build products end to end, from the interface to the backend and cloud behind it.",
    fa: "مهندس نرم‌افزار در نوبر و هم‌بنیان‌گذار روزا. محصول را از صفر تا صد می‌سازم؛ از رابط کاربری تا بک‌اند و زیرساخت ابری.",
  },
} as const;

export const about = {
  _id: "about",
  _type: "about",
  needsReview: true,
  statement: {
    en: "I care about why something should work a certain way, not only how to build it.",
    fa: "فقط به این فکر نمی‌کنم که چیزی را چطور بسازم؛ اول می‌پرسم چرا باید این‌طور کار کند.",
  },
  bio: [
    {
      en: "I taught myself to code as a teenager and have been shipping for clients since 2021, including work for teams in the UAE and Germany.",
      fa: "برنامه‌نویسی را در نوجوانی و خودآموز یاد گرفتم. از ۲۰۲۱ برای مشتری‌ها محصول ساخته‌ام؛ از جمله برای تیم‌هایی در امارات و آلمان.",
    },
    {
      en: "At Nobar, a cloud company, I built the design system and frontend monorepo, then moved to backend to work closer to the infrastructure.",
      fa: "در نوبر، که یک شرکت خدمات ابری است، دیزاین سیستم و مونوریپوی فرانت‌اند را ساختم. بعد به بک‌اند رفتم تا به زیرساخت نزدیک‌تر شوم.",
    },
  ],
  outside: [
    {
      en: "Co-founder of Rooza, a bilingual new-tab browser extension with 3,000+ users",
      fa: "هم‌بنیان‌گذار روزا؛ افزونهٔ دوزبانهٔ تب جدید مرورگر با بیش از ۳٬۰۰۰ کاربر",
    },
    {
      en: "Co-founder of Agent Assist with Hassan Faraji, a tool used by 100+ support agents that brings approved replies into helpdesks, CRMs and email",
      fa: "هم‌بنیان‌گذار Agent Assist در کنار حسن فرجی؛ ابزاری که بیش از ۱۰۰ کارشناس پشتیبانی با آن پاسخ‌های آماده و تأییدشده را مستقیم در هلپ‌دسک، CRM و ایمیل می‌نویسند",
    },
    {
      en: "Technical Lead at my university's computer science association, leading 7 developers",
      fa: "لید فنی انجمن علمی علوم کامپیوتر دانشگاه اصفهان، با تیمی از ۷ توسعه‌دهنده",
    },
  ],
  closing: {
    en: "Message me to talk about products, backend or cloud.",
    fa: "دربارهٔ محصول، بک‌اند یا زیرساخت ابری حرفی دارید؟ پیام بدهید.",
  },
  numbers: [
    { value: { en: "3,000+", fa: "۳٬۰۰۰+" }, label: { en: "Rooza users", fa: "کاربر روزا" } },
    { value: { en: "100+", fa: "۱۰۰+" }, label: { en: "Support agents on Agent Assist", fa: "کارشناس پشتیبانی با Agent Assist" } },
    { value: { en: "140+", fa: "۱۴۰+" }, label: { en: "GitHub stars on Windows 11 On Web", fa: "ستارهٔ گیت‌هاب Windows 11 On Web" } },
    { value: { en: "100K+", fa: "۱۰۰ هزار+" }, label: { en: "Monthly visits on Lusyman", fa: "بازدید ماهانهٔ لوسیمن" } },
    { value: { en: "2021", fa: "۲۰۲۱" }, label: { en: "Building since", fa: "از این سال می‌سازم" } },
  ],
  pillars: [
    {
      key: "engineering",
      title: { en: "Engineering", fa: "مهندسی" },
      proof: {
        en: "I build the server side of a cloud platform at Nobar. Before that I built its interface: 100+ reusable components used across its products.",
        fa: "در نوبر بک‌اند یک پلتفرم ابری را می‌سازم. قبل از آن فرانت‌اندش را ساخته بودم: بیش از ۱۰۰ کامپوننت که در همهٔ محصولات نوبر استفاده می‌شود.",
      },
      points: {
        // Plain words on the home page; the technology names live on /engineering.
        en: ["Backend services for a cloud platform", "A design system of 100+ components", "A captcha product built from scratch"],
        fa: ["سرویس‌های بک‌اند یک پلتفرم ابری", "دیزاین سیستمی با بیش از ۱۰۰ کامپوننت", "یک سرویس کپچا، ساخته‌شده از صفر"],
      },
      href: "/engineering",
    },
    {
      key: "founding",
      title: { en: "Founding", fa: "بنیان‌گذاری" },
      proof: {
        en: "Co-founder of Rooza, a new-tab extension with 3,000+ users, and of Agent Assist, used by 100+ support agents at Digikala and Mobinnet.",
        fa: "هم‌بنیان‌گذار روزا، افزونهٔ تب جدید با بیش از ۳٬۰۰۰ کاربر، و Agent Assist که بیش از ۱۰۰ کارشناس پشتیبانی در دیجی‌کالا و مبین‌نت با آن کار می‌کنند.",
      },
      points: {
        en: ["Rooza · co-founder", "Agent Assist · co-founder", "Chose equity over cash"],
        fa: ["روزا · هم‌بنیان‌گذار", "Agent Assist · هم‌بنیان‌گذار", "سهام را به دستمزد ترجیح دادم"],
      },
      href: "/founding",
    },
    {
      key: "product",
      title: { en: "Product building", fa: "محصول‌سازی" },
      proof: {
        en: "From idea to launch: design, interface, backend and release, for my own products and for clients in the UAE, Germany and Iran.",
        fa: "از ایده تا انتشار: طراحی، رابط کاربری، بک‌اند و عرضه؛ هم برای محصولات خودم، هم برای مشتری‌هایی در امارات، آلمان و ایران.",
      },
      points: {
        en: ["SaleCar · car marketplace in the UAE", "Windows 11 On Web · 140+ GitHub stars", "Lusyman · 100K+ monthly visits"],
        fa: ["SaleCar · مارکت‌پلیس خودرو در امارات", "Windows 11 On Web · بیش از ۱۴۰ ستاره در گیت‌هاب", "لوسیمن · بیش از ۱۰۰ هزار بازدید ماهانه"],
      },
      href: "/work",
    },
  ],
  beliefs: [
    {
      text: {
        en: "I don't wait for opportunities. I go and take them.",
        fa: "منتظر فرصت نمی‌مانم؛ خودم می‌روم و شکارش می‌کنم.",
      },
    },
    {
      text: {
        en: "Luck isn't found. It's built, one shipped thing at a time.",
        fa: "شانس پیداکردنی نیست، ساختنی است؛ با هر چیزی که می‌سازی و منتشر می‌کنی.",
      },
    },
    {
      text: {
        en: "Obsession is the edge. Everything else can be learned.",
        fa: "برگ برنده، عشق دیوانه‌وار به کار است؛ بقیه‌اش یادگرفتنی است.",
      },
    },
  ],
  quotes: [
    {
      kind: "founder",
      text: { en: "Make something people want.", fa: "چیزی بساز که مردم می‌خواهند." },
      author: { en: "Paul Graham", fa: "پل گراهام" },
      source: { en: "Y Combinator's motto", fa: "شعار Y Combinator" },
    },
    {
      kind: "founder",
      text: {
        en: "If you are not embarrassed by the first version of your product, you've launched too late.",
        fa: "اگر از نسخهٔ اول محصولت خجالت نمی‌کشی، یعنی دیر منتشرش کرده‌ای.",
      },
      author: { en: "Reid Hoffman", fa: "رید هافمن" },
      source: { en: "Co-founder of LinkedIn", fa: "هم‌بنیان‌گذار لینکدین" },
    },
    {
      kind: "founder",
      text: { en: "Real artists ship.", fa: "هنرمند واقعی کارش را منتشر می‌کند." },
      author: { en: "Steve Jobs", fa: "استیو جابز" },
      source: { en: "To the Macintosh team, 1983", fa: "خطاب به تیم مکینتاش، ۱۹۸۳" },
    },
    {
      kind: "engineering",
      text: { en: "Make it work, make it right, make it fast.", fa: "اول کاری کن که کار کند، بعد درستش کن، بعد سریعش کن." },
      author: { en: "Kent Beck", fa: "کنت بک" },
    },
    {
      kind: "engineering",
      text: { en: "Simplicity is prerequisite for reliability.", fa: "سادگی پیش‌شرط قابل‌اعتماد بودن است." },
      author: { en: "Edsger W. Dijkstra", fa: "ادسخر دایکسترا" },
      source: { en: "EWD 498, 1975", fa: "EWD 498، ۱۹۷۵" },
    },
    {
      kind: "engineering",
      text: {
        en: "The best way to predict the future is to invent it.",
        fa: "بهترین راه پیش‌بینی آینده، ساختن آن است.",
      },
      author: { en: "Alan Kay", fa: "آلن کی" },
      source: { en: "1971", fa: "۱۹۷۱" },
    },
  ],
  tools: ["TypeScript", "Python", "FastAPI", "Node.js", "React", "Next.js", "OpenStack", "OpenShift", "Docker", "Tailwind CSS"],
  education: [
    {
      school: { en: "University of Isfahan", fa: "دانشگاه اصفهان" },
      degree: { en: "Bachelor of Computer Science", fa: "کارشناسی علوم کامپیوتر" },
      start: "2024-09",
      end: "2028-06",
      note: {
        en: "Member of AMCSUI, the university's computer science student association.",
        fa: "عضو انجمن علمی دانشجویی علوم کامپیوتر دانشگاه.",
      },
    },
  ],
  volunteering: [
    {
      role: { en: "Event Host, Technical Team Lead", fa: "مجری رویداد و لید تیم فنی" },
      org: { en: "AMCSUI · VAST", fa: "انجمن علمی علوم کامپیوتر · رویداد VAST" },
      date: "2025-05",
      summary: {
        en: "Helped build a production-level authentication test system for the VAST coding competition at the University of Isfahan.",
        fa: "در ساخت یک سیستم تست احراز هویت برای مسابقهٔ برنامه‌نویسی VAST در دانشگاه اصفهان همکاری کردم؛ سیستمی در سطح یک محصول واقعی.",
      },
      bullets: {
        en: ["Wrote test cases and judged submissions", "Helped shape the competition's structure", "Wrote the documentation"],
        fa: ["نوشتن تست‌کیس‌ها و داوری پاسخ‌ها", "کمک به طراحی ساختار مسابقه", "نوشتن مستندات"],
      },
    },
  ],
  languages: [
    { name: { en: "Persian", fa: "فارسی" }, level: { en: "Native", fa: "زبان مادری" } },
    { name: { en: "English", fa: "انگلیسی" }, level: { en: "Professional working proficiency", fa: "تسلط در سطح کاری" } },
  ],
};

export type SeedRecommendation = {
  _id: string;
  _type: "recommendation";
  order: number;
  name: { en: string; fa?: string };
  headline: string;
  /** Where it was written: a LinkedIn recommendation, or one written for the earlier site mghn.info. */
  source: "linkedin" | "mghn.info";
  /** LinkedIn's "Worked with Mohammad on the same team" line. Old-site entries have none. */
  relationship?: L;
  /** ISO date. Old-site entries are undated. */
  date?: string;
  /** The writer's own profile. LinkedIn entries fall back to the recommendations list. */
  href?: string;
  /** File under /public/people. Without one the card shows initials. */
  portrait?: string;
  highlight: string;
  paragraphs: string[];
};

/**
 * Recommendations, verbatim (English on both locales): the five from LinkedIn, Mahdi Khodadadi first,
 * then two that were written for the earlier site mghn.info. `highlight` is a sentence lifted word
 * for word from the text.
 */
export const recommendations: SeedRecommendation[] = [
  {
    _id: "recommendation.mahdi-khodadadi",
    _type: "recommendation",
    order: 1,
    source: "linkedin",
    portrait: "mahdi-khodadadi.jpg",
    name: { en: "Mahdi Khodadadi" },
    headline: "Product Designer | Founder at Rooza | Ex at Bettermode, Snappfood, SnappShop, and Basalam",
    relationship: { en: "Worked with Mohammad on the same team", fa: "در یک تیم با محمد کار کرده" },
    date: "2026-08-07",
    highlight: "He is a true product partner, and someone I genuinely enjoy working with.",
    paragraphs: [
      "Having a developer who genuinely cares about product excellence and understands why spacing, pixels, and all the little details matter, is a real blessing for any designer.",
      "Mohammad is one of those developers. He has a strong sense of craftsmanship and a genuine desire to make every product he works on as good as it can possibly be. What sets him apart, though, is that he doesn't just focus on how to build something; he thinks deeply about why it should work a certain way and how the product should ultimately come together.",
      "That product vision, attention to detail, and sense of ownership make Mohammad much more than just a great developer. He is a true product partner, and someone I genuinely enjoy working with.",
    ],
  },
  {
    _id: "recommendation.sina-shah-oveisi",
    _type: "recommendation",
    order: 2,
    source: "linkedin",
    portrait: "sina-shah-oveisi.jpg",
    name: { en: "Sina Shah Oveisi" },
    headline: "Software Engineer",
    relationship: { en: "Worked with Mohammad on the same team at NobarCloud", fa: "در نوبرکلاد در یک تیم با محمد کار کرده" },
    date: "2026-06-05",
    highlight:
      "Beyond his strong front-end skills, he has an entrepreneurial mindset and is always full of innovative ideas for products, startups, and practical solutions.",
    paragraphs: [
      "I had the pleasure of working with Mohammad at NobarCloud, where he consistently demonstrated exceptional professionalism, technical expertise, and dedication as a Front-End Developer.",
      "Mohammad is highly motivated and genuinely passionate about technology. He constantly strives to improve code quality, software architecture, and overall project structure. Beyond his strong front-end skills, he has an entrepreneurial mindset and is always full of innovative ideas for products, startups, and practical solutions. This broader perspective has enabled him to gain valuable experience across the entire software development lifecycle—from product ideation and design to implementation, deployment, and continuous improvement.",
      "One of Mohammad's greatest strengths is his proactive attitude. Whenever he identifies an issue or opportunity for improvement, he takes ownership, raises it constructively, and actively engages the team in finding effective solutions. He is also known for asking insightful questions, both from technical and product perspectives, which reflects not only his deep understanding of the work but also his sense of responsibility and commitment to delivering high-quality results.",
      "I confidently recommend Mohammad as a highly skilled Front-End Developer with strong technical abilities, excellent problem-solving skills, and a genuine passion for building great products.",
    ],
  },
  {
    _id: "recommendation.mohammad-shahi",
    _type: "recommendation",
    order: 3,
    source: "linkedin",
    portrait: "mohammad-shahi.jpg",
    name: { en: "Mohammad Shahi" },
    headline: "Full-Stack Developer | Next.js, NestJS, React | Building Scalable Web Apps & APIs | CRM Solutions",
    relationship: {
      en: "Worked with Mohammad on the same team, on salecar.ae",
      fa: "روی salecar.ae در یک تیم با محمد کار کرده",
    },
    date: "2026-08-06",
    highlight:
      "Mohammad is an exceptionally skilled Next.js developer with a rare combination of strong technical ability and genuine product sense.",
    paragraphs: [
      "I had the pleasure of working with Mohammad Mohagheghian at Pishgaman Tose’e Tejarat Farda, where I was a backend developer and he was the frontend developer on our largest project, salecar.ae — a platform built for the UAE market.",
      "Mohammad is an exceptionally skilled Next.js developer with a rare combination of strong technical ability and genuine product sense. He doesn’t just implement designs — he deeply understands performance, user experience, and the real pain points of end users. His contributions to the UI/UX of salecar.ae went far beyond coding; many of the meaningful improvements were his own suggestions, and he executed them with high quality despite significant challenges and changing requirements.",
      "Beyond his technical skills, Mohammad is highly responsible, reliable with deadlines, and excellent in a team setting. He operates at a level where he can comfortably lead a small frontend team of 2–3 people. His creativity in solving UX problems and his ability to think from the user’s perspective make him a valuable asset on any product team.",
      "I would highly recommend Mohammad to any company looking for a strong, thoughtful frontend engineer who brings both craft and ownership to his work.",
    ],
  },
  {
    _id: "recommendation.amirhossein-jafari",
    _type: "recommendation",
    order: 4,
    source: "linkedin",
    portrait: "amirhossein-jafari.jpg",
    name: { en: "Amirhossein Jafari" },
    headline: "Devops & Cloud Infrastructure Engineer | K8S | OpenStack | OpenShift | Ceph | Linux | CICD",
    relationship: { en: "Worked with Mohammad on a different team", fa: "در تیمی دیگر با محمد کار کرده" },
    date: "2026-08-07",
    highlight:
      "He combines strong technical knowledge with a practical approach to problem solving and consistently takes ownership of his work.",
    paragraphs: [
      "I had the pleasure of working with Mohammad and found him to be a skilled and reliable Frontend Engineer.",
      "He combines strong technical knowledge with a practical approach to problem solving and consistently takes ownership of his work. What I particularly appreciated was his ability to collaborate effectively with other team members, communicate clearly, and stay focused on delivering high-quality results.",
      "Mohammad is responsible, easy to work with, and someone you can rely on when challenges come up. I’d gladly recommend him to any team looking for a capable Frontend Engineer and a strong team player.",
    ],
  },
  {
    _id: "recommendation.amir-alborz",
    _type: "recommendation",
    order: 5,
    source: "linkedin",
    portrait: "amir-alborz.jpg",
    name: { en: "Amir Alborz" },
    headline: "Product Designer | Design System | Systems Thinking | AI-Assisted Development",
    relationship: { en: "Worked with Mohammad on the same team", fa: "در یک تیم با محمد کار کرده" },
    date: "2026-07-03",
    highlight:
      "He is a skilled front-end developer who works in a very structured and systematic way, which makes collaboration with him smooth and effective.",
    paragraphs: [
      "I had the opportunity to work with Mohammad, and it was a great experience. He is a skilled front-end developer who works in a very structured and systematic way, which makes collaboration with him smooth and effective.",
      "What I appreciate most about Mohammad is his curiosity and growth mindset. He has a strong interest in AI and is always eager to learn, explore new ideas, and improve himself.",
      "He also brings positive energy to the team and is someone you can rely on. And yes, Mohammad is tall, but what stands out even more is his professionalism and mindset.",
    ],
  },  {
    _id: "recommendation.dayana-raadfar",
    _type: "recommendation",
    order: 6,
    source: "mghn.info",
    name: { en: "Dayana Raadfar" },
    headline: "Designer",
    highlight:
      "He is a professional and committed frontend developer who has successfully enhanced user experience for both us and our customers through your innovative ideas and designs.",
    paragraphs: [
      "I thoroughly appreciate our genuine and efficient collaboration. It has been an honor for me, and I have been influenced by your dedication and expertise. He is a professional and committed frontend developer who has successfully enhanced user experience for both us and our customers through your innovative ideas and designs.",
    ],
  },
  {
    _id: "recommendation.amir-mahdi-shad",
    _type: "recommendation",
    order: 7,
    source: "mghn.info",
    name: { en: "Amir Mahdi Shad" },
    headline: "Junior Front-end Developer",
    highlight:
      "As a perfectionist, he showcases an emphasis on details in all aspects of the project, guiding the entire team towards continuous improvement.",
    paragraphs: [
      "Continuous interactions with Mohammad provided me with a golden opportunity to gain deeper insights into Frontend development techniques. As a perfectionist, he showcases an emphasis on details in all aspects of the project, guiding the entire team towards continuous improvement. I thoroughly enjoyed collaborating with Mohammad and this experience provided me with an excellent chance to enhance my skills in Frontend development and perfectionist thinking.",
    ],
  },
];

/** Where all recommendations live on LinkedIn. */
export const recommendationsUrl = "https://www.linkedin.com/in/mohammad-mohagheghian/details/recommendations/";
