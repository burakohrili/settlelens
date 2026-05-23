import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const PADDLE_BASE =
  process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT === "production"
    ? "https://api.paddle.com"
    : "https://sandbox-api.paddle.com";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await (supabase as any)
    .from("profiles")
    .select("paddle_customer_id")
    .eq("id", user.id)
    .single();

  const customerId: string | null = profile?.paddle_customer_id ?? null;
  if (!customerId) {
    return NextResponse.json(
      { error: "No Paddle customer found for this account." },
      { status: 404 }
    );
  }

  const apiKey = process.env.PADDLE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Paddle not configured" }, { status: 500 });
  }

  const res = await fetch(
    `${PADDLE_BASE}/customers/${customerId}/portal-sessions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    }
  );

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    console.error("[paddle] customer-portal session error:", (body as any)?.error);
    return NextResponse.json({ error: "Failed to open customer portal" }, { status: 502 });
  }

  const body = await res.json();
  const url: string | undefined = body?.data?.urls?.general?.overview;
  if (!url) {
    return NextResponse.json({ error: "No portal URL returned" }, { status: 502 });
  }

  return NextResponse.json({ url });
}
