import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/layout/LegalPageLayout";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getLocale } from "next-intl/server";

type CountryData = {
  name: string;
  flag: string;
  framework: string;
  confidence: string;
  whatWeModel: string[];
  limitations: string[];
  whenToGetHelp: string[];
};

const COUNTRY_DATA: Record<string, CountryData> = {
  us: {
    name: "United States",
    flag: "🇺🇸",
    framework: "Community Property (AZ, CA, ID, LA, NV, NM, TX, WA, WI): 50/50 split of marital assets. All other 41 states: Equitable Distribution — courts divide assets 'fairly', not necessarily equally.",
    confidence: "formula-based-estimate (community property) / scenario-model (equitable distribution)",
    whatWeModel: [
      "Marital vs. separate property classification",
      "50/50 split for community property states",
      "Equitable distribution factors for other states",
      "Alimony (spousal support) range estimates",
      "Child support using state guideline assumptions",
      "10-year net worth projection",
    ],
    limitations: [
      "Judicial discretion in equitable distribution states varies widely",
      "Separate property commingling is not detected",
      "State-specific nuances beyond community/equitable split",
      "Tax implications of asset transfers",
    ],
    whenToGetHelp: [
      "Business ownership is involved",
      "Prenuptial or postnuptial agreement exists",
      "Spouse is uncooperative or hiding assets",
      "Significant separate property claims",
      "Custody arrangements are contested",
    ],
  },
  uk: {
    name: "United Kingdom",
    flag: "🇬🇧",
    framework: "Matrimonial Causes Act 1973, Section 25. Courts aim for a 'fair' outcome with the starting point of equal sharing (White v White [2000]). Needs of the parties are primary.",
    confidence: "scenario-model",
    whatWeModel: [
      "Equal sharing starting point",
      "Adjustment for needs (housing, income)",
      "Alimony (maintenance) range estimates",
      "10-year net worth projection",
    ],
    limitations: [
      "Section 25 gives courts wide discretion — outcomes vary significantly",
      "Length of marriage and pre-marital assets are highly case-specific",
      "Non-matrimonial assets (inheritance) require professional assessment",
    ],
    whenToGetHelp: [
      "Significant assets from before marriage or inheritance",
      "One party has much higher earning capacity",
      "Complex pension arrangements",
      "Business interests",
    ],
  },
  de: {
    name: "Germany",
    flag: "🇩🇪",
    framework: "BGB §1363 Zugewinngemeinschaft (community of accrued gains). Each spouse keeps pre-marriage assets. Net gain during marriage is equalized: (Spouse A gain − Spouse B gain) ÷ 2.",
    confidence: "formula-based-estimate",
    whatWeModel: [
      "Zugewinnausgleich (accrued gains equalization)",
      "Initial and final net worth calculation",
      "Versorgungsausgleich (pension rights adjustment) — simplified",
      "Unterhalt (alimony) range estimates",
      "10-year net worth projection",
    ],
    limitations: [
      "Exact pension adjustment (Versorgungsausgleich) requires official calculation",
      "Privileged gifts and inheritance may be excluded",
      "Business valuations are complex",
    ],
    whenToGetHelp: [
      "Significant inheritance or gifts received during marriage",
      "Business or professional practice valuation",
      "Pension schemes (Betriebsrente, Beamtenversorgung)",
    ],
  },
  fr: {
    name: "France",
    flag: "🇫🇷",
    framework: "Code civil Art. 1401 — Communauté d'acquêts (community of acquests). Assets acquired during marriage are joint; pre-marriage and inherited assets remain separate. Joint assets divided 50/50.",
    confidence: "formula-based-estimate",
    whatWeModel: [
      "Community property (biens communs) 50/50 split",
      "Separate property (biens propres) identification",
      "Prestation compensatoire (compensatory allowance) range",
      "10-year net worth projection",
    ],
    limitations: [
      "Some couples use a different matrimonial regime (e.g., séparation de biens) — verify at registration",
      "Prestation compensatoire is highly discretionary",
    ],
    whenToGetHelp: [
      "Different matrimonial regime applies",
      "Significant business or real estate portfolio",
      "International assets or cross-border residence",
    ],
  },
  es: {
    name: "Spain",
    flag: "🇪🇸",
    framework: "Código Civil Art. 1344 — Régimen de Gananciales. Assets acquired during marriage are joint and divided 50/50. Pre-marriage and inherited assets are private.",
    confidence: "formula-based-estimate",
    whatWeModel: [
      "Gananciales (community gains) 50/50 split",
      "Pensión compensatoria (compensatory pension) range",
      "Child support (alimentos) estimates",
      "10-year net worth projection",
    ],
    limitations: [
      "Some regions have different local law (Catalonia, Aragon, Navarra, etc.)",
      "Régimen de separación de bienes applies if opted in — verify",
    ],
    whenToGetHelp: [
      "You live in Catalonia, Aragon, or other foral regions",
      "Pre-marital asset claims are disputed",
      "Shared business or real estate in multiple countries",
    ],
  },
  tr: {
    name: "Turkey (Türkiye)",
    flag: "🇹🇷",
    framework: "TMK Madde 218-241 — Edinilmiş Mallara Katılma Rejimi. Evlilik süresinde edinilen mallar ortak kabul edilir. Her eşin net artık değeri hesaplanır, fark ikiye bölünür.",
    confidence: "formula-based-estimate",
    whatWeModel: [
      "Katılma alacağı hesabı (net artık değer farkı ÷ 2)",
      "Kişisel malların ayrıştırılması (miras, bağış)",
      "Yoksulluk nafakası (madde 175) tahmini",
      "İştirak nafakası tahmini",
      "10 yıllık net servet projeksiyonu",
      "Enflasyon ayarlaması (kullanıcı tanımlı — TR için önemli)",
    ],
    limitations: [
      "Katkı payı itirazları (kişisel katkı oranı tartışmalı ise)",
      "İşletme değerlemesi profesyonel ekspertiz gerektirir",
      "Yüksek enflasyon dönemlerinde projeksiyon güvenilirliği düşer",
    ],
    whenToGetHelp: [
      "Eşlerden biri işletme sahibi veya serbest meslek",
      "Evlilik öncesi mal rejimi sözleşmesi varsa",
      "Varlık gizleme şüphesi",
      "Yurt dışı varlıklar veya oturma",
      "Nafaka davası ayrı yürütülüyorsa",
    ],
  },
};

const VALID_COUNTRIES = Object.keys(COUNTRY_DATA);

type Props = {
  params: Promise<{ lang: string; country: string }>;
};

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, country } = await params;
  const data = COUNTRY_DATA[country];
  if (!data) return {};
  const descSnippet = data.framework.slice(0, 130);
  return {
    title: `${data.name} Divorce Property Division — Methodology | SettleLens`,
    description: `How SettleLens models divorce asset division in ${data.name}. ${descSnippet}...`,
    alternates: {
      canonical: `https://settlelens.com/${lang}/methodology/${country}`,
    },
  };
}

export function generateStaticParams() {
  return VALID_COUNTRIES.map((country) => ({ country }));
}

export default async function CountryMethodologyPage({ params }: Props) {
  const { country } = await params;
  const locale = await getLocale();
  const data = COUNTRY_DATA[country];

  if (!data) notFound();

  return (
    <LegalPageLayout
      title={`${data.flag} ${data.name} — How SettleLens Models It`}
    >
      <p>
        <Link href={`/${locale}/methodology`} className="text-[var(--gold)]">
          ← All jurisdictions
        </Link>
      </p>

      <div className="mt-2 inline-block rounded bg-[var(--slate)]/10 px-3 py-1 font-mono text-xs text-[var(--slate)]">
        Analysis type: {data.confidence}
      </div>

      <h2>Legal Framework</h2>
      <p>{data.framework}</p>

      <h2>What We Model</h2>
      <ul>
        {data.whatWeModel.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <h2>What We Cannot Know</h2>
      <ul>
        {data.limitations.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <h2>When to Get Professional Help</h2>
      <ul>
        {data.whenToGetHelp.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <div className="mt-6 rounded-lg border-2 border-[var(--gold)]/40 bg-[var(--gold)]/10 p-4">
        <p className="font-ui font-semibold text-[var(--navy)]">
          SettleLens is a financial modeling tool. Always verify outputs with a qualified attorney before making any decisions.
        </p>
        <Link
          href={`/${locale}/register`}
          className="mt-3 inline-block rounded bg-[var(--gold)] px-4 py-2 font-ui text-sm font-semibold text-[var(--navy)] no-underline hover:opacity-90"
        >
          See your scenarios →
        </Link>
      </div>
    </LegalPageLayout>
  );
}
