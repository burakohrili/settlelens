"use client";

import Script from "next/script";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { PLAN_DISPLAY } from "@/lib/plan-prices";

const PLANS = [
  {
    id: "clarified",
    nameKey: "planClarifiedName",
    billingKey: "billingOneTime",
    descKey: "planClarifiedDesc",
    featureKeys: ["f_clarified_1", "f_clarified_2", "f_clarified_3", "f_clarified_4"],
    accent: false,
  },
  {
    id: "strategist",
    nameKey: "planStrategistName",
    billingKey: "billingOneTime",
    descKey: "planStrategistDesc",
    featureKeys: [
      "f_strategist_1",
      "f_strategist_2",
      "f_strategist_3",
      "f_strategist_4",
      "f_strategist_5",
    ],
    accent: true,
  },
  {
    id: "professional",
    nameKey: "planProfessionalName",
    billingKey: "billingMonth",
    descKey: "planProfessionalDesc",
    featureKeys: [
      "f_professional_1",
      "f_professional_2",
      "f_professional_3",
      "f_professional_4",
      "f_professional_5",
    ],
    accent: false,
  },
];

interface Props {
  priceIds: { clarified: string; strategist: string; professional: string };
  paddleToken: string;
  paddleEnv: string;
}

export function UpgradeClient({ priceIds, paddleToken, paddleEnv }: Props) {
  const t = useTranslations("upgrade");
  const locale = useLocale();
  const router = useRouter();
  const [currentPlan, setCurrentPlan] = useState<string>("discovery");
  const [userEmail, setUserEmail] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [paddleReady, setPaddleReady] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

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
        router.push(`/${locale}/login`);
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
  }, [router, locale]);

  const handlePaddleLoad = () => {
    if (!paddleToken) {
      setInitError("Paddle client token is not configured. Contact support@settlelens.com.");
      return;
    }
    try {
      (window as Window & { Paddle: any }).Paddle.Initialize({
        token: paddleToken,
        ...(paddleEnv === "sandbox" ? { environment: "sandbox" } : {}),
      });
      setPaddleReady(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setInitError(`Payment system failed to load: ${msg}`);
      console.error("[paddle] Initialize failed:", err);
    }
  };

  const handleUpgrade = async (planId: string) => {
    setCheckoutError(null);

    if (!paddleReady || !(window as Window & { Paddle: any }).Paddle) {
      setCheckoutError(t("loadingError"));
      return;
    }

    const priceId = priceIds[planId as keyof typeof priceIds];
    if (!priceId) {
      setCheckoutError(t("priceIdMissing"));
      return;
    }

    setLoading(planId);
    try {
      (window as Window & { Paddle: any }).Paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        customer: { email: userEmail },
        customData: { userId },
        settings: {
          theme: "light",
          displayMode: "overlay",
          successUrl: `${window.location.origin}/dashboard?upgraded=1`,
        },
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[upgrade] Paddle checkout error:", err);
      setCheckoutError(`${t("checkoutError")}: ${msg}`);
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
    <>
      <Script
        src="https://cdn.paddle.com/paddle/v2/paddle.js"
        onLoad={handlePaddleLoad}
        strategy="afterInteractive"
      />

      <div className="py-6">
        {initError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-800 text-sm">
            {initError}
          </div>
        )}
        {checkoutError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-800 text-sm">
            {checkoutError}
          </div>
        )}

        <div className="mb-8 text-center">
          <h1
            className="font-display text-3xl font-bold text-[#1C2B3A]"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            {t("title")}
          </h1>
          <p className="mt-2 text-[#8B7355]">{t("subtitle")}</p>
          <p className="mt-1 text-sm text-[#8B7355]">{t("disclaimer")}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) => {
            const isCurrent = currentPlan === plan.id;
            const isDowngrade = planRank[plan.id] < planRank[currentPlan];

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
                    {t("mostPopular")}
                  </div>
                )}
                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#4FA86E] px-4 py-1 text-xs font-semibold text-white">
                    {t("currentPlan")}
                  </div>
                )}

                <div className="mb-4">
                  <h2
                    className={`text-xl font-bold ${plan.accent ? "text-white" : "text-[#1C2B3A]"}`}
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    {t(plan.nameKey)}
                  </h2>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span
                      className={`text-3xl font-bold ${plan.accent ? "text-[#C8973A]" : "text-[#1C2B3A]"}`}
                      style={{ fontFamily: "DM Mono, monospace" }}
                    >
                      {PLAN_DISPLAY[plan.id as keyof typeof PLAN_DISPLAY]?.prices[locale] ?? PLAN_DISPLAY[plan.id as keyof typeof PLAN_DISPLAY]?.prices["en"] ?? ""}
                    </span>
                    <span className={`text-sm ${plan.accent ? "text-gray-300" : "text-[#8B7355]"}`}>
                      {t(plan.billingKey)}
                    </span>
                  </div>
                  <p className={`mt-2 text-sm ${plan.accent ? "text-gray-300" : "text-[#8B7355]"}`}>
                    {t(plan.descKey)}
                  </p>
                </div>

                <ul className="mb-6 flex-1 space-y-2">
                  {plan.featureKeys.map((key) => (
                    <li key={key} className="flex items-start gap-2 text-sm">
                      <span className="mt-0.5 text-[#C8973A]">✓</span>
                      <span className={plan.accent ? "text-gray-200" : "text-[#2E4D6B]"}>
                        {t(key)}
                      </span>
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <div className="rounded-lg border border-[#4FA86E] py-2 text-center text-sm font-medium text-[#4FA86E]">
                    {t("currentPlan")}
                  </div>
                ) : isDowngrade ? (
                  <div className="rounded-lg border border-[#D4C5B0] py-2 text-center text-sm text-[#8B7355]">
                    {t("lowerTier")}
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
                    {loading === plan.id
                      ? t("openingCheckout")
                      : t("upgradeTo", { plan: t(plan.nameKey) })}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-xs text-[#8B7355]">{t("footer")}</p>
      </div>
    </>
  );
}
