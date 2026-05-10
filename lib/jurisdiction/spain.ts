export const spainRules = {
  regime: "Sociedad de Gananciales — Código Civil Art. 1344",
  splitFormula: "community_50_50",
  maritalAssets: [
    "salaries and income earned during marriage",
    "fruits from private property during marriage",
    "assets acquired for a price during marriage",
    "businesses started during marriage",
  ],
  separateAssets: [
    "property owned before marriage",
    "gifts and inheritances",
    "assets acquired with personal funds",
    "personal use items",
  ],
  regionalVariations: {
    catalonia: "Separació de béns — complete separation by default",
    balearicIslands: "Separació de béns — complete separation",
    aragon: "Consorcio conyugal — similar to gananciales",
    navarra: "Conquistas — similar to gananciales",
    basqueCountry: "Comunicación foral de bienes — broader community property",
  },
  alimonyType: "Pensión compensatoria (Art. 97) — discretionary, indefinite or time-limited",
  childSupportType: "Pensión de alimentos — based on income and needs",
  notes: "Gananciales applies in most of Spain. Regional foral law variations are significant — especially Catalonia and Balearic Islands which default to full separation.",
};
