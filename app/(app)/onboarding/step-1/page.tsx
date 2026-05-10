"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { WizardLayout } from "@/components/app/WizardLayout";
import { Label } from "@/components/ui/label";

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

export default function Step1Page() {
  const t = useTranslations("onboarding_form.step1");
  const router = useRouter();
  const params = useParams();
  const lang = (params.lang as string) ?? "en";
  const supabase = createClient();

  const [country, setCountry] = useState("");
  const [stateProvince, setStateProvince] = useState("");
  const [marriageYear, setMarriageYear] = useState("");
  const [saving, setSaving] = useState(false);

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
      </div>
    </WizardLayout>
  );
}
