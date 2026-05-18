import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Home, CreditCard, TrendingDown, Users, Pencil } from "lucide-react";
import { AssetList, DebtList } from "@/components/app/FinancialDataClient";

const VALID_LOCALES = ["en", "tr", "de", "fr", "es", "ar"];

function getLocale(preferred: string | null | undefined, cookie: string | null | undefined): string {
  if (preferred && VALID_LOCALES.includes(preferred)) return preferred;
  if (cookie && VALID_LOCALES.includes(cookie)) return cookie;
  return "en";
}

type Asset = { id: string; name: string; category: string; current_value: number; owned_by: string; mortgage_balance: number };
type Debt = { id: string; name: string; category: string; balance: number; owned_by: string };
type Income = { id: string; person: string; annual_net: number; employment_type: string };
type Child = { id: string; age: number; custody_arrangement: string };

function fmt(n: number) {
  return new Intl.NumberFormat("en", { maximumFractionDigits: 0 }).format(n);
}

const LABELS: Record<string, { assets: string; debts: string; income: string; children: string; edit: string; noAssets: string; noDebts: string; noIncome: string; noChildren: string; title: string; desc: string; editStep: string; save: string; cancel: string; deleteConfirm: string; name: string; value: string; owner: string; balance: string }> = {
  en: { title: "Financial Data", desc: "Review your assets, debts, income, and children entered during onboarding. Use the edit buttons to update each section.", assets: "Assets", debts: "Debts", income: "Income", children: "Children", edit: "Edit", noAssets: "No assets added yet.", noDebts: "No debts added yet.", noIncome: "No income data yet.", noChildren: "No children added.", editStep: "Update in setup wizard", save: "Save", cancel: "Cancel", deleteConfirm: "Confirm delete", name: "Name", value: "Value", owner: "Owner", balance: "Balance" },
  tr: { title: "Finansal Veriler", desc: "Kurulum sırasında girdiğiniz varlıkları, borçları, geliri ve çocukları gözden geçirin. Güncelleme için düzenle butonlarını kullanın.", assets: "Varlıklar", debts: "Borçlar", income: "Gelir", children: "Çocuklar", edit: "Düzenle", noAssets: "Henüz varlık eklenmedi.", noDebts: "Henüz borç eklenmedi.", noIncome: "Henüz gelir bilgisi yok.", noChildren: "Henüz çocuk eklenmedi.", editStep: "Kurulum sihirbazında güncelle", save: "Kaydet", cancel: "İptal", deleteConfirm: "Silmeyi onayla", name: "Ad", value: "Değer", owner: "Sahip", balance: "Bakiye" },
  de: { title: "Finanzdaten", desc: "Überprüfen Sie die beim Onboarding eingegebenen Vermögenswerte, Schulden, Einkommen und Kinder.", assets: "Vermögen", debts: "Schulden", income: "Einkommen", children: "Kinder", edit: "Bearbeiten", noAssets: "Noch keine Vermögenswerte.", noDebts: "Noch keine Schulden.", noIncome: "Noch keine Einkommensdaten.", noChildren: "Noch keine Kinder.", editStep: "Im Setup-Assistenten bearbeiten", save: "Speichern", cancel: "Abbrechen", deleteConfirm: "Löschen bestätigen", name: "Name", value: "Wert", owner: "Besitzer", balance: "Guthaben" },
  fr: { title: "Données financières", desc: "Consultez vos actifs, dettes, revenus et enfants saisis lors de l'initialisation.", assets: "Actifs", debts: "Dettes", income: "Revenus", children: "Enfants", edit: "Modifier", noAssets: "Aucun actif ajouté.", noDebts: "Aucune dette ajoutée.", noIncome: "Pas de données de revenus.", noChildren: "Aucun enfant ajouté.", editStep: "Modifier dans l'assistant", save: "Enregistrer", cancel: "Annuler", deleteConfirm: "Confirmer la suppression", name: "Nom", value: "Valeur", owner: "Propriétaire", balance: "Solde" },
  es: { title: "Datos financieros", desc: "Revisa tus activos, deudas, ingresos e hijos introducidos durante la configuración.", assets: "Activos", debts: "Deudas", income: "Ingresos", children: "Hijos", edit: "Editar", noAssets: "Aún no se han añadido activos.", noDebts: "Aún no se han añadido deudas.", noIncome: "No hay datos de ingresos.", noChildren: "No se han añadido hijos.", editStep: "Editar en el asistente", save: "Guardar", cancel: "Cancelar", deleteConfirm: "Confirmar eliminación", name: "Nombre", value: "Valor", owner: "Propietario", balance: "Saldo" },
  ar: { title: "البيانات المالية", desc: "راجع أصولك وديونك ودخلك وأطفالك المُدخَلة أثناء الإعداد.", assets: "الأصول", debts: "الديون", income: "الدخل", children: "الأطفال", edit: "تعديل", noAssets: "لم تُضَف أصول بعد.", noDebts: "لم تُضَف ديون بعد.", noIncome: "لا توجد بيانات دخل.", noChildren: "لم يُضَف أطفال.", editStep: "التعديل في معالج الإعداد", save: "حفظ", cancel: "إلغاء", deleteConfirm: "تأكيد الحذف", name: "الاسم", value: "القيمة", owner: "المالك", balance: "الرصيد" },
};

export default async function FinancialDataPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const cookieStore = await cookies();
    const lang = cookieStore.get("NEXT_LOCALE")?.value;
    const loc = VALID_LOCALES.includes(lang ?? "") ? lang! : "en";
    redirect(`/${loc}/login`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any;

  const [profileRes, assetsRes, debtsRes, incomeRes, childrenRes] = await Promise.all([
    db.from("profiles").select("preferred_language").eq("id", user.id).single(),
    db.from("assets").select("id, name, category, current_value, owned_by, mortgage_balance").eq("user_id", user.id).order("created_at"),
    db.from("debts").select("id, name, category, balance, owned_by").eq("user_id", user.id).order("created_at"),
    db.from("income").select("id, person, annual_net, employment_type").eq("user_id", user.id).order("created_at"),
    db.from("children").select("id, age, custody_arrangement").eq("user_id", user.id).order("created_at"),
  ]);

  const cookieStore = await cookies();
  const cookieLang = cookieStore.get("NEXT_LOCALE")?.value;
  const locale = getLocale(profileRes?.data?.preferred_language as string, cookieLang);
  const L = LABELS[locale] ?? LABELS.en;

  const assets: Asset[] = assetsRes.data ?? [];
  const debts: Debt[] = debtsRes.data ?? [];
  const income: Income[] = incomeRes.data ?? [];
  const children: Child[] = childrenRes.data ?? [];

  const totalAssets = assets.reduce((s, a) => s + (a.current_value ?? 0), 0);
  const totalDebts = debts.reduce((s, d) => s + (d.balance ?? 0), 0);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="font-display text-xl font-bold text-[var(--navy)]">{L.title}</h2>
        <p className="font-ui text-sm text-[var(--brown)] mt-1">{L.desc}</p>
      </div>

      {/* Assets */}
      <section className="rounded-xl border border-[var(--sand)] bg-white overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--sand)] bg-[var(--cream)]">
          <h3 className="font-ui text-sm font-semibold text-[var(--navy)] flex items-center gap-2">
            <Home size={15} /> {L.assets}
            {assets.length > 0 && <span className="text-[var(--brown)] font-normal">— {fmt(totalAssets)}</span>}
          </h3>
          <Link href="/onboarding/step-2" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-xs text-[var(--gold)] hover:text-[var(--gold)] gap-1")}>
            <Pencil size={12} /> {L.edit}
          </Link>
        </div>
        {assets.length === 0 ? (
          <p className="px-5 py-4 font-ui text-sm text-[var(--brown)]">{L.noAssets}</p>
        ) : (
          <AssetList
            initialAssets={assets}
            labels={{ save: L.save, cancel: L.cancel, deleteConfirm: L.deleteConfirm, name: L.name, value: L.value, owner: L.owner, balance: L.balance }}
          />
        )}
      </section>

      {/* Debts */}
      <section className="rounded-xl border border-[var(--sand)] bg-white overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--sand)] bg-[var(--cream)]">
          <h3 className="font-ui text-sm font-semibold text-[var(--navy)] flex items-center gap-2">
            <CreditCard size={15} /> {L.debts}
            {debts.length > 0 && <span className="text-[var(--red)] font-normal">— {fmt(totalDebts)}</span>}
          </h3>
          <Link href="/onboarding/step-3" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-xs text-[var(--gold)] hover:text-[var(--gold)] gap-1")}>
            <Pencil size={12} /> {L.edit}
          </Link>
        </div>
        {debts.length === 0 ? (
          <p className="px-5 py-4 font-ui text-sm text-[var(--brown)]">{L.noDebts}</p>
        ) : (
          <DebtList
            initialDebts={debts}
            labels={{ save: L.save, cancel: L.cancel, deleteConfirm: L.deleteConfirm, name: L.name, value: L.value, owner: L.owner, balance: L.balance }}
          />
        )}
      </section>

      {/* Income */}
      <section className="rounded-xl border border-[var(--sand)] bg-white overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--sand)] bg-[var(--cream)]">
          <h3 className="font-ui text-sm font-semibold text-[var(--navy)] flex items-center gap-2">
            <TrendingDown size={15} className="rotate-180" /> {L.income}
          </h3>
          <Link href="/onboarding/step-4" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-xs text-[var(--gold)] hover:text-[var(--gold)] gap-1")}>
            <Pencil size={12} /> {L.edit}
          </Link>
        </div>
        {income.length === 0 ? (
          <p className="px-5 py-4 font-ui text-sm text-[var(--brown)]">{L.noIncome}</p>
        ) : (
          <ul className="divide-y divide-[var(--sand)]">
            {income.map((inc) => (
              <li key={inc.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-2 text-[var(--navy)]">
                  <span className="font-ui text-sm capitalize">{inc.person === "me" ? (locale === "tr" ? "Ben" : locale === "de" ? "Ich" : locale === "fr" ? "Moi" : locale === "es" ? "Yo" : "Me") : (locale === "tr" ? "Eş" : locale === "de" ? "Ehepartner" : locale === "fr" ? "Conjoint(e)" : locale === "es" ? "Cónyuge" : "Spouse")}</span>
                  <span className="font-ui text-xs text-[var(--brown)] capitalize">{inc.employment_type?.replace("_", " ")}</span>
                </div>
                <span className="font-mono text-sm text-[var(--green)]">{fmt(inc.annual_net)} / yr</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Children */}
      <section className="rounded-xl border border-[var(--sand)] bg-white overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--sand)] bg-[var(--cream)]">
          <h3 className="font-ui text-sm font-semibold text-[var(--navy)] flex items-center gap-2">
            <Users size={15} /> {L.children}
          </h3>
          <Link href="/onboarding/step-5" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-xs text-[var(--gold)] hover:text-[var(--gold)] gap-1")}>
            <Pencil size={12} /> {L.edit}
          </Link>
        </div>
        {children.length === 0 ? (
          <p className="px-5 py-4 font-ui text-sm text-[var(--brown)]">{L.noChildren}</p>
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

      <p className="font-ui text-xs text-[var(--brown)] opacity-70 text-center">{L.editStep}</p>
    </div>
  );
}
