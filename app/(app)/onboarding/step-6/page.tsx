"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { SCENARIO_LIMITS } from "@/lib/plan-limits";
import { WizardLayout } from "@/components/app/WizardLayout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type AssetItem = {
  id: string;
  name: string;
  category: string;
};

type Scenario = {
  id?: string;
  name: string;
  retirement_split_me: number;
  alimony_monthly: number;
  alimony_years: number;
  alimony_direction: string;
  child_support_monthly: number;
  child_support_direction: string;
};

function newScenario(name: string): Scenario {
  return {
    name,
    retirement_split_me: 50,
    alimony_monthly: 0,
    alimony_years: 0,
    alimony_direction: "i_receive",
    child_support_monthly: 0,
    child_support_direction: "i_receive",
  };
}

const PHYSICAL_CATEGORIES = ["real_estate", "vehicle", "business"] as const;
type PhysicalCat = typeof PHYSICAL_CATEGORIES[number];

function outcomeOptions(category: PhysicalCat, t: (k: string) => string) {
  const base = [
    { value: "not_decided", label: t("outcome_not_decided") },
    { value: "i_keep",       label: t("outcome_i_keep")       },
    { value: "spouse_keeps", label: t("outcome_spouse_keeps")  },
    { value: "sell",         label: t("outcome_sell")          },
  ];
  if (category === "business") base.push({ value: "split", label: t("outcome_split") });
  return base;
}

function ScenarioCard({
  scenario,
  index,
  onChange,
  assets,
  overrides,
  onOverrideChange,
  t,
}: {
  scenario: Scenario;
  index: number;
  onChange: (field: keyof Scenario, value: unknown) => void;
  assets: AssetItem[];
  overrides: Record<string, string>;
  onOverrideChange: (assetId: string, outcome: string) => void;
  t: (key: string) => string;
}) {
  const selectCls = "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 font-ui text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  const grouped = PHYSICAL_CATEGORIES.reduce<Record<string, AssetItem[]>>((acc, cat) => {
    acc[cat] = assets.filter((a) => a.category === cat);
    return acc;
  }, { real_estate: [], vehicle: [], business: [] });

  const catLabel: Record<string, string> = {
    real_estate: t("catRealEstate"),
    vehicle: t("catVehicle"),
    business: t("catBusiness"),
  };

  return (
    <div className="rounded-lg border border-[var(--sand)] bg-white p-4 space-y-3">
      <div>
        <Label>{t("scenarioName")}</Label>
        <Input value={scenario.name} onChange={(e) => onChange("name", e.target.value)} className="mt-1" placeholder={t("scenarioNamePlaceholder")} />
      </div>

      <div className="border-t border-[var(--sand)] pt-3">
        <p className="font-ui text-xs font-semibold text-[var(--navy)] uppercase tracking-wide mb-3">{t("assetsSection")}</p>

        {assets.length === 0 ? (
          <p className="font-ui text-xs text-[var(--brown)] italic">{t("noPhysicalAssets")}</p>
        ) : (
          <div className="space-y-3">
            {PHYSICAL_CATEGORIES.map((cat) => {
              const catAssets = grouped[cat];
              if (catAssets.length === 0) return null;
              return (
                <div key={cat}>
                  <p className="font-ui text-xs text-[var(--navy)] font-semibold mb-2">{catLabel[cat]}</p>
                  <div className="space-y-2">
                    {catAssets.map((asset) => (
                      <div key={asset.id} className="flex items-center gap-3">
                        <span className="font-ui text-sm text-[var(--navy)] flex-1 min-w-0 truncate" title={asset.name}>{asset.name}</span>
                        <select
                          value={overrides[`${index}:${asset.id}`] ?? "not_decided"}
                          onChange={(e) => onOverrideChange(`${index}:${asset.id}`, e.target.value)}
                          className="w-44 rounded-md border border-input bg-background px-2 py-1.5 font-ui text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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

        <div className="mt-3">
          <Label>{t("investmentsLabel")}</Label>
          <div className="flex items-center gap-2 mt-1">
            <Input type="number" min={0} max={100} value={scenario.retirement_split_me} onChange={(e) => onChange("retirement_split_me", parseFloat(e.target.value) || 50)} className="w-24" />
            <span className="font-ui text-sm text-[var(--brown)]">% {t("toMe")}</span>
          </div>
          <p className="font-ui text-xs text-[var(--brown)] mt-1">{t("investmentsHint")}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>{t("alimonyMonthly")}</Label>
          <Input type="number" min={0} value={scenario.alimony_monthly || ""} onChange={(e) => onChange("alimony_monthly", parseFloat(e.target.value) || 0)} className="mt-1" placeholder="0" />
        </div>
        <div>
          <Label>{t("alimonyYears")}</Label>
          <Input type="number" min={0} max={30} value={scenario.alimony_years || ""} onChange={(e) => onChange("alimony_years", parseInt(e.target.value) || 0)} className="mt-1" placeholder="0" />
        </div>
        <div className="col-span-2">
          <Label>{t("alimonyDirection")}</Label>
          <select value={scenario.alimony_direction} onChange={(e) => onChange("alimony_direction", e.target.value)} className={selectCls}>
            <option value="i_receive">{t("iReceive")}</option>
            <option value="i_pay">{t("iPay")}</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>{t("childSupport")}</Label>
          <Input type="number" min={0} value={scenario.child_support_monthly || ""} onChange={(e) => onChange("child_support_monthly", parseFloat(e.target.value) || 0)} className="mt-1" placeholder="0" />
        </div>
        <div>
          <Label>{t("alimonyDirection")}</Label>
          <select value={scenario.child_support_direction} onChange={(e) => onChange("child_support_direction", e.target.value)} className={selectCls}>
            <option value="i_receive">{t("iReceive")}</option>
            <option value="i_pay">{t("iPay")}</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default function Step6Page() {
  const t = useTranslations("onboarding_form.step6");
  const router = useRouter();
  const params = useParams();
  const lang = (params.lang as string) ?? "en";
  const supabase = createClient();

  const [scenarios, setScenarios] = useState<Scenario[]>([
    newScenario(t("scenarioA")),
    newScenario(t("scenarioB")),
    newScenario(t("scenarioC")),
  ]);
  const [assets, setAssets] = useState<AssetItem[]>([]);
  // Key format: "{scenarioIndex}:{asset_id}" → outcome
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load existing scenarios
      const { data: existingScenarios } = await (supabase as never as {
        from: (t: string) => { select: (s: string) => { eq: (col: string, val: string) => { limit: (n: number) => Promise<{ data: Scenario[] | null }> } } }
      }).from("scenarios").select("*").eq("user_id", user.id).limit(3);
      if (existingScenarios && existingScenarios.length > 0) setScenarios(existingScenarios);

      // Load physical assets
      const { data: assetData } = await (supabase as never as {
        from: (t: string) => {
          select: (s: string) => {
            eq: (c: string, v: string) => {
              in: (c: string, v: string[]) => {
                order: (c: string) => { order: (c: string) => Promise<{ data: AssetItem[] | null }> }
              }
            }
          }
        }
      }).from("assets").select("id, name, category").eq("user_id", user.id)
        .in("category", [...PHYSICAL_CATEGORIES])
        .order("category").order("name");
      if (assetData) setAssets(assetData as AssetItem[]);
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateScenario(i: number, field: keyof Scenario, value: unknown) {
    setScenarios((prev) => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
  }

  function handleOverrideChange(key: string, outcome: string) {
    setOverrides((prev) => ({ ...prev, [key]: outcome }));
  }

  async function handleSkip() {
    setSaving(true);
    setSaveError(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }
    const defaultScenario = {
      name: "My Base Scenario",
      user_id: user.id,
      scenario_type: "custom",
      is_active: true,
      retirement_split_me: 50,
      alimony_monthly: 0,
      alimony_years: 0,
      alimony_direction: "i_receive",
      child_support_monthly: 0,
      child_support_direction: "i_receive",
    };
    await (supabase as never as { from: (t: string) => { delete: () => { eq: (col: string, val: string) => Promise<unknown> } } })
      .from("scenarios").delete().eq("user_id", user.id);
    await (supabase as never as { from: (t: string) => { insert: (d: unknown[]) => Promise<unknown> } })
      .from("scenarios").insert([defaultScenario]);
    await (supabase as never as { from: (t: string) => { update: (d: Record<string, unknown>) => { eq: (col: string, val: string) => Promise<unknown> } } })
      .from("profiles").update({ onboarding_completed: true }).eq("id", user.id);
    router.push("/dashboard");
  }

  async function handleStartAnalysis() {
    setSaving(true);
    setSaveError(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }

    const { data: profile } = await (supabase as never as {
      from: (t: string) => { select: (s: string) => { eq: (c: string, v: string) => { single: () => Promise<{ data: { plan_type: string } | null }> } } }
    }).from("profiles").select("plan_type").eq("id", user.id).single();

    // Delete existing scenarios
    await (supabase as never as { from: (t: string) => { delete: () => { eq: (col: string, val: string) => Promise<unknown> } } })
      .from("scenarios").delete().eq("user_id", user.id);

    const allRows = scenarios.filter((s) => s.name).map((s) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _id, ...rest } = s;
      return { ...rest, user_id: user.id, scenario_type: "custom", is_active: true };
    });

    const limit = SCENARIO_LIMITS[profile?.plan_type ?? "discovery"] ?? 3;
    const rows = limit === -1 ? allRows : allRows.slice(0, limit);

    if (rows.length > 0) {
      const { data: inserted, error } = await (supabase as never as {
        from: (t: string) => { insert: (d: unknown[]) => { select: (s: string) => Promise<{ data: { id: string }[] | null; error: { message: string } | null }> } }
      }).from("scenarios").insert(rows).select("id");

      if (error || !inserted) {
        setSaveError(t("saveError"));
        setSaving(false);
        return;
      }

      // Save per-asset overrides for each scenario
      for (let i = 0; i < inserted.length; i++) {
        const scenarioId = inserted[i].id;
        const overrideList = assets.map((a) => ({
          asset_id: a.id,
          outcome: overrides[`${i}:${a.id}`] ?? "not_decided",
          split_pct_me: 50,
        }));
        if (overrideList.length > 0) {
          await fetch(`/api/scenarios/${scenarioId}/asset-overrides`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ overrides: overrideList }),
          });
        }
      }
    }

    const { error: profileError } = await (supabase as never as {
      from: (t: string) => { update: (d: Record<string, unknown>) => { eq: (col: string, val: string) => Promise<{ error: { message: string } | null }> } }
    }).from("profiles").update({ onboarding_completed: true }).eq("id", user.id);

    if (profileError) {
      setSaveError(profileError.message);
      setSaving(false);
      return;
    }

    router.push("/dashboard");
  }

  const nextDisabled = saving || scenarios.some((s) => !s.name);

  return (
    <WizardLayout
      currentStep={6}
      onBack={() => router.push(`/${lang}/onboarding/step-5`)}
      onNext={handleStartAnalysis}
      onSkip={handleSkip}
      skipLabel="Skip for now"
      nextDisabled={nextDisabled}
      nextLabel={t("goToDashboard")}
    >
      <div className="space-y-4">
        <div className="rounded-md bg-[var(--cream)] border border-[var(--sand)] p-3">
          <p className="font-ui text-xs text-[var(--brown)]">
            <strong className="text-[var(--navy)]">{t("intro")}</strong>
          </p>
        </div>

        {scenarios.map((scenario, i) => (
          <div key={i}>
            <p className="font-ui text-xs font-semibold text-[var(--navy)] mb-2 uppercase tracking-wide">{t("scenarioLabel", { n: i + 1 })}</p>
            <ScenarioCard
              scenario={scenario}
              index={i}
              onChange={(field, value) => updateScenario(i, field, value)}
              assets={assets}
              overrides={overrides}
              onOverrideChange={handleOverrideChange}
              t={t}
            />
          </div>
        ))}

        {saveError && (
          <p className="font-ui text-sm text-[var(--red)]">{saveError}</p>
        )}
        <div className={cn("rounded-md border border-[var(--sand)] bg-[var(--cream)] p-3 font-ui text-xs text-[var(--brown)]")}>
          <strong>{t("disclaimerLabel")}:</strong> {t("disclaimer")}
        </div>
      </div>
    </WizardLayout>
  );
}
