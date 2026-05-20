"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";

type ConsentProfile = {
  gdpr_consent: boolean;
  marketing_consent: boolean;
  kvkk_consent: boolean;
  country: string;
};

export default function PrivacyPage() {
  const t = useTranslations("settings");
  const locale = useLocale();
  const router = useRouter();
  const supabase = createClient();

  const [userId, setUserId] = useState("");
  const [profile, setProfile] = useState<ConsentProfile>({
    gdpr_consent: true,
    marketing_consent: false,
    kvkk_consent: false,
    country: "US",
  });
  const [loading, setLoading] = useState(true);
  const [marketingSaving, setMarketingSaving] = useState(false);
  const [marketingMsg, setMarketingMsg] = useState("");

  const [exporting, setExporting] = useState(false);
  const [exportMsg, setExportMsg] = useState("");

  const [deleteInput, setDeleteInput] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const deleteTriggerRef = useRef<HTMLButtonElement>(null);

  // KVKK form
  const [kvkkSubject, setKvkkSubject] = useState("");
  const [kvkkMessage, setKvkkMessage] = useState("");

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
                single: () => Promise<{ data: ConsentProfile | null }>;
              };
            };
          };
        }
      )
        .from("profiles")
        .select("gdpr_consent,marketing_consent,kvkk_consent,country")
        .eq("id", user.id)
        .single();

      if (data) setProfile(data);
      setLoading(false);
    }
    load();
  }, [router, supabase]);

  // Focus trap for delete modal
  useEffect(() => {
    if (!deleteModal) return;
    const modal = modalRef.current;
    if (!modal) return;
    const FOCUSABLE = 'button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';
    const els = () => Array.from(modal.querySelectorAll<HTMLElement>(FOCUSABLE));
    els()[0]?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setDeleteModal(false); setDeleteInput(""); setDeleteError("");
        deleteTriggerRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = els();
      const first = focusable[0]; const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [deleteModal]);

  const handleMarketingToggle = async () => {
    const newValue = !profile.marketing_consent;
    setProfile({ ...profile, marketing_consent: newValue });
    setMarketingSaving(true);
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
      setMarketingMsg(newValue ? t("marketingEnabled") : t("marketingDisabled"));
    } catch {
      setProfile({ ...profile, marketing_consent: !newValue });
      setMarketingMsg(t("marketingFail"));
    } finally {
      setMarketingSaving(false);
      setTimeout(() => setMarketingMsg(""), 3000);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    setExportMsg("");
    try {
      const res = await fetch("/api/user/export-data");
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "settlelens-data-export.json";
      a.click();
      URL.revokeObjectURL(url);
      setExportMsg(t("exportOk"));
    } catch {
      setExportMsg(t("exportFail"));
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteInput !== "DELETE") return;
    setDeleting(true);
    setDeleteError("");
    try {
      const res = await fetch("/api/user/delete-account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmation: "DELETE" }),
      });
      if (!res.ok) throw new Error("Deletion failed");
      await supabase.auth.signOut();
      router.push(`/${locale}`);
    } catch {
      setDeleteError(t("deleteFail"));
      setDeleting(false);
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
          {t("privacyTitle")}
        </h1>
        <p className="mt-1 text-sm text-[#8B7355]">{t("privacyDesc")}</p>
      </div>

      {/* Download data */}
      <div className="rounded-xl border border-[#D4C5B0] bg-white p-6 space-y-3">
        <h2 className="font-semibold text-[#1C2B3A]">{t("downloadTitle")}</h2>
        <p className="text-sm text-[#8B7355]">{t("downloadDesc")}</p>
        {exportMsg && (
          <p
            className={`text-sm ${exportMsg === t("exportFail") ? "text-[#E85252]" : "text-[#4FA86E]"}`}
          >
            {exportMsg}
          </p>
        )}
        <button
          onClick={handleExport}
          disabled={exporting}
          className="rounded-lg bg-[#2E4D6B] px-5 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          {exporting ? t("exporting") : t("exportJson")}
        </button>
      </div>

      {/* Consent management */}
      <div className="rounded-xl border border-[#D4C5B0] bg-white p-6 space-y-4">
        <h2 className="font-semibold text-[#1C2B3A]">{t("consentTitle")}</h2>

        <div className="space-y-3">
          {/* GDPR consent — read-only */}
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded border-2 border-[#4FA86E] bg-[#4FA86E]">
              <span className="text-xs text-white">✓</span>
            </div>
            <div>
              <p className="text-sm font-medium text-[#1C2B3A]">
                {t("consentTerms")}
              </p>
              <p className="text-xs text-[#8B7355]">{t("consentTermsNote")}</p>
            </div>
          </div>

          {/* Marketing consent — toggleable */}
          <div className="flex items-start gap-3">
            <button
              onClick={handleMarketingToggle}
              disabled={marketingSaving}
              className={`mt-0.5 flex h-5 w-10 shrink-0 items-center rounded-full transition-colors ${
                profile.marketing_consent ? "bg-[#4FA86E]" : "bg-[#D4C5B0]"
              }`}
            >
              <span
                className={`h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  profile.marketing_consent
                    ? "translate-x-5"
                    : "translate-x-0.5"
                }`}
              />
            </button>
            <div>
              <p className="text-sm font-medium text-[#1C2B3A]">
                {t("consentMarketing")}
              </p>
              <p className="text-xs text-[#8B7355]">{t("consentMarketingNote")}</p>
              {marketingMsg && (
                <p className="mt-1 text-xs text-[#4FA86E]">{marketingMsg}</p>
              )}
            </div>
          </div>

          {/* KVKK — TR only */}
          {profile.country === "TR" && (
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded border-2 border-[#4FA86E] bg-[#4FA86E]">
                <span className="text-xs text-white">✓</span>
              </div>
              <div>
                <p className="text-sm font-medium text-[#1C2B3A]">
                  {t("kvkkConsentTitle")}
                </p>
                <p className="text-xs text-[#8B7355]">
                  {t("kvkkConsentNote")}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* KVKK request form — TR only */}
      {profile.country === "TR" && (
        <div className="rounded-xl border border-[#D4C5B0] bg-white p-6 space-y-4">
          <h2 className="font-semibold text-[#1C2B3A]">{t("kvkkFormTitle")}</h2>
          <p className="text-sm text-[#8B7355]">{t("kvkkFormDesc")}</p>
          <div>
            <label className="block text-sm font-medium text-[#2E4D6B] mb-1">
              {t("kvkkSubjectLabel")}
            </label>
            <select
              value={kvkkSubject}
              onChange={(e) => setKvkkSubject(e.target.value)}
              className="w-full rounded-lg border border-[#D4C5B0] px-3 py-2 text-sm"
            >
              <option value="">{t("kvkkSubjectPlaceholder")}</option>
              <option value="access">{t("kvkkOption1")}</option>
              <option value="correction">{t("kvkkOption2")}</option>
              <option value="deletion">{t("kvkkOption3")}</option>
              <option value="objection">{t("kvkkOption4")}</option>
              <option value="other">{t("kvkkOption5")}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2E4D6B] mb-1">
              {t("kvkkMessageLabel")}
            </label>
            <textarea
              value={kvkkMessage}
              onChange={(e) => setKvkkMessage(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-[#D4C5B0] px-3 py-2 text-sm resize-none"
              placeholder={t("kvkkMessagePlaceholder")}
            />
          </div>
          <a
            href={`mailto:support@settlelens.com?subject=KVKK Başvurusu: ${kvkkSubject}&body=${encodeURIComponent(kvkkMessage)}`}
            className="inline-block rounded-lg bg-[#2E4D6B] px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            {t("kvkkSubmitButton")}
          </a>
        </div>
      )}

      {/* Danger zone — delete account */}
      <div className="rounded-xl border-2 border-[#E85252] bg-white p-6 space-y-3">
        <h2 className="font-semibold text-[#E85252]">{t("dangerZone")}</h2>
        <p className="text-sm text-[#8B7355]">{t("deleteDesc1")}</p>
        <p className="text-sm text-[#8B7355]">{t("deleteDesc2")}</p>
        <button
          ref={deleteTriggerRef}
          onClick={() => setDeleteModal(true)}
          className="rounded-lg border border-[#E85252] px-5 py-2 text-sm font-semibold text-[#E85252] hover:bg-red-50 transition-colors"
        >
          {t("deleteMyAccount")}
        </button>
      </div>

      {/* Delete confirmation modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" aria-hidden="false">
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <h3 id="delete-modal-title" className="text-lg font-bold text-[#E85252] mb-2">
              {t("deleteTitle")}
            </h3>
            <p className="text-sm text-[#8B7355] mb-4">{t("deleteConfirmMsg")}</p>
            <input
              type="text"
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              placeholder={t("deletePlaceholder")}
              className="w-full rounded-lg border border-[#D4C5B0] px-3 py-2 text-sm mb-3 focus:border-[#E85252] focus:outline-none"
            />
            {deleteError && (
              <p role="alert" aria-live="polite" className="text-sm text-[#E85252] mb-3">{deleteError}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={deleteInput !== "DELETE" || deleting}
                className="flex-1 rounded-lg bg-[#E85252] py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-40"
              >
                {deleting ? t("deleting") : t("deleteBtn")}
              </button>
              <button
                onClick={() => {
                  setDeleteModal(false);
                  setDeleteInput("");
                  setDeleteError("");
                  deleteTriggerRef.current?.focus();
                }}
                className="flex-1 rounded-lg border border-[#D4C5B0] py-2 text-sm font-medium text-[#2E4D6B] hover:bg-[#F7F3EE]"
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
