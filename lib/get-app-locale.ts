import { headers, cookies } from "next/headers";
import { locales, defaultLocale } from "@/routing";

export async function getAppLocale(): Promise<string> {
  const h = await headers();
  const fromHeader = h.get("x-locale");
  if (fromHeader && (locales as readonly string[]).includes(fromHeader)) return fromHeader;
  const cs = await cookies();
  const fromCookie =
    cs.get("SETTLELENS_LOCALE")?.value ?? cs.get("NEXT_LOCALE")?.value;
  if (fromCookie && (locales as readonly string[]).includes(fromCookie)) return fromCookie;
  return defaultLocale;
}
