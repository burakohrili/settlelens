export const usCommunityRules = {
  regime: "Community Property (9 states)",
  states: ["AZ", "CA", "ID", "LA", "NV", "NM", "TX", "WA", "WI"],
  maritalAssets: ["income_during_marriage", "property_acquired_during_marriage", "debts_incurred_during_marriage"],
  separateAssets: ["pre_marriage_property", "gifts", "inheritance", "personal_injury_damages"],
  splitFormula: "50_50_community_property",
  notes: "All community property is split 50/50 regardless of contributions. Separate property remains with the original owner.",
};

export const usEquitableRules = {
  regime: "Equitable Distribution (41 states + DC)",
  splitFormula: "equitable_not_necessarily_equal",
  factors: [
    "length of marriage",
    "each spouse's income and earning capacity",
    "age and health of each spouse",
    "contributions to the marriage (homemaking, career support)",
    "economic circumstances at time of division",
    "custodial arrangements for children",
  ],
  notes: "Courts distribute marital property 'equitably' — fairly but not necessarily equally. Common range: 45-55% each, but can vary significantly.",
};
