import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { getAppLocale } from "@/lib/get-app-locale";
import { getJurisdiction, getCurrency, getJurisdictionName } from "@/lib/jurisdiction";

export const dynamic = "force-dynamic";
import { ProjectionChart } from "@/components/app/ProjectionChart";
import { ScenarioComparison } from "@/components/app/ScenarioComparison";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Plus, Download, Pencil, AlertTriangle, TrendingUp } from "lucide-react";
import { DiscoveryPreview } from "@/components/app/DiscoveryPreview";
import { DashboardFAQ } from "@/components/app/DashboardFAQ";
import { CountUpNumber } from "@/components/app/CountUpNumber";
import { RiskGauge } from "@/components/app/RiskGauge";
import { JourneyProgress } from "@/components/app/JourneyProgress";
import { NarrativeInsight } from "@/components/app/NarrativeInsight";

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

function fmt(n: number, currency: string, locale: string = "en"): string {
  return new Intl.NumberFormat(locale, {
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
  const tScenario = await getTranslations("scenarioComparison");
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
  const worstEntry = analyzedScenarios.reduce<{ value: number; name: string } | null>(
    (worst, s) => {
      if (!s.analysis) return worst;
      if (!worst || s.analysis.net_worth_year10 < worst.value) {
        return { value: s.analysis.net_worth_year10, name: s.scenario.name as string };
      }
      return worst;
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

  // Comparison table data — all scenarios (analyzed + unanalyzed)
  const allScenariosComparison = scenariosWithAnalysis.map(({ scenario, analysis }) => ({
    name: scenario.name as string,
    href: `/${lang}/scenarios/${scenario.id as string}`,
    net_worth_now: analysis?.net_worth_now ?? 0,
    year1: analysis?.net_worth_year1 ?? 0,
    year3: analysis?.net_worth_year3 ?? 0,
    year5: analysis?.net_worth_year5 ?? 0,
    year10: analysis?.net_worth_year10 ?? 0,
    monthly_cashflow: analysis?.monthly_cash_flow ?? 0,
    risk_score: analysis?.risk_score ?? 0,
    confidence_label_text: (analysis?.raw_json?.confidence_label_text as string) ?? "",
    awaitingAnalysis: !analysis,
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

      {/* Journey progress */}
      <JourneyProgress
        hasAssets={grossAssets > 0}
        hasScenarios={scenarioList.length > 0}
        hasAnalyses={hasAnalyses}
        hasOfferScenario={scenarioList.some((s) => (s.scenario_type as string) === "offer_comparison")}
      />

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
                  <p className="font-mono text-base font-bold text-[var(--navy)]">{fmt(grossAssets, currency, appLocale)}</p>
                </div>
                <div className="text-center">
                  <p className="font-ui text-xs text-[var(--brown)] mb-1">{t("totalDebts")}</p>
                  <p className="font-mono text-base font-bold text-[var(--danger)]">{fmt(totalDebts, currency, appLocale)}</p>
                </div>
                <div className="text-center">
                  <p className="font-ui text-xs text-[var(--brown)] mb-1">{t("netWorthCalc")}</p>
                  <p className={cn("font-mono text-base font-bold", calcNetWorth >= 0 ? "text-[var(--gain)]" : "text-[var(--danger)]")}>
                    {fmt(calcNetWorth, currency, appLocale)}
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

          {scenarioList.length === 0 ? (
            <div className="rounded-xl border border-[var(--sand)] bg-white p-6">
              <h2 className="font-display text-lg font-bold text-[var(--navy)] mb-5">{t("emptyGuideTitle")}</h2>
              <div className="space-y-3 mb-5">
                {[
                  { label: t("emptyStep1"), done: true },
                  { label: t("emptyStep2"), done: false },
                  { label: t("emptyStep3"), done: false },
                  { label: t("emptyStep4"), done: false },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                      step.done
                        ? "bg-[var(--gain)] text-white"
                        : "border-2 border-[var(--sand)] text-[var(--brown)]"
                    )}>
                      {step.done ? "✓" : i + 1}
                    </span>
                    <span className={cn(
                      "font-ui text-sm",
                      step.done ? "text-[var(--brown)] opacity-60 line-through" : "text-[var(--navy)]"
                    )}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
              <Link
                href={`/${lang}/onboarding/step-6`}
                className={cn(buttonVariants(), "bg-[var(--gold)] text-[var(--navy)] font-semibold hover:bg-[var(--gold)]/90")}
              >
                <Plus size={16} className="mr-1" /> {t("emptyCTA")}
              </Link>
            </div>
          ) : scenarioList.length > 0 && plan === "discovery" ? (
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

      {/* Narrative insight strip */}
      {hasAnalyses && (
        <NarrativeInsight
          analyzedCount={analyzedScenarios.length}
          bestScenarioName={bestScenarioName}
          worstScenarioName={worstEntry?.name ?? null}
          bestYear10={bestYear10 === -Infinity ? 0 : bestYear10}
          worstYear10={worstEntry?.value ?? 0}
          avgRisk={avgRisk}
          firstMonthlyCashflow={firstAnalysis?.monthly_cash_flow ?? null}
          currency={currency}
          locale={appLocale}
        />
      )}

      {/* Summary cards */}
      {hasAnalyses && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-xl border border-[var(--sand)] bg-white p-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
            <p className="font-ui text-xs text-[var(--brown)] uppercase tracking-wide">{t("netWorthNow")}</p>
            <CountUpNumber
              value={firstAnalysis?.net_worth_now ?? 0}
              currency={currency}
              className={cn("font-mono text-xl font-bold mt-1 block", (firstAnalysis?.net_worth_now ?? 0) >= 0 ? "text-[var(--navy)]" : "text-[var(--danger)]")}
            />
          </div>
          <div className="rounded-xl border border-[var(--sand)] bg-white p-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
            <p className="font-ui text-xs text-[var(--brown)] uppercase tracking-wide">{t("bestYear10")}</p>
            {bestYear10 === -Infinity ? (
              <p className="font-mono text-xl font-bold mt-1 text-[var(--gold)]">—</p>
            ) : (
              <CountUpNumber
                value={bestYear10}
                currency={currency}
                className="font-mono text-xl font-bold mt-1 block text-[var(--gold)]"
              />
            )}
            {bestScenarioName && (
              <p className="font-ui text-xs text-[var(--brown)] mt-1 truncate">{bestScenarioName}</p>
            )}
          </div>
          <div className="rounded-xl border border-[var(--sand)] bg-white p-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
            <p className="font-ui text-xs text-[var(--brown)] uppercase tracking-wide">{t("monthlyCashFlow")}</p>
            <CountUpNumber
              value={firstAnalysis?.monthly_cash_flow ?? 0}
              currency={currency}
              suffix={tScenario("perMonth")}
              className={cn("font-mono text-xl font-bold mt-1 block", (firstAnalysis?.monthly_cash_flow ?? 0) >= 0 ? "text-[var(--gain)]" : "text-[var(--danger)]")}
            />
          </div>
          <div className="rounded-xl border border-[var(--sand)] bg-white p-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
            <p className="font-ui text-xs text-[var(--brown)] uppercase tracking-wide">{t("riskScore")}</p>
            {avgRisk != null ? (
              <RiskGauge score={avgRisk} />
            ) : (
              <p className="font-mono text-xl font-bold mt-1 text-[var(--brown)]">—</p>
            )}
          </div>
        </div>
      )}

      {/* Chart */}
      {hasAnalyses && chartScenarios.length > 0 && (
        <div className="rounded-xl border border-[var(--sand)] bg-white p-4 hover:shadow-md transition-shadow duration-200">
          <h2 className="font-ui text-sm font-semibold text-[var(--navy)] mb-4">{t("projection")}</h2>
          <ProjectionChart scenarios={chartScenarios} currency={currency} locale={appLocale} />
        </div>
      )}

      {/* Scenario comparison — show when 2+ scenarios exist */}
      {scenarioList.length > 1 && (
        <div className="rounded-xl border border-[var(--sand)] bg-white p-4 hover:shadow-md transition-shadow duration-200">
          <h2 className="font-ui text-sm font-semibold text-[var(--navy)] mb-4">{t("scenarioComparison")}</h2>
          <ScenarioComparison
            scenarios={allScenariosComparison}
            currency={currency}
            locale={appLocale}
            awaitingLabel={t("awaitingAnalysis")}
          />
        </div>
      )}

      {/* Key risks */}
      {hasAnalyses && firstAnalysis?.key_risks && (firstAnalysis.key_risks as string[]).length > 0 && (
        <div className="rounded-xl border border-[var(--sand)] bg-white p-4 hover:shadow-md transition-shadow duration-200">
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
          href="/settings/financial-data"
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

      {scenarioList.length > 0 && <DashboardFAQ />}
    </div>
  );
}
