"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type ScenarioData = {
  name: string;
  net_worth_now: number;
  year1: number;
  year3: number;
  year5: number;
  year10: number;
  monthly_cashflow: number;
  risk_score: number;
  confidence_label_text?: string;
};

type Props = {
  scenarios: ScenarioData[];
  currency: string;
  recommendedIndex?: number;
};

function fmt(n: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(n || 0);
}

function riskBg(score: number): string {
  if (score >= 7) return "text-[var(--danger)]";
  if (score >= 4) return "text-[var(--gold)]";
  return "text-[var(--gain)]";
}

function riskIcon(score: number): string {
  if (score >= 7) return "▲";
  if (score >= 4) return "◆";
  return "●";
}

export function ScenarioComparison({ scenarios, currency, recommendedIndex = 0 }: Props) {
  const t = useTranslations("scenarioComparison");
  const [activeTab, setActiveTab] = useState(0);

  const ROWS: Array<{ label: string; key: keyof ScenarioData; format: "currency" | "number" | "cashflow" }> = [
    { label: t("netWorthNow"), key: "net_worth_now", format: "currency" },
    { label: t("year1"), key: "year1", format: "currency" },
    { label: t("year3"), key: "year3", format: "currency" },
    { label: t("year5"), key: "year5", format: "currency" },
    { label: t("year10"), key: "year10", format: "currency" },
    { label: t("monthlyCashFlow"), key: "monthly_cashflow", format: "cashflow" },
    { label: t("riskScore"), key: "risk_score", format: "number" },
  ];

  if (scenarios.length === 0) return null;

  // Find best value for each row (highlight)
  function bestIdx(key: keyof ScenarioData): number {
    if (key === "risk_score") {
      return scenarios.reduce((best, s, i) => ((s[key] as number) < (scenarios[best][key] as number) ? i : best), 0);
    }
    return scenarios.reduce((best, s, i) => ((s[key] as number) > (scenarios[best][key] as number) ? i : best), 0);
  }

  // Mobile: tabs
  return (
    <div>
      {/* Mobile tabs */}
      <div className="flex gap-1 mb-3 md:hidden">
        {scenarios.map((s, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={cn(
              "flex-1 rounded-md px-2 py-1.5 font-ui text-xs font-semibold transition-colors",
              activeTab === i
                ? "bg-[var(--navy)] text-white"
                : "bg-[var(--sand)] text-[var(--brown)]"
            )}
          >
            {i + 1}. {s.name.split(" ")[0]}
          </button>
        ))}
      </div>

      {/* Desktop: full table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full font-ui text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left py-2 pr-4 text-[var(--brown)] font-semibold text-xs w-36">{t("metric")}</th>
              {scenarios.map((s, i) => (
                <th
                  key={i}
                  className={cn(
                    "py-2 px-3 text-center font-semibold text-xs rounded-t-md",
                    i === recommendedIndex
                      ? "bg-[var(--gold)]/15 text-[var(--navy)] border-x border-t border-[var(--gold)]"
                      : "text-[var(--navy)]"
                  )}
                >
                  {i === recommendedIndex && (
                    <span className="block text-[9px] text-[var(--gold)] uppercase tracking-wider mb-0.5">{t("recommended")}</span>
                  )}
                  {s.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => {
              const best = bestIdx(row.key);
              return (
                <tr key={row.key} className="border-t border-[var(--sand)]">
                  <td className="py-2 pr-4 text-[var(--brown)] text-xs">{row.label}</td>
                  {scenarios.map((s, i) => {
                    const val = s[row.key] as number;
                    const isBest = i === best;
                    return (
                      <td
                        key={i}
                        className={cn(
                          "py-2 px-3 text-center font-mono text-xs",
                          isBest && "bg-[var(--gold)]/10 font-bold",
                          i === recommendedIndex && "border-x border-[var(--gold)]/40",
                          row.key === "risk_score" && riskBg(val),
                          row.key === "monthly_cashflow" && val < 0 && "text-[var(--danger)]",
                          row.key === "monthly_cashflow" && val >= 0 && "text-[var(--gain)]"
                        )}
                      >
                        {row.format === "currency" || row.format === "cashflow"
                          ? `${fmt(val, currency)}${row.format === "cashflow" ? t("perMonth") : ""}`
                          : row.key === "risk_score"
                            ? <span aria-label={`${val}/10`}>{riskIcon(val)} {val}/10</span>
                            : `${val}/10`}
                        {isBest && row.key !== "risk_score" && (
                          <span className="ml-1 text-[9px] text-[var(--gold)] font-sans">{t("best")}</span>
                        )}
                        {isBest && row.key === "risk_score" && (
                          <span className="ml-1 text-[9px] text-[var(--gain)] font-sans">{t("lowest")}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile: single scenario card */}
      <div className="md:hidden">
        {scenarios[activeTab] && (
          <div className="rounded-lg border border-[var(--sand)] bg-white p-4 space-y-2">
            {ROWS.map((row) => {
              const val = scenarios[activeTab][row.key] as number;
              return (
                <div key={row.key} className="flex justify-between items-center border-b border-[var(--sand)] pb-2 last:border-0">
                  <span className="font-ui text-xs text-[var(--brown)]">{row.label}</span>
                  <span className={cn(
                    "font-mono text-xs font-semibold",
                    row.key === "risk_score" && riskBg(val),
                    row.key === "monthly_cashflow" && val < 0 && "text-[var(--danger)]",
                    row.key === "monthly_cashflow" && val >= 0 && "text-[var(--gain)]",
                    row.key !== "risk_score" && row.key !== "monthly_cashflow" && "text-[var(--navy)]"
                  )}>
                    {row.format === "currency" || row.format === "cashflow"
                      ? `${fmt(val, currency)}${row.format === "cashflow" ? t("perMonth") : ""}`
                      : row.key === "risk_score"
                        ? <span aria-label={`${val}/10`}>{riskIcon(val)} {val}/10</span>
                        : `${val}/10`}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
