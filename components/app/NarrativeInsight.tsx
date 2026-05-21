"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Lightbulb } from "lucide-react";

type Props = {
  analyzedCount: number;
  bestScenarioName: string | null;
  worstScenarioName: string | null;
  bestYear10: number;
  worstYear10: number;
  avgRisk: number | null;
  firstMonthlyCashflow: number | null;
  currency: string;
  locale: string;
  negotiationStrategy?: string;
};

export function NarrativeInsight({
  analyzedCount,
  bestScenarioName,
  worstScenarioName,
  bestYear10,
  worstYear10,
  avgRisk,
  firstMonthlyCashflow,
  currency,
  locale,
  negotiationStrategy,
}: Props) {
  const t = useTranslations("dashboard.insight");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 120);
    return () => clearTimeout(timer);
  }, []);

  const fmtCurrency = (n: number) =>
    new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 }).format(Math.abs(n));

  let insight: string;

  if (
    analyzedCount >= 2 &&
    bestScenarioName &&
    worstScenarioName &&
    worstYear10 !== 0 &&
    bestYear10 !== worstYear10
  ) {
    const pct = Math.round(((bestYear10 - worstYear10) / Math.abs(worstYear10)) * 100);
    if (Math.abs(pct) >= 5) {
      insight = t("compareScenarios", { best: bestScenarioName, worst: worstScenarioName, pct: Math.abs(pct) });
    } else if (firstMonthlyCashflow != null && firstMonthlyCashflow < 0) {
      insight = t("negativeCashflow", { amount: fmtCurrency(firstMonthlyCashflow) });
    } else if (avgRisk != null && avgRisk >= 7) {
      insight = t("highRisk");
    } else {
      insight = t("default");
    }
  } else if (firstMonthlyCashflow != null && firstMonthlyCashflow < 0) {
    insight = t("negativeCashflow", { amount: fmtCurrency(firstMonthlyCashflow) });
  } else if (avgRisk != null && avgRisk >= 7) {
    insight = t("highRisk");
  } else if (analyzedCount === 1) {
    insight = t("addSecondScenario");
  } else {
    insight = t("default");
  }

  return (
    <div
      className="rounded-xl border border-[var(--gold)]/30 bg-[var(--gold)]/5 px-4 py-3 flex items-start gap-3"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(4px)",
        transition: "opacity 0.4s ease, transform 0.4s ease",
      }}
    >
      <Lightbulb size={16} className="text-[var(--gold)] shrink-0 mt-0.5" />
      <div className="space-y-1">
        <p className="font-ui text-sm text-[var(--navy)] leading-relaxed">{insight}</p>
        {negotiationStrategy && (() => {
          const summary = negotiationStrategy.split("|")[0]?.trim();
          return summary ? (
            <p className="font-ui text-xs text-[var(--brown)] leading-relaxed">{summary}</p>
          ) : null;
        })()}
      </div>
    </div>
  );
}
