"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { X } from "lucide-react";

const STORAGE_KEY = "sl_cookie_consent";

type ConsentValue = "all" | "essential" | null;

export function CookieBanner() {
  const locale = useLocale();
  const [consent, setConsent] = useState<ConsentValue>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ConsentValue;
    if (!stored) setVisible(true);
    else setConsent(stored);
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "all");
    setConsent("all");
    setVisible(false);
  }

  function reject() {
    localStorage.setItem(STORAGE_KEY, "essential");
    setConsent("essential");
    setVisible(false);
  }

  if (!visible || consent) return null;

  const isTR = locale === "tr";
  const isAR = locale === "ar";

  return (
    <div
      dir={isAR ? "rtl" : "ltr"}
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--sand)] bg-[#111923] px-4 py-4 shadow-lg"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-ui text-sm text-[var(--cream)]">
          {isTR
            ? "Bu site KVKK kapsamında çerez kullanır. Analitik çerezler yalnızca onayınızla etkinleşir."
            : "We use cookies to improve your experience. Analytics cookies are only activated with your consent."}
          {" "}
          <Link
            href={`/${locale}/cookie-policy`}
            className="underline text-[var(--gold)] hover:text-[var(--gold)]/80"
          >
            {isTR ? "Çerez Politikası" : "Cookie Policy"}
          </Link>
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "border-[var(--sand)] text-[var(--cream)] hover:bg-[var(--slate)] hover:text-[var(--cream)] bg-transparent")}
            onClick={reject}
          >
            {isTR ? "Sadece Zorunlu" : "Reject Non-Essential"}
          </button>
          <button
            className={cn(buttonVariants({ size: "sm" }), "bg-[var(--gold)] text-[var(--navy)] hover:bg-[var(--gold)]/90")}
            onClick={accept}
          >
            {isTR ? "Tümünü Kabul Et" : "Accept All"}
          </button>
          <button
            onClick={reject}
            className="ml-1 text-[var(--sand)] hover:text-[var(--cream)]"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
