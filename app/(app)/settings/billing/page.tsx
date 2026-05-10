"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";

const PLAN_LABELS: Record<string, { name: string; color: string; price: string }> = {
  discovery: { name: "Discovery", color: "text-[#8B7355] bg-[#F7F3EE]", price: "Free" },
  clarified: { name: "Clarified", color: "text-[#2E4D6B] bg-blue-50", price: "$29 one-time" },
  strategist: { name: "Strategist", color: "text-[#C8973A] bg-amber-50", price: "$39/month" },
  professional: { name: "Professional", color: "text-[#4FA86E] bg-green-50", price: "$99/month" },
};

type BillingProfile = {
  plan_type: string;
  plan_expires_at: string | null;
  paddle_subscription_id: string | null;
  paddle_customer_id: string | null;
};

export default function BillingPage() {
  const t = useTranslations("settings");
  const router = useRouter();
  const supabase = createClient();

  const [profile, setProfile] = useState<BillingProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [cancelMsg, setCancelMsg] = useState("");

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/en/login");
        return;
      }

      const { data } = await (
        supabase as unknown as {
          from: (t: string) => {
            select: (s: string) => {
              eq: (c: string, v: string) => {
                single: () => Promise<{ data: BillingProfile | null }>;
              };
            };
          };
        }
      )
        .from("profiles")
        .select(
          "plan_type,plan_expires_at,paddle_subscription_id,paddle_customer_id"
        )
        .eq("id", user.id)
        .single();

      setProfile(data);
      setLoading(false);
    }
    load();
  }, [router, supabase]);

  const handleCancelSubscription = async () => {
    if (!profile?.paddle_subscription_id) return;
    setCanceling(true);
    try {
      const res = await fetch("/api/paddle/cancel-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriptionId: profile.paddle_subscription_id,
        }),
      });
      if (res.ok) {
        setCancelMsg(t("cancelSuccess"));
        setCancelConfirm(false);
      } else {
        setCancelMsg(t("cancelFail"));
      }
    } catch {
      setCancelMsg(t("cancelFail"));
    } finally {
      setCanceling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-32 items-center justify-center text-[#8B7355]">
        {t("loading")}
      </div>
    );
  }

  const planInfo = PLAN_LABELS[profile?.plan_type ?? "discovery"];
  const hasSubscription =
    profile?.plan_type === "strategist" ||
    profile?.plan_type === "professional";

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1
          className="text-2xl font-bold text-[#1C2B3A]"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          {t("billingTitle")}
        </h1>
        <p className="mt-1 text-sm text-[#8B7355]">{t("billingDesc")}</p>
      </div>

      {/* Current plan */}
      <div className="rounded-xl border border-[#D4C5B0] bg-white p-6">
        <h2 className="mb-4 font-semibold text-[#1C2B3A]">{t("currentPlan")}</h2>

        <div className="flex items-center justify-between">
          <div>
            <span
              className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${planInfo.color}`}
            >
              {planInfo.name}
            </span>
            <p className="mt-2 text-sm text-[#8B7355]">{planInfo.price}</p>
            {profile?.plan_expires_at && (
              <p className="mt-1 text-sm text-[#8B7355]">
                {t("accessUntil")}{" "}
                {new Date(profile.plan_expires_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </div>

          {profile?.plan_type !== "professional" && (
            <Link
              href="/upgrade"
              className="rounded-lg bg-[#C8973A] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              {t("upgrade")}
            </Link>
          )}
        </div>
      </div>

      {/* Subscription management */}
      {hasSubscription && (
        <div className="rounded-xl border border-[#D4C5B0] bg-white p-6 space-y-4">
          <h2 className="font-semibold text-[#1C2B3A]">{t("subscription")}</h2>

          <p className="text-sm text-[#8B7355]">{t("subscriptionNote")}</p>

          <div className="flex flex-wrap gap-3">
            <a
              href="https://customer.paddle.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-[#D4C5B0] px-4 py-2 text-sm font-medium text-[#2E4D6B] hover:border-[#2E4D6B] transition-colors"
            >
              {t("managePayment")}
            </a>

            {!cancelConfirm && (
              <button
                onClick={() => setCancelConfirm(true)}
                className="rounded-lg border border-[#E85252] px-4 py-2 text-sm font-medium text-[#E85252] hover:bg-red-50 transition-colors"
              >
                {t("cancelSub")}
              </button>
            )}
          </div>

          {cancelConfirm && (
            <div className="rounded-lg border border-[#E85252] bg-red-50 p-4">
              <p className="text-sm font-medium text-[#E85252] mb-3">
                {t("cancelConfirmMsg")}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleCancelSubscription}
                  disabled={canceling}
                  className="rounded-lg bg-[#E85252] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
                >
                  {canceling ? t("canceling") : t("yesCancelSub")}
                </button>
                <button
                  onClick={() => setCancelConfirm(false)}
                  className="rounded-lg border border-[#D4C5B0] px-4 py-2 text-sm font-medium text-[#2E4D6B] hover:bg-[#F7F3EE]"
                >
                  {t("keepSub")}
                </button>
              </div>
            </div>
          )}

          {cancelMsg && (
            <p className="text-sm text-[#4FA86E]">{cancelMsg}</p>
          )}
        </div>
      )}

      {/* Discovery / Clarified — no subscription */}
      {!hasSubscription && profile?.plan_type !== "professional" && (
        <div className="rounded-xl border border-[#D4C5B0] bg-[#F7F3EE] p-6">
          <p className="text-sm text-[#8B7355]">
            {profile?.plan_type === "discovery"
              ? t("onPlanDiscovery")
              : t("onPlanClarified")}
          </p>
          <Link
            href="/upgrade"
            className="mt-4 inline-block rounded-lg bg-[#1C2B3A] px-6 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            {t("viewPlans")}
          </Link>
        </div>
      )}

      <p className="text-xs text-[#8B7355]">{t("paddleNote")}</p>
    </div>
  );
}
