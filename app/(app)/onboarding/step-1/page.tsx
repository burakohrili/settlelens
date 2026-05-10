"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { WizardLayout } from "@/components/app/WizardLayout";
import { Label } from "@/components/ui/label";
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";

const US_COMMUNITY_STATES = ["AZ", "CA", "ID", "LA", "NV", "NM", "TX", "WA", "WI"];

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
];

const COUNTRY_REGIONS: Record<string, string[]> = {
  US: US_STATES,
  DE: ["Baden-Württemberg","Bayern","Berlin","Brandenburg","Bremen","Hamburg","Hessen","Mecklenburg-Vorpommern","Niedersachsen","Nordrhein-Westfalen","Rheinland-Pfalz","Saarland","Sachsen","Sachsen-Anhalt","Schleswig-Holstein","Thüringen"],
  TR: ["Adana","Ankara","Antalya","Bursa","Diyarbakır","Eskişehir","Gaziantep","İstanbul","İzmir","Kayseri","Konya","Mersin","Sakarya","Samsun","Trabzon"],
  UK: ["England","Scotland","Wales","Northern Ireland"],
  FR: ["Île-de-France","Provence-Alpes-Côte d'Azur","Occitanie","Auvergne-Rhône-Alpes","Hauts-de-France","Grand Est","Normandie","Bretagne","Pays de la Loire","Others"],
  ES: ["Madrid","Cataluña","Andalucía","Comunitat Valenciana","País Vasco","Galicia","Castilla y León","Canarias","Others"],
};

const COUNTRY_CURRENCY: Record<string, string> = {
  US: "USD", UK: "GBP", DE: "EUR", FR: "EUR", ES: "EUR", TR: "TRY",
};

const HIGH_RISK_SIGNALS = [
  { key: "domestic_violence", en: "Domestic violence or coercive control", tr: "Aile içi şiddet veya zorlayıcı kontrol" },
  { key: "hidden_assets", en: "Concern about hidden or undisclosed assets", tr: "Gizlenmiş veya beyan edilmemiş varlık endişesi" },
  { key: "offshore_accounts", en: "Offshore accounts or complex international assets", tr: "Offshore hesaplar veya karmaşık uluslararası varlıklar" },
  { key: "business_dispute", en: "Business ownership dispute", tr: "İşletme sahipliği anlaşmazlığı" },
  { key: "complex_trust", en: "Complex trust, inheritance, or pre-marital agreement", tr: "Karmaşık tröst, miras veya evlilik öncesi anlaşma" },
  { key: "custody_conflict", en: "High-conflict child custody situation", tr: "Yüksek çatışmalı çocuk velayeti durumu" },
  { key: "immigration", en: "Immigration status dependency on marriage", tr: "Evliliğe bağlı göçmenlik durumu" },
  { key: "bankruptcy", en: "Bankruptcy, significant tax debt, or financial fraud", tr: "İflas, önemli vergi borcu veya mali dolandırıcılık" },
  { key: "disclosure_refusal", en: "Spouse refuses to disclose financial information", tr: "Eş finansal bilgileri açıklamayı reddediyor" },
];

export default function Step1Page() {
  const t = useTranslations("onboarding_form.step1");
  const locale = useLocale();
  const router = useRouter();
  const params = useParams();
  const lang = (params.lang as string) ?? locale;
  const supabase = createClient();

  const [country, setCountry] = useState("");
  const [stateProvince, setStateProvince] = useState("");
  const [marriageYear, setMarriageYear] = useState("");
  const [saving, setSaving] = useState(false);

  const [riskOpen, setRiskOpen] = useState(false);
  const [selectedRisks, setSelectedRisks] = useState<Set<string>>(new Set());
  const hasHighRisk = selectedRisks.size > 0;

  const isTR = lang === "tr";

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await (supabase as never as { from: (t: string) => { select: (s: string) => { eq: (col: string, val: string) => { single: () => Promise<{ data: Record<string, string> | null }> } } } })
        .from("profiles").select("country,state_province,marriage_year").eq("id", user.id).single();
      if (data) {
        setCountry(data.country ?? "");
        setStateProvince(data.state_province ?? "");
        setMarriageYear(data.marriage_year ? String(data.marriage_year) : "");
      }
    }
    load();
  }, [supabase]);

  const regions = country ? (COUNTRY_REGIONS[country] ?? []) : [];
  const isCommunity = country === "US" && US_COMMUNITY_STATES.includes(stateProvince);
  const currentYear = new Date().getFullYear();

  function getRegionLabel() {
    if (country === "US") return t("state");
    if (country === "DE") return t("bundesland");
    if (country === "TR") return t("il");
    return t("region");
  }

  function toggleRisk(key: string) {
    setSelectedRisks((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  async function handleNext() {
    if (!country || !marriageYear) return;
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await (supabase as never as { from: (t: string) => { upsert: (d: Record<string, unknown>) => Promise<unknown> } })
        .from("profiles").upsert({
          id: user.id,
          country,
          state_province: stateProvince || null,
          marriage_year: parseInt(marriageYear),
          preferred_language: lang,
          has_high_risk_signals: hasHighRisk,
        });
    }
    router.push(`/${lang}/onboarding/step-2`);
  }

  return (
    <WizardLayout
      currentStep={1}
      onNext={handleNext}
      nextDisabled={!country || !marriageYear || saving}
    >
      <div className="space-y-5">
        <div>
          <Label htmlFor="country">{t("country")}</Label>
          <select
            id="country"
            value={country}
            onChange={(e) => { setCountry(e.target.value); setStateProvince(""); }}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 font-ui text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">{t("selectCountry")}</option>
            <option value="US">🇺🇸 United States</option>
            <option value="UK">🇬🇧 United Kingdom</option>
            <option value="DE">🇩🇪 Germany</option>
            <option value="FR">🇫🇷 France</option>
            <option value="ES">🇪🇸 Spain</option>
            <option value="TR">🇹🇷 Turkey</option>
          </select>
        </div>

        {regions.length > 0 && (
          <div>
            <Label htmlFor="state">{getRegionLabel()}</Label>
            <select
              id="state"
              value={stateProvince}
              onChange={(e) => setStateProvince(e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 font-ui text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">{t("selectRegion")}</option>
              {regions.map((r) => (
                <option key={r} value={r}>
                  {country === "US" && US_COMMUNITY_STATES.includes(r) ? `★ ${r} (Community Property)` : r}
                </option>
              ))}
            </select>
            {isCommunity && (
              <p className="mt-1 font-ui text-xs text-[var(--gold)]">
                {t("communityProperty")}
              </p>
            )}
          </div>
        )}

        <div>
          <Label htmlFor="marriage-year">{t("marriageYear")}</Label>
          <input
            id="marriage-year"
            type="number"
            min={1950}
            max={currentYear - 1}
            value={marriageYear}
            onChange={(e) => setMarriageYear(e.target.value)}
            placeholder={String(currentYear - 5)}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 font-ui text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        {country && (
          <div className="rounded-md border border-[var(--sand)] bg-[var(--cream)] p-3">
            <p className="font-ui text-xs text-[var(--brown)]">
              <strong>{t("currencyNote", { currency: COUNTRY_CURRENCY[country] })}</strong>
            </p>
          </div>
        )}

        {/* High-risk situation detection */}
        <div className="rounded-md border border-[#D4C5B0] bg-white overflow-hidden">
          <button
            type="button"
            onClick={() => setRiskOpen((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 text-left font-ui text-sm font-medium text-[#2E4D6B] hover:bg-[#F7F3EE] transition-colors"
          >
            <span>
              {isTR
                ? "Durumunuza uyan bir durum var mı?"
                : "Do any of these apply to your situation?"}
              {hasHighRisk && (
                <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#E85252] text-[10px] font-bold text-white">
                  {selectedRisks.size}
                </span>
              )}
            </span>
            {riskOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {riskOpen && (
            <div className="px-4 pb-4 space-y-2 border-t border-[#D4C5B0]">
              <p className="font-ui text-xs text-[#8B7355] pt-3 pb-1">
                {isTR
                  ? "Bu bilgi modelimizin güven seviyesini ayarlar. Devam etmenizi engellemez."
                  : "This helps us adjust our confidence level. It does not prevent you from continuing."}
              </p>
              {HIGH_RISK_SIGNALS.map(({ key, en, tr: trLabel }) => (
                <label key={key} className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedRisks.has(key)}
                    onChange={() => toggleRisk(key)}
                    className="mt-0.5 h-4 w-4 rounded border-[#D4C5B0] text-[#E85252] focus:ring-[#E85252]"
                  />
                  <span className="font-ui text-sm text-[#1C2B3A] group-hover:text-[#2E4D6B]">
                    {isTR ? trLabel : en}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* HIGH-RISK NOTICE — shown when any signal is selected */}
        {hasHighRisk && (
          <div className="rounded-md border-2 border-[#E85252] bg-red-50 p-4 flex gap-3">
            <AlertTriangle className="shrink-0 text-[#E85252] mt-0.5" size={18} />
            <div>
              <p className="font-ui text-sm font-semibold text-[#E85252] mb-1">
                {isTR ? "Profesyonel Destek Gerekebilir" : "Professional Support May Be Required"}
              </p>
              <p className="font-ui text-sm text-[#1C2B3A]">
                {isTR
                  ? "Bu durum profesyonel hukuki destek gerektirebilir. SettleLens finansal senaryolarınızı düzenlemenize yardımcı olabilir, ancak herhangi bir karar vermeden önce nitelikli bir avukat veya arabulucuyla görüşmenizi öneririz."
                  : "This situation may require professional legal advice. SettleLens can help you organize financial scenarios, but please speak with a qualified lawyer or mediator before making any decisions."}
              </p>
            </div>
          </div>
        )}
      </div>
    </WizardLayout>
  );
}
