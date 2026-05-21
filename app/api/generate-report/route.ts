import { createClient } from "@/lib/supabase/server";
import { buildReportHTML, generatePDF } from "@/lib/pdf-generator";
import { getJurisdiction, getCurrency, getJurisdictionName } from "@/lib/jurisdiction";
import { writeAuditLog } from "@/lib/audit";
import { NextRequest } from "next/server";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  // 1. Auth
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  // 2. Plan check
  const { data: profile } = await (supabase as never as {
    from: (t: string) => { select: (s: string) => { eq: (c: string, v: string) => { single: () => Promise<{ data: Record<string, unknown> | null }> } } }
  }).from("profiles").select("name,country,state_province,plan_type,preferred_language,plan_expires_at").eq("id", user.id).single();

  if (!profile) return Response.json({ error: "Profile not found" }, { status: 404 });

  const plan = profile.plan_type as string;
  if (plan === "discovery") {
    return Response.json({ error: "upgrade_required", plan: "discovery" }, { status: 403 });
  }

  // Plan expiry check
  if (
    (plan === "clarified" || plan === "strategist" || plan === "professional") &&
    profile.plan_expires_at &&
    new Date(profile.plan_expires_at as string) < new Date()
  ) {
    return Response.json({ error: "plan_expired" }, { status: 403 });
  }

  // 2.5 Rate limit: 5 PDFs per hour per user
  const oneHourAgo = new Date(Date.now() - 3_600_000).toISOString();
  const { count: recentReports } = await (supabase as never as {
    from: (t: string) => {
      select: (s: string, opts: { count: string; head: boolean }) => {
        eq: (c: string, v: string) => {
          gte: (c2: string, v2: string) => Promise<{ count: number | null }>
        }
      }
    }
  }).from("reports").select("id", { count: "exact", head: true }).eq("user_id", user.id).gte("created_at", oneHourAgo);
  if ((recentReports ?? 0) >= 5) {
    return Response.json({ error: "rate_limited", message: "Maximum 5 reports per hour. Please try again later." }, { status: 429 });
  }

  // 3. Fetch all data in parallel
  const [assetsRes, debtsRes, scenariosRes] = await Promise.all([
    (supabase as never as { from: (t: string) => { select: (s: string) => { eq: (c: string, v: string) => Promise<{ data: Record<string, unknown>[] | null }> } } })
      .from("assets").select("*").eq("user_id", user.id),
    (supabase as never as { from: (t: string) => { select: (s: string) => { eq: (c: string, v: string) => Promise<{ data: Record<string, unknown>[] | null }> } } })
      .from("debts").select("*").eq("user_id", user.id),
    (supabase as never as { from: (t: string) => { select: (s: string) => { eq: (c: string, v: string) => { order: (c: string, o: Record<string, unknown>) => { limit: (n: number) => Promise<{ data: Record<string, unknown>[] | null }> } } } } })
      .from("scenarios").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10),
  ]);

  const assets = assetsRes.data ?? [];
  const debts = debtsRes.data ?? [];
  const scenarios = scenariosRes.data ?? [];

  // 4. Fetch latest analysis per scenario + per-asset overrides — both in parallel
  const scenarioIds = scenarios.map((s) => s.id as string);
  const analysesMap = new Map<string, Record<string, unknown>>();
  const overrideMap = new Map<string, { outcome: string; split_pct_me: number }>();

  if (scenarioIds.length > 0) {
    const [analysesRes, overridesRes] = await Promise.all([
      (supabase as never as {
        from: (t: string) => { select: (s: string) => { in: (c: string, v: string[]) => Promise<{ data: Record<string, unknown>[] | null }> } }
      }).from("latest_analysis_per_scenario").select("*").in("scenario_id", scenarioIds),
      (supabase as never as {
        from: (t: string) => { select: (s: string) => { in: (c: string, v: string[]) => Promise<{ data: Record<string, unknown>[] | null }> } }
      }).from("scenario_asset_overrides").select("scenario_id,asset_id,outcome,split_pct_me").in("scenario_id", scenarioIds),
    ]);
    for (const a of analysesRes.data ?? []) {
      analysesMap.set(a.scenario_id as string, a);
    }
    for (const o of overridesRes.data ?? []) {
      overrideMap.set(`${o.scenario_id as string}:${o.asset_id as string}`, {
        outcome: o.outcome as string,
        split_pct_me: o.split_pct_me as number,
      });
    }
  }

  const scenariosWithAnalysis = scenarios.map((s) => {
    const analysis = analysesMap.get(s.id as string) ?? null;
    const splitPct = (s.retirement_split_me as number) ?? 50;
    const FINANCIAL_CATS = new Set(["bank", "retirement", "investment", "crypto", "other"]);
    const scenarioAssets = assets.map((a) => {
      const override = overrideMap.get(`${s.id as string}:${a.id as string}`);
      const isFinancial = FINANCIAL_CATS.has(a.category as string);
      return {
        ...a,
        outcome: isFinancial ? `split:${splitPct}%_to_me` : (override?.outcome ?? "not_decided"),
        split_pct_me: isFinancial ? splitPct : (override?.split_pct_me ?? 50),
      };
    });
    return {
      name: s.name as string,
      net_worth_now: (analysis?.net_worth_now as number) ?? 0,
      year1: (analysis?.net_worth_year1 as number) ?? 0,
      year3: (analysis?.net_worth_year3 as number) ?? 0,
      year5: (analysis?.net_worth_year5 as number) ?? 0,
      year10: (analysis?.net_worth_year10 as number) ?? 0,
      monthly_cashflow: (analysis?.monthly_cash_flow as number) ?? 0,
      risk_score: (analysis?.risk_score as number) ?? 5,
      alimony_range_low: (analysis?.alimony_range_low as number) ?? 0,
      alimony_range_high: (analysis?.alimony_range_high as number) ?? 0,
      child_support_estimate: (analysis?.child_support_estimate as number) ?? 0,
      negotiation_strategy: (analysis?.negotiation_strategy as string) ?? "",
      key_risks: (analysis?.key_risks as string[]) ?? [],
      confidence_label_text: ((analysis?.raw_json as Record<string, unknown>)?.confidence_label_text as string) ?? "",
      assets: scenarioAssets as never,
      retirement_split_me: splitPct,
    };
  });

  // 5. Build HTML and generate PDF
  const country = profile.country as string;
  const j = getJurisdiction(country, profile.state_province as string);
  const currency = getCurrency(country);
  const html = buildReportHTML({
    userName: (profile.name as string) ?? "User",
    jurisdiction: getJurisdictionName(j),
    date: new Date().toLocaleDateString(
      { en: "en-US", tr: "tr-TR", de: "de-DE", fr: "fr-FR", es: "es-ES", ar: "ar-SA" }[(profile.preferred_language as string) ?? "en"] ?? "en-US",
      { year: "numeric", month: "long", day: "numeric" }
    ),
    lang: (profile.preferred_language as string) ?? "en",
    assets: assets as never,
    debts: debts as never,
    scenarios: scenariosWithAnalysis,
    currency,
  });

  // 6. Audit log
  await writeAuditLog(supabase, {
    user_id: user.id,
    action: "report_generated",
    user_visible: true,
    display_text: "Report generated",
    metadata: { report_type: plan === "professional" ? "professional" : "standard", scenario_count: scenarios.length },
  }, "generate-report");

  // 7. Generate PDF and return binary response
  const pdfBuffer = await generatePDF(html);
  return new Response(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="settlelens-report.pdf"',
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
