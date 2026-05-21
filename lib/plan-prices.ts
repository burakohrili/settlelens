// Canonical per-locale display prices — single source of truth for landing components.
export const PLAN_DISPLAY: Record<
  "clarified" | "strategist" | "professional",
  { name: string; prices: Record<string, string>; period: Record<string, string> }
> = {
  clarified: {
    name: "Scenario Package",
    prices: { en: "$19", tr: "₺499", de: "17 €", fr: "17 €", es: "17 €", ar: "$19" },
    period: { en: "one-time", tr: "tek seferlik", de: "einmalig", fr: "unique", es: "único", ar: "مرة واحدة" },
  },
  strategist: {
    name: "Process Package",
    prices: { en: "$149", tr: "₺3.999", de: "139 €", fr: "139 €", es: "139 €", ar: "$149" },
    period: { en: "one-time", tr: "tek seferlik", de: "einmalig", fr: "unique", es: "único", ar: "مرة واحدة" },
  },
  professional: {
    name: "Lawyer Edition",
    prices: { en: "$79", tr: "₺1.999", de: "74 €", fr: "74 €", es: "74 €", ar: "$79" },
    period: { en: "/mo", tr: "/ay", de: "/Monat", fr: "/mois", es: "/mes", ar: "/شهر" },
  },
};
