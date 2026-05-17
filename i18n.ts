import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { locales, defaultLocale } from "./routing";

export { locales, defaultLocale };
export type { Locale } from "./routing";

const valid = (v: string | undefined): v is string =>
  !!v && (locales as readonly string[]).includes(v);

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // (app) routes have no [locale] segment in the URL so requestLocale is
  // undefined. Fall back to the cookie written by updateProfile Server Action
  // (SETTLELENS_LOCALE), then the next-intl middleware cookie (NEXT_LOCALE).
  if (!valid(locale)) {
    const jar = await cookies();
    const sl = jar.get("SETTLELENS_LOCALE")?.value;
    const nl = jar.get("NEXT_LOCALE")?.value;
    locale = valid(sl) ? sl : valid(nl) ? nl : defaultLocale;
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
