"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { NumericInput } from "@/components/ui/NumericInput";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

type ScenarioForm = {
  name: string;
  house_outcome: string;
  retirement_split_me: number;
  alimony_monthly: number;
  alimony_years: number;
  alimony_direction: string;
  child_support_monthly: number;
  child_support_direction: string;
};

const DEFAULT_FORM: ScenarioForm = {
  name: "",
  house_outcome: "sell",
  retirement_split_me: 50,
  alimony_monthly: 0,
  alimony_years: 0,
  alimony_direction: "i_receive",
  child_support_monthly: 0,
  child_support_direction: "i_receive",
};

export default function NewScenarioPage() {
  const t = useTranslations("onboarding_form.step6");
  const tScenarios = useTranslations("userScenarios");
  const locale = useLocale();
  const router = useRouter();

  const [form, setForm] = useState<ScenarioForm>(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(field: keyof ScenarioForm, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const houseOptions = [
    { value: "i_keep", label: t("iKeepHouse") },
    { value: "spouse_keeps", label: t("spouseKeepsHouse") },
    { value: "sell", label: t("weSellHouse") },
    { value: "not_applicable", label: t("noHouse") },
  ];

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

    router.push(`/scenarios/${json.id as string}`);
  }

  const selectCls = "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 font-ui text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

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

        <div>
          <Label>{t("houseOutcome")}</Label>
          <select value={form.house_outcome} onChange={(e) => update("house_outcome", e.target.value)} className={selectCls}>
            {houseOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div>
          <Label>{t("retirementSplit")} (%)</Label>
          <Input
            type="number" min={0} max={100}
            value={form.retirement_split_me}
            onChange={(e) => update("retirement_split_me", parseFloat(e.target.value) || 50)}
            className="mt-1"
          />
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
              <Label>{t("alimonyDirection")}</Label>
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

      <div className="rounded-md border border-[var(--sand)] bg-[var(--cream)] p-3 font-ui text-xs text-[var(--brown)]">
        <strong>{t("disclaimerLabel")}:</strong> {t("disclaimer")}
      </div>

      <button
        onClick={handleSave}
        disabled={saving || !form.name.trim()}
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
