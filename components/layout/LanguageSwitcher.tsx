"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { locales, type Locale } from "@/routing";
import { cn } from "@/lib/utils";

const LANG_LABELS: Record<Locale, string> = {
  en: "🇺🇸 EN",
  tr: "🇹🇷 TR",
  de: "🇩🇪 DE",
  fr: "🇫🇷 FR",
  es: "🇪🇸 ES",
  ar: "🇸🇦 AR",
};

type Props = { variant?: "light" | "dark" };

export function LanguageSwitcher({ variant = "light" }: Props) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale(next: Locale) {
    const segments = pathname.split("/");
    segments[1] = next;
    router.push(segments.join("/") || `/${next}`);
  }

  const isDark = variant === "dark";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex items-center gap-1 rounded-md px-2 py-1.5 font-ui text-sm transition-colors outline-none",
          isDark
            ? "text-[var(--cream)] hover:bg-[var(--slate)]"
            : "text-[var(--navy)] hover:bg-[var(--sand)]/40"
        )}
      >
        {LANG_LABELS[locale]}
        <ChevronDown size={14} className="opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[100px]">
        {locales.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => switchLocale(lang)}
            className={cn(
              "cursor-pointer",
              lang === locale ? "font-semibold text-[var(--gold)]" : ""
            )}
          >
            {LANG_LABELS[lang]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
