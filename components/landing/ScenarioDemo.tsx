"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const LOCALE_CONFIG: Record<string, { currency: string; locale: string; min: number; max: number; default: number; step: number; appreciation: number; investmentReturn: number; saleCosts: number }> = {
  en: { currency: "USD", locale: "en-US", min: 100_000, max: 2_000_000, default: 800_000, step: 10_000, appreciation: 3, investmentReturn: 5, saleCosts: 6 },
  tr: { currency: "TRY", locale: "tr-TR", min: 100_000, max: 60_000_000, default: 5_000_000, step: 100_000, appreciation: 20, investmentReturn: 30, saleCosts: 6 },
  de: { currency: "EUR", locale: "de-DE", min: 100_000, max: 2_000_000, default: 800_000, step: 10_000, appreciation: 3, investmentReturn: 5, saleCosts: 10 },
  fr: { currency: "EUR", locale: "fr-FR", min: 100_000, max: 2_000_000, default: 800_000, step: 10_000, appreciation: 3, investmentReturn: 5, saleCosts: 8 },
  es: { currency: "EUR", locale: "es-ES", min: 100_000, max: 2_000_000, default: 800_000, step: 10_000, appreciation: 3, investmentReturn: 5, saleCosts: 10 },
  ar: { currency: "USD", locale: "en-US", min: 100_000, max: 2_000_000, default: 800_000, step: 10_000, appreciation: 3, investmentReturn: 5, saleCosts: 6 },
};

function fmtCurrency(n: number, currencyCode: string, localeCode: string) {
  return new Intl.NumberFormat(localeCode, {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(n);
}

function calcScenarios(homeValue: number, mortgage: number) {
  const equity = Math.max(homeValue - mortgage, 0);
  return {
    iKeep: equity * Math.pow(1.03, 5) - mortgage * 0.1,
    theyKeep: (equity / 2) * Math.pow(1.05, 5),
    weSell: (homeValue * 0.94 - mortgage) / 2 * Math.pow(1.05, 5),
  };
}

export function ScenarioDemo() {
  const t = useTranslations("houseDemo");
  const lang = useLocale();

  const cfg = LOCALE_CONFIG[lang] ?? LOCALE_CONFIG["en"];
  const fmt = (n: number) => fmtCurrency(n, cfg.currency, cfg.locale);

  const [homeValue, setHomeValue] = useState(cfg.default);
  const mortgage = Math.round(homeValue * 0.45);

  const s = calcScenarios(homeValue, mortgage);
  const best = Math.max(s.iKeep, s.theyKeep, s.weSell);

  const scenarios = [
    { key: "iKeep", label: t("iKeep"), icon: "🏠", value: s.iKeep },
    { key: "theyKeep", label: t("theyKeep"), icon: "🤝", value: s.theyKeep },
    { key: "weSell", label: t("weSell"), icon: "💰", value: s.weSell },
  ];

  return (
    <section className="bg-[var(--navy)] py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 space-y-3">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[var(--cream)] italic">{t("title")}</h2>
          <p className="font-body text-[#a0b0c0]">{t("sub")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Slider */}
          <div className="space-y-6 bg-[var(--slate)]/30 rounded-xl border border-[var(--sand)]/20 p-6">
            <div className="space-y-2">
              <div className="flex justify-between font-ui text-xs">
                <span className="text-[#a0b0c0]">{t("sliderLabel")}</span>
                <span className="font-semibold text-[var(--cream)]">{fmt(homeValue)}</span>
              </div>
              <input
                type="range"
                min={cfg.min}
                max={cfg.max}
                step={cfg.step}
                value={homeValue}
                onChange={(e) => setHomeValue(Number(e.target.value))}
                className="w-full accent-[var(--gold)] cursor-pointer"
              />
              <div className="flex justify-between font-mono text-xs text-[#6b7f90]">
                <span>{t("sliderMin")}</span><span>{t("sliderMax")}</span>
              </div>
            </div>
            <div className="rounded-md bg-[var(--navy)]/50 p-3 font-ui text-xs text-[#6b7f90]">
              {t("note", { appreciation: cfg.appreciation, investmentReturn: cfg.investmentReturn, saleCosts: cfg.saleCosts })}
            </div>
          </div>

          {/* Results */}
          <div className="space-y-3">
            {scenarios.map((sc) => (
              <div
                key={sc.key}
                className={cn(
                  "rounded-xl border p-4 flex items-center justify-between transition-all",
                  sc.value === best
                    ? "border-[var(--gold)] bg-[var(--gold)]/10"
                    : "border-[var(--sand)]/20 bg-[var(--slate)]/20"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{sc.icon}</span>
                  <div>
                    <p className="font-ui text-sm font-semibold text-[var(--cream)]">{sc.label}</p>
                    <p className="font-ui text-xs text-[#8B9BB0]">{t("netPosition")} {t("inYears")}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn("font-mono text-lg font-bold", sc.value === best ? "text-[var(--gold)]" : "text-[var(--cream)]")}>
                    {fmt(sc.value)}
                  </p>
                  {sc.value === best && <p className="font-ui text-xs text-[var(--gold)]">{t("best")}</p>}
                </div>
              </div>
            ))}

            <Link href={`/${lang}/house-simulator`} className="font-ui text-sm text-[var(--gold)] hover:underline block text-center mt-2">
              {t("fullAnalysis")}
            </Link>
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="font-body text-sm text-[#6b7f90] mb-4">
            {t("previewNote")}
          </p>
          <Link
            href={`/${lang}/register`}
            className={cn(buttonVariants(), "bg-[var(--gold)] text-[var(--navy)] font-semibold hover:bg-[var(--gold)]/90")}
          >
            {t("ctaFull")}
          </Link>
        </div>
      </div>
    </section>
  );
}
