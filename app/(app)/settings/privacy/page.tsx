"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type ConsentProfile = {
  gdpr_consent: boolean;
  marketing_consent: boolean;
  kvkk_consent: boolean;
  country: string;
};

export default function PrivacyPage() {
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

  // KVKK form
  const [kvkkSubject, setKvkkSubject] = useState("");
  const [kvkkMessage, setKvkkMessage] = useState("");

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/en/login");
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
      setMarketingMsg(
        newValue ? "Marketing emails enabled." : "Marketing emails disabled."
      );
    } catch {
      setProfile({ ...profile, marketing_consent: !newValue });
      setMarketingMsg("Failed to update preference.");
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
      setExportMsg("Your data has been downloaded.");
    } catch {
      setExportMsg("Export failed. Please try again or contact support.");
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
      router.push("/en");
    } catch {
      setDeleteError(
        "Account deletion failed. Please contact support@settlelens.com."
      );
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-32 items-center justify-center text-[#8B7355]">
        Loading...
      </div>
    );
  }

  const isTR = profile.country === "TR";

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1
          className="text-2xl font-bold text-[#1C2B3A]"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Privacy & Data
        </h1>
        <p className="mt-1 text-sm text-[#8B7355]">
          Manage your data, consents, and account deletion.
        </p>
      </div>

      {/* Download data */}
      <div className="rounded-xl border border-[#D4C5B0] bg-white p-6 space-y-3">
        <h2 className="font-semibold text-[#1C2B3A]">Download Your Data</h2>
        <p className="text-sm text-[#8B7355]">
          Export all your SettleLens data (profile, assets, debts, scenarios,
          analyses) as a JSON file. This is your right under GDPR Article 20
          (data portability).
        </p>
        {exportMsg && (
          <p
            className={`text-sm ${exportMsg.includes("failed") ? "text-[#E85252]" : "text-[#4FA86E]"}`}
          >
            {exportMsg}
          </p>
        )}
        <button
          onClick={handleExport}
          disabled={exporting}
          className="rounded-lg bg-[#2E4D6B] px-5 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          {exporting ? "Preparing export..." : "Export as JSON"}
        </button>
      </div>

      {/* Consent management */}
      <div className="rounded-xl border border-[#D4C5B0] bg-white p-6 space-y-4">
        <h2 className="font-semibold text-[#1C2B3A]">Consent Management</h2>

        <div className="space-y-3">
          {/* GDPR consent — read-only */}
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded border-2 border-[#4FA86E] bg-[#4FA86E]">
              <span className="text-xs text-white">✓</span>
            </div>
            <div>
              <p className="text-sm font-medium text-[#1C2B3A]">
                Service Terms & Privacy Policy
              </p>
              <p className="text-xs text-[#8B7355]">
                Required for service. Accepted at registration. Contact
                support@settlelens.com to withdraw.
              </p>
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
                Marketing Communications
              </p>
              <p className="text-xs text-[#8B7355]">
                Receive product updates and tips via email. You can change this
                at any time.
              </p>
              {marketingMsg && (
                <p className="mt-1 text-xs text-[#4FA86E]">{marketingMsg}</p>
              )}
            </div>
          </div>

          {/* KVKK — TR only */}
          {isKVKKCountry(profile.country) && (
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded border-2 border-[#4FA86E] bg-[#4FA86E]">
                <span className="text-xs text-white">✓</span>
              </div>
              <div>
                <p className="text-sm font-medium text-[#1C2B3A]">
                  KVKK Aydınlatma Metni
                </p>
                <p className="text-xs text-[#8B7355]">
                  Kayıt sırasında kabul edildi. Geri almak için
                  support@settlelens.com ile iletişime geçin.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* KVKK request form — TR only */}
      {isKVKKCountry(profile.country) && (
        <div className="rounded-xl border border-[#D4C5B0] bg-white p-6 space-y-4">
          <h2 className="font-semibold text-[#1C2B3A]">KVKK Başvuru Formu</h2>
          <p className="text-sm text-[#8B7355]">
            KVKK kapsamındaki haklarınızı kullanmak için aşağıdaki formu
            doldurun. Talebiniz 30 gün içinde yanıtlanacaktır.
          </p>
          <div>
            <label className="block text-sm font-medium text-[#2E4D6B] mb-1">
              Konu
            </label>
            <select
              value={kvkkSubject}
              onChange={(e) => setKvkkSubject(e.target.value)}
              className="w-full rounded-lg border border-[#D4C5B0] px-3 py-2 text-sm"
            >
              <option value="">Seçiniz</option>
              <option value="access">Kişisel verilerimi öğrenmek istiyorum</option>
              <option value="correction">Verilerimin düzeltilmesini talep ediyorum</option>
              <option value="deletion">Verilerimin silinmesini talep ediyorum</option>
              <option value="objection">İşlemeye itiraz ediyorum</option>
              <option value="other">Diğer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2E4D6B] mb-1">
              Mesajınız
            </label>
            <textarea
              value={kvkkMessage}
              onChange={(e) => setKvkkMessage(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-[#D4C5B0] px-3 py-2 text-sm resize-none"
              placeholder="Talebinizi açıklayın..."
            />
          </div>
          <a
            href={`mailto:support@settlelens.com?subject=KVKK Başvurusu: ${kvkkSubject}&body=${encodeURIComponent(kvkkMessage)}`}
            className="inline-block rounded-lg bg-[#2E4D6B] px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Başvuruyu Gönder
          </a>
        </div>
      )}

      {/* Danger zone — delete account */}
      <div className="rounded-xl border-2 border-[#E85252] bg-white p-6 space-y-3">
        <h2 className="font-semibold text-[#E85252]">Danger Zone</h2>
        <p className="text-sm text-[#8B7355]">
          Deleting your account will deactivate it immediately. All your
          financial data (assets, debts, scenarios, analyses) will be
          permanently deleted within 30 days. This action cannot be undone.
        </p>
        <p className="text-sm text-[#8B7355]">
          You can reactivate your account within 30 days by contacting
          support@settlelens.com.
        </p>
        <button
          onClick={() => setDeleteModal(true)}
          className="rounded-lg border border-[#E85252] px-5 py-2 text-sm font-semibold text-[#E85252] hover:bg-red-50 transition-colors"
        >
          Delete My Account
        </button>
      </div>

      {/* Delete confirmation modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-[#E85252] mb-2">
              Delete Account
            </h3>
            <p className="text-sm text-[#8B7355] mb-4">
              This action is permanent. Type{" "}
              <strong className="text-[#1C2B3A]">DELETE</strong> to confirm.
            </p>
            <input
              type="text"
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              placeholder="Type DELETE"
              className="w-full rounded-lg border border-[#D4C5B0] px-3 py-2 text-sm mb-3 focus:border-[#E85252] focus:outline-none"
            />
            {deleteError && (
              <p className="text-sm text-[#E85252] mb-3">{deleteError}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={deleteInput !== "DELETE" || deleting}
                className="flex-1 rounded-lg bg-[#E85252] py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-40"
              >
                {deleting ? "Deleting..." : "Delete Account"}
              </button>
              <button
                onClick={() => {
                  setDeleteModal(false);
                  setDeleteInput("");
                  setDeleteError("");
                }}
                className="flex-1 rounded-lg border border-[#D4C5B0] py-2 text-sm font-medium text-[#2E4D6B] hover:bg-[#F7F3EE]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function isKVKKCountry(country: string): boolean {
  return country === "TR";
}
