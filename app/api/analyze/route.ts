import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { turkeyRules } from "@/lib/jurisdiction/turkey";
import { ukRules } from "@/lib/jurisdiction/uk";
import { germanyRules } from "@/lib/jurisdiction/germany";
import { franceRules } from "@/lib/jurisdiction/france";
import { spainRules } from "@/lib/jurisdiction/spain";
import { usCommunityRules, usEquitableRules } from "@/lib/jurisdiction/us";

const JURISDICTION_RULES: Record<string, unknown> = {
  tr: turkeyRules,
  uk: ukRules,
  de: germanyRules,
  fr: franceRules,
  es: spainRules,
  "es-catalonia": spainRules,
  "us-community": usCommunityRules,
  "us-equitable": usEquitableRules,
};

const sanitizeForPrompt = (s: unknown): string =>
  String(s ?? "").replace(/[\r\n]+/g, " ").slice(0, 500);
import { getJurisdiction, getInflationRate, getCurrency } from "@/lib/jurisdiction";
import { sanitizeAIOutput } from "@/lib/safety/ai-output-guard";
import { getConfidenceLabel, CONFIDENCE_LABEL_COPY } from "@/lib/jurisdiction/confidence-labels";
import { NextRequest, after } from "next/server";

export const maxDuration = 60;

const anthropic = new Anthropic();

export async function POST(req: NextRequest) {
  // 1. Auth
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  // 2. Rate limit: 10 analyses/hour — DB-based (works across serverless invocations)
  const oneHourAgo = new Date(Date.now() - 3_600_000).toISOString();
  const { count: recentCount } = await (supabase as never as {
    from: (t: string) => { select: (s: string, opts?: { count: string; head: boolean }) => { eq: (c: string, v: string) => { eq: (c2: string, v2: string) => { gte: (c3: string, v3: string) => Promise<{ count: number | null }> } } } }
  }).from("audit_log").select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("action", "analysis_completed")
    .gte("created_at", oneHourAgo);
  if ((recentCount ?? 0) >= 10) {
    return Response.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429 });
  }

  // 3. Parse request
  let scenarioId: string;
  try {
    ({ scenarioId } = await req.json());
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }
  if (!scenarioId) return Response.json({ error: "scenarioId required" }, { status: 400 });

  // 4. Fetch all user data in parallel
  const [profileRes, assetsRes, debtsRes, incomeRes, childrenRes, scenarioRes, overridesRes] = await Promise.all([
    (supabase as never as { from: (t: string) => { select: (s: string) => { eq: (c: string, v: string) => { single: () => Promise<{ data: Record<string, unknown> | null }> } } } })
      .from("profiles").select("*").eq("id", user.id).single(),
    (supabase as never as { from: (t: string) => { select: (s: string) => { eq: (c: string, v: string) => Promise<{ data: Record<string, unknown>[] | null }> } } })
      .from("assets").select("*").eq("user_id", user.id),
    (supabase as never as { from: (t: string) => { select: (s: string) => { eq: (c: string, v: string) => Promise<{ data: Record<string, unknown>[] | null }> } } })
      .from("debts").select("*").eq("user_id", user.id),
    (supabase as never as { from: (t: string) => { select: (s: string) => { eq: (c: string, v: string) => Promise<{ data: Record<string, unknown>[] | null }> } } })
      .from("income").select("*").eq("user_id", user.id),
    (supabase as never as { from: (t: string) => { select: (s: string) => { eq: (c: string, v: string) => Promise<{ data: Record<string, unknown>[] | null }> } } })
      .from("children").select("*").eq("user_id", user.id),
    (supabase as never as { from: (t: string) => { select: (s: string) => { eq: (c: string, v: string) => { eq: (c2: string, v2: string) => { single: () => Promise<{ data: Record<string, unknown> | null }> } } } } })
      .from("scenarios").select("*").eq("id", scenarioId).eq("user_id", user.id).single(),
    (supabase as never as { from: (t: string) => { select: (s: string) => { eq: (c: string, v: string) => Promise<{ data: Record<string, unknown>[] | null }> } } })
      .from("scenario_asset_overrides").select("asset_id,outcome,split_pct_me,assets(id,name,category,current_value)").eq("scenario_id", scenarioId),
  ]);

  if (!profileRes.data) return Response.json({ error: "Profile not found" }, { status: 404 });
  if (!scenarioRes.data) return Response.json({ error: "Scenario not found" }, { status: 404 });

  const profile = profileRes.data;
  const scenario = scenarioRes.data;

  // 4.5 Plan check — block discovery, enforce clarified 3-analysis limit
  const planType = (profile.plan_type as string) ?? "discovery";
  if (planType === "discovery") {
    return Response.json({ error: "upgrade_required" }, { status: 403 });
  }
  if (planType === "clarified") {
    const { count: analysisCount } = await (supabase as never as {
      from: (t: string) => {
        select: (s: string, opts?: { count: string; head: boolean }) => {
          eq: (c: string, v: string) => Promise<{ count: number | null }>
        }
      }
    }).from("analyses").select("id", { count: "exact", head: true }).eq("user_id", user.id);
    if ((analysisCount ?? 0) >= 3) {
      return Response.json({ error: "analysis_limit_reached" }, { status: 403 });
    }
  }
  // Server-side expiry check — UI redirect alone is not sufficient
  if (
    (planType === "clarified" || planType === "strategist" || planType === "professional") &&
    profile.plan_expires_at &&
    new Date(profile.plan_expires_at as string) < new Date()
  ) {
    return Response.json({ error: "plan_expired" }, { status: 403 });
  }
  const assets = assetsRes.data ?? [];
  const debts = debtsRes.data ?? [];
  const income = incomeRes.data ?? [];
  const children = childrenRes.data ?? [];
  const assetOverrides = overridesRes.data ?? [];

  const country = profile.country as string;
  const j = getJurisdiction(country, profile.state_province as string);
  const currency = getCurrency(country);
  const inflation = Math.max(0, Math.min(0.50, (scenario.inflation_rate_override as number | null) ?? getInflationRate(country)));
  const investmentReturn = country === "TR" ? 0.08 : country === "UK" ? 0.04 : 0.05;
  const marriageYears = new Date().getFullYear() - ((profile.marriage_year as number) ?? 2010);
  const lang = (profile.preferred_language as string) ?? "en";

  const myIncome = income.find((i) => i.person === "me");
  const spouseIncome = income.find((i) => i.person === "spouse");

  // Detect missing data
  const missingFields: string[] = [];
  if (!myIncome) missingFields.push("my_income");
  if (!spouseIncome || (spouseIncome.annual_net as number) === -1) missingFields.push("spouse_income");
  if (assets.length === 0) missingFields.push("assets");

  const hasHighRisk = Boolean(profile.has_high_risk_signals);

  // 5. Build prompt (sensitive data — never log to console)
  const langInstruction = lang === "tr" ? "Tüm metin alanlarını (key_risks, negotiation_strategy, notes) TÜRKÇE yaz."
    : lang === "de" ? "Alle Textfelder auf DEUTSCH schreiben."
    : lang === "fr" ? "Écrire tous les champs texte en FRANÇAIS."
    : lang === "es" ? "Escribir todos los campos de texto en ESPAÑOL."
    : lang === "ar" ? "اكتب جميع حقول النص بالعربية."
    : "Write all text fields in ENGLISH.";

  const riskGuidance = hasHighRisk
    ? "User has HIGH-RISK signals. Set risk_score between 7-10."
    : "risk_score 1-10: start at 5. Add points for: negative monthly cashflow (+2), alimony direction=i_pay AND years>3 (+1), no income data (+2), crypto assets (+1), unknown spouse income (+1). Clamp result between 1 and 10.";

  const systemPrompt = `You are SettleLens's financial modeling engine.
RULES: Return ONLY valid JSON. No markdown. No preamble. No trailing text.
${langInstruction}
Include "Not legal or financial advice — for informational modeling only" in the notes field.
Use jurisdiction-specific formulas only. Be conservative in projections.
${riskGuidance}

ASSET OUTCOME CALCULATION RULES:
Each asset in the Assets array has an "outcome" field. Use these rules for net worth calculation:
- "i_keep": user receives 100% of (current_value - mortgage) for that asset
- "spouse_keeps": user receives 0% of that asset; exclude from user net worth entirely
- "sell": user receives 50% of net equity (current_value - mortgage - 8% sale costs)
- "split:N%_to_me": user receives N% of (current_value - mortgage) for that asset (applies to financial assets: bank, retirement, crypto, investment — typically mortgage=0)
- "not_decided": treat conservatively as sell (50/50 after costs)
For marital:true assets: apply the jurisdiction split formula to the marital portion only.
For marital:false assets: owner field determines — "me" → 100% to user, "spouse" → 0% to user, "joint" → apply outcome rule.
For TR/DE: if purchase_price is provided, marital_gain = current_value - purchase_price; apply splitFormula to marital_gain only; pre-marriage value stays with original owner.

NEGOTIATION_STRATEGY FORMAT:
Return negotiation_strategy as a single string with 4 sections separated by "|":
"overall_position|asset_approach|support_approach|risk_mitigation"
Each section: 1-2 sentences, calm factual tone. No "accept" or "reject".
Example: "Strong equity position relative to debt.|Retaining primary residence offsets retirement shortfall.|Proposed support terms align with income gap.|Monitor housing cost inflation against cashflow projection."`;

  const debtsSummary = debts.map((d) => ({
    cat: d.category,
    bal: d.balance,
    pay: d.monthly_payment,
    owner: d.owned_by,
    rate: d.interest_rate,
  }));

  // Build unified asset list: physical assets get per-asset outcome from overrides,
  // financial assets get the shared split percentage.
  type OverrideAsset = Record<string, unknown>;
  const overrideMap = new Map<string, string>();
  for (const o of assetOverrides as OverrideAsset[]) {
    const a = o.assets as Record<string, unknown> | null;
    if (a?.id) overrideMap.set(a.id as string, o.outcome as string);
  }

  const FINANCIAL_CATS = new Set(["bank", "retirement", "investment", "crypto", "other"]);
  const rawSplitPct = scenario.retirement_split_me as number;
  const splitPct = Number.isFinite(rawSplitPct) && rawSplitPct >= 0 && rawSplitPct <= 100 ? rawSplitPct : 50;

  const unifiedAssets = assets.map((a) => {
    const isFinancial = FINANCIAL_CATS.has(a.category as string);
    return {
      name: a.name,
      cat: a.category,
      val: a.current_value,
      purchase_price: (a.purchase_price as number | null) ?? null,
      acquisition_year: (a.acquisition_year as number | null) ?? null,
      owner: a.owned_by,
      marital: a.is_marital,
      mortgage: (a.mortgage_balance as number) ?? 0,
      outcome: isFinancial
        ? `split:${splitPct}%_to_me`
        : (overrideMap.get(a.id as string) ?? scenario.house_outcome ?? "not_decided"),
    };
  });

  const jurisdictionRule = JURISDICTION_RULES[j] ?? null;

  let userPrompt = `Jurisdiction:${j} | Marriage years:${marriageYears} | Currency:${currency}
JurisdictionRules:${jurisdictionRule ? JSON.stringify(jurisdictionRule) : "apply general equitable principles"}
Assets:${JSON.stringify(unifiedAssets)}
Debts:${JSON.stringify(debtsSummary)}
Income A(me):${(myIncome?.annual_net as number) ?? 0}/yr net, gross:${(myIncome?.annual_gross as number) ?? 0}, type:${(myIncome?.employment_type as string) ?? "unknown"}, other_income:${(myIncome?.other_income_annual as number) ?? 0}
Income B(spouse):${(spouseIncome?.annual_net as number) === -1 ? "unknown" : ((spouseIncome?.annual_net as number) ?? 0)}/yr net, gross:${(spouseIncome?.annual_net as number) === -1 ? "unknown" : ((spouseIncome?.annual_gross as number) ?? 0)}, type:${(spouseIncome?.employment_type as string) ?? "unknown"}, other_income:${(spouseIncome?.annual_net as number) === -1 ? "unknown" : ((spouseIncome?.other_income_annual as number) ?? 0)}
Children:${children.length > 0 ? children.map((c) => `age ${c.age as number}, custody:${c.custody_arrangement as string}`).join("; ") : "none"}
Scenario: alimony=${scenario.alimony_monthly}/mo×${scenario.alimony_years}yr(${scenario.alimony_direction}), child_support=${scenario.child_support_monthly}/mo(${scenario.child_support_direction})
Inflation:${(inflation * 100).toFixed(1)}%, Investment return:${(investmentReturn * 100).toFixed(0)}%, Response language:${lang}

Return JSON: {"net_worth_now":0,"year1":0,"year3":0,"year5":0,"year10":0,"monthly_cashflow":0,"alimony_range_low":0,"alimony_range_high":0,"child_support_estimate":0,"risk_score":5,"key_risks":[],"negotiation_strategy":"","confidence":"medium","notes":"","questions_for_your_lawyer":["","",""]}
questions_for_your_lawyer: provide 3 specific questions this user should ask their lawyer, based on their jurisdiction, assets, and scenario. Calm, professional tone.`;

  // Offer comparison mode
  if (scenario.scenario_type === "offer_comparison") {
    userPrompt += `\n\nOFFER COMPARISON MODE:
Offer source: ${scenario.offer_source ?? "unknown"}
Offer terms: ${sanitizeForPrompt(scenario.offer_raw_text)}
Compare this offer against the user's baseline financial position.
Additionally include in your JSON:
"offer_vs_baseline_year10": number,
"offer_assessment": "favorable|neutral|unfavorable",
"key_differences": ["","",""],
"points_to_negotiate": ["",""],
"questions_for_your_lawyer": ["","",""],
"offer_tone_note": ""
NEVER use "accept" or "reject". Say "this offer projects X outcome".`;
  }

  // 6. Call Claude API (9s client-side abort so Vercel doesn't kill us mid-flight)
  let aiResponse;
  try {
    const abortCtrl = new AbortController();
    const abortTimer = setTimeout(() => abortCtrl.abort(), 55_000);
    try {
      aiResponse = await anthropic.messages.create(
        {
          model: "claude-sonnet-4-6",
          max_tokens: 2048,
          temperature: 0,
          system: systemPrompt,
          messages: [{ role: "user", content: userPrompt }],
        },
        { signal: abortCtrl.signal }
      );
    } finally {
      clearTimeout(abortTimer);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const isTimeout = err instanceof Error && (err.name === "AbortError" || msg.includes("abort"));
    console.error("[analyze] Anthropic error:", isTimeout ? "client timeout" : msg);
    return Response.json(
      { error: isTimeout ? "analysis_timeout" : "ai_unavailable" },
      { status: 503 }
    );
  }

  // 7. Parse and sanitize
  const rawText = aiResponse.content[0].type === "text" ? aiResponse.content[0].text : "";
  const safeText = sanitizeAIOutput(rawText);

  let result: Record<string, unknown>;
  try {
    result = JSON.parse(safeText);
  } catch {
    return Response.json({ error: "AI response could not be parsed. Please try again." }, { status: 500 });
  }

  // Sanitize numeric fields — reject NaN/Infinity from AI output
  const numericFields = ["net_worth_now", "year1", "year3", "year5", "year10", "monthly_cashflow", "alimony_range_low", "alimony_range_high", "child_support_estimate"];
  for (const field of numericFields) {
    if (!Number.isFinite(result[field] as number)) result[field] = 0;
  }
  if (!Number.isFinite(result.risk_score as number) || (result.risk_score as number) < 1 || (result.risk_score as number) > 10) {
    result.risk_score = 5;
  }

  // 8. Add confidence label
  const confidenceLabel = getConfidenceLabel(j, hasHighRisk, missingFields);
  result.confidence_label = confidenceLabel;
  result.confidence_label_text =
    CONFIDENCE_LABEL_COPY[confidenceLabel][lang] ?? CONFIDENCE_LABEL_COPY[confidenceLabel]["en"];

  // 9 & 10. Save to DB after response is sent (keeps response within 10s Vercel Hobby limit)
  const tokensUsed = aiResponse.usage.input_tokens + aiResponse.usage.output_tokens;
  const scenarioName = scenario.name as string;
  after(async () => {
    const sb = await createClient();
    await (sb as never as { from: (t: string) => { insert: (d: unknown) => Promise<unknown> } })
      .from("analyses").insert({
        user_id: user.id,
        scenario_id: scenarioId,
        jurisdiction: j,
        net_worth_now: result.net_worth_now,
        net_worth_year1: result.year1,
        net_worth_year3: result.year3,
        net_worth_year5: result.year5,
        net_worth_year10: result.year10,
        monthly_cash_flow: result.monthly_cashflow,
        alimony_range_low: result.alimony_range_low,
        alimony_range_high: result.alimony_range_high,
        child_support_estimate: result.child_support_estimate,
        risk_score: result.risk_score,
        confidence_label: confidenceLabel,
        key_risks: result.key_risks,
        negotiation_strategy: result.negotiation_strategy,
        raw_json: result,
        tokens_used: tokensUsed,
      });
    await (sb as never as { from: (t: string) => { insert: (d: unknown) => Promise<unknown> } })
      .from("audit_log").insert({
        user_id: user.id,
        action: "analysis_completed",
        user_visible: true,
        display_text: `Analysis run for scenario: ${scenarioName}`,
        metadata: { scenario_id: scenarioId, risk_score: result.risk_score },
      });
  });

  return Response.json({ success: true, data: result, missingFields, pending_persist: true });
}
