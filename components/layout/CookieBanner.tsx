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
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
    else setConsent(stored as ConsentValue);
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setConsent("all");
    setVisible(false);
    window.dispatchEvent(new Event("sl:cookie-accepted"));
  }

  function reject() {
    localStorage.setItem(STORAGE_KEY, "essential");
    setConsent("essential");
    setVisible(false);
  }

  if (!visible || consent) return null;

  const isAR = locale === "ar";
  const isRTL = isAR;

  const cookieText: Record<string, { body: string; policy: string; reject: string; accept: string }> = {
    tr: { body: "Bu site KVKK kapsamında çerez kullanır. Analitik çerezler yalnızca onayınızla etkinleşir.", policy: "Çerez Politikası", reject: "Sadece Zorunlu", accept: "Tümünü Kabul Et" },
    ar: { body: "نستخدم ملفات تعريف الارتباط لتحسين تجربتك. لا تُفعَّل ملفات التحليل إلا بموافقتك.", policy: "سياسة ملفات تعريف الارتباط", reject: "الضروري فقط", accept: "قبول الكل" },
    de: { body: "Wir verwenden Cookies, um Ihre Erfahrung zu verbessern. Analyse-Cookies werden nur mit Ihrer Zustimmung aktiviert.", policy: "Cookie-Richtlinie", reject: "Nur Notwendige", accept: "Alle akzeptieren" },
    fr: { body: "Nous utilisons des cookies pour améliorer votre expérience. Les cookies analytiques ne sont activés qu'avec votre consentement.", policy: "Politique de cookies", reject: "Refuser", accept: "Tout accepter" },
    es: { body: "Usamos cookies para mejorar su experiencia. Las cookies analíticas solo se activan con su consentimiento.", policy: "Política de cookies", reject: "Solo esenciales", accept: "Aceptar todo" },
    en: { body: "We use cookies to improve your experience. Analytics cookies are only activated with your consent.", policy: "Cookie Policy", reject: "Reject Non-Essential", accept: "Accept All" },
  };
  const c = cookieText[locale] ?? cookieText.en;

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--sand)] bg-[#111923] px-4 py-4 shadow-lg"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-ui text-sm text-[var(--cream)]">
          {c.body}{" "}
          <Link
            href={`/${locale}/cookie-policy`}
            className="underline text-[var(--gold)] hover:text-[var(--gold)]/80"
          >
            {c.policy}
          </Link>
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "border-[var(--sand)] text-[var(--cream)] hover:bg-[var(--slate)] hover:text-[var(--cream)] bg-transparent")}
            onClick={reject}
          >
            {c.reject}
          </button>
          <button
            className={cn(buttonVariants({ size: "sm" }), "bg-[var(--gold)] text-[var(--navy)] hover:bg-[var(--gold)]/90")}
            onClick={accept}
          >
            {c.accept}
          </button>
          <button
            onClick={reject}
            className="ms-1 text-[var(--sand)] hover:text-[var(--cream)]"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
