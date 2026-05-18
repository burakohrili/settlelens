"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Disclaimer } from "@/components/layout/Disclaimer";
import { Loader2, ArrowLeft, AlertTriangle, HelpCircle } from "lucide-react";
import Link from "next/link";

type Analysis = {
  net_worth_now: number;
  net_worth_year1: number;
  net_worth_year3: number;
  net_worth_year5: number;
  net_worth_year10: number;
  monthly_cash_flow: number;
  alimony_range_low: number;
  alimony_range_high: number;
  child_support_estimate: number;
  risk_score: number;
  key_risks: string[];
  negotiation_strategy: string;
  raw_json: Record<string, unknown>;
  created_at: string;
};

type Scenario = {
  id: string;
  name: string;
  house_outcome: string;
  retirement_split_me: number;
  alimony_monthly: number;
  alimony_years: number;
  alimony_direction: string;
  child_support_monthly: number;
};

function fmt(n: number, currency: string): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(n || 0);
}

export default function ScenarioDetailPage() {
  const t = useTranslations("scenario_detail");
  const locale = useLocale();
  const params = useParams();
  const router = useRouter();
  const scenarioId = params.id as string;
  const supabase = createClient();

  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [currency, setCurrency] = useState("USD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState("discovery");
  const [analysisCount, setAnalysisCount] = useState(0);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push(`/${locale}/login`); return; }

      const { data: profile } = await (supabase as never as {
        from: (t: string) => { select: (s: string) => { eq: (c: string, v: string) => { single: () => Promise<{ data: Record<string, unknown> | null }> } } }
      }).from("profiles").select("country,state_province,plan_type").eq("id", user.id).single();

      if (profile) {
        const country = profile.country as string;
        setCurrency({ US: "USD", UK: "GBP", DE: "EUR", FR: "EUR", ES: "EUR", TR: "TRY" }[country] ?? "USD");
        setPlan(profile.plan_type as string ?? "discovery");
      }

      const { data: s } = await (supabase as never as {
        from: (t: string) => { select: (s: string) => { eq: (c: string, v: string) => { single: () => Promise<{ data: Scenario | null }> } } }
      }).from("scenarios").select("*").eq("id", scenarioId).single();
      if (s) setScenario(s);

      const { data: analyses } = await (supabase as never as {
        from: (t: string) => {
          select: (s: string) => {
            eq: (c: string, v: string) => {
              order: (col: string, opts: { ascending: boolean }) => {
                limit: (n: number) => Promise<{ data: Analysis[] | null }>
              }
            }
          }
        }
      }).from("analyses").select("*").eq("scenario_id", scenarioId).order("created_at", { ascending: false }).limit(1);

      if (analyses?.[0]) setAnalysis(analyses[0]);

      // Fetch total analysis count for clarified quota display
      const { count } = await (supabase as never as {
        from: (t: string) => {
          select: (s: string, opts: { count: string; head: boolean }) => {
            eq: (c: string, v: string) => Promise<{ count: number | null }>
          }
        }
      }).from("analyses").select("id", { count: "exact", head: true }).eq("user_id", user.id);
      setAnalysisCount(count ?? 0);
    }
    load();
  }, [supabase, scenarioId, router, locale]);

  function mapAnalysisError(code: string | undefined, body?: { detail?: string }): string {
    if (code === "upgrade_required") return t("errorUpgrade");
    if (code === "analysis_limit_reached") return t("errorLimitReached");
    if (code === "Rate limit exceeded. Please try again later.") return t("errorBusy");
    if (code === "analysis_timeout") return t("errorTimeout");
    return t("errorBusy");
  }

  async function handleRunAnalysis() {
    if (plan === "discovery") {
      router.push("/upgrade");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 45_000);
      let res: Response;
      try {
        res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scenarioId }),
          signal: controller.signal,
        });
      } catch {
        setError(t("errorNetwork"));
        return;
      } finally {
        clearTimeout(tid);
      }
      const body = await res.json();
      if (!res.ok) {
        setError(mapAnalysisError(body.error, body));
      } else {
        setAnalysis({
          ...body.data,
          net_worth_year1: body.data.year1,
          net_worth_year3: body.data.year3,
          net_worth_year5: body.data.year5,
          net_worth_year10: body.data.year10,
          monthly_cash_flow: body.data.monthly_cashflow,
          raw_json: body.data,
          created_at: new Date().toISOString(),
        });
      }
    } catch {
      setError(t("errorNetwork"));
    } finally {
      setLoading(false);
    }
  }

  if (!scenario) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="animate-spin text-[var(--gold)]" size={24} />
      </div>
    );
  }

  const riskColor = (score: number) =>
    score >= 7 ? "text-[var(--danger)]" : score >= 4 ? "text-[var(--gold)]" : "text-[var(--gain)]";

  const riskLabel = (score: number) =>
    score >= 7 ? t("riskHigh") : score >= 4 ? t("riskMedium") : t("riskLow");

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="text-[var(--brown)] hover:text-[var(--navy)]">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="font-display text-xl font-bold text-[var(--navy)]">{scenario.name}</h1>
      </div>

      {/* Scenario summary */}
      <div className="rounded-xl border border-[var(--sand)] bg-white p-4">
        <h2 className="font-ui text-xs font-semibold text-[var(--brown)] uppercase mb-3">{t("scenarioTerms")}</h2>
        <div className="grid grid-cols-2 gap-2 font-ui text-sm">
          <div><span className="text-[var(--brown)]">{t("house")}:</span> <span className="font-medium text-[var(--navy)]">{scenario.house_outcome?.replace(/_/g, " ")}</span></div>
          <div><span className="text-[var(--brown)]">{t("retirementSplit")}:</span> <span className="font-medium text-[var(--navy)]">{scenario.retirement_split_me}{t("toMe")}</span></div>
          <div><span className="text-[var(--brown)]">{t("alimony")}:</span> <span className="font-medium text-[var(--navy)]">{fmt(scenario.alimony_monthly, currency)}{t("perMonth")} × {scenario.alimony_years}{t("yr")} ({t(scenario.alimony_direction as "i_receive" | "i_pay")})</span></div>
          <div><span className="text-[var(--brown)]">{t("childSupport")}:</span> <span className="font-medium text-[var(--navy)]">{fmt(scenario.child_support_monthly, currency)}{t("perMonth")}</span></div>
        </div>
      </div>

      {/* Clarified plan: remaining analysis quota */}
      {plan === "clarified" && (
        <div className={cn(
          "rounded-md border px-3 py-2 font-ui text-xs flex items-center gap-2",
          analysisCount >= 1
            ? "border-[var(--danger)] bg-red-50 text-[var(--danger)]"
            : "border-[var(--gold)] bg-amber-50 text-[var(--brown)]"
        )}>
          <span>{analysisCount >= 1 ? t("clarifiedUsed") : t("clarifiedRemaining")}</span>
        </div>
      )}

      {/* Loading time hint */}
      {loading && (
        <div className="rounded-md bg-[var(--cream)] border border-[var(--sand)] px-3 py-2 flex items-center gap-2">
          <Loader2 size={13} className="animate-spin text-[var(--gold)] shrink-0" />
          <p className="font-ui text-xs text-[var(--brown)]">{t("loadingHint")}</p>
        </div>
      )}

      {/* Analysis results */}
      {analysis ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: t("netWorthNow"), value: fmt(analysis.net_worth_now, currency), color: "text-[var(--navy)]", tip: t("tipNetWorthNow") },
              { label: t("year1"), value: fmt(analysis.net_worth_year1, currency), color: "text-[var(--navy)]", tip: t("tipYear1") },
              { label: t("year5"), value: fmt(analysis.net_worth_year5, currency), color: "text-[var(--navy)]", tip: t("tipYear5") },
              { label: t("year10"), value: fmt(analysis.net_worth_year10, currency), color: "text-[var(--gold)]", tip: t("tipYear10") },
              { label: t("monthlyCashFlow"), value: `${fmt(analysis.monthly_cash_flow, currency)}${t("perMonth")}`, color: analysis.monthly_cash_flow >= 0 ? "text-[var(--gain)]" : "text-[var(--danger)]", tip: t("tipMonthlyCashFlow") },
              { label: t("riskScore"), value: `${analysis.risk_score}/10`, color: riskColor(analysis.risk_score), tip: t("tipRiskScore"), extra: riskLabel(analysis.risk_score) },
            ].map((c) => (
              <div key={c.label} className="rounded-lg border border-[var(--sand)] bg-white p-3 text-center">
                <p className="font-ui text-xs text-[var(--brown)] flex items-center justify-center gap-1">
                  {c.label}
                  <span
                    title={c.tip}
                    aria-label={c.tip}
                    tabIndex={0}
                    role="button"
                    className="cursor-help text-[var(--sand)] hover:text-[var(--brown)] focus:text-[var(--brown)] focus:outline-none transition-colors"
                  >
                    <HelpCircle size={11} />
                  </span>
                </p>
                <p className={cn("font-mono text-base font-bold mt-1", c.color)}>{c.value}</p>
                {"extra" in c && c.extra && (
                  <p className={cn("font-ui text-xs mt-0.5 font-medium", c.color)}>{c.extra}</p>
                )}
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-[var(--sand)] bg-white p-4">
            <p className="font-ui text-xs text-[var(--brown)] mb-2">{t("alimonyRange")}</p>
            <p className="font-mono text-sm font-bold text-[var(--navy)]">
              {fmt(analysis.alimony_range_low, currency)} – {fmt(analysis.alimony_range_high, currency)}/mo
            </p>
            {analysis.child_support_estimate > 0 && (
              <>
                <p className="font-ui text-xs text-[var(--brown)] mt-3 mb-1">{t("childSupportEstimate")}</p>
                <p className="font-mono text-sm font-bold text-[var(--navy)]">{fmt(analysis.child_support_estimate, currency)}/mo</p>
              </>
            )}
          </div>

          {analysis.key_risks?.length > 0 && (
            <div className="rounded-xl border border-[var(--sand)] bg-white p-4">
              <h3 className="font-ui text-sm font-semibold text-[var(--navy)] mb-2 flex items-center gap-2">
                <AlertTriangle size={14} className="text-[var(--danger)]" /> {t("keyRisks")}
              </h3>
              <ul className="space-y-1">
                {analysis.key_risks.map((r, i) => (
                  <li key={i} className="font-ui text-sm text-[var(--brown)] flex items-start gap-2">
                    <span className="text-[var(--danger)] mt-0.5">•</span><span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysis.negotiation_strategy && (
            <div className="rounded-xl border border-[var(--sand)] bg-white p-4">
              <h3 className="font-ui text-sm font-semibold text-[var(--navy)] mb-2">{t("financialNote")}</h3>
              <p className="font-ui text-sm text-[var(--brown)]">{analysis.negotiation_strategy}</p>
            </div>
          )}

          {!!analysis.raw_json?.confidence_label_text && (
            <p className="font-ui text-xs text-[var(--brown)] italic">{String(analysis.raw_json.confidence_label_text)}</p>
          )}

          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 p-3">
              <p role="alert" aria-live="polite" className="font-ui text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            onClick={handleRunAnalysis}
            disabled={loading}
            className={cn(buttonVariants({ variant: "outline" }), "border-[var(--sand)]", loading && "opacity-70 cursor-not-allowed")}
          >
            {loading ? <><Loader2 size={14} className="mr-1 animate-spin" /> {t("rerunning")}</> : t("rerunAnalysis")}
          </button>
        </div>
      ) : (
        <div className="rounded-xl border border-[var(--sand)] bg-[var(--cream)] p-6 text-center">
          <p className="font-ui text-sm text-[var(--brown)] mb-4">
            {plan === "discovery" ? t("discoveryUpgradeMsg") : t("noAnalysisYet")}
          </p>
          {error && <p role="alert" aria-live="polite" className="font-ui text-sm text-red-600 mb-3">{error}</p>}
          <button
            onClick={handleRunAnalysis}
            disabled={loading}
            className={cn(buttonVariants(), "bg-[var(--gold)] text-[var(--navy)] font-semibold hover:bg-[var(--gold)]/90", loading && "opacity-70 cursor-not-allowed")}
          >
            {loading ? <><Loader2 size={16} className="mr-2 animate-spin" /> {t("analyzing")}</> : plan === "discovery" ? t("upgradeToAnalyze") : t("runAnalysis")}
          </button>
        </div>
      )}

      <Disclaimer />
    </div>
  );
}
