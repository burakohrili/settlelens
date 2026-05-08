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

type Child = {
  id?: string;
  age: number;
  custody_arrangement: string;
};

const CUSTODY_OPTIONS = [
  { value: "joint_50_50", label: "Joint 50/50" },
  { value: "primary_me", label: "Primary — Me" },
  { value: "primary_spouse", label: "Primary — Spouse" },
  { value: "other", label: "Other / TBD" },
];

function newChild(): Child {
  return { age: 0, custody_arrangement: "joint_50_50" };
}

export default function Step5Page() {
  const router = useRouter();
  const params = useParams();
  const lang = (params.lang as string) ?? "en";
  const supabase = createClient();

  const [hasChildren, setHasChildren] = useState<boolean | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await (supabase as never as { from: (t: string) => { select: (s: string) => { eq: (col: string, val: string) => Promise<{ data: Child[] | null }> } } })
        .from("children").select("*").eq("user_id", user.id);
      if (data && data.length > 0) { setHasChildren(true); setChildren(data); }
    }
    load();
  }, [supabase]);

  function updateChild(i: number, field: keyof Child, value: unknown) {
    setChildren((prev) => prev.map((c, idx) => idx === i ? { ...c, [field]: value } : c));
  }

  async function handleNext() {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await (supabase as never as { from: (t: string) => { delete: () => { eq: (col: string, val: string) => Promise<unknown> } } })
        .from("children").delete().eq("user_id", user.id);
      if (hasChildren && children.length > 0) {
        const rows = children.map((c) => ({ ...c, user_id: user.id, id: undefined }));
        await (supabase as never as { from: (t: string) => { insert: (d: unknown[]) => Promise<unknown> } })
          .from("children").insert(rows);
      }
    }
    router.push(`/${lang}/onboarding/step-6`);
  }

  const nextDisabled = saving || (hasChildren === true && children.some((c) => !c.age));

  return (
    <WizardLayout
      currentStep={5}
      onBack={() => router.push(`/${lang}/onboarding/step-4`)}
      onNext={handleNext}
      nextDisabled={nextDisabled}
    >
      <div className="space-y-4">
        {hasChildren === null && (
          <div>
            <p className="font-ui text-sm font-semibold text-[var(--navy)] mb-3">Do you have any minor children (under 18)?</p>
            <div className="flex gap-3">
              <button onClick={() => { setHasChildren(true); setChildren([newChild()]); }} className={cn(buttonVariants({ variant: "outline" }), "flex-1 border-[var(--sand)]")}>Yes</button>
              <button onClick={() => setHasChildren(false)} className={cn(buttonVariants({ variant: "outline" }), "flex-1 border-[var(--sand)]")}>No, skip</button>
            </div>
          </div>
        )}

        {hasChildren === false && (
          <p className="font-ui text-sm text-[var(--brown)] italic">No children entered. Click Continue to proceed.</p>
        )}

        {hasChildren === true && (
          <>
            <p className="font-ui text-xs text-[var(--brown)]">Enter each child&apos;s age and expected custody arrangement. This helps model child support projections.</p>

            {children.map((child, i) => (
              <div key={i} className="rounded-lg border border-[var(--sand)] bg-white p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <div>
                      <Label>Age</Label>
                      <Input
                        type="number"
                        min={0}
                        max={17}
                        value={child.age || ""}
                        onChange={(e) => updateChild(i, "age", parseInt(e.target.value) || 0)}
                        placeholder="0–17"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Custody arrangement</Label>
                      <select
                        value={child.custody_arrangement}
                        onChange={(e) => updateChild(i, "custody_arrangement", e.target.value)}
                        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 font-ui text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {CUSTODY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </div>
                  </div>
                  {children.length > 1 && (
                    <button onClick={() => setChildren((prev) => prev.filter((_, idx) => idx !== i))} className="mt-1 text-[var(--danger)] hover:opacity-70">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button onClick={() => setChildren((prev) => [...prev, newChild()])} className={cn(buttonVariants({ variant: "outline" }), "w-full border-dashed border-[var(--sand)] text-[var(--brown)]")}>
              <Plus size={16} className="mr-1" /> Add child
            </button>

            <div className="rounded-md border border-[var(--sand)] bg-[var(--cream)] p-3 font-ui text-xs text-[var(--brown)]">
              <strong>Note:</strong> Custody arrangements are assumptions for financial modeling only. Actual custody determinations are made by courts based on best interest of the child. Discuss custody with a qualified family law attorney.
            </div>
          </>
        )}
      </div>
    </WizardLayout>
  );
}
