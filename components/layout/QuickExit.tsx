"use client";

import { useEffect, useCallback } from "react";
import { useLocale } from "next-intl";

const LABELS: Record<string, string> = {
  en: "Quick Exit",
  tr: "Hızlı Çıkış",
  de: "Schnell beenden",
  fr: "Quitter vite",
  es: "Salida rápida",
  ar: "خروج سريع",
};

export function QuickExit() {
  const locale = useLocale();
  const label = LABELS[locale] ?? LABELS.en;

  const exit = useCallback(() => {
    // Replace current history entry so Back button won't return here
    window.location.replace("https://www.google.com");
  }, []);

  // Keyboard shortcut: Escape × 3 within 1.5 seconds
  useEffect(() => {
    let count = 0;
    let timer: ReturnType<typeof setTimeout>;

    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      count += 1;
      clearTimeout(timer);
      if (count >= 3) {
        exit();
        return;
      }
      timer = setTimeout(() => { count = 0; }, 1500);
    }

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(timer);
    };
  }, [exit]);

  return (
    <button
      onClick={exit}
      aria-label={label}
      title={label}
      className="
        fixed bottom-20 right-4 z-50
        md:bottom-6 md:right-6
        bg-[var(--red)] text-white
        font-ui text-xs font-bold
        px-3 py-2 rounded-full
        shadow-lg shadow-black/30
        hover:bg-red-700 active:scale-95
        transition-all
        opacity-70 hover:opacity-100
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-white
      "
    >
      ✕ {label}
    </button>
  );
}
