import { createClient } from "@/lib/supabase/server";
import { PLAN_PRICE_IDS } from "@/lib/paddle";
import { NextRequest } from "next/server";

// This endpoint returns the priceId for client-side Paddle.js checkout.
// Actual checkout is opened client-side via openCheckout() in lib/paddle.ts.
// Server validates the user is authenticated and the plan is valid.
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  let plan: string;
  try {
    ({ plan } = await req.json());
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const validPlans = ["clarified", "strategist", "professional"];
  if (!validPlans.includes(plan)) {
    return Response.json({ error: "Invalid plan" }, { status: 400 });
  }

  const priceId = PLAN_PRICE_IDS[plan];
  if (!priceId) {
    return Response.json({ error: "Plan price not configured" }, { status: 500 });
  }

  return Response.json({ priceId, userId: user.id });
}
