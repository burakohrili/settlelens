import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Plus, GitBranch, ChevronRight } from "lucide-react";

export default async function ScenariosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/en/login");

  const { data: profile } = await (supabase as never as {
    from: (t: string) => {
      select: (s: string) => {
        eq: (c: string, v: string) => {
          single: () => Promise<{ data: Record<string, unknown> | null }>
        }
      }
    }
  }).from("profiles").select("preferred_language, plan_type").eq("id", user.id).single();

  const lang = (profile?.preferred_language as string) ?? "en";
  const planType = (profile?.plan_type as string) ?? "discovery";
  const t = await getTranslations({ locale: lang, namespace: "dashboard" });

  const { data: scenarios } = await (supabase as never as {
    from: (t: string) => {
      select: (s: string) => {
        eq: (c: string, v: string) => {
          order: (col: string, opts: { ascending: boolean }) => Promise<{ data: Record<string, unknown>[] | null }>
        }
      }
    }
  }).from("scenarios").select("id, name, scenario_type, house_outcome, created_at").eq("user_id", user.id).order("created_at", { ascending: false });

  const scenarioList = scenarios ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--navy)]">
            {t("scenarios") ?? "Scenarios"}
          </h1>
          <p className="font-ui text-sm text-[var(--brown)] mt-1">
            {t("scenariosDesc") ?? "Compare different settlement outcomes"}
          </p>
        </div>
        <Link
          href="/scenarios/offer"
          className={cn(buttonVariants(), "bg-[var(--gold)] text-[var(--navy)] font-semibold hover:bg-[var(--gold)]/90")}
        >
          <Plus size={16} className="mr-1" /> {t("analyzeOffer")}
        </Link>
      </div>

      {scenarioList.length === 0 ? (
        <div className="rounded-xl border border-[var(--sand)] bg-[var(--cream)] p-10 text-center">
          <GitBranch className="mx-auto text-[var(--gold)] mb-3" size={32} />
          <h2 className="font-display text-lg font-bold text-[var(--navy)] mb-2">
            {t("noScenarios") ?? "No scenarios yet"}
          </h2>
          <p className="font-ui text-sm text-[var(--brown)] mb-4 max-w-sm mx-auto">
            {t("noScenariosDesc") ?? "Create your first scenario to compare settlement outcomes."}
          </p>
          <Link
            href="/onboarding/step-6"
            className={cn(buttonVariants(), "bg-[var(--gold)] text-[var(--navy)] font-semibold hover:bg-[var(--gold)]/90")}
          >
            <Plus size={16} className="mr-1" /> {t("buildScenarios")}
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {scenarioList.map((s) => {
            const createdAt = new Date(s.created_at as string).toLocaleDateString(lang, {
              year: "numeric", month: "short", day: "numeric",
            });
            return (
              <Link
                key={s.id as string}
                href={`/scenarios/${s.id}`}
                className="flex items-center justify-between rounded-xl border border-[var(--sand)] bg-white p-4 hover:border-[var(--gold)]/60 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--cream)] border border-[var(--sand)]">
                    <GitBranch size={16} className="text-[var(--navy)]" />
                  </div>
                  <div>
                    <p className="font-ui text-sm font-semibold text-[var(--navy)]">{s.name as string}</p>
                    <p className="font-ui text-xs text-[var(--brown)] mt-0.5 capitalize">
                      {(s.scenario_type as string)?.replace("_", " ")} · {createdAt}
                    </p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-[var(--brown)] group-hover:text-[var(--gold)] transition-colors" />
              </Link>
            );
          })}
        </div>
      )}

      {planType === "discovery" && scenarioList.length > 0 && (
        <div className="rounded-xl border border-[var(--gold)]/40 bg-[var(--gold)]/5 p-4 text-center">
          <p className="font-ui text-sm text-[var(--navy)] font-semibold mb-1">
            {t("upgradeToRun")}
          </p>
          <Link
            href="/upgrade"
            className={cn(buttonVariants({ size: "sm" }), "mt-2 bg-[var(--gold)] text-[var(--navy)] font-semibold hover:bg-[var(--gold)]/90")}
          >
            {t("upgradeToRun")}
          </Link>
        </div>
      )}
    </div>
  );
}
