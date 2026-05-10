"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { WizardLayout } from "@/components/app/WizardLayout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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

const DEBT_CATEGORIES = [
  { value: "mortgage", label: "🏠 Mortgage" },
  { value: "car_loan", label: "🚗 Car Loan" },
  { value: "credit_card", label: "💳 Credit Card" },
  { value: "student_loan", label: "🎓 Student Loan" },
  { value: "personal_loan", label: "📄 Personal Loan" },
  { value: "other", label: "📦 Other" },
];

function newDebt(): Debt {
  return { name: "", category: "credit_card", balance: 0, monthly_payment: 0, interest_rate: 0, owned_by: "joint" };
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export default function Step3Page() {
  const t = useTranslations("onboarding_form.step3");
  const router = useRouter();
  const params = useParams();
  const lang = (params.lang as string) ?? "en";
  const supabase = createClient();
  const [debts, setDebts] = useState<Debt[]>([]);
  const [hasDebts, setHasDebts] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
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
    const { data: { user } } = await supabase.auth.getUser();
    if (user && hasDebts && debts.length > 0) {
      await (supabase as never as { from: (t: string) => { delete: () => { eq: (col: string, val: string) => Promise<unknown> } } })
        .from("debts").delete().eq("user_id", user.id);
      const rows = debts.filter((d) => d.name).map((d) => ({ ...d, user_id: user.id, id: undefined }));
      if (rows.length > 0) {
        await (supabase as never as { from: (t: string) => { insert: (d: unknown[]) => Promise<unknown> } })
          .from("debts").insert(rows);
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
                      <Label>{t("debtName")}</Label>
                      <Input value={debt.name} onChange={(e) => updateDebt(i, "name", e.target.value)} placeholder={t("debtNamePlaceholder")} className="mt-1" />
                    </div>
                    <div>
                      <Label>{t("category")}</Label>
                      <select value={debt.category} onChange={(e) => updateDebt(i, "category", e.target.value)} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 font-ui text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        {DEBT_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <Label>{t("ownedBy")}</Label>
                      <select value={debt.owned_by} onChange={(e) => updateDebt(i, "owned_by", e.target.value)} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 font-ui text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        <option value="joint">{t("joint")}</option>
                        <option value="me">{t("me")}</option>
                        <option value="spouse">{t("spouse")}</option>
                      </select>
                    </div>
                    <div>
                      <Label>{t("balance")}</Label>
                      <Input type="number" min={0} value={debt.balance || ""} onChange={(e) => updateDebt(i, "balance", parseFloat(e.target.value) || 0)} className="mt-1" />
                    </div>
                    <div>
                      <Label>{t("monthlyPayment")}</Label>
                      <Input type="number" min={0} value={debt.monthly_payment || ""} onChange={(e) => updateDebt(i, "monthly_payment", parseFloat(e.target.value) || 0)} className="mt-1" />
                    </div>
                    <div>
                      <Label>{t("interestRate")}</Label>
                      <Input type="number" min={0} max={100} step={0.1} value={debt.interest_rate || ""} onChange={(e) => updateDebt(i, "interest_rate", parseFloat(e.target.value) || 0)} className="mt-1" />
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
              <div className="flex justify-between"><span className="text-[var(--brown)]">{t("totalBalance")}</span><span className="font-semibold text-[var(--danger)]">{fmt(totalBalance)}</span></div>
              <div className="flex justify-between"><span className="text-[var(--brown)]">{t("monthlyPayments")}</span><span className="font-semibold">{fmt(totalMonthly)}/mo</span></div>
            </div>
          </>
        )}
      </div>
    </WizardLayout>
  );
}
