"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export function MobileStickyCTA() {
  const locale = useLocale();
  const t = useTranslations("hero");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 500);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
      <div className="bg-[var(--navy)]/95 backdrop-blur-sm border-t border-white/10 px-4 py-3 flex items-center gap-3">
        <Link
          href={`/${locale}/register`}
          className="flex-1 text-center bg-[var(--gold)] text-[var(--navy)] font-display font-bold text-sm py-3 rounded-lg hover:bg-[var(--gold)]/90 transition-colors"
        >
          {t("cta")}
        </Link>
      </div>
    </div>
  );
}
