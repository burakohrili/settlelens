"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { WizardLayout } from "@/components/app/WizardLayout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type IncomeRow = {
  id?: string;
  person: "me" | "spouse";
  annual_gross: number;
  annual_net: number;
  employment_type: string;
  other_income_annual: number;
};

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function newIncome(person: "me" | "spouse"): IncomeRow {
  return { person, annual_gross: 0, annual_net: 0, employment_type: "employed", other_income_annual: 0 };
}

export default function Step4Page() {
  const t = useTranslations("onboarding_form.step4");
  const router = useRouter();
  const params = useParams();
  const lang = (params.lang as string) ?? "en";
  const supabase = createClient();

  const [me, setMe] = useState<IncomeRow>(newIncome("me"));
  const [spouse, setSpouse] = useState<IncomeRow>(newIncome("spouse"));
  const [spouseUnknown, setSpouseUnknown] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await (supabase as never as { from: (t: string) => { select: (s: string) => { eq: (col: string, val: string) => Promise<{ data: IncomeRow[] | null }> } } })
        .from("income").select("*").eq("user_id", user.id);
      if (data) {
        const myRow = data.find((r) => r.person === "me");
        const spouseRow = data.find((r) => r.person === "spouse");
        if (myRow) setMe(myRow);
        if (spouseRow) setSpouse(spouseRow);
      }
    }
    load();
  }, [supabase]);

  function updateMe(field: keyof IncomeRow, value: unknown) {
    setMe((prev) => ({ ...prev, [field]: value }));
  }

  function updateSpouse(field: keyof IncomeRow, value: unknown) {
    setSpouse((prev) => ({ ...prev, [field]: value }));
  }

  async function handleNext() {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await (supabase as never as { from: (t: string) => { delete: () => { eq: (col: string, val: string) => Promise<unknown> } } })
        .from("income").delete().eq("user_id", user.id);

      const rows = [
        { ...me, user_id: user.id, id: undefined },
        ...(!spouseUnknown ? [{ ...spouse, user_id: user.id, id: undefined }] : [
          { ...newIncome("spouse"), user_id: user.id, annual_gross: -1, annual_net: -1 },
        ]),
      ];
      await (supabase as never as { from: (t: string) => { insert: (d: unknown[]) => Promise<unknown> } })
        .from("income").insert(rows);
    }
    router.push(`/${lang}/onboarding/step-5`);
  }

  const totalHousehold = (me.annual_net || 0) + (spouseUnknown ? 0 : (spouse.annual_net || 0));
  const nextDisabled = saving || !me.annual_gross;

  const employmentOptions = [
    { value: "employed", label: t("employed") },
    { value: "self_employed", label: t("selfEmployed") },
    { value: "part_time", label: t("partTime") },
    { value: "retired", label: t("retired") },
    { value: "unemployed", label: t("unemployed") },
  ];

  return (
    <WizardLayout
      currentStep={4}
      onBack={() => router.push(`/${lang}/onboarding/step-3`)}
      onNext={handleNext}
      nextDisabled={nextDisabled}
    >
      <div className="space-y-6">
        <div className="rounded-lg border border-[var(--sand)] bg-white p-4">
          <p className="font-ui text-sm font-semibold text-[var(--navy)] mb-3">{t("myIncome")}</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>{t("annualGross")}</Label>
              <Input type="number" min={0} value={me.annual_gross || ""} onChange={(e) => updateMe("annual_gross", parseFloat(e.target.value) || 0)} className="mt-1" />
            </div>
            <div>
              <Label>{t("annualNet")}</Label>
              <Input type="number" min={0} value={me.annual_net || ""} onChange={(e) => updateMe("annual_net", parseFloat(e.target.value) || 0)} className="mt-1" />
            </div>
            <div className="col-span-2">
              <Label>{t("employmentType")}</Label>
              <select value={me.employment_type} onChange={(e) => updateMe("employment_type", e.target.value)} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 font-ui text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {employmentOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <Label>{t("otherIncome")} <span className="text-[var(--brown)] font-normal">{t("otherIncomeHint")}</span></Label>
              <Input type="number" min={0} value={me.other_income_annual || ""} onChange={(e) => updateMe("other_income_annual", parseFloat(e.target.value) || 0)} className="mt-1" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[var(--sand)] bg-white p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="font-ui text-sm font-semibold text-[var(--navy)]">{t("spouseIncome")}</p>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={spouseUnknown}
                onChange={(e) => setSpouseUnknown(e.target.checked)}
                className="h-4 w-4 accent-[var(--gold)]"
              />
              <span className="font-ui text-xs text-[var(--brown)]">{t("iDontKnow")}</span>
            </label>
          </div>

          {spouseUnknown ? (
            <p className="font-ui text-xs text-[var(--brown)] italic">{t("spouseUnknownNote")}</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>{t("annualGross")}</Label>
                <Input type="number" min={0} value={spouse.annual_gross || ""} onChange={(e) => updateSpouse("annual_gross", parseFloat(e.target.value) || 0)} className="mt-1" />
              </div>
              <div>
                <Label>{t("annualNet")}</Label>
                <Input type="number" min={0} value={spouse.annual_net || ""} onChange={(e) => updateSpouse("annual_net", parseFloat(e.target.value) || 0)} className="mt-1" />
              </div>
              <div className="col-span-2">
                <Label>{t("employmentType")}</Label>
                <select value={spouse.employment_type} onChange={(e) => updateSpouse("employment_type", e.target.value)} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 font-ui text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {employmentOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <Label>{t("otherIncome")}</Label>
                <Input type="number" min={0} value={spouse.other_income_annual || ""} onChange={(e) => updateSpouse("other_income_annual", parseFloat(e.target.value) || 0)} className="mt-1" />
              </div>
            </div>
          )}
        </div>

        {totalHousehold > 0 && (
          <div className={cn("rounded-md border border-[var(--sand)] bg-[var(--cream)] p-3 font-ui text-sm")}>
            <div className="flex justify-between">
              <span className="text-[var(--brown)]">{t("combinedNet")}</span>
              <span className="font-semibold text-[var(--navy)]">{fmt(totalHousehold)}/yr</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[var(--brown)]">{t("monthly")}</span>
              <span className="font-semibold">{fmt(totalHousehold / 12)}/mo</span>
            </div>
          </div>
        )}
      </div>
    </WizardLayout>
  );
}
