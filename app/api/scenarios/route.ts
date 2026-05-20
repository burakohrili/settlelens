import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { SCENARIO_LIMITS } from "@/lib/plan-limits";

const VALID_HOUSE    = ["i_keep", "spouse_keeps", "sell", "not_applicable"] as const;
const VALID_VEHICLE  = ["i_keep", "spouse_keeps", "sell", "not_applicable"] as const;
const VALID_BUSINESS = ["i_keep", "spouse_keeps", "split", "sell", "not_applicable"] as const;
const VALID_DIR      = ["i_receive", "i_pay"] as const;
const VALID_TYPE     = ["custom", "offer_comparison"] as const;

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  // Server-side quota enforcement
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan_type")
    .eq("id", user.id)
    .single();

  const { count } = await supabase
    .from("scenarios")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  const limit = SCENARIO_LIMITS[(profile as { plan_type?: string } | null)?.plan_type ?? "discovery"] ?? 3;
  if (limit !== -1 && (count ?? 0) >= limit) {
    return NextResponse.json({ error: "scenario_limit_reached" }, { status: 403 });
  }

  // Input validation
  const body = await req.json() as Record<string, unknown>;
  const name = String(body.name ?? "").trim();
  if (!name || name.length > 200) {
    return NextResponse.json({ error: "invalid_name" }, { status: 400 });
  }

  const houseOutcome = String(body.house_outcome ?? "sell");
  if (!(VALID_HOUSE as readonly string[]).includes(houseOutcome)) {
    return NextResponse.json({ error: "invalid_house_outcome" }, { status: 400 });
  }

  const vehicleOutcome = String(body.vehicle_outcome ?? "not_applicable");
  if (!(VALID_VEHICLE as readonly string[]).includes(vehicleOutcome)) {
    return NextResponse.json({ error: "invalid_vehicle_outcome" }, { status: 400 });
  }

  const businessOutcome = String(body.business_outcome ?? "not_applicable");
  if (!(VALID_BUSINESS as readonly string[]).includes(businessOutcome)) {
    return NextResponse.json({ error: "invalid_business_outcome" }, { status: 400 });
  }

  const alimonyDir = String(body.alimony_direction ?? "i_receive");
  const csDir = String(body.child_support_direction ?? "i_receive");
  if (!(VALID_DIR as readonly string[]).includes(alimonyDir) || !(VALID_DIR as readonly string[]).includes(csDir)) {
    return NextResponse.json({ error: "invalid_direction" }, { status: 400 });
  }

  const scenarioType = String(body.scenario_type ?? "custom");
  if (!(VALID_TYPE as readonly string[]).includes(scenarioType)) {
    return NextResponse.json({ error: "invalid_type" }, { status: 400 });
  }

  const retirementSplit = Math.min(100, Math.max(0, Number(body.retirement_split_me) || 50));
  const alimonyMonthly  = Math.max(0, Number(body.alimony_monthly) || 0);
  const alimonyYears    = Math.min(50, Math.max(0, Math.round(Number(body.alimony_years) || 0)));
  const csMonthly       = Math.max(0, Number(body.child_support_monthly) || 0);
  const offerSource     = body.offer_source ? String(body.offer_source).slice(0, 100) : null;
  const offerRawText    = body.offer_raw_text ? String(body.offer_raw_text).slice(0, 5000) : null;

  const { data, error } = await supabase
    .from("scenarios")
    .insert({
      user_id: user.id,
      name,
      scenario_type: scenarioType as "custom" | "offer_comparison",
      house_outcome: houseOutcome as "i_keep" | "spouse_keeps" | "sell" | "not_applicable",
      vehicle_outcome: vehicleOutcome as "i_keep" | "spouse_keeps" | "sell" | "not_applicable",
      business_outcome: businessOutcome as "i_keep" | "spouse_keeps" | "split" | "sell" | "not_applicable",
      retirement_split_me: retirementSplit,
      alimony_monthly: alimonyMonthly,
      alimony_years: alimonyYears,
      alimony_direction: alimonyDir as "i_receive" | "i_pay",
      child_support_monthly: csMonthly,
      child_support_direction: csDir as "i_receive" | "i_pay",
      ...(offerSource && { offer_source: offerSource }),
      ...(offerRawText && { offer_raw_text: offerRawText, offer_entered_at: new Date().toISOString() }),
      is_active: true,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("[API] scenario insert failed");
    return NextResponse.json({ error: "insert_failed" }, { status: 500 });
  }

  return NextResponse.json({ id: (data as { id: string }).id }, { status: 201 });
}
