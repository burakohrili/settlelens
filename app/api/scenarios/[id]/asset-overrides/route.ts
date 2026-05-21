import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

const VALID_OUTCOMES = ["i_keep", "spouse_keeps", "sell", "split", "not_decided"] as const;
const PHYSICAL_CATEGORIES = ["real_estate", "vehicle", "business"] as const;

export async function GET(_req: NextRequest, { params }: Params) {
  const { id: scenarioId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  // Verify scenario belongs to user
  const { data: scenario } = await supabase
    .from("scenarios")
    .select("id")
    .eq("id", scenarioId)
    .eq("user_id", user.id)
    .single();
  if (!scenario) return NextResponse.json({ error: "not_found" }, { status: 404 });

  // Fetch overrides joined with asset name/category
  const { data: overrides } = await supabase
    .from("scenario_asset_overrides")
    .select("asset_id, outcome, split_pct_me, assets(id, name, category, current_value, owned_by)")
    .eq("scenario_id", scenarioId);

  return NextResponse.json({ overrides: overrides ?? [] });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { id: scenarioId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  // Verify scenario belongs to user
  const { data: scenario } = await supabase
    .from("scenarios")
    .select("id")
    .eq("id", scenarioId)
    .eq("user_id", user.id)
    .single();
  if (!scenario) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const body = await req.json() as { overrides?: unknown[] };
  if (!Array.isArray(body.overrides)) {
    return NextResponse.json({ error: "overrides must be an array" }, { status: 400 });
  }

  // Validate each override
  type OverrideInput = { asset_id: string; outcome: string; split_pct_me?: number };
  const validated: OverrideInput[] = [];
  for (const item of body.overrides) {
    const o = item as Record<string, unknown>;
    if (typeof o.asset_id !== "string") continue;
    const outcome = typeof o.outcome === "string" ? o.outcome : "not_decided";
    if (!(VALID_OUTCOMES as readonly string[]).includes(outcome)) continue;
    const splitPct = typeof o.split_pct_me === "number"
      ? Math.min(100, Math.max(0, o.split_pct_me))
      : 50;
    validated.push({ asset_id: o.asset_id, outcome, split_pct_me: splitPct });
  }

  // Verify all asset_ids belong to the user and are physical categories
  if (validated.length > 0) {
    const { data: userAssets } = await (supabase as never as {
      from: (t: string) => {
        select: (s: string) => {
          eq: (c: string, v: string) => {
            in: (c: string, v: string[]) => {
              in: (c: string, v: string[]) => Promise<{ data: { id: string }[] | null }>
            }
          }
        }
      }
    }).from("assets").select("id")
      .eq("user_id", user.id)
      .in("category", [...PHYSICAL_CATEGORIES])
      .in("id", validated.map((v) => v.asset_id));

    const validIds = new Set((userAssets ?? []).map((a: { id: string }) => a.id));
    const rows = validated
      .filter((v) => validIds.has(v.asset_id))
      .map((v) => ({
        scenario_id: scenarioId,
        asset_id: v.asset_id,
        outcome: v.outcome,
        split_pct_me: v.split_pct_me,
      }));

    if (rows.length > 0) {
      const typedRows = rows.map((r) => ({
        ...r,
        outcome: r.outcome as "i_keep" | "spouse_keeps" | "sell" | "split" | "not_decided",
      }));
      const { error } = await supabase
        .from("scenario_asset_overrides")
        .upsert(typedRows, { onConflict: "scenario_id,asset_id" });
      if (error) {
        console.error("[API] override upsert failed");
        return NextResponse.json({ error: "upsert_failed" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ ok: true });
}
