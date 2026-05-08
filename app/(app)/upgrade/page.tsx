"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/server";
import { openCheckout, PLAN_PRICE_IDS } from "@/lib/paddle";
import { useRouter } from "next/navigation";

const PLANS = [
  {
    id: "clarified",
    name: "Clarified",
    price: "$29",
    billing: "one-time",
    description: "14-day access to one full financial analysis",
    features: [
      "1 scenario analysis",
      "1 PDF report",
      "10-year projection",
      "14-day access",
    ],
    accent: false,
  },
  {
    id: "strategist",
    name: "Strategist",
    price: "$39",
    billing: "/month",
    description: "Unlimited scenarios for ongoing negotiation",
    features: [
      "Unlimited scenario analyses",
      "Unlimited PDF reports",
      "Inflation scenario modeling",
      "10-year projections",
      "Offer comparison tool",
    ],
    accent: true,
  },
  {
    id: "professional",
    name: "Professional",
    price: "$99",
    billing: "/month",
    description: "Attorney-ready export for your legal team",
    features: [
      "Everything in Strategist",
      "Attorney-ready financial export",
      "Evidence organizer",
      "Excel + indexed PDF output",
      "Questions for your lawyer",
    ],
    accent: false,
  },
];

export default function UpgradePage() {
  const router = useRouter();
  const [currentPlan, setCurrentPlan] = useState<string>("discovery");
  const [userEmail, setUserEmail] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const { createClient: createBrowserClient } = await import(
        "@/lib/supabase/client"
      );
      const supabase = createBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/en/login");
        return;
      }
      setUserEmail(user.email ?? "");
      setUserId(user.id);

      const { data: profile } = await (
        supabase as unknown as {
          from: (t: string) => {
            select: (s: string) => {
              eq: (c: string, v: string) => {
                single: () => Promise<{
                  data: { plan_type: string } | null;
                }>;
              };
            };
          };
        }
      )
        .from("profiles")
        .select("plan_type")
        .eq("id", user.id)
        .single();

      setCurrentPlan(profile?.plan_type ?? "discovery");
    }
    loadUser();
  }, [router]);

  const handleUpgrade = async (planId: string) => {
    const priceId = PLAN_PRICE_IDS[planId];
    if (!priceId) return;

    setLoading(planId);
    try {
      await openCheckout(priceId, userId, userEmail, () => {
        setSuccess(true);
        setTimeout(() => router.push("/dashboard"), 2000);
      });
    } catch {
      // Paddle overlay handles its own errors
    } finally {
      setLoading(null);
    }
  };

  const planRank: Record<string, number> = {
    discovery: 0,
    clarified: 1,
    strategist: 2,
    professional: 3,
  };

  return (
    <div className="py-6">
      {success && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-center text-green-800">
          Payment successful! Redirecting to your dashboard...
        </div>
      )}

      <div className="mb-8 text-center">
        <h1
          className="font-display text-3xl font-bold text-[#1C2B3A]"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Upgrade Your Plan
        </h1>
        <p className="mt-2 text-[#8B7355]">
          Get the financial clarity you need for your divorce negotiations.
        </p>
        <p className="mt-1 text-sm text-[#8B7355]">
          Financial modeling for informational purposes only. Not legal or
          financial advice.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {PLANS.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          const isDowngrade =
            planRank[plan.id] < planRank[currentPlan];

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-2xl border p-6 ${
                plan.accent
                  ? "border-[#C8973A] bg-[#1C2B3A] text-white shadow-xl scale-105"
                  : isCurrent
                  ? "border-[#4FA86E] bg-[#F7F3EE]"
                  : "border-[#D4C5B0] bg-white"
              }`}
            >
              {plan.accent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#C8973A] px-4 py-1 text-xs font-semibold text-white">
                  Most Popular
                </div>
              )}
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#4FA86E] px-4 py-1 text-xs font-semibold text-white">
                  Current Plan
                </div>
              )}

              <div className="mb-4">
                <h2
                  className={`text-xl font-bold ${plan.accent ? "text-white" : "text-[#1C2B3A]"}`}
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  {plan.name}
                </h2>
                <div className="mt-2 flex items-baseline gap-1">
                  <span
                    className={`text-3xl font-bold ${plan.accent ? "text-[#C8973A]" : "text-[#1C2B3A]"}`}
                    style={{ fontFamily: "DM Mono, monospace" }}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={`text-sm ${plan.accent ? "text-gray-300" : "text-[#8B7355]"}`}
                  >
                    {plan.billing}
                  </span>
                </div>
                <p
                  className={`mt-2 text-sm ${plan.accent ? "text-gray-300" : "text-[#8B7355]"}`}
                >
                  {plan.description}
                </p>
              </div>

              <ul className="mb-6 flex-1 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <span className="mt-0.5 text-[#C8973A]">✓</span>
                    <span
                      className={plan.accent ? "text-gray-200" : "text-[#2E4D6B]"}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <div className="rounded-lg border border-[#4FA86E] py-2 text-center text-sm font-medium text-[#4FA86E]">
                  Current Plan
                </div>
              ) : isDowngrade ? (
                <div className="rounded-lg border border-[#D4C5B0] py-2 text-center text-sm text-[#8B7355]">
                  Lower tier
                </div>
              ) : (
                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={loading === plan.id}
                  className={`w-full rounded-lg py-2.5 text-sm font-semibold transition-opacity ${
                    plan.accent
                      ? "bg-[#C8973A] text-white hover:opacity-90"
                      : "bg-[#1C2B3A] text-white hover:opacity-90"
                  } disabled:opacity-50`}
                >
                  {loading === plan.id ? "Opening checkout..." : `Upgrade to ${plan.name}`}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-center text-xs text-[#8B7355]">
        Payments processed securely by Paddle. We never store your card details.
        Cancel anytime from Settings → Billing.
      </p>
    </div>
  );
}
