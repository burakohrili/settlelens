import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "10-Year Divorce Financial Impact | SettleLens",
  description: "See the 10-year financial impact of your divorce settlement. Net worth projections, cash flow modeling, and inflation-adjusted outcomes across every scenario.",
};

export default function Page() {
  return (
    <SeoLandingTemplate config={{
      locale: "en",
      badge: "Long-Term Projection",
      headline: "See the 10-Year Financial Impact of Your Divorce Settlement",
      intro: "Short-term thinking is the biggest mistake in divorce financial planning. A settlement that feels fair today can leave you significantly worse off at year 5 or year 10. SettleLens models the full decade — so you can see the trajectory, not just the starting point.",
      sections: [
        { heading: "Net Worth at Year 1, 3, 5, and 10", body: "SettleLens generates a complete net worth projection timeline. You see where your assets and liabilities put you immediately after settlement, and how compound growth, debt paydown, and support payments reshape your position over each interval." },
        { heading: "Inflation and Investment Return Modeling", body: "SettleLens applies configurable inflation and investment return assumptions to each scenario. The default uses historical averages for your jurisdiction — but you can override them to model conservative, base, or optimistic outcomes." },
        { heading: "The Compounding Effect of Small Differences", body: "A $300/month difference in alimony, invested over 10 years at 6% return, is worth over $48,000. SettleLens quantifies these compounding effects and shows them in the projection chart — making the long-term cost or benefit of each term visible." },
        { heading: "Risk Score per Scenario", body: "Each scenario in SettleLens receives a risk score from 1 to 10, based on debt-to-income ratio, mortgage affordability, alimony duration, and liquidity. High-risk scenarios are flagged — so you can discuss them with your attorney before accepting." },
      ],
      faq: [
        { q: "How reliable is a 10-year financial projection?", a: "All projections are estimates based on your inputs and configurable assumptions. Market returns, inflation, and personal circumstances will differ. SettleLens shows a labeled confidence level with each result — use it as a planning guide, not a guarantee." },
        { q: "Which plans include 10-year projections?", a: "10-year AI projections are included in the Scenario Package and above. The free Discovery plan includes a basic net worth summary." },
      ],
      ctaText: "See My 10-Year Projection",
      ctaHref: "/en/register",
      ctaSub: "Start free — no credit card required",
      disclaimer: "SettleLens provides financial modeling for informational purposes only. Projections are estimates and will differ from actual outcomes. Not legal or investment advice. Consult a qualified attorney and financial advisor.",
    }} />
  );
}
