"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Lock, TrendingUp, DollarSign, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

type Scenario = { id: string; name: string; scenario_type: string };

const PRICE_BY_LOCALE: Record<string, string> = {
  tr: "899 ₺",
  en: "$29",
  de: "27 €",
  fr: "27 €",
  es: "27 €",
  ar: "$29",
};

export function DiscoveryPreview({ scenarios }: { scenarios: Scenario[] }) {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const price = PRICE_BY_LOCALE[locale] ?? "$29";

  const displayScenarios = scenarios.slice(0, 3);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-lg font-bold text-[var(--navy)]">
          {t("previewTitle")}
        </h2>
        <p className="font-ui text-sm text-[var(--brown)] mt-1">
          {t("previewSubtitle")}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {displayScenarios.map((s) => (
          <div key={s.id} className="relative rounded-xl border border-[var(--sand)] bg-white overflow-hidden">
            {/* Blurred content */}
            <div className="p-4 select-none" aria-hidden="true">
              <p className="font-ui text-xs font-semibold text-[var(--brown)] uppercase tracking-wide mb-3 truncate">
                {s.name}
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-ui text-xs text-[var(--brown)] flex items-center gap-1">
                    <DollarSign size={11} /> {t("netWorthNow")}
                  </span>
                  <span className="font-mono text-sm font-bold text-[var(--navy)] blur-sm select-none">
                    $142,500
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-ui text-xs text-[var(--brown)] flex items-center gap-1">
                    <TrendingUp size={11} /> {t("bestYear10")}
                  </span>
                  <span className="font-mono text-sm font-bold text-[var(--gold)] blur-sm select-none">
                    $298,000
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-ui text-xs text-[var(--brown)] flex items-center gap-1">
                    <Shield size={11} /> {t("riskScore")}
                  </span>
                  <span className="font-mono text-sm font-bold text-[var(--gold)] blur-sm select-none">
                    4/10
                  </span>
                </div>
              </div>

              {/* Mini bar chart placeholder */}
              <div className="mt-3 flex items-end gap-1 h-8">
                {[35, 55, 45, 70, 60, 85, 75].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-[var(--sand)] rounded-sm blur-sm"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Lock overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-[2px]">
              <div className="rounded-full bg-[var(--navy)]/10 p-2 mb-2">
                <Lock size={18} className="text-[var(--navy)]" />
              </div>
              <p className="font-ui text-xs font-semibold text-[var(--navy)] text-center px-2">
                {t("lockedScenario")}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="rounded-xl border border-[var(--gold)]/40 bg-[var(--gold)]/5 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="font-ui font-semibold text-sm text-[var(--navy)]">
              {t("unlockTitle")}
            </p>
            <p className="font-ui text-xs text-[var(--brown)] mt-1">
              {t("unlockDesc")}
            </p>
          </div>
          <Link
            href="/upgrade"
            className={cn(
              buttonVariants(),
              "bg-[var(--gold)] text-[var(--navy)] font-semibold hover:bg-[var(--gold)]/90 shrink-0 whitespace-nowrap"
            )}
          >
            {t("unlockCTA", { price })}
          </Link>
        </div>
      </div>
    </div>
  );
}
