export function getJurisdiction(country: string, stateProvince?: string): string {
  if (country === "US") {
    const COMMUNITY_PROP = ["AZ", "CA", "ID", "LA", "NV", "NM", "TX", "WA", "WI"];
    return COMMUNITY_PROP.includes(stateProvince || "") ? "us-community" : "us-equitable";
  }
  return ({ UK: "uk", DE: "de", FR: "fr", ES: "es", TR: "tr" } as Record<string, string>)[country] ?? "us-equitable";
}

export function getInflationRate(country: string): number {
  return ({ US: 0.035, UK: 0.04, DE: 0.03, FR: 0.03, ES: 0.035, TR: 0.45 } as Record<string, number>)[country] ?? 0.035;
}

export function getCurrency(country: string): string {
  return ({ US: "USD", UK: "GBP", DE: "EUR", FR: "EUR", ES: "EUR", TR: "TRY" } as Record<string, string>)[country] ?? "USD";
}

export function getJurisdictionName(jurisdiction: string): string {
  const names: Record<string, string> = {
    "us-community": "US Community Property",
    "us-equitable": "US Equitable Distribution",
    "uk": "UK — Matrimonial Causes Act 1973",
    "de": "Germany — Zugewinngemeinschaft (BGB §1363)",
    "fr": "France — Communauté réduite aux acquêts (Art.1401)",
    "es": "Spain — Sociedad de Gananciales (CC Art.1344)",
    "tr": "Turkey — Edinilmiş Mallara Katılma (TMK 179)",
  };
  return names[jurisdiction] ?? jurisdiction;
}
