"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";

export default function NotificationsPage() {
  const t = useTranslations("settings");
  const locale = useLocale();
  const router = useRouter();
  const supabase = createClient();

  const [userId, setUserId] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push(`/${locale}/login`);
        return;
      }
      setUserId(user.id);

      const { data } = await (
        supabase as unknown as {
          from: (t: string) => {
            select: (s: string) => {
              eq: (c: string, v: string) => {
                single: () => Promise<{ data: { marketing_consent: boolean } | null }>;
              };
            };
          };
        }
      )
        .from("profiles")
        .select("marketing_consent")
        .eq("id", user.id)
        .single();

      if (data) setMarketingConsent(data.marketing_consent);
      setLoading(false);
    }
    load();
  }, [router, supabase]);

  const handleMarketingToggle = async () => {
    const newValue = !marketingConsent;
    setMarketingConsent(newValue);
    setSaving(true);
    try {
      await (
        supabase as unknown as {
          from: (t: string) => {
            update: (d: unknown) => {
              eq: (c: string, v: string) => Promise<unknown>;
            };
          };
        }
      )
        .from("profiles")
        .update({ marketing_consent: newValue })
        .eq("id", userId);
      setMsg(newValue ? t("notifMarketingEnabled") : t("notifMarketingDisabled"));
    } catch {
      setMarketingConsent(!newValue);
      setMsg(t("notifMarketingFail"));
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(""), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex h-32 items-center justify-center text-[#8B7355]">
        {t("loading")}
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1
          className="text-2xl font-bold text-[#1C2B3A]"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          {t("notificationsTitle")}
        </h1>
        <p className="mt-1 text-sm text-[#8B7355]">{t("notificationsDesc")}</p>
      </div>

      <div className="rounded-xl border border-[#D4C5B0] bg-white p-6 space-y-4">
        <h2 className="font-semibold text-[#1C2B3A]">{t("emailNotificationsTitle")}</h2>

        {/* Marketing emails — toggleable */}
        <div className="flex items-start gap-4 py-2">
          <button
            onClick={handleMarketingToggle}
            disabled={saving}
            className={`mt-0.5 flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
              marketingConsent ? "bg-[#4FA86E]" : "bg-[#D4C5B0]"
            }`}
            aria-pressed={marketingConsent}
          >
            <span
              className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${
                marketingConsent ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
          <div className="flex-1">
            <p className="text-sm font-medium text-[#1C2B3A]">{t("notifMarketing")}</p>
            <p className="text-xs text-[#8B7355] mt-0.5">{t("notifMarketingDesc")}</p>
          </div>
        </div>

        {/* Security alerts — always on, read-only */}
        <div className="flex items-start gap-4 py-2 border-t border-[#F7F3EE]">
          <div className="mt-0.5 flex h-6 w-11 shrink-0 items-center rounded-full bg-[#4FA86E] cursor-not-allowed opacity-70">
            <span className="h-5 w-5 rounded-full bg-white shadow translate-x-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-[#1C2B3A]">{t("notifSecurity")}</p>
            <p className="text-xs text-[#8B7355] mt-0.5">{t("notifSecurityDesc")}</p>
          </div>
        </div>

        {msg && (
          <p className={`text-sm ${msg === t("notifMarketingFail") ? "text-[#E85252]" : "text-[#4FA86E]"}`}>
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}
