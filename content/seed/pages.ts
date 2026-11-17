/**
 * Seed content: the words that change from page to page. Each page has the statement under its
 * title and its own closing contact block (a two-line title and a lead). A page that leaves a
 * contact field out uses `contactDefault`, which is also what the home page shows.
 */
import type { L, PageKey } from "@/lib/content/types";

export type SeedPageCopy = { statement?: L; contactTitleA?: L; contactTitleB?: L; contactLead?: L };

export const pages: {
  _id: "pages";
  _type: "pages";
  contactDefault: { titleA: L; titleB: L; lead: L };
} & Record<PageKey, SeedPageCopy> = {
  _id: "pages",
  _type: "pages",
  contactDefault: {
    titleA: { en: "Let's build", fa: "بیایید" },
    titleB: { en: "something.", fa: "چیزی بسازیم." },
    lead: { en: "Hiring an engineer, looking for a co-founder or a partner, or have a product to build? My inbox is open.", fa: "دنبال مهندس هستید، هم‌بنیان‌گذار یا شریک می‌خواهید، یا محصولی دارید که باید ساخته شود؟ ایمیلم همیشه باز است." },
  },
  home: {},
  engineering: {
    statement: { en: "Since 2021 I've built interfaces and design systems. Now I build the backend and cloud behind them too.", fa: "از ۲۰۲۱ رابط کاربری و دیزاین سیستم می‌سازم. حالا بک‌اند و زیرساخت ابری پشتشان را هم می‌سازم." },
    contactTitleA: { en: "Hiring an", fa: "دنبال" },
    contactTitleB: { en: "engineer?", fa: "مهندس هستید؟" },
    contactLead: { en: "I'm open to remote software engineering roles. Send me the role and a little about the team.", fa: "برای موقعیت‌های مهندسی نرم‌افزار دورکاری آماده‌ام. شرح موقعیت و کمی دربارهٔ تیم را برایم بفرستید." },
  },
  founding: {
    statement: { en: "Two products I co-founded with partners I trust. Real people use both of them every day.", fa: "دو محصول که با شریک‌هایی که به آن‌ها اعتماد دارم بنیان گذاشتم. آدم‌های واقعی هر روز از هر دو استفاده می‌کنند." },
    contactTitleA: { en: "Building", fa: "شما هم" },
    contactTitleB: { en: "something too?", fa: "چیزی می‌سازید؟" },
    contactLead: { en: "Looking for a co-founder or a technical partner, or want to talk about Rooza or Agent Assist? Write to me.", fa: "دنبال هم‌بنیان‌گذار یا شریک فنی هستید، یا می‌خواهید دربارهٔ روزا یا Agent Assist حرف بزنیم؟ برایم بنویسید." },
  },
  work: {
    contactTitleA: { en: "Have a product", fa: "محصولی برای" },
    contactTitleB: { en: "to build?", fa: "ساختن دارید؟" },
    contactLead: { en: "Send a short brief and your timeline. I take products from idea to launch.", fa: "یک توضیح کوتاه و زمان‌بندی‌تان را بفرستید. محصول را از ایده تا انتشار می‌سازم." },
  },
  content: {
    statement: { en: "I make Persian videos and posts about tech and building products.", fa: "به فارسی ویدیو و پست می‌سازم، دربارهٔ تکنولوژی و ساختن محصول." },
    contactTitleA: { en: "Want to", fa: "همکاری" },
    contactTitleB: { en: "collaborate?", fa: "کنیم؟" },
    contactLead: { en: "For videos, talks or a collaboration, message me.", fa: "برای ویدیو، گفت‌وگو یا همکاری در محتوا پیام بدهید." },
  },
  about: {
    contactTitleA: { en: "Let's", fa: "بیایید" },
    contactTitleB: { en: "talk.", fa: "گپ بزنیم." },
    contactLead: { en: "Products, backend or cloud: my inbox is open.", fa: "محصول، بک‌اند یا زیرساخت ابری؛ ایمیلم همیشه باز است." },
  },
  recommendations: {
    statement: { en: "People I've worked with, in their own words. Nothing is edited.", fa: "کسانی که با آن‌ها کار کرده‌ام، با کلمات خودشان؛ بدون هیچ ویرایشی." },
    contactTitleA: { en: "Want to work", fa: "با هم" },
    contactTitleB: { en: "together?", fa: "کار کنیم؟" },
    contactLead: { en: "These people worked with me. If you'd like to as well, write to me.", fa: "این آدم‌ها با من کار کرده‌اند. اگر شما هم می‌خواهید، برایم بنویسید." },
  },
  resume: {
    contactTitleA: { en: "Need more", fa: "جزئیات بیشتری" },
    contactTitleB: { en: "detail?", fa: "می‌خواهید؟" },
    contactLead: { en: "Ask me for references or anything the resume doesn't cover.", fa: "برای معرف یا هر چیزی که در رزومه نیامده، از من بپرسید." },
  },
  contact: {
    statement: { en: "Email is the best way to reach me. Tell me which of these fits.", fa: "بهترین راه ارتباط با من ایمیل است. بگویید کدام‌یک از این‌ها به کارتان می‌آید." },
  },
};
