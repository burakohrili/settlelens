import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "Divorce Financial Settlement UK — How It Works | SettleLens",
  description:
    "How divorce financial settlements work in England and Wales under MCA 1973 s.25: what courts consider, typical splits, and how to model your financial outcome before negotiating.",
};

export default function Page() {
  return (
    <SeoLandingTemplate
      config={{
        locale: "en",
        badge: "UK Divorce Law — England & Wales",
        headline: "Divorce Financial Settlement UK — How It Actually Works",
        intro:
          "A divorce financial settlement in England and Wales does not follow a fixed formula. Under the Matrimonial Causes Act 1973 Section 25, a judge weighs eight statutory factors to reach a 'fair' outcome — and the starting point since the landmark White v White [2000] ruling is equal division. This guide explains what courts consider, what typical settlements look like, and how to model your financial outcome before you negotiate.",
        sections: [
          {
            heading: "How UK Divorce Financial Settlements Work",
            body: "In England and Wales, neither spouse has an automatic legal entitlement to exactly half of the marital assets — but equal division is the baseline the court starts from, and departures must be justified. The court's job is to reach a 'fair' outcome under Section 25 MCA 1973. There is no formula: the judge applies discretion across eight factors. This is fundamentally different from Scottish law (which follows the Family Law (Scotland) Act 1985) and from community property states in the US. Settlements can be reached by agreement (via a consent order) or decided by the court at a Financial Remedy Hearing if spouses cannot agree.",
          },
          {
            heading: "The Sharing Principle — White v White 2000",
            body: "The House of Lords in White v White [2000] UKHL 54 established the 'equality yardstick': when dividing matrimonial assets, the starting point is 50/50, and any departure requires justification. Before White v White, courts routinely awarded the primary carer (usually the wife) a 'needs-based' share that was often well below half. The sharing principle changed this. However, 50/50 is a starting point, not a rule. Short marriages, pre-marital assets, and significant contributions by one spouse can shift the outcome. For marriages under 5 years without children, a needs-based approach often prevails over equal sharing.",
          },
          {
            heading: "The 8 Section 25 Factors Courts Weigh",
            body: "Under MCA 1973 s.25(2), courts consider: (1) Income, earning capacity, and financial resources of each party — now and in the foreseeable future. (2) Financial needs, obligations, and responsibilities. (3) Standard of living enjoyed during the marriage. (4) Age of each party and duration of the marriage. (5) Physical or mental disability. (6) Contributions to the family's welfare — including non-financial contributions such as childcare and homemaking. (7) Conduct — only if it would be 'inequitable to disregard it' (a high bar). (8) Value of any benefit lost on divorce, such as pension rights. The first consideration in cases involving children is the welfare of any minor children (s.25(1)).",
          },
          {
            heading: "Common Settlement Patterns",
            body: "Short marriages (under 5 years, no children): needs-based approach. The non-earning spouse may receive enough to rehouse but not necessarily half of all assets. Long marriages with children: equal sharing of all matrimonial assets is common. The primary carer typically stays in the family home until the youngest child finishes full-time education (a 'Mesher order'). High-income cases: both parties' needs being met, the surplus is typically shared equally. Pre-marital assets: property owned before the marriage may be 'ringfenced' if it can be clearly traced and was never used for the family, though this is harder in long marriages where assets become commingled.",
          },
          {
            heading: "Clean Break vs. Ongoing Maintenance",
            body: "English courts prefer a 'clean break' — a final, once-and-for-all settlement that severs financial ties. Where possible, a lump sum or property transfer is preferred over periodic payments. However, where one spouse cannot meet their needs without ongoing support, the court will order spousal maintenance (periodical payments). Maintenance is typically time-limited (term orders), not permanent. In long marriages where one spouse gave up a career to raise children, longer-term or joint-lives maintenance may be ordered. A clean break order, once approved by the court, prevents either party from making future financial claims — which is why it is important to formalise the settlement in a consent order even when spouses agree amicably.",
          },
          {
            heading: "How SettleLens Models Your UK Settlement",
            body: "Because UK financial settlements depend on judicial discretion rather than a fixed formula, the range of likely outcomes matters more than a single prediction. SettleLens lets you build multiple settlement scenarios — different house outcomes, different maintenance assumptions, different pension shares — and projects your 10-year net worth under each. This helps you enter negotiations with a clear view of which terms are financially critical and which are less significant over the long term. It does not predict what a court would decide; it models the financial consequences of the scenarios you are considering.",
          },
        ],
        checklist: [
          "Gather Form E financial statements for both parties (or prepare your own draft)",
          "List all matrimonial property: home, savings, investments, pensions",
          "Identify any pre-marital or inherited assets with supporting documentation",
          "Get a current valuation of the family home (RICS surveyor or estate agent)",
          "Obtain pension cash equivalent transfer values (CETVs) for all pension schemes",
          "List all joint and sole debts: mortgage, credit cards, loans",
          "Document non-financial contributions (years of childcare, career breaks)",
          "Note any conduct issues that may be relevant (a high bar under English law)",
          "Understand both parties' future income and earning capacity",
          "Consider whether a clean break is achievable or whether maintenance is needed",
        ],
        faq: [
          {
            q: "Is divorce financial settlement different in Scotland?",
            a: "Yes. Scotland operates under the Family Law (Scotland) Act 1985, which uses a different set of principles from MCA 1973. Scottish courts focus on 'matrimonial property' (assets acquired during the marriage, excluding gifts and inheritance) and apply a presumption of equal sharing of that matrimonial property. England and Wales use the broader s.25 discretionary approach. If you are divorcing in Scotland, the SettleLens UK methodology page notes this distinction.",
          },
          {
            q: "Can we agree a settlement without going to court?",
            a: "Yes — and the majority of divorces in England and Wales are settled by agreement. However, a verbal or written private agreement is not legally binding. To make it enforceable, you must apply to the court for a consent order, which a judge reviews and approves. Without a consent order, either party could make a new financial claim years later, even after remarriage. The court fee for a consent order is currently £53.",
          },
          {
            q: "How long does a UK financial settlement take?",
            a: "If both parties agree and a consent order is drafted promptly, a financial settlement can be finalised within 3–6 months of the decree nisi (now the conditional order under the Divorce, Dissolution and Separation Act 2020). Contested cases that proceed to a Financial Remedy Hearing typically take 12–24 months and involve three court hearings (FDA, FDR, and Final Hearing). The financial process is separate from, and often longer than, the divorce itself.",
          },
        ],
        relatedLinks: [
          { title: "Consent Order in Divorce UK", href: "/en/consent-order-divorce-uk", description: "Why you need a consent order and how to get one approved" },
          { title: "Spousal Maintenance UK", href: "/en/spousal-maintenance-uk", description: "How UK courts decide maintenance amounts and duration" },
          { title: "Pension Sharing Order in Divorce", href: "/en/pension-sharing-order-divorce", description: "How pensions are split in UK divorce and what a pension sharing order costs" },
          { title: "Compare Settlement Scenarios", href: "/en/compare-divorce-settlement-scenarios", description: "Model different settlement proposals and compare 10-year financial outcomes" },
        ],
        ctaText: "Model My UK Settlement Scenarios",
        ctaHref: "/en/register",
        ctaSub: "Free to start — no credit card required",
        disclaimer:
          "SettleLens provides financial scenario modeling for informational purposes only. Not legal advice. UK divorce financial settlements are determined by the court under MCA 1973 based on individual circumstances. Always consult a qualified solicitor or barrister specialising in family law.",
      }}
    />
  );
}
