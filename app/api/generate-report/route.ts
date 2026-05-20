import { createClient } from "@/lib/supabase/server";
import { buildReportHTML, generatePDF } from "@/lib/pdf-generator";
import { getJurisdiction, getCurrency, getJurisdictionName } from "@/lib/jurisdiction";
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

  // 4. Fetch latest analysis for each scenario — single IN query instead of N+1
  const scenarioIds = scenarios.map((s) => s.id as string);
  const { data: allAnalyses } = await (supabase as never as {
    from: (t: string) => {
      select: (s: string) => {
        in: (c: string, v: string[]) => {
          order: (col: string, opts: { ascending: boolean }) => Promise<{ data: Record<string, unknown>[] | null }>
        }
      }
    }
  }).from("analyses").select("*").in("scenario_id", scenarioIds).order("created_at", { ascending: false });

  const scenariosWithAnalysis = scenarios.map((s) => {
    const analysis = (allAnalyses ?? []).find((a) => a.scenario_id === s.id);
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
  await (supabase as never as { from: (t: string) => { insert: (d: unknown) => Promise<unknown> } })
    .from("audit_log").insert({
      user_id: user.id,
      action: "report_generated",
      user_visible: true,
      display_text: "Report generated",
      metadata: { report_type: plan === "professional" ? "professional" : "standard", scenario_count: scenarios.length },
    });

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
