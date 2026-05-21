"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { NumericInput } from "@/components/ui/NumericInput";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

type Asset = {
  id: string;
  name: string;
  category: string;
  current_value: number;
};

type ScenarioForm = {
  name: string;
  retirement_split_me: number;
  alimony_monthly: number;
  alimony_years: number;
  alimony_direction: string;
  child_support_monthly: number;
  child_support_direction: string;
};

const DEFAULT_FORM: ScenarioForm = {
  name: "",
  retirement_split_me: 50,
  alimony_monthly: 0,
  alimony_years: 0,
  alimony_direction: "i_receive",
  child_support_monthly: 0,
  child_support_direction: "i_receive",
};

const PHYSICAL_CATEGORIES = ["real_estate", "vehicle", "business"] as const;
type PhysicalCategory = typeof PHYSICAL_CATEGORIES[number];

function outcomeOptions(category: PhysicalCategory, t: (k: string) => string) {
  const base = [
    { value: "not_decided", label: t("outcome_not_decided") },
    { value: "i_keep",      label: t("outcome_i_keep")      },
    { value: "spouse_keeps",label: t("outcome_spouse_keeps") },
    { value: "sell",        label: t("outcome_sell")        },
  ];
  if (category === "business") {
    base.push({ value: "split", label: t("outcome_split") });
  }
  return base;
}

export default function NewScenarioPage() {
  const t = useTranslations("onboarding_form.step6");
  const tScenarios = useTranslations("userScenarios");
  const locale = useLocale();
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState<ScenarioForm>(DEFAULT_FORM);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [overrides, setOverrides] = useState<Record<string, string>>({}); // asset_id → outcome
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scenarioCount, setScenarioCount] = useState<number | null>(null);
  const [planType, setPlanType] = useState<string>("discovery");

  useEffect(() => {
    async function loadAssets() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch plan and scenario count to show proactive limit warning
      const [profileRes, countRes] = await Promise.all([
        (supabase as never as {
          from: (t: string) => { select: (s: string) => { eq: (c: string, v: string) => { single: () => Promise<{ data: { plan_type: string } | null }> } } }
        }).from("profiles").select("plan_type").eq("id", user.id).single(),
        (supabase as never as {
          from: (t: string) => { select: (s: string, opts: { count: string; head: boolean }) => { eq: (c: string, v: string) => Promise<{ count: number | null }> } }
        }).from("scenarios").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      ]);
      if (profileRes.data) setPlanType(profileRes.data.plan_type ?? "discovery");
      if (countRes.count !== null) setScenarioCount(countRes.count);

      const { data } = await (supabase as never as {
        from: (t: string) => {
          select: (s: string) => {
            eq: (c: string, v: string) => {
              in: (c: string, v: string[]) => {
                order: (c: string) => { order: (c: string) => Promise<{ data: Asset[] | null }> }
              }
            }
          }
        }
      }).from("assets").select("id, name, category, current_value")
        .eq("user_id", user.id)
        .in("category", [...PHYSICAL_CATEGORIES])
        .order("category").order("name");
      if (data) {
        setAssets(data as Asset[]);
        const defaults: Record<string, string> = {};
        for (const a of data) defaults[a.id] = "not_decided";
        setOverrides(defaults);
      }
    }
    loadAssets();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function update(field: keyof ScenarioForm, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    if (!form.name.trim()) return;
    setSaving(true);
    setError(null);

    const res = await fetch("/api/scenarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, scenario_type: "custom" }),
    });
    const json = await res.json() as { id?: string; error?: string };

    if (!res.ok) {
      if (res.status === 401) { router.push(`/${locale}/login`); return; }
      setError(json.error === "scenario_limit_reached"
        ? tScenarios("scenarioLimitReached")
        : t("saveError"));
      setSaving(false);
      return;
    }

    const scenarioId = json.id as string;

    // Save per-asset overrides
    const overrideList = assets.map((a) => ({
      asset_id: a.id,
      outcome: overrides[a.id] ?? "not_decided",
      split_pct_me: 50,
    }));
    if (overrideList.length > 0) {
      await fetch(`/api/scenarios/${scenarioId}/asset-overrides`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ overrides: overrideList }),
      });
    }

    router.push(`/scenarios/${scenarioId}`);
  }

  const selectCls = "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 font-ui text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  const grouped = PHYSICAL_CATEGORIES.reduce<Record<string, Asset[]>>((acc, cat) => {
    acc[cat] = assets.filter((a) => a.category === cat);
    return acc;
  }, { real_estate: [], vehicle: [], business: [] });

  const hasPhysicalAssets = assets.length > 0;

  const catLabel: Record<string, string> = {
    real_estate: t("catRealEstate"),
    vehicle: t("catVehicle"),
    business: t("catBusiness"),
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-center gap-3">
        <Link href="/scenarios" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-[var(--brown)]")}>
          <ArrowLeft size={16} className="mr-1" />
          {t("backToScenarios")}
        </Link>
      </div>

      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--navy)]">
          {t("pageTitle")}
        </h1>
        <p className="font-ui text-sm text-[var(--brown)] mt-1">
          {t("pageSubtitle")}
        </p>
      </div>

      <div className="rounded-xl border border-[var(--sand)] bg-white p-5 space-y-4">
        <div>
          <Label>{t("scenarioName")}</Label>
          <Input
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="mt-1"
            placeholder={t("scenarioNamePlaceholder")}
            maxLength={200}
            autoFocus
          />
        </div>

        {/* Per-asset outcomes */}
        <div className="border-b border-[var(--sand)] pb-4">
          <p className="font-ui text-xs font-semibold text-[var(--navy)] uppercase tracking-wide mb-3">
            {t("assetsSection")}
          </p>

          {!hasPhysicalAssets ? (
            <p className="font-ui text-sm text-[var(--brown)] italic">
              {t("noPhysicalAssets")}
            </p>
          ) : (
            <div className="space-y-4">
              {PHYSICAL_CATEGORIES.map((cat) => {
                const catAssets = grouped[cat];
                if (catAssets.length === 0) return null;
                return (
                  <div key={cat}>
                    <p className="font-ui text-xs text-[var(--navy)] font-semibold mb-2">{catLabel[cat]}</p>
                    <div className="space-y-2">
                      {catAssets.map((asset) => (
                        <div key={asset.id} className="flex items-center gap-3">
                          <span className="font-ui text-sm text-[var(--navy)] flex-1 min-w-0 truncate" title={asset.name}>
                            {asset.name}
                          </span>
                          <select
                            value={overrides[asset.id] ?? "not_decided"}
                            onChange={(e) => setOverrides((prev) => ({ ...prev, [asset.id]: e.target.value }))}
                            className="w-48 rounded-md border border-input bg-background px-2 py-1.5 font-ui text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            {outcomeOptions(cat, t).map((o) => (
                              <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Financial assets split % */}
          <div className="mt-4">
            <Label>{t("investmentsLabel")}</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                type="number" min={0} max={100}
                value={form.retirement_split_me}
                onChange={(e) => update("retirement_split_me", parseFloat(e.target.value) || 50)}
                className="w-24"
              />
              <span className="font-ui text-sm text-[var(--brown)]">% {t("toMe")}</span>
            </div>
            <p className="font-ui text-xs text-[var(--brown)] mt-1">{t("investmentsHint")}</p>
          </div>
        </div>

        <div className="border-t border-[var(--sand)] pt-4">
          <p className="font-ui text-xs font-semibold text-[var(--navy)] uppercase tracking-wide mb-3">
            {t("alimonySection")}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>{t("alimonyMonthly")}</Label>
              <NumericInput value={form.alimony_monthly} onChange={(v) => update("alimony_monthly", v)} min={0} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 font-ui text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
            <div>
              <Label>{t("alimonyYears")}</Label>
              <Input type="number" min={0} max={30} value={form.alimony_years || ""} onChange={(e) => update("alimony_years", parseInt(e.target.value) || 0)} className="mt-1" placeholder="0" />
            </div>
            <div className="col-span-2">
              <Label>{t("alimonyDirection")}</Label>
              <select value={form.alimony_direction} onChange={(e) => update("alimony_direction", e.target.value)} className={selectCls}>
                <option value="i_receive">{t("iReceive")}</option>
                <option value="i_pay">{t("iPay")}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--sand)] pt-4">
          <p className="font-ui text-xs font-semibold text-[var(--navy)] uppercase tracking-wide mb-3">
            {t("childSupportSection")}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>{t("childSupport")}</Label>
              <NumericInput value={form.child_support_monthly} onChange={(v) => update("child_support_monthly", v)} min={0} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 font-ui text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
            <div>
              <Label>{t("childSupportDirection")}</Label>
              <select value={form.child_support_direction} onChange={(e) => update("child_support_direction", e.target.value)} className={selectCls}>
                <option value="i_receive">{t("iReceive")}</option>
                <option value="i_pay">{t("iPay")}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <p className="font-ui text-sm text-[var(--red)] bg-[var(--red)]/10 border border-[var(--red)]/20 rounded-lg px-4 py-3">{error}</p>
      )}

      {(() => {
        const limit = planType === "discovery" || planType === "clarified" ? 3 : -1;
        if (limit > 0 && scenarioCount !== null && scenarioCount >= limit) {
          return (
            <p className="font-ui text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
              {tScenarios("scenarioLimitReached")}
            </p>
          );
        }
        return null;
      })()}

      <div className="rounded-md border border-[var(--sand)] bg-[var(--cream)] p-3 font-ui text-xs text-[var(--brown)]">
        <strong>{t("disclaimerLabel")}:</strong> {t("disclaimer")}
      </div>

      <button
        onClick={handleSave}
        disabled={saving || !form.name.trim() || ((() => { const l = planType === "discovery" || planType === "clarified" ? 3 : -1; return l > 0 && scenarioCount !== null && scenarioCount >= l; })())}
        className={cn(
          buttonVariants(),
          "bg-[var(--gold)] text-[var(--navy)] font-semibold hover:bg-[var(--gold)]/90 w-full",
          (saving || !form.name.trim()) && "opacity-50 cursor-not-allowed"
        )}
      >
        <Save size={16} className="mr-2" />
        {saving ? t("saving") : t("saveScenario")}
      </button>
    </div>
  );
}
