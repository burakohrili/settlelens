import { LegalPageLayout } from "@/components/layout/LegalPageLayout";
import { getLocale } from "next-intl/server";
import Link from "next/link";

const COUNTRIES = [
  { slug: "us", flag: "🇺🇸", name: "United States", law: "Community property (9 states) / Equitable distribution (41 states)", confidence: "formula-based-estimate / scenario-model" },
  { slug: "uk", flag: "🇬🇧", name: "United Kingdom", law: "Matrimonial Causes Act 1973, Section 25", confidence: "scenario-model" },
  { slug: "de", flag: "🇩🇪", name: "Germany", law: "BGB §1363 Zugewinngemeinschaft", confidence: "formula-based-estimate" },
  { slug: "fr", flag: "🇫🇷", name: "France", law: "Code civil Art. 1401 — Communauté d'acquêts", confidence: "formula-based-estimate" },
  { slug: "es", flag: "🇪🇸", name: "Spain", law: "CC Art. 1344 — Régimen de Gananciales", confidence: "formula-based-estimate" },
  { slug: "tr", flag: "🇹🇷", name: "Turkey", law: "TMK 218-241 — Edinilmiş Mallara Katılma", confidence: "formula-based-estimate" },
];

export default async function MethodologyPage() {
  const locale = await getLocale();

  return (
    <LegalPageLayout
      title="How SettleLens Models Divorce Finances"
    >
      <p>
        SettleLens applies jurisdiction-specific property division rules to model the financial impact of settlement scenarios. This page explains our approach and its limitations.
      </p>

      <h2>Supported Jurisdictions</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {COUNTRIES.map((c) => (
          <Link
            key={c.slug}
            href={`/${locale}/methodology/${c.slug}`}
            className="block rounded-lg border border-[var(--sand)] p-4 transition-colors hover:border-[var(--gold)] hover:bg-[var(--gold)]/5 no-underline"
          >
            <p className="font-ui text-lg">{c.flag} {c.name}</p>
            <p className="mt-1 font-ui text-xs text-[var(--brown)]">{c.law}</p>
            <p className="mt-1 font-mono text-[10px] text-[var(--slate)]">
              {c.confidence}
            </p>
          </Link>
        ))}
      </div>

      <h2>What SettleLens Cannot Know</h2>
      <ul>
        <li>Hidden or undisclosed assets</li>
        <li>Judicial discretion in non-formula jurisdictions</li>
        <li>Pre/postnuptial agreements (unless entered as custom data)</li>
        <li>Future changes in asset values or income</li>
        <li>Complex business ownership or trust structures</li>
      </ul>
      <p>
        When high-risk signals are detected, all analyses are labeled{" "}
        <strong>requires-professional-review</strong> regardless of jurisdiction.
      </p>

      <h2>Confidence Labels</h2>
      <ul>
        <li><strong>formula-based-estimate</strong> — Clear statutory formula applies</li>
        <li><strong>scenario-model</strong> — General legal approach, outcome varies by case</li>
        <li><strong>requires-professional-review</strong> — Complex factors detected</li>
        <li><strong>limited-confidence</strong> — Missing data or unusual circumstance</li>
      </ul>

      <p className="mt-4 font-semibold">
        SettleLens is a financial modeling tool. Always verify outputs with a qualified attorney before making any decisions.
      </p>
    </LegalPageLayout>
  );
}
