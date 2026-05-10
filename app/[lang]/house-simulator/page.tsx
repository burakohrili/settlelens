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
import { Home, ArrowRight } from "lucide-react";

type HouseInputs = {
  homeValue: number;
  mortgage: number;
  monthlyPayment: number;
  myIncome: number;
  spouseIncome: number;
};

type ScenarioResult = {
  label: string;
  icon: string;
  netAsset: number;
  monthlyBurden: number;
  year5NetWorth: number;
  description: string[];
};

function calculateScenarios(inputs: HouseInputs): ScenarioResult[] {
  const { homeValue, mortgage, monthlyPayment } = inputs;
  const equity = Math.max(homeValue - mortgage, 0);
  const annualAppreciation = 0.03;
  const saleTransactionCost = 0.06;

  const iKeepYear5 = homeValue * Math.pow(1 + annualAppreciation, 5) - mortgage * 0.85;
  const iKeepMonthlyBurden = monthlyPayment;

  const sellNetProceeds = homeValue * (1 - saleTransactionCost) - mortgage;
  const myShare = sellNetProceeds / 2;
  const investedYear5 = myShare * Math.pow(1.05, 5);

  const spouseKeepsLostEquity = equity / 2;
  const rentMonthly = homeValue * 0.004;
  const rentInvestmentYear5 = spouseKeepsLostEquity * Math.pow(1.05, 5);

  return [
    {
      label: "I Keep the House",
      icon: "🏠",
      netAsset: equity,
      monthlyBurden: iKeepMonthlyBurden,
      year5NetWorth: iKeepYear5,
      description: [
        `Equity retained: ${fmt(equity)}`,
        `Monthly mortgage: ${fmt(monthlyPayment)}/mo`,
        `Projected value in 5 yrs: ${fmt(iKeepYear5)}`,
      ],
    },
    {
      label: "Spouse Keeps the House",
      icon: "🔄",
      netAsset: spouseKeepsLostEquity,
      monthlyBurden: rentMonthly,
      year5NetWorth: rentInvestmentYear5,
      description: [
        `Equity payout to you: ${fmt(spouseKeepsLostEquity)}`,
        `Estimated rent: ${fmt(rentMonthly)}/mo`,
        `If invested for 5 yrs: ${fmt(rentInvestmentYear5)}`,
      ],
    },
    {
      label: "We Sell the House",
      icon: "💰",
      netAsset: myShare,
      monthlyBurden: rentMonthly,
      year5NetWorth: investedYear5,
      description: [
        `Your share after costs: ${fmt(myShare)}`,
        `Estimated rent: ${fmt(rentMonthly)}/mo`,
        `If invested for 5 yrs: ${fmt(investedYear5)}`,
      ],
    },
  ];
}

function fmt(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n || 0);
}

function Slider({ label, value, min, max, step, onChange }: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between font-ui text-xs">
        <span className="text-[var(--brown)]">{label}</span>
        <span className="font-semibold text-[var(--navy)]">{fmt(value)}</span>
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

export default function HouseSimulatorPage() {
  const t = useTranslations("houseSimulator");
  const params = useParams();
  const lang = (params.lang as string) ?? "en";

  const [inputs, setInputs] = useState<HouseInputs>({
    homeValue: 400_000,
    mortgage: 200_000,
    monthlyPayment: 1_500,
    myIncome: 80_000,
    spouseIncome: 70_000,
  });

  function update(field: keyof HouseInputs, value: number) {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }

  const scenarios = calculateScenarios(inputs);
  const bestIdx = scenarios.reduce((best, s, i) => s.year5NetWorth > scenarios[best].year5NetWorth ? i : best, 0);

  return (
    <>
    <Header />
    <div className="min-h-screen bg-[var(--cream)]">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div className="rounded-full bg-[var(--gold)]/15 p-3">
              <Home size={28} className="text-[var(--gold)]" />
            </div>
          </div>
          <h1 className="font-display text-3xl font-bold text-[var(--navy)]">{t("title")}</h1>
          <p className="font-body text-[var(--brown)] mt-2 max-w-lg mx-auto">{t("subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="rounded-xl border border-[var(--sand)] bg-white p-5 space-y-5">
            <h2 className="font-ui text-sm font-semibold text-[var(--navy)]">{t("situationTitle")}</h2>
            <Slider label={t("homeValue")} value={inputs.homeValue} min={50_000} max={2_000_000} step={10_000} onChange={(v) => update("homeValue", v)} />
            <Slider label={t("mortgage")} value={inputs.mortgage} min={0} max={inputs.homeValue} step={5_000} onChange={(v) => update("mortgage", v)} />
            <Slider label={t("monthlyPayment")} value={inputs.monthlyPayment} min={200} max={10_000} step={100} onChange={(v) => update("monthlyPayment", v)} />
            <Slider label={t("myIncome")} value={inputs.myIncome} min={0} max={500_000} step={5_000} onChange={(v) => update("myIncome", v)} />
            <Slider label={t("spouseIncome")} value={inputs.spouseIncome} min={0} max={500_000} step={5_000} onChange={(v) => update("spouseIncome", v)} />

            <div className="rounded-md bg-[var(--cream)] border border-[var(--sand)] p-3 font-ui text-xs text-[var(--brown)]">
              <strong>{t("equity")}</strong> {fmt(Math.max(inputs.homeValue - inputs.mortgage, 0))} · {t("note")}
            </div>
          </div>

          {/* Results */}
          <div className="space-y-3">
            {scenarios.map((s, i) => (
              <div
                key={i}
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
                    <span className="font-ui text-sm font-semibold text-[var(--navy)]">{s.label}</span>
                  </div>
                  {i === bestIdx && (
                    <span className="font-ui text-xs bg-[var(--gold)] text-[var(--navy)] px-2 py-0.5 rounded-full font-semibold">Best</span>
                  )}
                </div>
                <p className="font-mono text-xl font-bold text-[var(--navy)] mb-2">{fmt(s.year5NetWorth)}</p>
                <p className="font-ui text-xs text-[var(--brown)] mb-2">projected net position in 5 years</p>
                <ul className="space-y-0.5">
                  {s.description.map((d, j) => (
                    <li key={j} className="font-ui text-xs text-[var(--brown)]">· {d}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 rounded-xl border border-[var(--navy)] bg-[var(--navy)] p-6 text-center text-white">
          <h2 className="font-display text-xl font-bold mb-2">{t("fullPictureTitle")}</h2>
          <p className="font-body text-sm text-[#a0b0c0] mb-4 max-w-md mx-auto">{t("fullPictureDesc")}</p>
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
        <p className="font-ui text-xs text-center text-[var(--brown)] mt-3">
          {t("disclaimer")}
        </p>
      </div>
    </div>
    <Footer />
    </>
  );
}
