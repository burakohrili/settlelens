import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "How Is Alimony Calculated? Spousal Support Guide 2026 | SettleLens",
  description:
    "How alimony is calculated in 2026: income-based formulas, state variations, duration rules, and how to model the long-term financial impact before negotiating.",
};

export default function Page() {
  return (
    <SeoLandingTemplate
      config={{
        locale: "en",
        badge: "Alimony / Spousal Support",
        headline:
          "How Is Alimony Calculated? — Spousal Support Explained for 2026",
        intro:
          "Alimony — also called spousal support or spousal maintenance — is one of the most financially significant and most misunderstood elements of a divorce. There is no single national formula: the amount and duration depend on your state, your income, and a range of factors the judge weighs. This guide explains how alimony is typically calculated, how long it lasts, and what the numbers mean for your long-term financial plan.",
        sections: [
          {
            heading: "Two Types of Alimony: Temporary vs. Post-Divorce",
            body: "Alimony during the divorce proceedings (called pendente lite or temporary support) is designed to maintain the status quo while the case is pending — it's usually calculated more quickly and roughly. Post-divorce alimony is different: it can be rehabilitative (to help a spouse become self-supporting), durational (for a fixed period), or in rare cases permanent. Most modern alimony awards are rehabilitative or time-limited. Permanent alimony, once common, has been restricted in most states following law reforms over the past decade.",
          },
          {
            heading: "How Is Alimony Calculated? Common Methods",
            body: "There is no single national formula, but several common approaches exist. A widely-used method: 30–40% of the higher earner's monthly net income minus 20–30% of the lower earner's monthly net income. Example: Partner A earns $4,000/month net, Partner B earns $1,500/month net. ($4,000 × 35%) − ($1,500 × 25%) = $1,400 − $375 = $1,025/month. Some states have statutory formulas: Virginia, Massachusetts, and New York use income-based guidelines. Many states leave amount and duration to judicial discretion. SettleLens models scenarios across the likely range — not a single prediction.",
          },
          {
            heading: "How Long Does Alimony Last?",
            body: "Duration rules vary significantly by state and marriage length. For marriages under 10 years: typically 1 year of alimony for every 2–3 years of marriage. For marriages of 10–20 years: 5–10 years of alimony is common. For marriages over 20 years: indefinite or permanent alimony may be awarded. Key termination triggers: recipient remarries (almost universal termination), recipient cohabitates with a partner (varies by state), either spouse dies, retirement of the paying spouse (grounds for modification). Always verify your state's specific rules with an attorney.",
          },
          {
            heading: "The 10-Year Dollar Impact",
            body: "$600/month for 5 years = $36,000 total. $900/month for 8 years = $86,400 total. For the paying spouse, alimony directly reduces monthly budget and savings capacity for years. For the receiving spouse, it provides an income bridge — but one that ends. SettleLens models the full 10-year financial trajectory for both the paying and receiving side: net worth at year 1, 3, 5, and 10, monthly cash flow impact, and the break-even point. This helps you evaluate whether a proposed amount and duration is financially sustainable — or negotiable.",
          },
          {
            heading: "What Courts Actually Consider",
            body: "Courts weigh several factors beyond just income difference. Common considerations: length of the marriage, the standard of living established during the marriage, each spouse's earning capacity and employability, age and health, career sacrifices made by one spouse to support the other's education or career, child custody arrangements, and each spouse's financial resources including separate property. In some states, marital misconduct (such as infidelity) is relevant; in others, it is not considered. Always consult a local family law attorney to understand your state's specific approach.",
          },
        ],
        faq: [
          {
            q: "Can we negotiate alimony without going to court?",
            a: "Yes. Most divorces settle through negotiation or mediation. You and your spouse can agree on any amount and duration you both find acceptable, and incorporate it into a separation agreement. This is generally faster, less expensive, and gives both parties more control over the outcome than litigation.",
          },
          {
            q: "Does alimony change if my income changes significantly?",
            a: "Yes. Either party can petition for a modification if there is a substantial change in circumstances — typically defined as a change of 10–20% or more in income, loss of a job, serious illness, or the recipient gaining employment. The change must be involuntary; voluntarily reducing income to avoid alimony is not typically accepted by courts.",
          },
          {
            q: "Is alimony tax deductible in 2026?",
            a: "No. The Tax Cuts and Jobs Act (TCJA), which took effect in 2019, eliminated the alimony deduction for the paying spouse and removed the income inclusion for the receiving spouse — for divorce agreements executed or modified after December 31, 2018. If your divorce agreement predates 2019, the old rules (deductible/includible) may still apply. Consult a tax professional.",
          },
        ],
        relatedLinks: [
          { title: "Model Your Alimony Scenarios", href: "/en/alimony-impact-calculator", description: "See the 10-year financial impact of different alimony amounts and durations" },
          { title: "Child Support in Divorce", href: "/en/child-support-divorce", description: "How child support is calculated — income shares model, guidelines, long-term cost" },
          { title: "Spousal Maintenance UK", href: "/en/spousal-maintenance-uk", description: "How spousal maintenance is calculated in England and Wales under MCA 1973" },
          { title: "Spousal Support Planning Checklist", href: "/en/divorce-checklist/spousal-support-planning", description: "What to document before agreeing to any alimony amount" },
        ],
        ctaText: "Model My Alimony Scenarios",
        ctaHref: "/en/register",
        ctaSub: "Free to start — no credit card required",
        disclaimer:
          "SettleLens provides financial scenario modeling for informational purposes only. Not legal advice. Alimony amounts and duration are set by courts based on individual circumstances. Always consult a qualified family law attorney.",
      }}
    />
  );
}
