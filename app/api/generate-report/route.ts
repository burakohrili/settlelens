import { createClient } from "@/lib/supabase/server";
import { generatePDF, buildReportHTML } from "@/lib/pdf-generator";
import { getJurisdiction, getCurrency, getJurisdictionName } from "@/lib/jurisdiction";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  // 1. Auth
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  // 2. Plan check
  const { data: profile } = await (supabase as never as {
    from: (t: string) => { select: (s: string) => { eq: (c: string, v: string) => { single: () => Promise<{ data: Record<string, unknown> | null }> } } }
  }).from("profiles").select("name,country,state_province,plan_type,preferred_language").eq("id", user.id).single();

  if (!profile) return Response.json({ error: "Profile not found" }, { status: 404 });

  const plan = profile.plan_type as string;
  if (plan === "discovery") {
    return Response.json({ error: "upgrade_required", plan: "discovery" }, { status: 403 });
  }

  // 3. Fetch all data in parallel
  const [assetsRes, debtsRes, scenariosRes] = await Promise.all([
    (supabase as never as { from: (t: string) => { select: (s: string) => { eq: (c: string, v: string) => Promise<{ data: Record<string, unknown>[] | null }> } } })
      .from("assets").select("*").eq("user_id", user.id),
    (supabase as never as { from: (t: string) => { select: (s: string) => { eq: (c: string, v: string) => Promise<{ data: Record<string, unknown>[] | null }> } } })
      .from("debts").select("*").eq("user_id", user.id),
    (supabase as never as { from: (t: string) => { select: (s: string) => { eq: (c: string, v: string) => Promise<{ data: Record<string, unknown>[] | null }> } } })
      .from("scenarios").select("*").eq("user_id", user.id),
  ]);

  const assets = assetsRes.data ?? [];
  const debts = debtsRes.data ?? [];
  const scenarios = scenariosRes.data ?? [];

  // 4. Fetch latest analysis for each scenario
  const scenariosWithAnalysis = await Promise.all(
    scenarios.map(async (s) => {
      const { data: analyses } = await (supabase as never as {
        from: (t: string) => {
          select: (s: string) => {
            eq: (c: string, v: string) => {
              order: (col: string, opts: { ascending: boolean }) => {
                limit: (n: number) => Promise<{ data: Record<string, unknown>[] | null }>
              }
            }
          }
        }
      }).from("analyses").select("*").eq("scenario_id", s.id as string).order("created_at", { ascending: false }).limit(1);

      const analysis = analyses?.[0];
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
    })
  );

  // 5. Build HTML and generate PDF
  const country = profile.country as string;
  const j = getJurisdiction(country, profile.state_province as string);
  const currency = getCurrency(country);
  const html = buildReportHTML({
    userName: (profile.name as string) ?? "User",
    jurisdiction: getJurisdictionName(j),
    date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    lang: (profile.preferred_language as string) ?? "en",
    assets: assets as never,
    debts: debts as never,
    scenarios: scenariosWithAnalysis,
    currency,
  });

  let pdfBuffer: Buffer;
  try {
    pdfBuffer = await generatePDF(html);
  } catch {
    return Response.json({ error: "PDF generation failed. Please try again." }, { status: 500 });
  }

  // 6. Upload to Supabase Storage
  const fileName = `reports/${user.id}/${Date.now()}.pdf`;
  const { error: uploadError } = await supabase.storage
    .from("reports")
    .upload(fileName, pdfBuffer, { contentType: "application/pdf" });

  if (uploadError) {
    return Response.json({ error: "Could not save report. Please try again." }, { status: 500 });
  }

  // 7. Get signed URL (24 hours)
  const { data: signedUrlData } = await supabase.storage
    .from("reports")
    .createSignedUrl(fileName, 86_400);

  const signedUrl = signedUrlData?.signedUrl;

  // 8. Save to reports table
  await (supabase as never as { from: (t: string) => { insert: (d: unknown) => Promise<unknown> } })
    .from("reports").insert({
      user_id: user.id,
      pdf_url: signedUrl,
      language: profile.preferred_language ?? "en",
      scenarios_compared: scenarios.map((s) => s.id),
      report_type: plan === "professional" ? "professional" : "standard",
    });

  // 9. Audit log
  await (supabase as never as { from: (t: string) => { insert: (d: unknown) => Promise<unknown> } })
    .from("audit_log").insert({
      user_id: user.id,
      action: "report_generated",
      user_visible: true,
      display_text: "PDF report generated",
      metadata: { report_type: plan === "professional" ? "professional" : "standard", scenario_count: scenarios.length },
    });

  return Response.json({ success: true, url: signedUrl });
}
