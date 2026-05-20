"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { formatMoney } from "@/lib/money";
import { getCurrency } from "@/lib/jurisdiction";
import { WizardLayout } from "@/components/app/WizardLayout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { NumericInput } from "@/components/ui/NumericInput";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

type Debt = {
  id?: string;
  name: string;
  category: string;
  balance: number;
  monthly_payment: number;
  interest_rate: number;
  owned_by: "joint" | "me" | "spouse";
};

const DEBT_CATEGORY_VALUES = ["mortgage", "car_loan", "credit_card", "student_loan", "personal_loan", "other"] as const;
const DEBT_ICONS: Record<string, string> = {
  mortgage: "🏠", car_loan: "🚗", credit_card: "💳",
  student_loan: "🎓", personal_loan: "📄", other: "📦",
};

function newDebt(): Debt {
  return { name: "", category: "credit_card", balance: 0, monthly_payment: 0, interest_rate: 0, owned_by: "joint" };
}

export default function Step3Page() {
  const t = useTranslations("onboarding_form.step3");
  const locale = useLocale();
  const router = useRouter();
  const params = useParams();
  const lang = (params.lang as string) ?? "en";
  const supabase = createClient();
  const [debts, setDebts] = useState<Debt[]>([]);
  const [hasDebts, setHasDebts] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await (supabase as never as { from: (t: string) => { select: (s: string) => { eq: (col: string, val: string) => { single: () => Promise<{ data: Record<string, unknown> | null }> } } } })
        .from("profiles").select("country").eq("id", user.id).single();
      if (profile?.country) setCurrency(getCurrency(profile.country as string));
      const { data } = await (supabase as never as { from: (t: string) => { select: (s: string) => { eq: (col: string, val: string) => Promise<{ data: Debt[] | null }> } } })
        .from("debts").select("*").eq("user_id", user.id);
      if (data && data.length > 0) { setHasDebts(true); setDebts(data); }
    }
    load();
  }, [supabase]);

  function updateDebt(i: number, field: keyof Debt, value: unknown) {
    setDebts((prev) => prev.map((d, idx) => idx === i ? { ...d, [field]: value } : d));
  }

  const totalBalance = debts.reduce((s, d) => s + (d.balance || 0), 0);
  const totalMonthly = debts.reduce((s, d) => s + (d.monthly_payment || 0), 0);

  async function handleNext() {
    setSaving(true);
    setSaveError(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (user && hasDebts && debts.length > 0) {
      const { error: deleteError } = await (supabase as never as { from: (t: string) => { delete: () => { eq: (col: string, val: string) => Promise<{ error: unknown }> } } })
        .from("debts").delete().eq("user_id", user.id);
      if (deleteError) {
        console.error("[step-3] debt delete error:", deleteError);
        setSaveError(t("saveError"));
        setSaving(false);
        return;
      }
      const rows = debts.filter((d) => d.name).map((d) => ({ ...d, user_id: user.id, id: undefined }));
      if (rows.length > 0) {
        const { error: insertError } = await (supabase as never as { from: (t: string) => { insert: (d: unknown[]) => Promise<{ error: unknown }> } })
          .from("debts").insert(rows);
        if (insertError) {
          console.error("[step-3] debt insert error:", insertError);
          setSaveError(t("saveError"));
          setSaving(false);
          return;
        }
      }
    }
    router.push(`/${lang}/onboarding/step-4`);
  }

  return (
    <WizardLayout
      currentStep={3}
      onBack={() => router.push(`/${lang}/onboarding/step-2`)}
      onNext={handleNext}
      nextDisabled={saving || (hasDebts === true && debts.some((d) => !d.name))}
    >
      <div className="space-y-4">
        {saveError && (
          <p role="alert" className="rounded-md bg-red-50 border border-red-200 px-3 py-2 font-ui text-sm text-red-700">{saveError}</p>
        )}
        {hasDebts === null && (
          <div>
            <p className="font-ui text-sm font-semibold text-[var(--navy)] mb-3">{t("hasDebts")}</p>
            <div className="flex gap-3">
              <button onClick={() => { setHasDebts(true); setDebts([newDebt()]); }} className={cn(buttonVariants({ variant: "outline" }), "flex-1 border-[var(--sand)]")}>{t("yes")}</button>
              <button onClick={() => setHasDebts(false)} className={cn(buttonVariants({ variant: "outline" }), "flex-1 border-[var(--sand)]")}>{t("noSkip")}</button>
            </div>
          </div>
        )}

        {hasDebts === false && (
          <p className="font-ui text-sm text-[var(--brown)] italic">{t("noDebts")}</p>
        )}

        {hasDebts === true && (
          <>
            {debts.map((debt, i) => (
              <div key={i} className="rounded-lg border border-[var(--sand)] bg-white p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <Label htmlFor={`debt-name-${i}`}>{t("debtName")}</Label>
                      <Input id={`debt-name-${i}`} value={debt.name} onChange={(e) => updateDebt(i, "name", e.target.value)} placeholder={t("debtNamePlaceholder")} className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor={`debt-category-${i}`}>{t("category")}</Label>
                      <select id={`debt-category-${i}`} value={debt.category} onChange={(e) => updateDebt(i, "category", e.target.value)} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 font-ui text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        {DEBT_CATEGORY_VALUES.map((v) => <option key={v} value={v}>{DEBT_ICONS[v]} {t(`cat_${v}`)}</option>)}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor={`debt-owner-${i}`}>{t("ownedBy")}</Label>
                      <select id={`debt-owner-${i}`} value={debt.owned_by} onChange={(e) => updateDebt(i, "owned_by", e.target.value)} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 font-ui text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        <option value="joint">{t("joint")}</option>
                        <option value="me">{t("me")}</option>
                        <option value="spouse">{t("spouse")}</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor={`debt-balance-${i}`}>{t("balance")}</Label>
                      <NumericInput value={debt.balance} onChange={(v) => updateDebt(i, "balance", v)} min={0} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 font-ui text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                    </div>
                    <div>
                      <Label htmlFor={`debt-payment-${i}`}>{t("monthlyPayment")}</Label>
                      <NumericInput value={debt.monthly_payment} onChange={(v) => updateDebt(i, "monthly_payment", v)} min={0} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 font-ui text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                    </div>
                    <div>
                      <Label htmlFor={`debt-rate-${i}`}>{t("interestRate")}</Label>
                      <Input id={`debt-rate-${i}`} type="number" min={0} max={100} step={0.1} value={debt.interest_rate || ""} onChange={(e) => updateDebt(i, "interest_rate", parseFloat(e.target.value) || 0)} className="mt-1" />
                    </div>
                  </div>
                  {debts.length > 1 && (
                    <button onClick={() => setDebts((prev) => prev.filter((_, idx) => idx !== i))} className="mt-1 text-[var(--danger)] hover:opacity-70"><Trash2 size={16} /></button>
                  )}
                </div>
              </div>
            ))}

            <button onClick={() => setDebts((prev) => [...prev, newDebt()])} className={cn(buttonVariants({ variant: "outline" }), "w-full border-dashed border-[var(--sand)] text-[var(--brown)]")}>
              <Plus size={16} className="mr-1" /> {t("addDebt")}
            </button>

            <div className="rounded-md border border-[var(--sand)] bg-[var(--cream)] p-3 font-ui text-sm">
              <div className="flex justify-between"><span className="text-[var(--brown)]">{t("totalBalance")}</span><span className="font-semibold text-[var(--danger)]">{formatMoney(totalBalance, currency, locale)}</span></div>
              <div className="flex justify-between"><span className="text-[var(--brown)]">{t("monthlyPayments")}</span><span className="font-semibold">{formatMoney(totalMonthly, currency, locale)}/mo</span></div>
            </div>
          </>
        )}
      </div>
    </WizardLayout>
  );
}
