"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

type AuditEntry = {
  action: string;
  display_text: string;
  created_at: string;
};

const ACTION_ICONS: Record<string, string> = {
  user_registered: "👤",
  analysis_completed: "📊",
  report_generated: "📄",
  data_exported: "⬇️",
  password_changed: "🔑",
  plan_upgraded: "⬆️",
  account_deleted: "🗑️",
};

const PAGE_SIZE = 20;

export default function SecurityPage() {
  const t = useTranslations("settings");
  const locale = useLocale();
  const router = useRouter();
  const supabase = createClient();

  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [userId, setUserId] = useState("");

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
      await fetchLogs(user.id, 0, []);
      setLoading(false);
    }
    load();
  }, [router, supabase]);

  async function fetchLogs(uid: string, offset: number, existing: AuditEntry[]) {
    const { data } = await (
      supabase as unknown as {
        from: (t: string) => {
          select: (s: string) => {
            eq: (c: string, v: string) => {
              eq: (c: string, v: boolean) => {
                order: (c: string, o: { ascending: boolean }) => {
                  range: (from: number, to: number) => Promise<{ data: AuditEntry[] | null }>;
                };
              };
            };
          };
        };
      }
    )
      .from("audit_log")
      .select("action,display_text,created_at")
      .eq("user_id", uid)
      .eq("user_visible", true)
      .order("created_at", { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1);

    const fetched = data ?? [];
    setLogs([...existing, ...fetched]);
    setHasMore(fetched.length === PAGE_SIZE);
  }

  async function handleLoadMore() {
    setLoadingMore(true);
    await fetchLogs(userId, logs.length, logs);
    setLoadingMore(false);
  }

  if (loading) {
    return (
      <div className="flex h-32 items-center justify-center gap-2 text-[#8B7355]">
        <Loader2 size={18} className="animate-spin" />
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
          {t("securityTitle")}
        </h1>
        <p className="mt-1 text-sm text-[#8B7355]">{t("securityDesc")}</p>
      </div>

      {/* Trust statement */}
      <div className="rounded-xl border border-[#4FA86E] bg-green-50 p-5">
        <p className="text-sm font-semibold text-[#1C2B3A] mb-1">
          {t("trustTitle")}
        </p>
        <p className="text-sm text-[#2E4D6B]">{t("trustDesc")}</p>
      </div>

      {/* Third-party access */}
      <div className="rounded-xl border border-[#D4C5B0] bg-white p-6">
        <h2 className="font-semibold text-[#1C2B3A] mb-3">
          {t("thirdPartyTitle")}
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-xl">🔒</span>
          <p className="text-sm text-[#4FA86E] font-medium">{t("thirdPartyNone")}</p>
        </div>
        <p className="mt-2 text-xs text-[#8B7355]">{t("thirdPartyNote")}</p>
      </div>

      {/* Activity log */}
      <div className="rounded-xl border border-[#D4C5B0] bg-white p-6">
        <h2 className="font-semibold text-[#1C2B3A] mb-4">
          {t("activityTitle")}
        </h2>

        {logs.length === 0 ? (
          <p className="text-sm text-[#8B7355]">{t("noActivity")}</p>
        ) : (
          <>
            <ul className="space-y-3">
              {logs.map((entry, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 text-base">
                    {ACTION_ICONS[entry.action] ?? "📌"}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-[#1C2B3A]">
                      {entry.display_text || entry.action}
                    </p>
                    <p className="text-xs text-[#8B7355]">
                      {new Date(entry.created_at).toLocaleString(locale, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            {hasMore && (
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="mt-4 w-full rounded-lg border border-[#D4C5B0] py-2 text-sm font-medium text-[#2E4D6B] hover:bg-[#F7F3EE] disabled:opacity-50 transition-colors"
              >
                {loadingMore ? t("loading") : t("loadMore")}
              </button>
            )}
          </>
        )}
      </div>

      <p className="text-xs text-[#8B7355]">{t("activityFooter")}</p>
    </div>
  );
}
