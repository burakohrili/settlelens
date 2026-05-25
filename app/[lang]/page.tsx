import { getTranslations } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Hero,
  FearHook,
  UserScenarios,
  HowItWorks,
  WhatItDoesNotDo,
  FeatureGrid,
  CountryCoverage,
  TrustSection,
  ScenarioDemo,
  SocialProof,
  Pricing,
  AttorneyPrepCTA,
  ReportPreview,
  FinalCTA,
  MobileStickyCTA,
  FAQ,
  ComparisonTable,
  PricingWizard,
  FounderNote,
} from "@/components/landing";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "meta" });

  return {
    title: `SettleLens — ${t("tagline")}`,
    description: t("description"),
    openGraph: {
      title: `SettleLens — ${t("tagline")}`,
      description: t("description"),
      url: `https://settlelens.com/${lang}`,
      siteName: "SettleLens",
      type: "website",
    },
    alternates: {
      canonical: `https://settlelens.com/${lang}`,
      languages: {
        "x-default": "https://settlelens.com/en",
        en: "/en",
        tr: "/tr",
        de: "/de",
        fr: "/fr",
        es: "/es",
        ar: "/ar",
      },
    },
  };
}

const SOFTWARE_APP_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "SettleLens",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  url: "https://settlelens.com",
  description:
    "AI-powered financial modeling for divorce settlements. Compare scenarios, project 10-year net worth, and prepare for attorney meetings.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free Discovery plan. Paid plans from $19.",
  },
  publisher: {
    "@type": "Organization",
    name: "SettleLens",
    url: "https://settlelens.com",
    contactPoint: {
      "@type": "ContactPoint",
      email: "support@settlelens.com",
      contactType: "customer support",
    },
  },
};

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SOFTWARE_APP_SCHEMA) }}
      />
      <Header />
      <main id="main-content">
        {/*
        POSITIONING NOTE:
        SettleLens is a financial scenario modeling tool — NOT a lawyer, court predictor, or settlement guarantor.
        Primary message: "See the financial impact of divorce decisions before you negotiate."
        NEVER use: "calculate your legal entitlement", "the court will", "you do not need a lawyer"
        ALWAYS pair with: "financial modeling, not legal advice"
        See CLAUDE.md → POSITIONING & CLAIM RULES
        */}
        <Hero />

        {/*
        TONE NOTE:
        Users may be emotionally vulnerable. Use calm, supportive, non-judgmental language.
        Avoid: fear, urgency, revenge framing, certainty about legal outcomes.
        Prefer: "this scenario suggests", "based on the information entered", "you may want to discuss with a lawyer"
        See CLAUDE.md → SENSITIVE USER TONE GUIDE
        */}
        <FearHook />

        <UserScenarios />
        <HowItWorks />
        <WhatItDoesNotDo />
        <FeatureGrid />
        <CountryCoverage />

        {/*
        TRUST NOTE:
        Privacy is a product feature. Homepage must communicate:
        data not sold · no console logging · export/delete available · Paddle payments · RLS · GDPR/KVKK
        See CLAUDE.md → TRUST & PRIVACY POSITIONING
        */}
        <TrustSection />

        <ScenarioDemo />
        <SocialProof />
        <FounderNote />
        <ComparisonTable />
        <PricingWizard />
        <Pricing />
        <FAQ />
        <AttorneyPrepCTA />
        <ReportPreview />
        <FinalCTA />
      </main>
      <Footer />
      <MobileStickyCTA />
    </>
  );
}
