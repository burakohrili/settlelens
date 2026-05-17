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
      images: [{ url: `/og/${lang}.png`, width: 1200, height: 630 }],
    },
    alternates: {
      languages: {
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

export default function LandingPage() {
  return (
    <>
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
