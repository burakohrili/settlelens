"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { WizardLayout } from "@/components/app/WizardLayout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Scenario = {
  id?: string;
  name: string;
  house_outcome: string;
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
    house_outcome: "sell",
    retirement_split_me: 50,
    alimony_monthly: 0,
    alimony_years: 0,
    alimony_direction: "i_receive",
    child_support_monthly: 0,
    child_support_direction: "i_receive",
  };
}

function ScenarioCard({
  scenario,
  onChange,
  houseOptions,
  t,
}: {
  scenario: Scenario;
  onChange: (field: keyof Scenario, value: unknown) => void;
  houseOptions: { value: string; label: string }[];
  t: (key: string) => string;
}) {
  return (
    <div className="rounded-lg border border-[var(--sand)] bg-white p-4 space-y-3">
      <div>
        <Label>{t("scenarioName")}</Label>
        <Input value={scenario.name} onChange={(e) => onChange("name", e.target.value)} className="mt-1" placeholder={t("scenarioNamePlaceholder")} />
      </div>

      <div>
        <Label>{t("houseOutcome")}</Label>
        <select value={scenario.house_outcome} onChange={(e) => onChange("house_outcome", e.target.value)} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 font-ui text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          {houseOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <div>
        <Label>{t("retirementSplit")}</Label>
        <Input type="number" min={0} max={100} value={scenario.retirement_split_me} onChange={(e) => onChange("retirement_split_me", parseFloat(e.target.value) || 50)} className="mt-1" />
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
          <select value={scenario.alimony_direction} onChange={(e) => onChange("alimony_direction", e.target.value)} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 font-ui text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
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
          <select value={scenario.child_support_direction} onChange={(e) => onChange("child_support_direction", e.target.value)} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 font-ui text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
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
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await (supabase as never as { from: (t: string) => { select: (s: string) => { eq: (col: string, val: string) => { limit: (n: number) => Promise<{ data: Scenario[] | null }> } } } })
        .from("scenarios").select("*").eq("user_id", user.id).limit(3);
      if (data && data.length > 0) setScenarios(data);
    }
    load();
  }, [supabase]);

  function updateScenario(i: number, field: keyof Scenario, value: unknown) {
    setScenarios((prev) => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
  }

  const houseOptions = [
    { value: "i_keep", label: t("iKeepHouse") },
    { value: "spouse_keeps", label: t("spouseKeepsHouse") },
    { value: "sell", label: t("weSellHouse") },
    { value: "not_applicable", label: t("noHouse") },
  ];

  async function handleStartAnalysis() {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await (supabase as never as { from: (t: string) => { delete: () => { eq: (col: string, val: string) => Promise<unknown> } } })
        .from("scenarios").delete().eq("user_id", user.id);

      const rows = scenarios.filter((s) => s.name).map((s) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _id, ...rest } = s;
        return { ...rest, user_id: user.id, scenario_type: "custom", is_active: true };
      });

      if (rows.length > 0) {
        const { error } = await (supabase as never as { from: (t: string) => { insert: (d: unknown[]) => Promise<{ error: { message: string } | null }> } })
          .from("scenarios").insert(rows);
        if (error) {
          setSaving(false);
          return;
        }
      }

      const { error: profileError } = await (supabase as never as { from: (t: string) => { update: (d: Record<string, unknown>) => { eq: (col: string, val: string) => Promise<{ error: { message: string } | null }> } } })
        .from("profiles").update({ onboarding_completed: true }).eq("id", user.id);
      if (profileError) {
        setSaveError(profileError.message);
        setSaving(false);
        return;
      }
    }
    router.push("/dashboard");
  }

  const nextDisabled = saving || scenarios.some((s) => !s.name);

  return (
    <WizardLayout
      currentStep={6}
      onBack={() => router.push(`/${lang}/onboarding/step-5`)}
      onNext={handleStartAnalysis}
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
              onChange={(field, value) => updateScenario(i, field, value)}
              houseOptions={houseOptions}
              t={t}
            />
          </div>
        ))}

        {saveError && (
          <p className="font-ui text-sm text-[var(--red)]">{saveError}</p>
        )}
        <div className={cn("rounded-md border border-[var(--sand)] bg-[var(--cream)] p-3 font-ui text-xs text-[var(--brown)]")}>
          <strong>Disclaimer:</strong> {t("disclaimer")}
        </div>
      </div>
    </WizardLayout>
  );
}
