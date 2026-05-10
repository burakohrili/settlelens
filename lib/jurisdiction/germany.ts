export const germanyRules = {
  regime: "Zugewinngemeinschaft — BGB §1363 ff.",
  splitFormula: "net_surplus_50_50",
  formula: "Zugewinnausgleich = (Endvermögen - Anfangsvermögen) / 2",
  maritalAssets: ["all_assets_acquired_during_marriage"],
  separateAssets: ["pre_marriage_assets", "gifts", "inheritance"],
  alimonyType: "Nachehelicher Unterhalt (BGB §1569) — needs-based, time-limited post-reform",
  childSupportType: "Kindesunterhalt — Düsseldorfer Tabelle (income-based)",
  notes: "Each spouse keeps their own assets; only the 'Zugewinn' (surplus gain during marriage) is equalized. Anfangsvermögen = assets at marriage date (adjusted for inflation). Endvermögen = assets at separation date.",
};
