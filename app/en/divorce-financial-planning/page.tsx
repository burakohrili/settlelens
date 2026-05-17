import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "Divorce Financial Planning | SettleLens",
  description: "Plan your finances through and after divorce. Model settlement scenarios, cash flow projections, and 10-year net worth forecasts before you negotiate.",
};

export default function Page() {
  return (
    <SeoLandingTemplate config={{
      locale: "en",
      badge: "Financial Planning",
      headline: "Plan Your Finances Through Divorce — Before You Sign Anything",
      intro: "Divorce changes your financial picture permanently. Single income, new housing costs, support payments, and divided retirement accounts all affect your long-term financial position. SettleLens helps you model these changes before the decisions are made.",
      sections: [
        { heading: "The Single-Income Transition", body: "Moving from two incomes to one is the most immediate financial shock of divorce. SettleLens models your post-settlement monthly cash flow — income, support payments, housing, debt obligations — so you can see whether your plan is sustainable before you commit to it." },
        { heading: "Housing Strategy: Buy, Rent, or Transfer?", body: "Whether to keep the marital home, buy a new property, or rent affects both short-term cash flow and long-term net worth. SettleLens compares the 10-year financial impact of each housing path side by side." },
        { heading: "Retirement Account Impact", body: "Dividing retirement accounts (401k, IRA, pension) through a QDRO is one of the most complex aspects of divorce financial planning. SettleLens models how different retirement splits affect your projected retirement position at year 10." },
        { heading: "Emergency Cash Buffer", body: "Divorce brings unexpected costs: legal fees, moving expenses, new furniture, deposits. SettleLens helps you quantify the liquidity you'll need and how many months your post-settlement cash covers." },
      ],
      faq: [
        { q: "Can I use SettleLens before I decide to divorce?", a: "Yes. SettleLens is designed for early-stage 'what if' modeling. Understanding the financial picture before making a decision can help you approach the process more clearly." },
        { q: "Does SettleLens account for taxes?", a: "SettleLens models pre-tax income and post-tax cash flow estimates based on your inputs. For detailed tax planning, consult a CPA or financial advisor." },
      ],
      ctaText: "Start My Financial Plan",
      ctaHref: "/en/register",
      ctaSub: "Start free — no credit card required",
      disclaimer: "SettleLens provides financial modeling for informational purposes only. Not legal or financial advice. Always consult a qualified family law attorney and financial advisor before making major decisions.",
    }} />
  );
}
