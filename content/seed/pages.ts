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
    titleA: { en: "Let's build", fa: "بیایید با هم" },
    titleB: { en: "something.", fa: "بسازیم." },
    lead: { en: "Hiring an engineer, looking for a co-founder or a partner, or have a product to build? My inbox is open.", fa: "دنبال مهندس می‌گردید، هم‌بنیان‌گذار یا شریک می‌خواهید، یا محصولی دارید که باید ساخته شود؟ خوشحال می‌شوم ایمیل بزنید." },
  },
  home: {},
  engineering: {
    statement: { en: "Since 2021 I've built interfaces and design systems. Now I build the backend and cloud behind them too.", fa: "از ۲۰۲۱ رابط کاربری و دیزاین سیستم ساخته‌ام. حالا بک‌اند و زیرساخت ابریِ پشت آن‌ها را هم می‌سازم." },
    contactTitleA: { en: "Hiring an", fa: "دنبال مهندس" },
    contactTitleB: { en: "engineer?", fa: "می‌گردید؟" },
    contactLead: { en: "I'm open to remote software engineering roles. Send me the role and a little about the team.", fa: "برای موقعیت‌های دورکار مهندسی نرم‌افزار آماده‌ام. شرح موقعیت و چند خط دربارهٔ تیم را برایم بفرستید." },
  },
  founding: {
    statement: { en: "Two products I co-founded with partners I trust. Real people use both of them every day.", fa: "دو محصول که با شریک‌هایی ساختم که به آن‌ها اعتماد دارم. آدم‌های واقعی هر روز از هر دو استفاده می‌کنند." },
    contactTitleA: { en: "Building", fa: "شما هم چیزی" },
    contactTitleB: { en: "something too?", fa: "می‌سازید؟" },
    contactLead: { en: "Looking for a co-founder or a technical partner, or want to talk about Rooza or Agent Assist? Write to me.", fa: "دنبال هم‌بنیان‌گذار یا شریک فنی هستید؟ یا می‌خواهید دربارهٔ روزا و Agent Assist گپ بزنیم؟ برایم بنویسید." },
  },
  work: {
    contactTitleA: { en: "Have a product", fa: "محصولی دارید؟" },
    contactTitleB: { en: "to build?", fa: "بسازیمش." },
    contactLead: { en: "Send a short brief and your timeline. I take products from idea to launch.", fa: "یک توضیح کوتاه و زمان‌بندی‌تان را بفرستید. محصول را از ایده تا انتشار می‌سازم." },
  },
  content: {
    statement: { en: "I make Persian videos and posts about tech and building products.", fa: "به فارسی ویدیو و پست می‌سازم؛ دربارهٔ تکنولوژی و محصول‌سازی." },
    contactTitleA: { en: "Want to", fa: "با هم محتوا" },
    contactTitleB: { en: "collaborate?", fa: "بسازیم؟" },
    contactLead: { en: "For videos, talks or a collaboration, message me.", fa: "برای ویدیو، گفت‌وگو یا ساختن محتوای مشترک پیام بدهید." },
  },
  about: {
    contactTitleA: { en: "Let's", fa: "بیایید" },
    contactTitleB: { en: "talk.", fa: "گپ بزنیم." },
    contactLead: { en: "Products, backend or cloud: my inbox is open.", fa: "محصول، بک‌اند یا زیرساخت ابری؛ دربارهٔ هر کدام خوشحال می‌شوم حرف بزنیم." },
  },
  recommendations: {
    statement: { en: "People I've worked with, in their own words. Nothing is edited.", fa: "کسانی که با آن‌ها کار کرده‌ام، به قلم خودشان. هیچ متنی ویرایش نشده است." },
    contactTitleA: { en: "Want to work", fa: "با هم" },
    contactTitleB: { en: "together?", fa: "کار کنیم؟" },
    contactLead: { en: "These people worked with me. If you'd like to as well, write to me.", fa: "این‌ها با من کار کرده‌اند. اگر شما هم دوست دارید، برایم بنویسید." },
  },
  resume: {
    contactTitleA: { en: "Need more", fa: "جزئیات بیشتری" },
    contactTitleB: { en: "detail?", fa: "لازم دارید؟" },
    contactLead: { en: "Ask me for references or anything the resume doesn't cover.", fa: "برای معرف یا هر چیزی که در رزومه نیامده، بپرسید." },
  },
  contact: {
    statement: { en: "Email is the best way to reach me. Tell me which of these fits.", fa: "ایمیل بهترین راه ارتباط با من است. بگویید کدام‌یک از این‌ها به کارتان می‌خورد." },
  },
};
