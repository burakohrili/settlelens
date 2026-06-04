// Canonical per-locale display prices — single source of truth for landing components.
export const PLAN_DISPLAY: Record<
  "clarified" | "strategist" | "professional",
  { name: string; prices: Record<string, string>; period: Record<string, string> }
> = {
  clarified: {
    name: "Clarified",
    prices: { en: "$29", tr: "₺899", de: "27 €", fr: "27 €", es: "27 €", ar: "$29" },
    period: { en: "one-time · 14 days", tr: "tek seferlik · 14 gün", de: "einmalig · 14 Tage", fr: "unique · 14 jours", es: "único · 14 días", ar: "لمرة واحدة · 14 يوماً" },
  },
  strategist: {
    name: "Strategist",
    prices: { en: "$39", tr: "₺1.299", de: "36 €", fr: "36 €", es: "36 €", ar: "$39" },
    period: { en: "/month", tr: "/ay", de: "/Monat", fr: "/mois", es: "/mes", ar: "/شهر" },
  },
  professional: {
    name: "Professional",
    prices: { en: "$99", tr: "₺3.299", de: "92 €", fr: "92 €", es: "92 €", ar: "$99" },
    period: { en: "/month", tr: "/ay", de: "/Monat", fr: "/mois", es: "/mes", ar: "/شهر" },
  },
};
