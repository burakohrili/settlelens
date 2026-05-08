"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { WizardLayout } from "@/components/app/WizardLayout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
};

const CATEGORIES = [
  { value: "real_estate", label: "🏠 Real Estate" },
  { value: "vehicle", label: "🚗 Vehicle" },
  { value: "bank", label: "🏦 Bank Account" },
  { value: "retirement", label: "📈 Retirement/Investment" },
  { value: "business", label: "🏢 Business" },
  { value: "crypto", label: "₿ Crypto" },
  { value: "other", label: "📦 Other" },
];

function newAsset(): Asset {
  return { name: "", category: "real_estate", current_value: 0, purchase_price: 0, owned_by: "joint", is_marital: true, mortgage_balance: 0 };
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export default function Step2Page() {
  const router = useRouter();
  const params = useParams();
  const lang = (params.lang as string) ?? "en";
  const supabase = createClient();
  const [assets, setAssets] = useState<Asset[]>([newAsset()]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
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
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Delete existing and re-insert
      await (supabase as never as { from: (t: string) => { delete: () => { eq: (col: string, val: string) => Promise<unknown> } } })
        .from("assets").delete().eq("user_id", user.id);
      const rows = assets.filter((a) => a.name).map((a) => ({ ...a, user_id: user.id, id: undefined }));
      if (rows.length > 0) {
        await (supabase as never as { from: (t: string) => { insert: (d: unknown[]) => Promise<unknown> } })
          .from("assets").insert(rows);
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
        {assets.map((asset, i) => (
          <div key={i} className="rounded-lg border border-[var(--sand)] bg-white p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Label>Asset name</Label>
                  <Input
                    value={asset.name}
                    onChange={(e) => updateAsset(i, "name", e.target.value)}
                    placeholder="e.g. Family Home"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <select
                    value={asset.category}
                    onChange={(e) => updateAsset(i, "category", e.target.value)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 font-ui text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Owned by</Label>
                  <select
                    value={asset.owned_by}
                    onChange={(e) => updateAsset(i, "owned_by", e.target.value)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 font-ui text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="joint">Joint</option>
                    <option value="me">Me</option>
                    <option value="spouse">Spouse</option>
                  </select>
                </div>
                <div>
                  <Label>Current value ($)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={asset.current_value || ""}
                    onChange={(e) => updateAsset(i, "current_value", parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Purchase price ($)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={asset.purchase_price || ""}
                    onChange={(e) => updateAsset(i, "purchase_price", parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
                {asset.category === "real_estate" && (
                  <div>
                    <Label>Mortgage balance ($)</Label>
                    <Input
                      type="number"
                      min={0}
                      value={asset.mortgage_balance || ""}
                      onChange={(e) => updateAsset(i, "mortgage_balance", parseFloat(e.target.value) || 0)}
                      className="mt-1"
                    />
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
                  <Label htmlFor={`marital-${i}`} className="cursor-pointer">Marital asset</Label>
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
          <Plus size={16} className="mr-1" /> Add asset
        </button>

        <div className="rounded-md border border-[var(--sand)] bg-[var(--cream)] p-3 font-ui text-sm">
          <div className="flex justify-between"><span className="text-[var(--brown)]">Total assets</span><span className="font-semibold">{fmt(totalValue)}</span></div>
          <div className="flex justify-between"><span className="text-[var(--brown)]">Total mortgage</span><span className="font-semibold text-[var(--danger)]">-{fmt(totalMortgage)}</span></div>
          <div className="flex justify-between border-t border-[var(--sand)] pt-1 mt-1"><span className="font-semibold text-[var(--navy)]">Net assets</span><span className={cn("font-bold", net >= 0 ? "text-[var(--gain)]" : "text-[var(--danger)]")}>{fmt(net)}</span></div>
        </div>
      </div>
    </WizardLayout>
  );
}
