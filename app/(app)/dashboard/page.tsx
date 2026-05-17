import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { getAppLocale } from "@/lib/get-app-locale";
import { getJurisdiction, getCurrency, getJurisdictionName } from "@/lib/jurisdiction";

export const dynamic = "force-dynamic";
import { ProjectionChart } from "@/components/app/ProjectionChart";
import { ScenarioComparison } from "@/components/app/ScenarioComparison";
import { Disclaimer } from "@/components/layout/Disclaimer";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Plus, Download, Pencil, AlertTriangle, TrendingUp } from "lucide-react";
import { DiscoveryPreview } from "@/components/app/DiscoveryPreview";

type Analysis = {
  net_worth_now: number;
  net_worth_year1: number;
  net_worth_year3: number;
  net_worth_year5: number;
  net_worth_year10: number;
  monthly_cash_flow: number;
  risk_score: number;
  alimony_range_low: number;
  alimony_range_high: number;
  child_support_estimate: number;
  negotiation_strategy: string;
  key_risks: string[];
  confidence_label: string;
  raw_json: Record<string, unknown>;
};

function fmt(n: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(n || 0);
}

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ upgraded?: string }> }) {
  const appLocale = await getAppLocale();
  setRequestLocale(appLocale);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/en/login");

  // Fetch profile
  const { data: profile } = await (supabase as never as {
    from: (t: string) => {
      select: (s: string) => {
        eq: (c: string, v: string) => {
          single: () => Promise<{ data: Record<string, unknown> | null }>
        }
      }
    }
  }).from("profiles").select("*").eq("id", user.id).single();

  // No profile = registration profile INSERT failed (email-confirm RLS race).
  // Redirect to onboarding so the user can create their profile via upsert.
  if (!profile) redirect("/onboarding/step-1");

  // If onboarding not complete, redirect to step 1
  if (!profile.onboarding_completed) {
    const lang = (profile.preferred_language as string) ?? "en";
    redirect(`/${lang}/onboarding/step-1`);
  }

  const lang = await getLocale();
  const t = await getTranslations("dashboard");
  const country = profile.country as string;
  const j = getJurisdiction(country, profile.state_province as string);
  const currency = getCurrency(country);
  const marriageYears = new Date().getFullYear() - ((profile.marriage_year as number) ?? 2010);
  const name = (profile.name as string) ?? t("greeting_fallback");

  // Fetch assets & debts for net worth calculation (shown on discovery plan)
  const { data: rawAssets } = await (supabase as never as {
    from: (t: string) => {
      select: (s: string) => {
        eq: (c: string, v: string) => Promise<{ data: Array<{ current_value: number; mortgage_balance: number }> | null }>
      }
    }
  }).from("assets").select("current_value,mortgage_balance").eq("user_id", user.id);

  const { data: rawDebts } = await (supabase as never as {
    from: (t: string) => {
      select: (s: string) => {
        eq: (c: string, v: string) => Promise<{ data: Array<{ balance: number }> | null }>
      }
    }
  }).from("debts").select("balance").eq("user_id", user.id);

  const grossAssets = (rawAssets ?? []).reduce((s, a) => s + (a.current_value ?? 0), 0);
  const totalMortgages = (rawAssets ?? []).reduce((s, a) => s + (a.mortgage_balance ?? 0), 0);
  const totalDebts = (rawDebts ?? []).reduce((s, d) => s + (d.balance ?? 0), 0) + totalMortgages;
  const calcNetWorth = grossAssets - totalDebts;

  // Fetch scenarios
  const { data: scenarios } = await (supabase as never as {
    from: (t: string) => {
      select: (s: string) => {
        eq: (c: string, v: string) => Promise<{ data: Record<string, unknown>[] | null }>
      }
    }
  }).from("scenarios").select("*").eq("user_id", user.id);

  const scenarioList = scenarios ?? [];

  // Fetch latest analysis for each scenario
  const scenariosWithAnalysis = await Promise.all(
    scenarioList.map(async (s) => {
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
      })
        .from("analyses")
        .select("*")
        .eq("scenario_id", s.id as string)
        .order("created_at", { ascending: false })
        .limit(1);

      return { scenario: s, analysis: analyses?.[0] ?? null };
    })
  );

  // Summary stats
  const analyzedScenarios = scenariosWithAnalysis.filter((s) => s.analysis);
  const bestEntry = analyzedScenarios.reduce<{ value: number; name: string } | null>(
    (best, s) => {
      if (!s.analysis) return best;
      if (!best || s.analysis.net_worth_year10 > best.value) {
        return { value: s.analysis.net_worth_year10, name: s.scenario.name as string };
      }
      return best;
    },
    null
  );
  const bestYear10 = bestEntry?.value ?? -Infinity;
  const bestScenarioName = bestEntry?.name ?? null;
  const firstAnalysis = analyzedScenarios[0]?.analysis;
  const avgRisk =
    analyzedScenarios.length > 0
      ? Math.round(analyzedScenarios.reduce((s, a) => s + (a.analysis?.risk_score ?? 5), 0) / analyzedScenarios.length)
      : null;

  // Chart data
  const chartScenarios = analyzedScenarios.map(({ scenario, analysis }) => ({
    name: scenario.name as string,
    data: [
      { year: 0, value: analysis!.net_worth_now },
      { year: 1, value: analysis!.net_worth_year1 },
      { year: 3, value: analysis!.net_worth_year3 },
      { year: 5, value: analysis!.net_worth_year5 },
      { year: 10, value: analysis!.net_worth_year10 },
    ],
  }));

  // Comparison table data
  const comparisonScenarios = analyzedScenarios.map(({ scenario, analysis }) => ({
    name: scenario.name as string,
    net_worth_now: analysis!.net_worth_now,
    year1: analysis!.net_worth_year1,
    year3: analysis!.net_worth_year3,
    year5: analysis!.net_worth_year5,
    year10: analysis!.net_worth_year10,
    monthly_cashflow: analysis!.monthly_cash_flow,
    risk_score: analysis!.risk_score,
    confidence_label_text: (analysis!.raw_json?.confidence_label_text as string) ?? "",
  }));

  const hasAnalyses = analyzedScenarios.length > 0;
  const plan = profile.plan_type as string;
  const resolvedParams = await searchParams;
  const justUpgraded = resolvedParams.upgraded === "1";

  return (
    <div className="space-y-6">
      {/* Upgrade success banner */}
      {justUpgraded && (
        <div className="rounded-xl border border-[var(--gain)] bg-green-50 p-4 flex items-center gap-3">
          <TrendingUp size={20} className="text-[var(--gain)] shrink-0" />
          <div>
            <p className="font-ui font-semibold text-sm text-[var(--gain)]">{t("upgradedTitle")}</p>
            <p className="font-ui text-xs text-[var(--brown)] mt-0.5">{t("upgradedDesc")}</p>
          </div>
        </div>
      )}

      {/* Welcome header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--navy)]">
          {(() => { const h = new Date().getHours(); return h < 12 ? t("greeting.morning") : h < 17 ? t("greeting.afternoon") : t("greeting.evening"); })()}, {name.split(" ")[0]}.
        </h1>
        <p className="font-ui text-sm text-[var(--brown)] mt-1">
          {getJurisdictionName(j)} · {t("yearsOfMarriage", { count: marriageYears })} · {t("planLabel", { plan: plan.charAt(0).toUpperCase() + plan.slice(1) })}
        </p>
      </div>

      {/* No analysis yet — onboarding complete but no scenarios analyzed */}
      {!hasAnalyses && (
        <>
          {/* Net worth summary card — shown for all plans when no analyses exist */}
          {grossAssets > 0 && (
            <div className="rounded-xl border border-[var(--sand)] bg-white p-5">
              <h2 className="font-ui text-xs font-semibold text-[var(--brown)] uppercase tracking-wide mb-4">{t("discoveryNetWorthTitle")}</h2>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center">
                  <p className="font-ui text-xs text-[var(--brown)] mb-1">{t("totalAssets")}</p>
                  <p className="font-mono text-base font-bold text-[var(--navy)]">{fmt(grossAssets, currency)}</p>
                </div>
                <div className="text-center">
                  <p className="font-ui text-xs text-[var(--brown)] mb-1">{t("totalDebts")}</p>
                  <p className="font-mono text-base font-bold text-[var(--danger)]">{fmt(totalDebts, currency)}</p>
                </div>
                <div className="text-center">
                  <p className="font-ui text-xs text-[var(--brown)] mb-1">{t("netWorthCalc")}</p>
                  <p className={cn("font-mono text-base font-bold", calcNetWorth >= 0 ? "text-[var(--gain)]" : "text-[var(--danger)]")}>
                    {fmt(calcNetWorth, currency)}
                  </p>
                </div>
              </div>
              {plan === "discovery" && (
                <div className="rounded-md bg-[var(--cream)] border border-[var(--sand)] p-3 flex items-center justify-between gap-3">
                  <p className="font-ui text-xs text-[var(--brown)]">{t("discoveryUpgradeNote")}</p>
                  <Link
                    href={`/${lang}/upgrade`}
                    className={cn(buttonVariants({ variant: "outline" }), "border-[var(--gold)] text-[var(--gold)] text-xs whitespace-nowrap shrink-0")}
                  >
                    {t("discoveryUpgradeCTA")}
                  </Link>
                </div>
              )}
            </div>
          )}

          {scenarioList.length > 0 && plan === "discovery" ? (
            <DiscoveryPreview
              scenarios={scenarioList.map((s) => ({
                id: s.id as string,
                name: s.name as string,
                scenario_type: s.scenario_type as string,
              }))}
            />
          ) : (
            <div className="rounded-xl border border-[var(--sand)] bg-[var(--cream)] p-6 text-center">
              <TrendingUp className="mx-auto text-[var(--gold)] mb-3" size={32} />
              <h2 className="font-display text-lg font-bold text-[var(--navy)] mb-2">{t("readyTitle")}</h2>
              <p className="font-ui text-sm text-[var(--brown)] mb-4 max-w-sm mx-auto">
                {t("readyDesc")}
              </p>
              <Link
                href={`/${lang}/onboarding/step-6`}
                className={cn(buttonVariants(), "bg-[var(--gold)] text-[var(--navy)] font-semibold hover:bg-[var(--gold)]/90")}
              >
                <Plus size={16} className="mr-1" /> {t("buildScenarios")}
              </Link>
            </div>
          )}
        </>
      )}

      {/* Summary cards */}
      {hasAnalyses && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-xl border border-[var(--sand)] bg-white p-4">
            <p className="font-ui text-xs text-[var(--brown)] uppercase tracking-wide">{t("netWorthNow")}</p>
            <p className={cn("font-mono text-xl font-bold mt-1", (firstAnalysis?.net_worth_now ?? 0) >= 0 ? "text-[var(--navy)]" : "text-[var(--danger)]")}>
              {fmt(firstAnalysis?.net_worth_now ?? 0, currency)}
            </p>
          </div>
          <div className="rounded-xl border border-[var(--sand)] bg-white p-4">
            <p className="font-ui text-xs text-[var(--brown)] uppercase tracking-wide">{t("bestYear10")}</p>
            <p className={cn("font-mono text-xl font-bold mt-1 text-[var(--gold)]")}>
              {bestYear10 === -Infinity ? "—" : fmt(bestYear10, currency)}
            </p>
            {bestScenarioName && (
              <p className="font-ui text-xs text-[var(--brown)] mt-1 truncate">{bestScenarioName}</p>
            )}
          </div>
          <div className="rounded-xl border border-[var(--sand)] bg-white p-4">
            <p className="font-ui text-xs text-[var(--brown)] uppercase tracking-wide">{t("monthlyCashFlow")}</p>
            <p className={cn("font-mono text-xl font-bold mt-1", (firstAnalysis?.monthly_cash_flow ?? 0) >= 0 ? "text-[var(--gain)]" : "text-[var(--danger)]")}>
              {fmt(firstAnalysis?.monthly_cash_flow ?? 0, currency)}<span className="text-xs font-normal">/mo</span>
            </p>
          </div>
          <div className="rounded-xl border border-[var(--sand)] bg-white p-4">
            <p className="font-ui text-xs text-[var(--brown)] uppercase tracking-wide">{t("riskScore")}</p>
            <p className={cn("font-mono text-xl font-bold mt-1", (avgRisk ?? 5) >= 7 ? "text-[var(--danger)]" : (avgRisk ?? 5) >= 4 ? "text-[var(--gold)]" : "text-[var(--gain)]")}>
              {avgRisk ?? "—"}<span className="text-xs font-normal">/10</span>
            </p>
          </div>
        </div>
      )}

      {/* Chart */}
      {hasAnalyses && chartScenarios.length > 0 && (
        <div className="rounded-xl border border-[var(--sand)] bg-white p-4">
          <h2 className="font-ui text-sm font-semibold text-[var(--navy)] mb-4">{t("projection")}</h2>
          <ProjectionChart scenarios={chartScenarios} currency={currency} />
        </div>
      )}

      {/* Scenario comparison */}
      {hasAnalyses && comparisonScenarios.length > 1 && (
        <div className="rounded-xl border border-[var(--sand)] bg-white p-4">
          <h2 className="font-ui text-sm font-semibold text-[var(--navy)] mb-4">{t("scenarioComparison")}</h2>
          <ScenarioComparison scenarios={comparisonScenarios} currency={currency} />
        </div>
      )}

      {/* Key risks */}
      {hasAnalyses && firstAnalysis?.key_risks && (firstAnalysis.key_risks as string[]).length > 0 && (
        <div className="rounded-xl border border-[var(--sand)] bg-white p-4">
          <h2 className="font-ui text-sm font-semibold text-[var(--navy)] mb-3 flex items-center gap-2">
            <AlertTriangle size={16} className="text-[var(--danger)]" /> {t("keyRisks")}
          </h2>
          <ul className="space-y-1.5">
            {(firstAnalysis.key_risks as string[]).map((risk, i) => (
              <li key={i} className="font-ui text-sm text-[var(--brown)] flex items-start gap-2">
                <span className="text-[var(--danger)] mt-0.5">•</span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Professional: Evidence Organizer banner */}
      {plan === "professional" && (
        <div className="rounded-xl border border-[var(--navy)] bg-[var(--navy)]/5 p-5 flex items-start gap-4">
          <div className="h-10 w-10 rounded-full bg-[var(--navy)] flex items-center justify-center shrink-0">
            <Download size={18} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="font-ui font-semibold text-sm text-[var(--navy)]">{t("evidenceOrganizerTitle")}</p>
            <p className="font-ui text-xs text-[var(--brown)] mt-1">{t("evidenceOrganizerDesc")}</p>
          </div>
          <Link
            href={`/${lang}/report`}
            className={cn(buttonVariants({ size: "sm" }), "bg-[var(--navy)] text-white hover:bg-[var(--navy)]/90 shrink-0 text-xs")}
          >
            {t("evidenceOrganizerCTA")}
          </Link>
        </div>
      )}

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          href={`/${lang}/scenarios/offer`}
          className={cn(buttonVariants(), "bg-[var(--gold)] text-[var(--navy)] font-semibold hover:bg-[var(--gold)]/90")}
        >
          <Plus size={16} className="mr-1" /> {t("analyzeOffer")}
        </Link>
        {plan !== "discovery" && (
          <Link
            href={`/${lang}/report`}
            className={cn(buttonVariants({ variant: "outline" }), "border-[var(--sand)]")}
          >
            <Download size={16} className="mr-1" /> {t("downloadPDF")}
          </Link>
        )}
        <Link
          href={`/${lang}/onboarding/step-2`}
          className={cn(buttonVariants({ variant: "outline" }), "border-[var(--sand)]")}
        >
          <Pencil size={16} className="mr-1" /> {t("editAssets")}
        </Link>
        {plan === "discovery" && (
          <Link
            href={`/${lang}/upgrade`}
            className={cn(buttonVariants({ variant: "outline" }), "border-[var(--gold)] text-[var(--gold)]")}
          >
            {t("upgradeToRun")}
          </Link>
        )}
      </div>

      <Disclaimer className="mt-4" />
    </div>
  );
}
