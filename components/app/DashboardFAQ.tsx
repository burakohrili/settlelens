"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const FAQ_KEYS = ["1", "2", "3", "4", "5", "6"] as const;

export function DashboardFAQ() {
  const t = useTranslations("dashboard");
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="rounded-xl border border-[var(--sand)] bg-white overflow-hidden">
      <div className="px-5 py-3 border-b border-[var(--sand)] bg-[var(--cream)]">
        <h3 className="font-ui text-sm font-semibold text-[var(--navy)]">{t("faqTitle")}</h3>
      </div>
      <ul className="divide-y divide-[var(--sand)]">
        {FAQ_KEYS.map((k) => {
          const isOpen = open === k;
          return (
            <li key={k}>
              <button
                onClick={() => setOpen(isOpen ? null : k)}
                className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-[var(--cream)]/60 transition-colors"
                aria-expanded={isOpen}
              >
                <span className="font-ui text-sm font-medium text-[var(--navy)]">
                  {t(`faq_q${k}` as "faq_q1")}
                </span>
                <ChevronDown
                  size={16}
                  className={cn(
                    "shrink-0 text-[var(--brown)] transition-transform duration-200 ml-3",
                    isOpen && "rotate-180"
                  )}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-4">
                  <p className="font-ui text-sm text-[var(--brown)] leading-relaxed">
                    {t(`faq_a${k}` as "faq_a1")}
                  </p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
