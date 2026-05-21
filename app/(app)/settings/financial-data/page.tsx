import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Home, CreditCard, TrendingDown, Users, Pencil, Plus } from "lucide-react";
import { AssetList, DebtList } from "@/components/app/FinancialDataClient";
import { getTranslations } from "next-intl/server";
import { getAppLocale } from "@/lib/get-app-locale";

const VALID_LOCALES = ["en", "tr", "de", "fr", "es", "ar"];

type Asset = { id: string; name: string; category: string; current_value: number; owned_by: string; mortgage_balance: number; purchase_price: number | null };
type Debt = { id: string; name: string; category: string; balance: number; owned_by: string };
type Income = { id: string; person: string; annual_net: number; employment_type: string };
type Child = { id: string; age: number; custody_arrangement: string };

function fmt(n: number) {
  return new Intl.NumberFormat("en", { maximumFractionDigits: 0 }).format(n);
}

export default async function FinancialDataPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const cookieStore = await cookies();
    const lang = cookieStore.get("NEXT_LOCALE")?.value;
    const loc = VALID_LOCALES.includes(lang ?? "") ? lang! : "en";
    redirect(`/${loc}/login`);
  }

  const t = await getTranslations("settings.financialData");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any;

  const [assetsRes, debtsRes, incomeRes, childrenRes] = await Promise.all([
    db.from("assets").select("id, name, category, current_value, owned_by, mortgage_balance, purchase_price").eq("user_id", user.id).order("created_at"),
    db.from("debts").select("id, name, category, balance, owned_by").eq("user_id", user.id).order("created_at"),
    db.from("income").select("id, person, annual_net, employment_type").eq("user_id", user.id).order("created_at"),
    db.from("children").select("id, age, custody_arrangement").eq("user_id", user.id).order("created_at"),
  ]);

  const assets: Asset[] = assetsRes.data ?? [];
  const debts: Debt[] = debtsRes.data ?? [];
  const income: Income[] = incomeRes.data ?? [];
  const children: Child[] = childrenRes.data ?? [];

  const totalAssets = assets.reduce((s, a) => s + (a.current_value ?? 0), 0);
  const totalDebts = debts.reduce((s, d) => s + (d.balance ?? 0), 0);

  const labels = {
    save: t("save"),
    cancel: t("cancel"),
    deleteConfirm: t("deleteConfirm"),
    name: t("name"),
    value: t("value"),
    owner: t("owner"),
    balance: t("balance"),
    joint: t("joint"),
    me: t("me"),
    spouse: t("spouse"),
    mortgageBalance: t("mortgageBalance"),
    purchasePrice: t("purchasePrice"),
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="font-display text-xl font-bold text-[var(--navy)]">{t("title")}</h2>
        <p className="font-ui text-sm text-[var(--brown)] mt-1">{t("desc")}</p>
      </div>

      {/* Assets */}
      <section className="rounded-xl border border-[var(--sand)] bg-white overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--sand)] bg-[var(--cream)]">
          <h3 className="font-ui text-sm font-semibold text-[var(--navy)] flex items-center gap-2">
            <Home size={15} /> {t("assets")}
            {assets.length > 0 && <span className="text-[var(--brown)] font-normal">— {fmt(totalAssets)}</span>}
          </h3>
          <Link href="/onboarding/step-2" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-xs text-[var(--gold)] hover:text-[var(--gold)] gap-1")}>
            <Plus size={12} /> {t("addAsset")}
          </Link>
        </div>
        {assets.length === 0 ? (
          <p className="px-5 py-4 font-ui text-sm text-[var(--brown)]">{t("noAssets")}</p>
        ) : (
          <AssetList initialAssets={assets} labels={labels} />
        )}
      </section>

      {/* Debts */}
      <section className="rounded-xl border border-[var(--sand)] bg-white overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--sand)] bg-[var(--cream)]">
          <h3 className="font-ui text-sm font-semibold text-[var(--navy)] flex items-center gap-2">
            <CreditCard size={15} /> {t("debts")}
            {debts.length > 0 && <span className="text-[var(--red)] font-normal">— {fmt(totalDebts)}</span>}
          </h3>
          <Link href="/onboarding/step-3" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-xs text-[var(--gold)] hover:text-[var(--gold)] gap-1")}>
            <Plus size={12} /> {t("addDebt")}
          </Link>
        </div>
        {debts.length === 0 ? (
          <p className="px-5 py-4 font-ui text-sm text-[var(--brown)]">{t("noDebts")}</p>
        ) : (
          <DebtList initialDebts={debts} labels={labels} />
        )}
      </section>

      {/* Income */}
      <section className="rounded-xl border border-[var(--sand)] bg-white overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--sand)] bg-[var(--cream)]">
          <h3 className="font-ui text-sm font-semibold text-[var(--navy)] flex items-center gap-2">
            <TrendingDown size={15} className="rotate-180" /> {t("income")}
          </h3>
          <Link href="/onboarding/step-4" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-xs text-[var(--gold)] hover:text-[var(--gold)] gap-1")}>
            <Pencil size={12} /> {t("edit")}
          </Link>
        </div>
        {income.length === 0 ? (
          <p className="px-5 py-4 font-ui text-sm text-[var(--brown)]">{t("noIncome")}</p>
        ) : (
          <ul className="divide-y divide-[var(--sand)]">
            {income.map((inc) => (
              <li key={inc.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-2 text-[var(--navy)]">
                  <span className="font-ui text-sm capitalize">{inc.person === "me" ? t("me") : t("spouse")}</span>
                  <span className="font-ui text-xs text-[var(--brown)] capitalize">{inc.employment_type?.replace("_", " ")}</span>
                </div>
                <span className="font-mono text-sm text-[var(--green)]">{fmt(inc.annual_net)} {t("perYear")}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Children */}
      <section className="rounded-xl border border-[var(--sand)] bg-white overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--sand)] bg-[var(--cream)]">
          <h3 className="font-ui text-sm font-semibold text-[var(--navy)] flex items-center gap-2">
            <Users size={15} /> {t("children")}
          </h3>
          <Link href="/onboarding/step-5" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-xs text-[var(--gold)] hover:text-[var(--gold)] gap-1")}>
            <Pencil size={12} /> {t("edit")}
          </Link>
        </div>
        {children.length === 0 ? (
          <p className="px-5 py-4 font-ui text-sm text-[var(--brown)]">{t("noChildren")}</p>
        ) : (
          <ul className="divide-y divide-[var(--sand)]">
            {children.map((c) => (
              <li key={c.id} className="flex items-center justify-between px-5 py-3">
                <span className="font-ui text-sm text-[var(--navy)]">Age {c.age}</span>
                <span className="font-ui text-xs text-[var(--brown)] capitalize">{c.custody_arrangement?.replace(/_/g, " ")}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Link
        href="/onboarding/step-1"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "w-full text-xs text-[var(--brown)] hover:text-[var(--navy)] gap-1.5")}
      >
        <Pencil size={12} /> {t("editStep")}
      </Link>
    </div>
  );
}
