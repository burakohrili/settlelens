"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { formatMoney } from "@/lib/money";
import { WizardLayout } from "@/components/app/WizardLayout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { NumericInput } from "@/components/ui/NumericInput";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

type Asset = {
  id?: string;
  name: string;
  category: string;
  current_value: number;
  purchase_price: number;
  owned_by: "joint" | "me" | "spouse";
  is_marital: boolean;
  mortgage_balance: number;
  acquisition_year?: number;
  contribution_ratio?: number;  // UI: 0-100, stored as 0-1
  crypto_token?: string;
  crypto_quantity?: number;
  crypto_exchange?: string;
  crypto_wallet_address?: string;
  crypto_price_at_entry?: number;
};

const CATEGORY_VALUES = ["real_estate", "vehicle", "bank", "retirement", "business", "crypto", "other"] as const;
const CATEGORY_ICONS: Record<string, string> = {
  real_estate: "🏠", vehicle: "🚗", bank: "🏦",
  retirement: "📈", business: "🏢", crypto: "₿", other: "📦",
};

const CRYPTO_STORAGE = ["exchange", "cold_wallet", "defi"] as const;

function newAsset(): Asset {
  return { name: "", category: "real_estate", current_value: 0, purchase_price: 0, owned_by: "joint", is_marital: true, mortgage_balance: 0 };
}

const COUNTRY_CURRENCY: Record<string, string> = {
  US: "USD", UK: "GBP", DE: "EUR", FR: "EUR", ES: "EUR", TR: "TRY",
};


export default function Step2Page() {
  const t = useTranslations("onboarding_form.step2");
  const locale = useLocale();
  const router = useRouter();
  const params = useParams();
  const lang = (params.lang as string) ?? "en";
  const supabase = createClient();
  const [assets, setAssets] = useState<Asset[]>([newAsset()]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await (supabase as never as { from: (t: string) => { select: (s: string) => { eq: (col: string, val: string) => { single: () => Promise<{ data: Record<string, unknown> | null }> } } } })
        .from("profiles").select("country").eq("id", user.id).single();
      const LOCALE_CURRENCY: Record<string, string> = { tr: "TRY", de: "EUR", fr: "EUR", es: "EUR" };
      if (profile?.country) {
        setCurrency(COUNTRY_CURRENCY[profile.country as string] ?? LOCALE_CURRENCY[locale] ?? "USD");
      } else {
        setCurrency(LOCALE_CURRENCY[locale] ?? "USD");
      }
      const { data } = await (supabase as never as { from: (t: string) => { select: (s: string) => { eq: (col: string, val: string) => Promise<{ data: Asset[] | null }> } } })
        .from("assets").select("*").eq("user_id", user.id);
      if (data && data.length > 0) setAssets(data);
    }
    load();
  }, [supabase]);

  function updateAsset(i: number, field: keyof Asset, value: unknown) {
    setAssets((prev) => prev.map((a, idx) => idx === i ? { ...a, [field]: value } : a));
  }

  function addAsset() { setAssets((prev) => [...prev, newAsset()]); }
  function removeAsset(i: number) { setAssets((prev) => prev.filter((_, idx) => idx !== i)); }

  const totalValue = assets.reduce((s, a) => s + (a.current_value || 0), 0);
  const totalMortgage = assets.reduce((s, a) => s + (a.mortgage_balance || 0), 0);
  const net = totalValue - totalMortgage;

  async function handleNext() {
    setSaveError("");
    for (const a of assets) {
      if ((a.category === "real_estate" || a.category === "vehicle") &&
          a.mortgage_balance > a.current_value && a.current_value > 0) {
        setSaveError(t("mortgageExceedsValue"));
        return;
      }
    }
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await (supabase as never as { from: (t: string) => { delete: () => { eq: (col: string, val: string) => Promise<unknown> } } })
        .from("assets").delete().eq("user_id", user.id);
      const rows = assets.filter((a) => a.name).map((a) => ({
        ...a,
        user_id: user.id,
        id: undefined,
        contribution_ratio: a.contribution_ratio !== undefined ? a.contribution_ratio / 100 : 1,
      }));
      if (rows.length > 0) {
        const { error: insertError } = await (supabase as never as { from: (t: string) => { insert: (d: unknown[]) => Promise<{ error: { message: string } | null }> } })
          .from("assets").insert(rows);
        if (insertError) {
          setSaveError(t("saveError"));
          setSaving(false);
          return;
        }
      }
    }
    router.push(`/${lang}/onboarding/step-3`);
  }

  return (
    <WizardLayout
      currentStep={2}
      onBack={() => router.push(`/${lang}/onboarding/step-1`)}
      onNext={handleNext}
      nextDisabled={saving || assets.some((a) => !a.name)}
    >
      <div className="space-y-4">
        {saveError && (
          <p className="rounded-md bg-red-50 px-3 py-2 font-ui text-sm text-[var(--danger)]" role="alert">
            {saveError}
          </p>
        )}
        {assets.map((asset, i) => (
          <div key={i} className="rounded-lg border border-[var(--sand)] bg-white p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Label htmlFor={`asset-name-${i}`}>{t("assetName")}</Label>
                  <Input
                    id={`asset-name-${i}`}
                    value={asset.name}
                    onChange={(e) => updateAsset(i, "name", e.target.value)}
                    placeholder={t("assetNamePlaceholder")}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor={`asset-category-${i}`}>{t("category")}</Label>
                  <select
                    id={`asset-category-${i}`}
                    value={asset.category}
                    onChange={(e) => updateAsset(i, "category", e.target.value)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 font-ui text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {CATEGORY_VALUES.map((v) => <option key={v} value={v}>{CATEGORY_ICONS[v]} {t(`cat_${v}`)}</option>)}
                  </select>
                </div>
                <div>
                  <Label htmlFor={`asset-owner-${i}`}>{t("ownedBy")}</Label>
                  <select
                    id={`asset-owner-${i}`}
                    value={asset.owned_by}
                    onChange={(e) => updateAsset(i, "owned_by", e.target.value)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 font-ui text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="joint">{t("joint")}</option>
                    <option value="me">{t("me")}</option>
                    <option value="spouse">{t("spouse")}</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor={`asset-value-${i}`}>{t("currentValue")}</Label>
                  <NumericInput
                    value={asset.current_value}
                    onChange={(v) => updateAsset(i, "current_value", v)}
                    min={0}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 font-ui text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div>
                  <Label htmlFor={`asset-purchase-${i}`}>{t("purchasePrice")}</Label>
                  <NumericInput
                    value={asset.purchase_price}
                    onChange={(v) => updateAsset(i, "purchase_price", v)}
                    min={0}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 font-ui text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                {(asset.category === "real_estate" || asset.category === "vehicle") && (
                  <div>
                    <Label htmlFor={`asset-mortgage-${i}`}>{t("mortgageBalance")}</Label>
                    <NumericInput
                      value={asset.mortgage_balance}
                      onChange={(v) => updateAsset(i, "mortgage_balance", v)}
                      min={0}
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 font-ui text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                )}

                {(asset.category === "real_estate" || asset.category === "vehicle" || asset.category === "business") && (
                  <div>
                    <Label htmlFor={`asset-acqyear-${i}`}>{t("acquisitionYear")}</Label>
                    <Input
                      id={`asset-acqyear-${i}`}
                      type="number"
                      min={1900}
                      max={new Date().getFullYear()}
                      value={asset.acquisition_year ?? ""}
                      onChange={(e) => updateAsset(i, "acquisition_year", parseInt(e.target.value) || undefined)}
                      placeholder={String(new Date().getFullYear() - 5)}
                      className="mt-1"
                    />
                    <p className="font-ui text-xs text-[var(--brown)] mt-0.5">{t("acquisitionYearHint")}</p>
                  </div>
                )}

                {(asset.category === "real_estate" || asset.category === "business") && (
                  <div>
                    <Label htmlFor={`asset-contrib-${i}`}>{t("contributionRatio")}</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        id={`asset-contrib-${i}`}
                        type="number"
                        min={0}
                        max={100}
                        value={asset.contribution_ratio !== undefined ? asset.contribution_ratio : 100}
                        onChange={(e) => updateAsset(i, "contribution_ratio", Math.min(100, Math.max(0, parseFloat(e.target.value) || 100)))}
                        className="w-20"
                      />
                      <span className="font-ui text-sm text-[var(--brown)]">%</span>
                    </div>
                    <p className="font-ui text-xs text-[var(--brown)] mt-0.5">{t("contributionRatioHint")}</p>
                  </div>
                )}

                {asset.category === "crypto" && (
                  <div className="col-span-2 space-y-3">
                    <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
                      <p className="font-ui text-xs text-amber-800">{t("cryptoWarning")}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>{t("cryptoToken")}</Label>
                        <Input
                          value={asset.crypto_token ?? ""}
                          onChange={(e) => updateAsset(i, "crypto_token", e.target.value)}
                          placeholder="BTC"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>{t("cryptoQuantity")}</Label>
                        <Input
                          type="number"
                          min={0}
                          step="0.00000001"
                          value={asset.crypto_quantity ?? ""}
                          onChange={(e) => updateAsset(i, "crypto_quantity", parseFloat(e.target.value) || 0)}
                          className="mt-1"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>{t("cryptoWhere")}</Label>
                        <select
                          value={asset.crypto_exchange ?? "exchange"}
                          onChange={(e) => updateAsset(i, "crypto_exchange", e.target.value)}
                          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 font-ui text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {CRYPTO_STORAGE.map((s) => (
                            <option key={s} value={s}>
                              {s === "exchange" ? t("cryptoExchange") : s === "cold_wallet" ? t("cryptoColdWallet") : t("cryptoDefi")}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-2">
                        <Label>{t("cryptoPriceAtEntry")}</Label>
                        <Input
                          type="number"
                          min={0}
                          value={asset.crypto_price_at_entry ?? ""}
                          onChange={(e) => updateAsset(i, "crypto_price_at_entry", parseFloat(e.target.value) || undefined)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id={`marital-${i}`}
                    checked={asset.is_marital}
                    onChange={(e) => updateAsset(i, "is_marital", e.target.checked)}
                    className="h-4 w-4 accent-[var(--gold)]"
                  />
                  <Label htmlFor={`marital-${i}`} className="cursor-pointer">{t("maritalAsset")}</Label>
                </div>
              </div>
              {assets.length > 1 && (
                <button
                  onClick={() => removeAsset(i)}
                  className="mt-1 text-[var(--danger)] hover:opacity-70"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        ))}

        <button
          onClick={addAsset}
          className={cn(buttonVariants({ variant: "outline" }), "w-full border-dashed border-[var(--sand)] text-[var(--brown)]")}
        >
          <Plus size={16} className="mr-1" /> {t("addAsset")}
        </button>

        <div className="rounded-md border border-[var(--sand)] bg-[var(--cream)] p-3 font-ui text-sm">
          <div className="flex justify-between"><span className="text-[var(--brown)]">{t("totalAssets")}</span><span className="font-semibold">{formatMoney(totalValue, currency, locale)}</span></div>
          <div className="flex justify-between"><span className="text-[var(--brown)]">{t("totalMortgage")}</span><span className="font-semibold text-[var(--danger)]">-{formatMoney(totalMortgage, currency, locale)}</span></div>
          <div className="flex justify-between border-t border-[var(--sand)] pt-1 mt-1"><span className="font-semibold text-[var(--navy)]">{t("netAssets")}</span><span className={cn("font-bold", net >= 0 ? "text-[var(--gain)]" : "text-[var(--danger)]")}>{formatMoney(net, currency, locale)}</span></div>
        </div>
      </div>
    </WizardLayout>
  );
}
