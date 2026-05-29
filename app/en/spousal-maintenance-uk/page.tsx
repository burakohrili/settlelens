import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "Spousal Maintenance UK — How It's Calculated and How Long It Lasts | SettleLens",
  description:
    "How spousal maintenance is calculated in England and Wales: what courts consider, typical amounts and durations, clean break alternatives, and how to model the long-term financial impact.",
};

export default function Page() {
  return (
    <SeoLandingTemplate
      config={{
        locale: "en",
        badge: "UK Divorce Law — England & Wales",
        headline: "Spousal Maintenance UK — What It Is, How It's Calculated, and How Long It Lasts",
        intro:
          "Spousal maintenance (also called periodical payments or spousal support) is an ongoing financial payment from one ex-spouse to the other after divorce. In England and Wales, courts prefer a clean break where possible, but maintenance is ordered when one party cannot meet their reasonable needs from their own resources. This guide explains how courts decide whether to award maintenance, how the amount and duration are determined, and how to model the long-term financial impact.",
        sections: [
          {
            heading: "What Is Spousal Maintenance in England and Wales?",
            body: "Spousal maintenance is a periodic payment — usually monthly — ordered under the Matrimonial Causes Act 1973. It is separate from child maintenance (which falls under the Child Maintenance Service). Courts award spousal maintenance when one spouse cannot achieve financial independence without ongoing support from the other. Common scenarios: one spouse gave up a career to raise children and needs time to retrain or re-enter the work force; one spouse has significantly lower earning capacity due to disability or age; the marriage was very long and financial dependence is deeply established. UK courts do not automatically award maintenance: the clean break principle (s.25A MCA 1973) requires the court to consider whether the financial ties between the parties should be severed.",
          },
          {
            heading: "How Is Spousal Maintenance Calculated?",
            body: "There is no statutory formula for calculating spousal maintenance in England and Wales. The starting point is the payee's 'budgetary needs' — what they genuinely need to meet reasonable living costs. A maintenance order is usually set at the gap between the payee's income and their reasonable outgoings. Example: payee earns £1,200/month net, reasonable monthly budget assessed at £2,000/month — maintenance ordered at £800/month. The paying spouse's ability to pay is then checked: the order cannot leave the payer unable to meet their own reasonable needs. In practice, courts in most cases look at both parties' income, outgoings, and the available surplus. Detailed Duxbury tables (actuarial calculations) are used for capitalising maintenance into a lump sum alternative.",
          },
          {
            heading: "How Long Does Spousal Maintenance Last?",
            body: "Courts strongly prefer time-limited (term) maintenance over joint-lives (open-ended) maintenance. A term order might run for 3–5 years, giving the receiving spouse time to retrain, increase their income, or otherwise become self-sufficient. After the landmark case of SS v NS [2014], courts established that maintenance should be for the shortest term appropriate. Joint-lives orders (continuing until death or remarriage) are now rare and typically reserved for long marriages where one party is elderly, seriously ill, or has no realistic prospect of becoming financially independent. Maintenance automatically ends on: (1) the remarriage of the receiving spouse, (2) the death of either party, (3) the date specified in a term order, or (4) a further court order.",
          },
          {
            heading: "Nominal Maintenance Orders",
            body: "Where a clean break is not appropriate but the receiving spouse is currently self-sufficient, courts sometimes make a 'nominal' maintenance order — typically £1 per year. This keeps the door open: if the receiving spouse's circumstances deteriorate in future (for example, due to illness or redundancy), they can return to court to increase the nominal order. A nominal order is common in long marriages where the financial gap is small but the court wants to preserve the receiving party's right to seek increased maintenance if needed. If you want certainty and closure, pressing for a clean break dismissal is preferable to a nominal order.",
          },
          {
            heading: "Clean Break — The Preferred Alternative",
            body: "Section 25A MCA 1973 requires the court to consider whether the parties' financial obligations to each other can be terminated immediately or within a defined period. A clean break consent order dismisses all future financial claims — neither party can ever apply for maintenance or capital provision again. Where both parties can meet their needs from the settled assets alone, courts will almost always make a clean break. Accepting a slightly smaller share of assets in return for a clean break is often financially preferable in the long run — it eliminates the risk of ongoing litigation, income disclosure obligations, and the uncertainty of variable maintenance.",
          },
          {
            heading: "The Long-Term Financial Impact",
            body: "Maintenance is one of the most financially significant variables in a divorce settlement — yet it is often negotiated without modelling the numbers over the full duration. £800/month for 5 years is £48,000. £1,200/month with a joint-lives order over 15 years is £216,000. For the paying spouse, maintenance reduces monthly cash flow and long-term savings capacity. For the receiving spouse, it provides an income bridge — but one that ends. SettleLens models both the paying and receiving side: net worth at year 1, 3, 5, and 10 under different maintenance assumptions, so you can compare the financial difference between term and joint-lives orders, or between maintenance and a lump sum buyout.",
          },
        ],
        checklist: [
          "Document both parties' income: salary, dividends, rental income, benefits",
          "Prepare a realistic monthly budget for both parties post-divorce",
          "Identify the gap between the lower-earning spouse's income and reasonable needs",
          "Assess the paying spouse's ability to pay after meeting their own needs",
          "Consider the receiving spouse's realistic path to financial independence",
          "Explore capitalisation: convert maintenance to a lump sum using Duxbury tables",
          "Evaluate whether a nominal order or clean break is more appropriate",
          "Check whether a joint-lives or term order is justified given marriage length",
          "Model the long-term financial difference between maintenance vs. extra assets",
          "Ensure any maintenance order specifies termination triggers clearly",
        ],
        faq: [
          {
            q: "Can spousal maintenance be varied after it is ordered?",
            a: "Yes. Either party can apply to vary a maintenance order if there is a material change in circumstances — the paying spouse loses their job, their income increases significantly, or the receiving spouse's circumstances change. The threshold is a real and substantial change. Courts will also consider whether the receiving spouse has taken reasonable steps toward financial independence during the period of the order. Variation applications are heard in the Family Court.",
          },
          {
            q: "What happens if the paying spouse stops paying maintenance?",
            a: "If maintenance is ordered by the court and the paying spouse defaults, the receiving spouse can apply to enforce the order. Enforcement options include an attachment of earnings order (deducting maintenance directly from wages), charging order on property, third-party debt orders, or committal to prison for serious contempt. Arrears of maintenance are recoverable for up to 12 months without leave of the court (s.32 MCA 1973); older arrears require court permission.",
          },
          {
            q: "Is spousal maintenance tax-free in the UK?",
            a: "Maintenance payments made by one individual to a former spouse are not deductible by the payer and are not taxable income for the recipient under current HMRC rules — provided the payments are made under a court order or legally binding maintenance agreement. This means the receiving spouse receives the full amount net of tax. Lump sum capital payments on divorce are also not subject to capital gains tax between spouses at the time of the order (Section 58 TCGA 1992 — though there are time limits post-separation). Always confirm tax treatment with an accountant.",
          },
        ],
        relatedLinks: [
          { title: "Divorce Financial Settlement UK", href: "/en/divorce-financial-settlement-uk", description: "How the overall financial settlement works under MCA 1973 Section 25" },
          { title: "Consent Order in Divorce UK", href: "/en/consent-order-divorce-uk", description: "How to formalise your agreed maintenance terms in a court order" },
          { title: "Model Alimony Scenarios", href: "/en/alimony-impact-calculator", description: "See the 10-year financial impact of different maintenance amounts and durations" },
          { title: "10-Year Divorce Financial Impact", href: "/en/10-year-divorce-financial-impact", description: "Project your net worth over 10 years under different settlement scenarios" },
        ],
        ctaText: "Model My Maintenance Scenarios",
        ctaHref: "/en/register",
        ctaSub: "Free to start — no credit card required",
        disclaimer:
          "SettleLens provides financial scenario modeling for informational purposes only. Not legal advice. Spousal maintenance in England and Wales is determined by the family court under MCA 1973 based on individual circumstances. Always consult a qualified family law solicitor.",
      }}
    />
  );
}
