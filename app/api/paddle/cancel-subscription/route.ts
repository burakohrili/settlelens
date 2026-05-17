import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let subscriptionId: string;
  try {
    ({ subscriptionId } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!subscriptionId) {
    return NextResponse.json({ error: "subscriptionId required" }, { status: 400 });
  }

  const apiKey = process.env.PADDLE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Paddle not configured" }, { status: 500 });
  }

  const res = await fetch(`https://api.paddle.com/subscriptions/${subscriptionId}/cancel`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ effective_from: "next_billing_period" }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const detail = (body as { error?: { detail?: string } })?.error?.detail ?? "Paddle cancellation failed";
    return NextResponse.json({ error: "Paddle cancellation failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
