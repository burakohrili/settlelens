"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Disclaimer } from "@/components/layout/Disclaimer";
import { Download, Loader2, Lock } from "lucide-react";

export default function ReportPage() {
  const t = useTranslations("report");
  const params = useParams();
  const router = useRouter();
  const lang = (params.lang as string) ?? "en";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [step, setStep] = useState(0);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    setStep(1);
    const t1 = setTimeout(() => setStep(2), 2000);
    const t2 = setTimeout(() => setStep(3), 4000);

    try {
      const res = await fetch("/api/generate-report", { method: "POST" });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (body.error === "upgrade_required") {
          router.push(`/${lang}/upgrade`);
          return;
        }
        setError(body.error ?? t("errorDefault"));
        return;
      }

      // API returns HTML — open in new tab, browser print dialog appears automatically
      const html = await res.text();
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const win = window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 30_000);
      if (!win) {
        setError(t("errorPopupBlocked") ?? "Please allow popups for this site and try again.");
        return;
      }
      setDone(true);
    } catch {
      setError(t("errorConnection"));
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
      setLoading(false);
      setStep(0);
    }
  }

  const items = [
    t("item1"), t("item2"), t("item3"), t("item4"),
    t("item5"), t("item6"), t("item7"), t("item8"),
  ];

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--navy)]">{t("title")}</h1>
        <p className="font-ui text-sm text-[var(--brown)] mt-1">{t("subtitle")}</p>
      </div>

      <div className="rounded-xl border border-[var(--sand)] bg-white p-6 space-y-4">
        <h2 className="font-ui text-sm font-semibold text-[var(--navy)]">{t("includes")}</h2>
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2 font-ui text-sm text-[var(--brown)]">
              <span className="text-[var(--gold)] mt-0.5">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="rounded-md bg-[var(--cream)] border border-[var(--sand)] p-3">
          <p className="font-ui text-xs text-[var(--brown)]">
            <strong>{t("formatLabel")}</strong> {t("formatValue")}<br />
            <strong>{t("validLabel")}</strong> {t("validValue")}
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 p-3">
            <p className="font-ui text-sm text-red-700">{error}</p>
          </div>
        )}

        {done ? (
          <div className="rounded-md bg-green-50 border border-green-200 p-3">
            <p className="font-ui text-sm text-green-700">{t("successMsg")}</p>
            <button
              onClick={handleGenerate}
              className={cn(buttonVariants({ variant: "outline" }), "mt-3 border-[var(--sand)] text-sm")}
            >
              <Download size={14} className="mr-1" /> {t("downloadAgain")}
            </button>
          </div>
        ) : (
          <>
            {loading && step > 0 && (
              <div className="rounded-md bg-[var(--cream)] border border-[var(--sand)] p-3 space-y-2">
                {[t("step1"), t("step2"), t("step3")].map((label, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className={cn(
                      "w-4 h-4 rounded-full border-2 flex items-center justify-center text-[9px] font-bold shrink-0",
                      step > i + 1 ? "border-[var(--gain)] bg-[var(--gain)] text-white"
                      : step === i + 1 ? "border-[var(--gold)] bg-[var(--gold)] text-white"
                      : "border-[var(--sand)] text-[var(--brown)]"
                    )}>
                      {step > i + 1 ? "✓" : i + 1}
                    </span>
                    <p className={cn(
                      "font-ui text-xs",
                      step === i + 1 ? "text-[var(--navy)] font-semibold" : "text-[var(--brown)]"
                    )}>
                      {step === i + 1 && <Loader2 size={11} className="inline mr-1 animate-spin" />}
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className={cn(
                buttonVariants(),
                "w-full bg-[var(--gold)] text-[var(--navy)] font-semibold hover:bg-[var(--gold)]/90",
                loading && "opacity-70 cursor-not-allowed"
              )}
            >
              {loading ? (
                <><Loader2 size={16} className="mr-2 animate-spin" /> {t("generating")}</>
              ) : (
                <><Download size={16} className="mr-2" /> {t("generate")}</>
              )}
            </button>
          </>
        )}
      </div>

      <div className="flex items-start gap-2 rounded-md border border-[var(--sand)] bg-[var(--cream)] p-3">
        <Lock size={14} className="text-[var(--brown)] mt-0.5 flex-shrink-0" />
        <p className="font-ui text-xs text-[var(--brown)]">{t("secureNote")}</p>
      </div>

      <Disclaimer />
    </div>
  );
}
