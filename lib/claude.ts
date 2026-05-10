import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

const SYSTEM_PROMPT = `You are SettleLens's financial modeling engine.
RULES: Return ONLY valid JSON. No markdown. No preamble. No trailing text.
Include "Not legal or financial advice — for informational modeling only" in the notes field.
Use jurisdiction-specific formulas only. Be conservative in projections.`;

export type AnalysisInput = {
  jurisdiction: string;
  marriageYears: number;
  currency: string;
  inflation: number;
  assets: object[];
  debts: object[];
  myIncomeNet: number;
  spouseIncomeNet: number | "unknown";
  childrenCount: number;
  scenario: {
    house_outcome: unknown;
    retirement_split_me: unknown;
    alimony_monthly: unknown;
    alimony_years: unknown;
    alimony_direction: unknown;
    child_support_monthly: unknown;
    child_support_direction: unknown;
    scenario_type?: string;
    offer_source?: string;
    offer_raw_text?: string;
  };
  lang: string;
  hasHighRisk?: boolean;
};

export type AnalysisResult = {
  net_worth_now: number;
  year1: number;
  year3: number;
  year5: number;
  year10: number;
  monthly_cashflow: number;
  alimony_range_low: number;
  alimony_range_high: number;
  child_support_estimate: number;
  risk_score: number;
  key_risks: string[];
  negotiation_strategy: string;
  confidence: string;
  notes: string;
  offer_vs_baseline_year10?: number;
  offer_assessment?: string;
  key_differences?: string[];
  points_to_negotiate?: string[];
  questions_for_your_lawyer?: string[];
  offer_tone_note?: string;
  tokens_used?: number;
};

export async function runAnalysis(input: AnalysisInput): Promise<AnalysisResult> {
  let userPrompt = `Jurisdiction:${input.jurisdiction} | Marriage years:${input.marriageYears} | Currency:${input.currency}
Assets:${JSON.stringify(input.assets)}
Debts:${JSON.stringify(input.debts)}
Income A(me):${input.myIncomeNet}/yr net
Income B(spouse):${input.spouseIncomeNet}/yr net
Children:${input.childrenCount}
Scenario: house=${input.scenario.house_outcome}, retirement_split=${input.scenario.retirement_split_me}%, alimony=${input.scenario.alimony_monthly}/mo×${input.scenario.alimony_years}yr(${input.scenario.alimony_direction}), child_support=${input.scenario.child_support_monthly}/mo(${input.scenario.child_support_direction})
Inflation:${(input.inflation * 100).toFixed(1)}%, Investment return:5%, Response language:${input.lang}

Return JSON: {"net_worth_now":0,"year1":0,"year3":0,"year5":0,"year10":0,"monthly_cashflow":0,"alimony_range_low":0,"alimony_range_high":0,"child_support_estimate":0,"risk_score":5,"key_risks":[],"negotiation_strategy":"","confidence":"medium","notes":""}`;

  if (input.hasHighRisk) {
    userPrompt += `\n\nHIGH-RISK SITUATION: User flagged one or more high-risk signals (domestic concern, hidden assets, complex assets, etc.). Set confidence to "requires-professional-review". Include a note that professional legal advice is strongly recommended. Do not model any scenarios involving asset concealment.`;
  }

  if (input.scenario.scenario_type === "offer_comparison") {
    userPrompt += `\n\nOFFER COMPARISON MODE:
Offer source: ${input.scenario.offer_source ?? "unknown"}
Offer terms: ${input.scenario.offer_raw_text ?? "not provided"}
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

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1500,
    temperature: 0,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  const rawText = response.content[0].type === "text" ? response.content[0].text : "";
  const result = JSON.parse(rawText) as AnalysisResult;
  result.tokens_used = response.usage.input_tokens + response.usage.output_tokens;
  return result;
}
