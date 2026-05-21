// Canonical per-locale display prices — single source of truth for landing components.
export const PLAN_DISPLAY: Record<
  "clarified" | "strategist" | "professional",
  { name: string; prices: Record<string, string>; period: Record<string, string> }
> = {
  clarified: {
    name: "Scenario Package",
    prices: { en: "$19", tr: "₺499", de: "18 €", fr: "18 €", es: "18 €", ar: "$19" },
    period: { en: "one-time · 30 days", tr: "tek seferlik · 30 gün", de: "einmalig · 30 Tage", fr: "unique · 30 jours", es: "único · 30 días", ar: "لمرة واحدة · 30 يوماً" },
  },
  strategist: {
    name: "Process Package",
    prices: { en: "$149", tr: "₺3.999", de: "139 €", fr: "139 €", es: "139 €", ar: "$149" },
    period: { en: "one-time · 6 months", tr: "tek seferlik · 6 ay", de: "einmalig · 6 Monate", fr: "unique · 6 mois", es: "único · 6 meses", ar: "لمرة واحدة · 6 أشهر" },
  },
  professional: {
    name: "Lawyer Edition",
    prices: { en: "$79", tr: "₺1.999", de: "74 €", fr: "74 €", es: "74 €", ar: "$79" },
    period: { en: "/mo", tr: "/ay", de: "/Monat", fr: "/mois", es: "/mes", ar: "/شهر" },
  },
};
