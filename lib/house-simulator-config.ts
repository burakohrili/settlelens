export type AppreciationScenario = "low" | "mid" | "high";

export type LocaleEconomics = {
  currency: string;
  currencyLocale: string;
  /** Annual housing appreciation rates — low/mid/high scenarios */
  appreciationScenarios: Record<AppreciationScenario, number>;
  /** Annual investment return rate (nominal) */
  investmentReturn: number;
  /** Sale transaction cost as % of home value */
  saleTransactionCost: number;
  /** Monthly rent as % of home value */
  rentYieldMonthly: number;
  /** Show nominal value warning */
  nominalWarning: boolean;
  /** Whether mortgage is common (false = cash-dominant market, show toggle) */
  mortgageCommon: boolean;
  defaults: {
    homeValue: number;
    mortgage: number;
    monthlyPayment: number;
    myIncome: number;
    spouseIncome: number;
    hasMortgage: boolean;
  };
  sliderMin: {
    homeValue: number;
    income: number;
  };
  sliderMax: {
    homeValue: number;
    mortgage: number;
    monthlyPayment: number;
    income: number;
  };
  sliderStep: {
    homeValue: number;
    mortgage: number;
    monthlyPayment: number;
    income: number;
  };
};

export const LOCALE_ECONOMICS: Record<string, LocaleEconomics> = {
  tr: {
    currency: "TRY",
    currencyLocale: "tr-TR",
    // Türkiye nominal konut artışı: 2022 ~%80, 2023 ~%70, 2024 ~%40
    // Konservatif/orta/iyimser bant olarak 3 senaryo
    appreciationScenarios: { low: 0.15, mid: 0.30, high: 0.50 },
    investmentReturn: 0.18,     // BIST 100 son 5 yıl nominal ortalama
    saleTransactionCost: 0.04,  // Tapu harcı %2 + emlakçı komisyonu %2-3
    rentYieldMonthly: 0.005,    // Yıllık ~%6 kira getirisi
    nominalWarning: true,
    // Türkiye'de konut alımlarının büyük kısmı nakit
    // Mortgage faizleri %40-55 bandında (Mayıs 2024)
    mortgageCommon: false,
    defaults: {
      homeValue: 5_000_000,
      mortgage: 0,             // Nakit alım varsayımı
      monthlyPayment: 0,
      myIncome: 480_000,       // ~₺40,000/ay (2024 ortalama üzeri)
      spouseIncome: 360_000,   // ~₺30,000/ay
      hasMortgage: false,
    },
    sliderMin: {
      homeValue: 500_000,
      income: 204_000,         // 2024 asgari ücret: ₺17,002/ay × 12
    },
    sliderMax: {
      homeValue: 50_000_000,
      mortgage: 30_000_000,
      monthlyPayment: 300_000,
      income: 12_000_000,
    },
    sliderStep: {
      homeValue: 100_000,
      mortgage: 100_000,
      monthlyPayment: 5_000,
      income: 12_000,          // 1,000/ay adımı
    },
  },
  en: {
    currency: "USD",
    currencyLocale: "en-US",
    appreciationScenarios: { low: 0.02, mid: 0.04, high: 0.07 },
    investmentReturn: 0.07,
    saleTransactionCost: 0.06,
    rentYieldMonthly: 0.004,
    nominalWarning: false,
    mortgageCommon: true,
    defaults: {
      homeValue: 450_000,
      mortgage: 280_000,
      monthlyPayment: 2_100,
      myIncome: 85_000,
      spouseIncome: 75_000,
      hasMortgage: true,
    },
    sliderMin: { homeValue: 50_000, income: 20_000 },
    sliderMax: { homeValue: 3_000_000, mortgage: 2_000_000, monthlyPayment: 15_000, income: 500_000 },
    sliderStep: { homeValue: 10_000, mortgage: 10_000, monthlyPayment: 100, income: 5_000 },
  },
  de: {
    currency: "EUR",
    currencyLocale: "de-DE",
    appreciationScenarios: { low: 0.01, mid: 0.03, high: 0.05 },
    investmentReturn: 0.05,
    saleTransactionCost: 0.08, // Grunderwerbsteuer 3.5-6.5% + Notar ~1.5% + Makler ~3.57%
    rentYieldMonthly: 0.003,
    nominalWarning: false,
    mortgageCommon: true,
    defaults: {
      homeValue: 400_000,
      mortgage: 240_000,
      monthlyPayment: 1_400,
      myIncome: 60_000,
      spouseIncome: 55_000,
      hasMortgage: true,
    },
    sliderMin: { homeValue: 50_000, income: 15_000 },
    sliderMax: { homeValue: 2_000_000, mortgage: 1_500_000, monthlyPayment: 8_000, income: 300_000 },
    sliderStep: { homeValue: 10_000, mortgage: 10_000, monthlyPayment: 50, income: 2_000 },
  },
  fr: {
    currency: "EUR",
    currencyLocale: "fr-FR",
    appreciationScenarios: { low: 0.01, mid: 0.025, high: 0.05 },
    investmentReturn: 0.05,
    saleTransactionCost: 0.08, // Frais de notaire 7-8%
    rentYieldMonthly: 0.003,
    nominalWarning: false,
    mortgageCommon: true,
    defaults: {
      homeValue: 350_000,
      mortgage: 210_000,
      monthlyPayment: 1_100,
      myIncome: 52_000,
      spouseIncome: 48_000,
      hasMortgage: true,
    },
    sliderMin: { homeValue: 50_000, income: 15_000 },
    sliderMax: { homeValue: 2_000_000, mortgage: 1_500_000, monthlyPayment: 8_000, income: 300_000 },
    sliderStep: { homeValue: 10_000, mortgage: 10_000, monthlyPayment: 50, income: 2_000 },
  },
  es: {
    currency: "EUR",
    currencyLocale: "es-ES",
    appreciationScenarios: { low: 0.02, mid: 0.04, high: 0.07 },
    investmentReturn: 0.05,
    saleTransactionCost: 0.11, // ITP 6-10% + AJD + Notaría + Agencia
    rentYieldMonthly: 0.004,
    nominalWarning: false,
    mortgageCommon: true,
    defaults: {
      homeValue: 300_000,
      mortgage: 180_000,
      monthlyPayment: 900,
      myIncome: 42_000,
      spouseIncome: 38_000,
      hasMortgage: true,
    },
    sliderMin: { homeValue: 50_000, income: 12_000 },
    sliderMax: { homeValue: 2_000_000, mortgage: 1_500_000, monthlyPayment: 8_000, income: 300_000 },
    sliderStep: { homeValue: 10_000, mortgage: 10_000, monthlyPayment: 50, income: 2_000 },
  },
  ar: {
    currency: "USD",
    currencyLocale: "en-US",
    appreciationScenarios: { low: 0.02, mid: 0.04, high: 0.07 },
    investmentReturn: 0.05,
    saleTransactionCost: 0.05,
    rentYieldMonthly: 0.004,
    nominalWarning: false,
    mortgageCommon: true,
    defaults: {
      homeValue: 300_000,
      mortgage: 150_000,
      monthlyPayment: 1_200,
      myIncome: 60_000,
      spouseIncome: 50_000,
      hasMortgage: true,
    },
    sliderMin: { homeValue: 50_000, income: 10_000 },
    sliderMax: { homeValue: 2_000_000, mortgage: 1_500_000, monthlyPayment: 10_000, income: 500_000 },
    sliderStep: { homeValue: 10_000, mortgage: 10_000, monthlyPayment: 100, income: 5_000 },
  },
};

export function getLocaleEconomics(lang: string): LocaleEconomics {
  return LOCALE_ECONOMICS[lang] ?? LOCALE_ECONOMICS["en"];
}
