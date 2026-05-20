import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json();

  if (body.name !== undefined) {
    const nameStr = String(body.name);
    if (nameStr.length === 0 || nameStr.length > 200) {
      return NextResponse.json({ error: "Invalid name: must be 1-200 characters" }, { status: 400 });
    }
  }
  if (body.retirement_split_me !== undefined) {
    const v = Number(body.retirement_split_me);
    if (isNaN(v) || v < 0 || v > 100) return NextResponse.json({ error: "Invalid retirement_split_me" }, { status: 400 });
  }
  for (const field of ["alimony_monthly", "child_support_monthly"] as const) {
    if (body[field] !== undefined) {
      const v = Number(body[field]);
      if (isNaN(v) || v < 0 || v > 1_000_000_000) return NextResponse.json({ error: `Invalid ${field}` }, { status: 400 });
    }
  }
  if (body.alimony_years !== undefined) {
    const v = Number(body.alimony_years);
    if (isNaN(v) || v < 0 || v > 50) return NextResponse.json({ error: "Invalid alimony_years" }, { status: 400 });
  }
  const houseOutcomeValues = ["i_keep", "spouse_keeps", "sell", "not_applicable"];
  if (body.house_outcome !== undefined && !houseOutcomeValues.includes(body.house_outcome)) {
    return NextResponse.json({ error: "Invalid house_outcome" }, { status: 400 });
  }
  const vehicleOutcomeValues = ["i_keep", "spouse_keeps", "sell", "not_applicable"];
  if (body.vehicle_outcome !== undefined && !vehicleOutcomeValues.includes(body.vehicle_outcome)) {
    return NextResponse.json({ error: "Invalid vehicle_outcome" }, { status: 400 });
  }
  const businessOutcomeValues = ["i_keep", "spouse_keeps", "split", "sell", "not_applicable"];
  if (body.business_outcome !== undefined && !businessOutcomeValues.includes(body.business_outcome)) {
    return NextResponse.json({ error: "Invalid business_outcome" }, { status: 400 });
  }
  const directionValues = ["i_receive", "i_pay"];
  for (const field of ["alimony_direction", "child_support_direction"] as const) {
    if (body[field] !== undefined && !directionValues.includes(body[field])) {
      return NextResponse.json({ error: `Invalid ${field}` }, { status: 400 });
    }
  }

  const allowed = [
    "name", "house_outcome", "vehicle_outcome", "business_outcome", "retirement_split_me",
    "alimony_monthly", "alimony_years", "alimony_direction",
    "child_support_monthly", "child_support_direction",
  ];
  const update: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) update[key] = body[key];
  }
  update.updated_at = new Date().toISOString();

  const { error } = await (supabase as never as {
    from: (t: string) => {
      update: (data: Record<string, unknown>) => {
        eq: (c: string, v: string) => {
          eq: (c: string, v: string) => Promise<{ error: { message: string } | null }>
        }
      }
    }
  }).from("scenarios").update(update).eq("id", id).eq("user_id", user.id);

  if (error) { console.error("[API] DB error"); return NextResponse.json({ error: "Operation failed" }, { status: 500 }); }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { error } = await (supabase as never as {
    from: (t: string) => {
      delete: () => {
        eq: (c: string, v: string) => {
          eq: (c: string, v: string) => Promise<{ error: { message: string } | null }>
        }
      }
    }
  }).from("scenarios").delete().eq("id", id).eq("user_id", user.id);

  if (error) { console.error("[API] DB error"); return NextResponse.json({ error: "Operation failed" }, { status: 500 }); }
  return NextResponse.json({ ok: true });
}
