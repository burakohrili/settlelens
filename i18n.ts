import { getRequestConfig } from "next-intl/server";
import { locales, defaultLocale } from "./routing";

export { locales, defaultLocale };
export type { Locale } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) ?? defaultLocale;
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
