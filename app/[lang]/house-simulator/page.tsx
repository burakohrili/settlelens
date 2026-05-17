"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Disclaimer } from "@/components/layout/Disclaimer";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { Home, ArrowRight, Info } from "lucide-react";
import {
  getLocaleEconomics,
  type LocaleEconomics,
  type AppreciationScenario,
} from "@/lib/house-simulator-config";

type HouseInputs = {
  homeValue: number;
  mortgage: number;
  monthlyPayment: number;
  myIncome: number;
  spouseIncome: number;
  hasMortgage: boolean;
};

type ScenarioData = {
  key: "iKeep" | "spouseKeeps" | "sell";
  icon: string;
  year5NetWorth: number;
  lines: { labelKey: string; value: string }[];
  unaffordable: boolean;
};

function calculateScenarios(
  inputs: HouseInputs,
  cfg: LocaleEconomics,
  appreciation: number,
  fmtFn: (n: number) => string
): ScenarioData[] {
  const { homeValue, mortgage, monthlyPayment, myIncome, hasMortgage } = inputs;
  const equity = Math.max(homeValue - mortgage, 0);
  const myMonthlyIncome = myIncome / 12;
  // Unaffordable: mortgage payment > 43% of monthly income (standard DTI)
  const unaffordable = hasMortgage && myMonthlyIncome > 0 && monthlyPayment > myMonthlyIncome * 0.43;

  const remainingMortgage = hasMortgage ? mortgage * 0.85 : 0;
  const spouseBuyout = equity / 2;

  // Scenario A: I keep — pay spouse's equity half upfront, carry mortgage
  const iKeepYear5 = homeValue * Math.pow(1 + appreciation, 5) - remainingMortgage - spouseBuyout;

  // Scenario B: Spouse keeps — I receive equity/2 payout, invest it
  const myPayout = equity / 2;
  const rentMonthly = homeValue * cfg.rentYieldMonthly;
  const spouseKeepsYear5 = myPayout * Math.pow(1 + cfg.investmentReturn, 5);

  // Scenario C: Sell — net proceeds / 2, invest my share
  const sellNetProceeds = homeValue * (1 - cfg.saleTransactionCost) - (hasMortgage ? mortgage : 0);
  const myShare = Math.max(sellNetProceeds / 2, 0);
  const sellYear5 = myShare * Math.pow(1 + cfg.investmentReturn, 5);

  return [
    {
      key: "iKeep",
      icon: "🏠",
      year5NetWorth: iKeepYear5,
      unaffordable,
      lines: [
        { labelKey: "equityAfterBuyout", value: fmtFn(equity / 2) },
        { labelKey: "spouseBuyout", value: fmtFn(spouseBuyout) },
        ...(hasMortgage ? [{ labelKey: "monthlyMortgage", value: `${fmtFn(monthlyPayment)}/mo` }] : []),
        { labelKey: "projectedValue5", value: fmtFn(iKeepYear5) },
      ],
    },
    {
      key: "spouseKeeps",
      icon: "🔄",
      year5NetWorth: spouseKeepsYear5,
      unaffordable: false,
      lines: [
        { labelKey: "equityPayout", value: fmtFn(myPayout) },
        { labelKey: "estimatedRent", value: `${fmtFn(rentMonthly)}/mo` },
        { labelKey: "invested5", value: fmtFn(spouseKeepsYear5) },
      ],
    },
    {
      key: "sell",
      icon: "💰",
      year5NetWorth: sellYear5,
      unaffordable: false,
      lines: [
        { labelKey: "shareAfterCosts", value: fmtFn(myShare) },
        { labelKey: "estimatedRent", value: `${fmtFn(rentMonthly)}/mo` },
        { labelKey: "invested5", value: fmtFn(sellYear5) },
      ],
    },
  ];
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  fmtFn,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  fmtFn: (n: number) => string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between font-ui text-xs">
        <span className="text-[var(--brown)]">{label}</span>
        <span className="font-semibold text-[var(--navy)]">{fmtFn(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-[var(--gold)] cursor-pointer"
      />
    </div>
  );
}

const LABEL_KEY: Record<ScenarioData["key"], string> = {
  iKeep: "iKeepLabel",
  spouseKeeps: "spouseKeepsLabel",
  sell: "sellLabel",
};

export default function HouseSimulatorPage() {
  const t = useTranslations("houseSimulator");
  const params = useParams();
  const lang = (params.lang as string) ?? "en";
  const cfg = getLocaleEconomics(lang);

  const [inputs, setInputs] = useState<HouseInputs>(cfg.defaults);
  const [appreciation, setAppreciation] = useState<AppreciationScenario>("mid");

  function fmt(n: number): string {
    return new Intl.NumberFormat(cfg.currencyLocale, {
      style: "currency",
      currency: cfg.currency,
      maximumFractionDigits: 0,
    }).format(n || 0);
  }

  function update(field: keyof HouseInputs, value: number | boolean) {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }

  const activeAppreciation = cfg.appreciationScenarios[appreciation];
  const scenarios = calculateScenarios(inputs, cfg, activeAppreciation, fmt);

  // Best = highest 5-year net worth, unaffordable excluded
  const affordableScenarios = scenarios.map((s, i) => ({ i, s })).filter(({ s }) => !s.unaffordable);
  const bestIdx =
    affordableScenarios.length > 0
      ? affordableScenarios.reduce((best, cur) =>
          cur.s.year5NetWorth > best.s.year5NetWorth ? cur : best
        ).i
      : -1;

  const equity = Math.max(inputs.homeValue - inputs.mortgage, 0);
  const appreciationPct = Math.round(activeAppreciation * 100);
  const returnPct = Math.round(cfg.investmentReturn * 100);
  const costsPct = Math.round(cfg.saleTransactionCost * 100);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[var(--cream)]">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
          {/* Title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-3">
              <div className="rounded-full bg-[var(--gold)]/15 p-3">
                <Home size={28} className="text-[var(--gold)]" />
              </div>
            </div>
            <h1 className="font-display text-3xl font-bold text-[var(--navy)]">{t("title")}</h1>
            <p className="font-body text-[var(--brown)] mt-2 max-w-lg mx-auto">{t("subtitle")}</p>
          </div>

          {/* Appreciation scenario selector */}
          <div className="mb-5 rounded-xl border border-[var(--sand)] bg-white p-4">
            <p className="font-ui text-xs font-semibold text-[var(--navy)] mb-3">{t("appreciationTitle")}</p>
            <div className="flex gap-2">
              {(["low", "mid", "high"] as AppreciationScenario[]).map((sc) => {
                const pct = Math.round(cfg.appreciationScenarios[sc] * 100);
                const labelKey = sc === "low" ? "appreciationLow" : sc === "mid" ? "appreciationMid" : "appreciationHigh";
                return (
                  <button
                    key={sc}
                    onClick={() => setAppreciation(sc)}
                    className={cn(
                      "flex-1 rounded-lg border px-2 py-2 font-ui text-xs font-medium transition-all",
                      appreciation === sc
                        ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--navy)]"
                        : "border-[var(--sand)] text-[var(--brown)] hover:border-[var(--navy)]/30"
                    )}
                  >
                    {t(labelKey, { pct })}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Inputs */}
            <div className="rounded-xl border border-[var(--sand)] bg-white p-5 space-y-5">
              <h2 className="font-ui text-sm font-semibold text-[var(--navy)]">{t("situationTitle")}</h2>

              <Slider
                label={t("homeValue")}
                value={inputs.homeValue}
                min={cfg.sliderMin.homeValue}
                max={cfg.sliderMax.homeValue}
                step={cfg.sliderStep.homeValue}
                onChange={(v) => update("homeValue", v)}
                fmtFn={fmt}
              />

              {/* Mortgage toggle */}
              <div className="space-y-1">
                <p className="font-ui text-xs text-[var(--brown)]">{t("hasMortgage")}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => update("hasMortgage", true)}
                    className={cn(
                      "flex-1 rounded-lg border px-3 py-2 font-ui text-xs font-medium transition-all",
                      inputs.hasMortgage
                        ? "border-[var(--navy)] bg-[var(--navy)] text-white"
                        : "border-[var(--sand)] text-[var(--brown)] hover:border-[var(--navy)]/40"
                    )}
                  >
                    {t("mortgageYes")}
                  </button>
                  <button
                    onClick={() => { update("hasMortgage", false); update("mortgage", 0); update("monthlyPayment", 0); }}
                    className={cn(
                      "flex-1 rounded-lg border px-3 py-2 font-ui text-xs font-medium transition-all",
                      !inputs.hasMortgage
                        ? "border-[var(--navy)] bg-[var(--navy)] text-white"
                        : "border-[var(--sand)] text-[var(--brown)] hover:border-[var(--navy)]/40"
                    )}
                  >
                    {t("mortgageNo")}
                  </button>
                </div>
              </div>

              {inputs.hasMortgage && (
                <>
                  <Slider
                    label={t("mortgage")}
                    value={inputs.mortgage}
                    min={0}
                    max={Math.min(inputs.homeValue, cfg.sliderMax.mortgage)}
                    step={cfg.sliderStep.mortgage}
                    onChange={(v) => update("mortgage", v)}
                    fmtFn={fmt}
                  />
                  <Slider
                    label={t("monthlyPayment")}
                    value={inputs.monthlyPayment}
                    min={cfg.sliderStep.monthlyPayment}
                    max={cfg.sliderMax.monthlyPayment}
                    step={cfg.sliderStep.monthlyPayment}
                    onChange={(v) => update("monthlyPayment", v)}
                    fmtFn={fmt}
                  />
                </>
              )}

              <Slider
                label={t("myIncome")}
                value={inputs.myIncome}
                min={cfg.sliderMin.income}
                max={cfg.sliderMax.income}
                step={cfg.sliderStep.income}
                onChange={(v) => update("myIncome", v)}
                fmtFn={fmt}
              />
              <Slider
                label={t("spouseIncome")}
                value={inputs.spouseIncome}
                min={cfg.sliderMin.income}
                max={cfg.sliderMax.income}
                step={cfg.sliderStep.income}
                onChange={(v) => update("spouseIncome", v)}
                fmtFn={fmt}
              />

              <div className="rounded-md bg-[var(--cream)] border border-[var(--sand)] p-3 font-ui text-xs text-[var(--brown)]">
                <strong>{t("equity")}</strong> {fmt(equity)} ·{" "}
                {t("note", { appreciation: appreciationPct, investmentReturn: returnPct, saleCosts: costsPct })}
              </div>

              {cfg.nominalWarning && (
                <div className="rounded-md bg-amber-50 border border-amber-200 p-3 font-ui text-xs text-amber-800">
                  {t("nominalWarning")}
                </div>
              )}

              {/* Mortgage note (shown when mortgage is active and locale has a note) */}
              {inputs.hasMortgage && !cfg.mortgageCommon && (
                <div className="rounded-md bg-blue-50 border border-blue-200 p-3 font-ui text-xs text-blue-800 flex gap-2">
                  <Info size={14} className="shrink-0 mt-0.5" />
                  <span>{t("mortgageNote")}</span>
                </div>
              )}
            </div>

            {/* Results */}
            <div className="space-y-3">
              {scenarios.map((s, i) => (
                <div
                  key={s.key}
                  className={cn(
                    "rounded-xl border p-4 transition-all",
                    i === bestIdx
                      ? "border-[var(--gold)] bg-[var(--gold)]/5"
                      : "border-[var(--sand)] bg-white"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{s.icon}</span>
                      <span className="font-ui text-sm font-semibold text-[var(--navy)]">
                        {t(LABEL_KEY[s.key])}
                      </span>
                    </div>
                    {i === bestIdx && (
                      <span className="font-ui text-xs bg-[var(--gold)] text-[var(--navy)] px-2 py-0.5 rounded-full font-semibold">
                        {t("bestLabel")}
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-xl font-bold text-[var(--navy)] mb-1">{fmt(s.year5NetWorth)}</p>
                  <p className="font-ui text-xs text-[var(--brown)] mb-2">{t("projectedNet")}</p>
                  {s.unaffordable && (
                    <p className="font-ui text-xs text-red-600 mb-2 font-medium">
                      {t("affordabilityWarning")}
                    </p>
                  )}
                  <ul className="space-y-0.5">
                    {s.lines.map((line) => (
                      <li key={line.labelKey} className="font-ui text-xs text-[var(--brown)]">
                        · {t(line.labelKey)} {line.value}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Scenario note */}
              <div className="rounded-lg border border-[var(--sand)] bg-[var(--cream)] p-3 flex gap-2">
                <Info size={14} className="shrink-0 mt-0.5 text-[var(--brown)]" />
                <p className="font-ui text-xs text-[var(--brown)]">{t("scenarioNote")}</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 rounded-xl border border-[var(--navy)] bg-[var(--navy)] p-6 text-center text-white">
            <h2 className="font-display text-xl font-bold mb-2">{t("fullPictureTitle")}</h2>
            <p className="font-body text-sm text-[#a0b0c0] mb-1 max-w-md mx-auto">{t("fullPictureDesc")}</p>
            <p className="font-ui text-xs text-[var(--gold)] mb-4">{t("trustNote")}</p>
            <Link
              href={`/${lang}/register`}
              className={cn(buttonVariants(), "bg-[var(--gold)] text-[var(--navy)] font-semibold hover:bg-[var(--gold)]/90")}
            >
              {t("fullPictureButton")} <ArrowRight size={16} className="ml-1" />
            </Link>
            <p className="font-ui text-xs text-[#6b7f90] mt-2">{t("fullPictureFree")}</p>
          </div>

          <div className="mt-6">
            <Disclaimer />
          </div>
          <p className="font-ui text-xs text-center text-[var(--brown)] mt-3">{t("disclaimer")}</p>
        </div>
      </div>
      <Footer />
    </>
  );
}
