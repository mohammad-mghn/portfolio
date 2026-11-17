import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import * as rootParams from "next/root-params";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // Server components under app/[locale] read the root param directly;
  // requestLocale covers callers outside that tree (e.g. metadata routes).
  let value: string | undefined;
  try {
    value = await rootParams.locale();
  } catch {
    value = await requestLocale;
  }

  if (!hasLocale(routing.locales, value)) notFound();

  return {
    locale: value,
    messages: (await import(`../messages/${value}.json`)).default,
    timeZone: "Asia/Tehran",
  };
});
