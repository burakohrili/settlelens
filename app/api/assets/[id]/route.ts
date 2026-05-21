import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json();
  const numericAssetFields = ["current_value", "purchase_price", "mortgage_balance", "crypto_quantity", "crypto_price_at_entry"] as const;
  for (const field of numericAssetFields) {
    if (body[field] !== undefined) {
      const v = Number(body[field]);
      if (isNaN(v) || v < 0 || v > 1_000_000_000_000) {
        return NextResponse.json({ error: `Invalid ${field}` }, { status: 400 });
      }
    }
  }
  if (body.contribution_ratio !== undefined) {
    const cr = Number(body.contribution_ratio);
    if (isNaN(cr) || cr < 0 || cr > 1) {
      return NextResponse.json({ error: "Invalid contribution_ratio (must be 0–1)" }, { status: 400 });
    }
  }
  if (body.acquisition_year !== undefined) {
    const ay = Number(body.acquisition_year);
    if (!Number.isInteger(ay) || ay < 1900 || ay > new Date().getFullYear()) {
      return NextResponse.json({ error: "Invalid acquisition_year" }, { status: 400 });
    }
  }
  const allowed = ["name", "current_value", "owned_by", "mortgage_balance", "category",
    "purchase_price", "crypto_quantity", "crypto_price_at_entry", "crypto_token",
    "crypto_exchange", "notes", "is_marital", "acquisition_year", "contribution_ratio"];
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
  }).from("assets").update(update).eq("id", id).eq("user_id", user.id);

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
  }).from("assets").delete().eq("id", id).eq("user_id", user.id);

  if (error) { console.error("[API] DB error"); return NextResponse.json({ error: "Operation failed" }, { status: 500 }); }
  return NextResponse.json({ ok: true });
}
