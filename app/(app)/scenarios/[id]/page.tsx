"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Loader2, ArrowLeft, AlertTriangle, HelpCircle, Pencil, Trash2 } from "lucide-react";
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
  retirement_split_me: number;
  alimony_monthly: number;
  alimony_years: number;
  alimony_direction: string;
  child_support_monthly: number;
  child_support_direction: string;
};

type AssetOverride = {
  asset_id: string;
  outcome: string;
  split_pct_me: number;
  assets: {
    id: string;
    name: string;
    category: string;
    current_value: number;
    owned_by: string | null;
  } | null;
};

const PHYSICAL_CATEGORIES = ["real_estate", "vehicle", "business"] as const;
type PhysicalCat = typeof PHYSICAL_CATEGORIES[number];

function fmt(n: number, currency: string, locale: string): string {
  return formatMoney(n, currency, locale);
}

function outcomeLabel(outcome: string, t: (k: string) => string): string {
  const map: Record<string, string> = {
    not_decided: t("outcome_not_decided"),
    i_keep:      t("outcome_i_keep"),
    spouse_keeps:t("outcome_spouse_keeps"),
    sell:        t("outcome_sell"),
    split:       t("outcome_split"),
  };
  return map[outcome] ?? outcome;
}

export default function ScenarioDetailPage() {
  const t = useTranslations("scenario_detail");
  const tStep6 = useTranslations("onboarding_form.step6");
  const locale = useLocale();
  const params = useParams();
  const router = useRouter();
  const scenarioId = params.id as string;
  const supabase = createClient();

  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [overrides, setOverrides] = useState<AssetOverride[]>([]);
  const [currency, setCurrency] = useState("USD");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState("discovery");
  const [planExpiresAt, setPlanExpiresAt] = useState<string | null>(null);
  const [analysisCount, setAnalysisCount] = useState(0);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  // Edit state
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editRetirement, setEditRetirement] = useState(50);
  const [editAlimonyMonthly, setEditAlimonyMonthly] = useState(0);
  const [editAlimonyYears, setEditAlimonyYears] = useState(0);
  const [editAlimonyDir, setEditAlimonyDir] = useState("i_receive");
  const [editChildSupport, setEditChildSupport] = useState(0);
  const [editChildDir, setEditChildDir] = useState("i_receive");
  const [editOverrides, setEditOverrides] = useState<Record<string, string>>({}); // asset_id → outcome
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (showDeleteConfirm) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [showDeleteConfirm]);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push(`/${locale}/login`); return; }

      const { data: profile } = await (supabase as never as {
        from: (t: string) => { select: (s: string) => { eq: (c: string, v: string) => { single: () => Promise<{ data: Record<string, unknown> | null }> } } }
      }).from("profiles").select("country,plan_type,plan_expires_at").eq("id", user.id).single();

      if (profile) {
        const countryCode = profile.country as string | null | undefined;
        const COUNTRY_CURRENCY_MAP: Record<string, string> = { US: "USD", UK: "GBP", DE: "EUR", FR: "EUR", ES: "EUR", TR: "TRY" };
        const LOCALE_CURRENCY_MAP: Record<string, string> = { tr: "TRY", de: "EUR", fr: "EUR", es: "EUR" };
        setCurrency(
          (countryCode ? (COUNTRY_CURRENCY_MAP[countryCode] ?? null) : null) ??
          LOCALE_CURRENCY_MAP[locale] ??
          "USD"
        );
        setPlan(profile.plan_type as string ?? "discovery");
        setPlanExpiresAt(profile.plan_expires_at as string | null);
      }

      const { data: s } = await (supabase as never as {
        from: (t: string) => { select: (s: string) => { eq: (c: string, v: string) => { single: () => Promise<{ data: Scenario | null }> } } }
      }).from("scenarios").select("*").eq("id", scenarioId).single();
      if (s) {
        setScenario(s);
        setEditName(s.name);
        setEditRetirement(s.retirement_split_me);
        setEditAlimonyMonthly(s.alimony_monthly);
        setEditAlimonyYears(s.alimony_years);
        setEditAlimonyDir(s.alimony_direction);
        setEditChildSupport(s.child_support_monthly);
        setEditChildDir(s.child_support_direction ?? "i_receive");
      }

      // Load per-asset overrides
      try {
        const oRes = await fetch(`/api/scenarios/${scenarioId}/asset-overrides`);
        if (oRes.ok) {
          const oJson = await oRes.json() as { overrides: AssetOverride[] };
          setOverrides(oJson.overrides ?? []);
          const map: Record<string, string> = {};
          for (const o of oJson.overrides ?? []) map[o.asset_id] = o.outcome;
          setEditOverrides(map);
        }
      } catch { /* silent — overrides optional */ }

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenarioId, locale]);

  function mapAnalysisError(code: string | undefined): string {
    if (code === "upgrade_required") return t("errorUpgrade");
    if (code === "analysis_limit_reached") return t("errorLimitReached");
    if (code === "analysis_timeout") return t("errorTimeout");
    return t("errorBusy");
  }

  async function handleSaveEdit() {
    if (!scenario) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/scenarios/${scenarioId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          retirement_split_me: editRetirement,
          alimony_monthly: editAlimonyMonthly,
          alimony_years: editAlimonyYears,
          alimony_direction: editAlimonyDir,
          child_support_monthly: editChildSupport,
          child_support_direction: editChildDir,
        }),
      });

      // Save per-asset overrides
      const overrideList = overrides.map((o) => ({
        asset_id: o.asset_id,
        outcome: editOverrides[o.asset_id] ?? o.outcome,
        split_pct_me: o.split_pct_me,
      }));
      if (overrideList.length > 0) {
        await fetch(`/api/scenarios/${scenarioId}/asset-overrides`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ overrides: overrideList }),
        });
        // Refresh overrides in state
        setOverrides((prev) =>
          prev.map((o) => ({ ...o, outcome: editOverrides[o.asset_id] ?? o.outcome }))
        );
      }

      if (res.ok) {
        setScenario((prev) => prev ? {
          ...prev,
          name: editName,
          retirement_split_me: editRetirement,
          alimony_monthly: editAlimonyMonthly,
          alimony_years: editAlimonyYears,
          alimony_direction: editAlimonyDir,
          child_support_monthly: editChildSupport,
          child_support_direction: editChildDir,
        } : prev);
        setEditMode(false);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/scenarios/${scenarioId}`, { method: "DELETE" });
      if (res.ok) router.push(`/${locale}/dashboard`);
    } finally {
      setDeleting(false);
    }
  }

  async function handleRunAnalysis() {
    if (plan === "discovery") { router.push("/upgrade"); return; }
    if (plan === "clarified" && planExpiresAt && new Date() > new Date(planExpiresAt)) {
      router.push("/upgrade"); return;
    }
    setLoading(true);
    setStep(1);
    setError(null);
    const t1 = setTimeout(() => setStep(2), 3000);
    const t2 = setTimeout(() => setStep(3), 8000);
    const t3 = setTimeout(() => setStep(4), 15000);
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
        setError(mapAnalysisError(body.error));
        if (body.error === "analysis_limit_reached") setAnalysisCount((c) => Math.max(c, 1));
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
        setAnalysisCount((c) => c + 1);
        if (body.missingFields?.length > 0) setMissingFields(body.missingFields);
      }
    } catch {
      setError(t("errorNetwork"));
    } finally {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      setLoading(false);
      setStep(0);
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

  const selectCls = "w-full border border-[var(--sand)] rounded-md px-3 py-2 font-ui text-sm focus:outline-none focus:border-[var(--gold)]";

  const groupedOverrides = PHYSICAL_CATEGORIES.reduce<Record<string, AssetOverride[]>>((acc, cat) => {
    acc[cat] = overrides.filter((o) => o.assets?.category === cat);
    return acc;
  }, { real_estate: [], vehicle: [], business: [] });

  const catLabel: Record<string, string> = {
    real_estate: tStep6("catRealEstate"),
    vehicle: tStep6("catVehicle"),
    business: tStep6("catBusiness"),
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Delete confirmation dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl border border-[var(--sand)] p-6 max-w-sm w-full mx-4 space-y-4">
            <h3 className="font-display text-base font-bold text-[var(--navy)]">{t("deleteScenario")}</h3>
            <p className="font-ui text-sm text-[var(--brown)]">{t("deleteConfirm")}</p>
            <div className="flex gap-2">
              <button onClick={handleDelete} disabled={deleting}
                className={cn(buttonVariants({ variant: "destructive" }), "flex-1", deleting && "opacity-70")}
              >
                {deleting ? <Loader2 size={14} className="animate-spin mr-1" /> : null}
                {t("deleteConfirmBtn")}
              </button>
              <button onClick={() => setShowDeleteConfirm(false)}
                className={cn(buttonVariants({ variant: "outline" }), "flex-1 border-[var(--sand)]")}
              >
                {t("cancelBtn")}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <Link href={`/${locale}/dashboard`} className="text-[var(--brown)] hover:text-[var(--navy)]">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="font-display text-xl font-bold text-[var(--navy)] flex-1">{scenario.name}</h1>
        <button onClick={() => setEditMode(!editMode)} title={t("editScenario")}
          className="p-1.5 rounded text-[var(--brown)] hover:text-[var(--navy)] hover:bg-[var(--cream)] transition-colors"
        >
          <Pencil size={16} />
        </button>
        <button onClick={() => setShowDeleteConfirm(true)} title={t("deleteScenario")}
          className="p-1.5 rounded text-[var(--brown)] hover:text-[var(--danger)] hover:bg-red-50 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Scenario terms */}
      <div className="rounded-xl border border-[var(--sand)] bg-white p-4">
        <h2 className="font-ui text-xs font-semibold text-[var(--brown)] uppercase mb-3">{t("scenarioTerms")}</h2>

        {editMode ? (
          <div className="space-y-3">
            <div>
              <label className="font-ui text-xs text-[var(--brown)] block mb-1">{t("editScenario")}</label>
              <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)}
                className={selectCls} />
            </div>

            {/* Per-asset overrides */}
            {overrides.length > 0 && (
              <div className="border-t border-[var(--sand)] pt-3">
                <p className="font-ui text-xs font-semibold text-[var(--navy)] uppercase tracking-wide mb-2">
                  {tStep6("assetsSection")}
                </p>
                <div className="space-y-3">
                  {PHYSICAL_CATEGORIES.map((cat) => {
                    const catOvr = groupedOverrides[cat];
                    if (catOvr.length === 0) return null;
                    return (
                      <div key={cat}>
                        <p className="font-ui text-xs text-[var(--brown)] font-semibold mb-1">{catLabel[cat]}</p>
                        {catOvr.map((o) => (
                          <div key={o.asset_id} className="flex items-center gap-3 mb-2">
                            <span className="font-ui text-sm flex-1 truncate text-[var(--navy)]">{o.assets?.name}</span>
                            <select
                              value={editOverrides[o.asset_id] ?? o.outcome}
                              onChange={(e) => setEditOverrides((prev) => ({ ...prev, [o.asset_id]: e.target.value }))}
                              className="w-40 border border-[var(--sand)] rounded-md px-2 py-1.5 font-ui text-sm focus:outline-none focus:border-[var(--gold)]"
                            >
                              <option value="not_decided">{tStep6("outcome_not_decided")}</option>
                              <option value="i_keep">{tStep6("outcome_i_keep")}</option>
                              <option value="spouse_keeps">{tStep6("outcome_spouse_keeps")}</option>
                              <option value="sell">{tStep6("outcome_sell")}</option>
                              {(cat as string) === "business" && (
                                <option value="split">{tStep6("outcome_split")}</option>
                              )}
                            </select>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-ui text-xs text-[var(--brown)] block mb-1">{t("investmentsLabel")}</label>
                <input type="number" min={0} max={100} value={editRetirement}
                  onChange={(e) => setEditRetirement(Number(e.target.value))}
                  className={cn(selectCls, "font-mono")} />
              </div>
              <div>
                <label className="font-ui text-xs text-[var(--brown)] block mb-1">{t("alimony")} {t("perMonth")}</label>
                <input type="number" min={0} value={editAlimonyMonthly}
                  onChange={(e) => setEditAlimonyMonthly(Number(e.target.value))}
                  className={cn(selectCls, "font-mono")} />
              </div>
              <div>
                <label className="font-ui text-xs text-[var(--brown)] block mb-1">{t("alimony")} {t("yr")}</label>
                <input type="number" min={0} value={editAlimonyYears}
                  onChange={(e) => setEditAlimonyYears(Number(e.target.value))}
                  className={cn(selectCls, "font-mono")} />
              </div>
              <div>
                <label className="font-ui text-xs text-[var(--brown)] block mb-1">{t("alimony")}</label>
                <select value={editAlimonyDir} onChange={(e) => setEditAlimonyDir(e.target.value)} className={selectCls}>
                  <option value="i_receive">{t("i_receive")}</option>
                  <option value="i_pay">{t("i_pay")}</option>
                </select>
              </div>
              <div>
                <label className="font-ui text-xs text-[var(--brown)] block mb-1">{t("childSupport")} {t("perMonth")}</label>
                <input type="number" min={0} value={editChildSupport}
                  onChange={(e) => setEditChildSupport(Number(e.target.value))}
                  className={cn(selectCls, "font-mono")} />
              </div>
              <div>
                <label className="font-ui text-xs text-[var(--brown)] block mb-1">{t("childSupport")}</label>
                <select value={editChildDir} onChange={(e) => setEditChildDir(e.target.value)} className={selectCls}>
                  <option value="i_receive">{t("i_receive")}</option>
                  <option value="i_pay">{t("i_pay")}</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button onClick={handleSaveEdit} disabled={saving}
                className={cn(buttonVariants(), "bg-[var(--gold)] text-[var(--navy)] font-semibold hover:bg-[var(--gold)]/90", saving && "opacity-70")}
              >
                {saving ? <Loader2 size={14} className="animate-spin mr-1" /> : null}
                {t("saveChanges")}
              </button>
              <button onClick={() => setEditMode(false)}
                className={cn(buttonVariants({ variant: "outline" }), "border-[var(--sand)]")}
              >
                {t("cancelBtn")}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 font-ui text-sm">
            {/* Per-asset outcomes */}
            {overrides.length > 0 && (
              <div>
                <p className="font-ui text-xs font-semibold text-[var(--navy)] uppercase tracking-wide mb-2">
                  {tStep6("assetsSection")}
                </p>
                <div className="space-y-3">
                  {PHYSICAL_CATEGORIES.map((cat) => {
                    const catOvr = groupedOverrides[cat];
                    if (catOvr.length === 0) return null;
                    return (
                      <div key={cat}>
                        <p className="font-ui text-xs text-[var(--brown)] font-semibold mb-1">{catLabel[cat]}</p>
                        <div className="space-y-1">
                          {catOvr.map((o) => (
                            <div key={o.asset_id} className="flex items-center justify-between">
                              <span className="text-[var(--brown)]">{o.assets?.name}</span>
                              <span className="font-medium text-[var(--navy)]">{outcomeLabel(o.outcome, tStep6)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 border-t border-[var(--sand)] pt-3">
              <div><span className="text-[var(--brown)]">{t("investmentsLabel")}:</span> <span className="font-medium text-[var(--navy)]">{scenario.retirement_split_me}{t("toMe")}</span></div>
              <div><span className="text-[var(--brown)]">{t("alimony")}:</span> <span className="font-medium text-[var(--navy)]">{fmt(scenario.alimony_monthly, currency, locale)}{t("perMonth")} × {scenario.alimony_years}{t("yr")} ({t(scenario.alimony_direction as "i_receive" | "i_pay")})</span></div>
              <div><span className="text-[var(--brown)]">{t("childSupport")}:</span> <span className="font-medium text-[var(--navy)]">{fmt(scenario.child_support_monthly, currency, locale)}{t("perMonth")}</span></div>
            </div>
          </div>
        )}
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

      {/* Analysis progress indicator */}
      {loading && step > 0 && (
        <div className="rounded-md bg-[var(--cream)] border border-[var(--sand)] p-3 space-y-2">
          {[t("step1"), t("step2"), t("step3"), t("step4")].map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className={cn(
                "w-4 h-4 rounded-full border-2 flex items-center justify-center text-[9px] font-bold shrink-0",
                step > i + 1 ? "border-[var(--gain)] bg-[var(--gain)] text-white"
                : step === i + 1 ? "border-[var(--gold)] bg-[var(--gold)] text-white"
                : "border-[var(--sand)] text-[var(--brown)]"
              )}>
                {step > i + 1 ? "✓" : i + 1}
              </span>
              <p className={cn("font-ui text-xs", step === i + 1 ? "text-[var(--navy)] font-semibold" : "text-[var(--brown)]")}>
                {step === i + 1 && <Loader2 size={11} className="inline mr-1 animate-spin" />}
                {label}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Analysis results */}
      {analysis ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: t("netWorthNow"), value: fmt(analysis.net_worth_now, currency, locale), color: "text-[var(--navy)]", tip: t("tipNetWorthNow") },
              { label: t("year1"),       value: fmt(analysis.net_worth_year1, currency, locale), color: "text-[var(--navy)]", tip: t("tipYear1") },
              { label: t("year5"),       value: fmt(analysis.net_worth_year5, currency, locale), color: "text-[var(--navy)]", tip: t("tipYear5") },
              { label: t("year10"),      value: fmt(analysis.net_worth_year10, currency, locale), color: "text-[var(--gold)]", tip: t("tipYear10") },
              { label: t("monthlyCashFlow"), value: `${fmt(analysis.monthly_cash_flow, currency, locale)}${t("perMonth")}`, color: analysis.monthly_cash_flow >= 0 ? "text-[var(--gain)]" : "text-[var(--danger)]", tip: t("tipMonthlyCashFlow") },
              { label: t("riskScore"),   value: `${analysis.risk_score}/10`, color: riskColor(analysis.risk_score), tip: t("tipRiskScore"), extra: riskLabel(analysis.risk_score) },
            ].map((c) => (
              <div key={c.label} className="rounded-lg border border-[var(--sand)] bg-white p-3 text-center">
                <p className="font-ui text-xs text-[var(--brown)] flex items-center justify-center gap-1">
                  {c.label}
                  <span title={c.tip} aria-label={c.tip} tabIndex={0} role="button"
                    className="cursor-help text-[var(--sand)] hover:text-[var(--brown)] focus:text-[var(--brown)] focus:outline-none transition-colors"
                  >
                    <HelpCircle size={11} />
                  </span>
                </p>
                <p className={cn("font-mono text-base font-bold mt-1", c.color)}>{c.value}</p>
                {"extra" in c && c.extra && <p className={cn("font-ui text-xs mt-0.5 font-medium", c.color)}>{c.extra}</p>}
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-[var(--sand)] bg-white p-4">
            <p className="font-ui text-xs text-[var(--brown)] mb-2">{t("alimonyRange")}</p>
            <p className="font-mono text-sm font-bold text-[var(--navy)]">
              {fmt(analysis.alimony_range_low, currency, locale)} – {fmt(analysis.alimony_range_high, currency, locale)}{t("perMonth")}
            </p>
            {analysis.child_support_estimate > 0 && (
              <>
                <p className="font-ui text-xs text-[var(--brown)] mt-3 mb-1">{t("childSupportEstimate")}</p>
                <p className="font-mono text-sm font-bold text-[var(--navy)]">{fmt(analysis.child_support_estimate, currency, locale)}{t("perMonth")}</p>
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

          {missingFields.length > 0 && (
            <div className="rounded-md bg-amber-50 border border-amber-200 p-3">
              <p className="font-ui text-xs text-amber-800">{t("missingFieldsWarning", { fields: missingFields.join(", ") })}</p>
            </div>
          )}

          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 p-3">
              <p role="alert" aria-live="polite" className="font-ui text-sm text-red-700">{error}</p>
            </div>
          )}

          {!(plan === "clarified" && analysisCount >= 1) && (
            <button onClick={handleRunAnalysis} disabled={loading}
              className={cn(buttonVariants({ variant: "outline" }), "border-[var(--sand)]", loading && "opacity-70 cursor-not-allowed")}
            >
              {loading ? <><Loader2 size={14} className="mr-1 animate-spin" /> {t("rerunning")}</> : t("rerunAnalysis")}
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-[var(--sand)] bg-[var(--cream)] p-6 text-center">
          <p className="font-ui text-sm text-[var(--brown)] mb-4">
            {plan === "discovery" ? t("discoveryUpgradeMsg") : t("noAnalysisYet")}
          </p>
          {error && <p role="alert" aria-live="polite" className="font-ui text-sm text-red-600 mb-3">{error}</p>}
          <button
            onClick={plan === "clarified" && analysisCount >= 1 ? () => router.push(`/${locale}/upgrade`) : handleRunAnalysis}
            disabled={loading}
            className={cn(buttonVariants(), "bg-[var(--gold)] text-[var(--navy)] font-semibold hover:bg-[var(--gold)]/90", loading && "opacity-70 cursor-not-allowed")}
          >
            {loading
              ? <><Loader2 size={16} className="mr-2 animate-spin" /> {t("analyzing")}</>
              : plan === "discovery"
              ? t("upgradeToAnalyze")
              : plan === "clarified" && analysisCount >= 1
              ? t("upgradeToAnalyzeAgain")
              : t("runAnalysis")}
          </button>
        </div>
      )}
    </div>
  );
}
