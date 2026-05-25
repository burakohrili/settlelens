import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "Equitable Distribution in Divorce — How Property Is Divided | SettleLens",
  description:
    "How equitable distribution works step by step: identify marital property, value assets, understand what factors courts weigh, and model your financial outcome.",
};

export default function Page() {
  return (
    <SeoLandingTemplate
      config={{
        locale: "en",
        badge: "Property Division Guide",
        headline:
          "Equitable Distribution in Divorce — How Property Is Actually Divided",
        intro:
          "Equitable distribution is the property division system used in 41 US states. Unlike community property, it doesn't divide assets 50/50 — it divides them fairly, based on a range of factors. Understanding the process before you negotiate can mean the difference of tens of thousands of dollars in your financial future. This guide walks through each step.",
        sections: [
          {
            heading: "The 4-Step Property Division Process",
            body: "Property division in an equitable distribution state follows four steps: (1) Identify all property owned by either spouse. (2) Classify each asset as marital or separate. (3) Value the marital assets. (4) Distribute them equitably. Each step has its own complexity, and mistakes at any stage can affect your outcome significantly.",
          },
          {
            heading: "Step 1: Identifying Marital Property",
            body: "Marital property is everything acquired by either spouse during the marriage, regardless of whose name it's in. This includes: home equity growth since purchase, your 401(k) contributions and investment growth during the marriage, joint and individual bank accounts funded during marriage, business appreciation, and income-based assets. Separate property — what you owned before marriage, gifts, inheritances — typically stays yours, but only if it can be clearly traced and hasn't been commingled with marital funds.",
          },
          {
            heading: "Step 2: Valuing What You Own",
            body: "Every marital asset must be valued as of a specific date (usually the date of separation or divorce filing, depending on state). Real estate: professional appraisal is standard; tax assessments often undervalue. Retirement accounts: use the account statement closest to the valuation date; defined benefit pensions require actuarial analysis. Businesses: the most complex — a certified business valuator is often required. Crypto assets: high volatility makes the valuation date critical. SettleLens lets you enter values and model different scenarios if valuations are disputed.",
          },
          {
            heading: "Step 3: The Factors Courts Weigh",
            body: "Most equitable distribution states use a multi-factor test. Common factors: (1) Duration of the marriage. (2) Each spouse's income and earning capacity. (3) Financial contributions during the marriage. (4) Non-financial contributions — raising children, supporting a spouse's education or career. (5) Age and health of each spouse. (6) Child custody arrangements. (7) Standard of living established during the marriage. (8) Tax consequences of the proposed division. (9) Whether one spouse dissipated (wasted) marital assets.",
          },
          {
            heading: "Step 4: Modeling the Financial Outcome",
            body: "The most important insight: asset composition often matters more than percentage. A 60/40 split where you receive liquid assets and your spouse receives the house can be financially superior to a 50/50 split where you're house-rich and cash-poor. SettleLens models the net worth trajectory of each possible scenario — so you can see whether keeping the house, keeping the retirement account, or taking cash leads to the strongest financial position at year 5 and year 10.",
          },
          {
            heading: "Common Mistakes in Property Division",
            body: "The most costly mistakes: (1) Overvaluing the house and undervaluing illiquidity. (2) Ignoring the tax difference between a traditional 401(k) and a Roth IRA of the same balance. (3) Forgetting unvested stock options or deferred compensation. (4) Accepting a 50/50 of gross assets without accounting for debts attached to each asset. (5) Not documenting separate property contributions — without records, courts may treat it as marital. (6) Missing the deadline to file a QDRO after the divorce is final.",
          },
        ],
        checklist: [
          "List every marital asset with current estimated value",
          "Gather purchase records or statements for any pre-marital separate property claims",
          "Get a professional home appraisal (not just Zillow)",
          "Request retirement account statements dated at or near the valuation date",
          "Obtain business valuation from a certified valuator if applicable",
          "Document all debts attached to each asset",
          "Research your state's specific equitable distribution factors",
          "Check for unvested stock options, deferred compensation, or restricted shares",
          "Note any inheritances or gifts received — maintain separate records",
          "Identify any assets that may have been transferred or dissipated before separation",
        ],
        faq: [
          {
            q: "What is the difference between equitable distribution and community property?",
            a: "Community property states (CA, TX, AZ, NV, WA, NM, ID, LA, WI) divide marital assets 50/50 by default. Equitable distribution states (the other 41) divide assets based on a fairness standard, with a judge weighing multiple factors. The result could be 50/50, but it could also be 60/40 or another ratio depending on your specific circumstances.",
          },
          {
            q: "Can my spouse and I agree on our own division without going to court?",
            a: "Yes. Most divorces settle out of court through negotiation or mediation. You and your spouse can agree on any division you both find acceptable, and the court will typically approve it as long as it isn't grossly unfair to either party or to children. A negotiated settlement is generally faster and less expensive than litigation.",
          },
          {
            q: "What if my spouse hid assets before we separated?",
            a: "Asset concealment is unfortunately common. Both spouses have a legal duty of financial disclosure. If you suspect hidden assets, your attorney can use subpoenas, formal discovery, and forensic accountants to uncover them. Courts can impose significant penalties for asset concealment, including awarding a larger share to the deceived spouse.",
          },
        ],
        relatedLinks: [
          { title: "What Is Equitable Distribution?", href: "/en/what-is-equitable-distribution", description: "The basics: community property vs. equitable distribution states explained" },
          { title: "Compare Settlement Scenarios", href: "/en/compare-divorce-settlement-scenarios", description: "Model multiple split ratios and see the 10-year financial difference" },
          { title: "Complete Divorce Financial Planning", href: "/en/divorce-financial-planning", description: "All financial aspects of your divorce — assets, support, house, retirement" },
          { title: "Keep or Sell the House?", href: "/en/keep-or-sell-house-divorce", description: "Three house scenarios compared financially over 10 years" },
        ],
        ctaText: "Model My Property Division",
        ctaHref: "/en/register",
        ctaSub: "Free to start — no credit card required",
        disclaimer:
          "SettleLens provides financial scenario modeling for informational purposes only. Not legal advice. Property division outcomes depend on your specific facts and jurisdiction. Always consult a qualified family law attorney.",
      }}
    />
  );
}
