"use client";

import { useState } from "react";
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
  const locale = useLocale();
  const router = useRouter();
  const supabase = createClient();

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

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push(`/${locale}/login`);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error: insertError } = await (supabase as any)
      .from("scenarios")
      .insert({
        user_id: user.id,
        name: form.name.trim(),
        scenario_type: "custom",
        house_outcome: form.house_outcome,
        retirement_split_me: form.retirement_split_me,
        alimony_monthly: form.alimony_monthly,
        alimony_years: form.alimony_years,
        alimony_direction: form.alimony_direction,
        child_support_monthly: form.child_support_monthly,
        child_support_direction: form.child_support_direction,
        is_active: true,
      })
      .select("id")
      .single();

    if (insertError || !data) {
      setError("Could not save scenario. Please try again.");
      setSaving(false);
      return;
    }

    router.push(`/scenarios/${data.id as string}`);
  }

  const selectCls = "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 font-ui text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-center gap-3">
        <Link href="/scenarios" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-[var(--brown)]")}>
          <ArrowLeft size={16} className="mr-1" />
          {locale === "tr" ? "Senaryolar" : locale === "de" ? "Szenarien" : locale === "fr" ? "Scénarios" : locale === "es" ? "Escenarios" : "Scenarios"}
        </Link>
      </div>

      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--navy)]">
          {locale === "tr" ? "Yeni Senaryo" : locale === "de" ? "Neues Szenario" : locale === "fr" ? "Nouveau scénario" : locale === "es" ? "Nuevo escenario" : "New Scenario"}
        </h1>
        <p className="font-ui text-sm text-[var(--brown)] mt-1">
          {locale === "tr" ? "Farklı bir anlaşma pozisyonu modelle." : locale === "de" ? "Modellieren Sie eine andere Verhandlungsposition." : locale === "fr" ? "Modélisez une position de négociation différente." : locale === "es" ? "Modela una posición de negociación diferente." : "Model a different settlement position."}
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
            {locale === "tr" ? "Nafaka" : locale === "de" ? "Unterhalt" : locale === "fr" ? "Pension alimentaire" : locale === "es" ? "Pensión compensatoria" : "Alimony"}
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
            {locale === "tr" ? "Çocuk Nafakası" : locale === "de" ? "Kindesunterhalt" : locale === "fr" ? "Pension pour enfants" : locale === "es" ? "Pensión de alimentos" : "Child Support"}
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
        <strong>Disclaimer:</strong> {t("disclaimer")}
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
        {saving
          ? (locale === "tr" ? "Kaydediliyor..." : locale === "de" ? "Wird gespeichert..." : locale === "fr" ? "Enregistrement..." : locale === "es" ? "Guardando..." : "Saving...")
          : (locale === "tr" ? "Senaryoyu Kaydet" : locale === "de" ? "Szenario speichern" : locale === "fr" ? "Enregistrer le scénario" : locale === "es" ? "Guardar escenario" : "Save Scenario")}
      </button>
    </div>
  );
}
