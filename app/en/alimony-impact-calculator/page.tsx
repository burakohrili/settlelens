import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "Alimony Financial Impact — Model Your Scenarios | SettleLens",
  description: "See the 10-year financial impact of alimony payments in your divorce. Model different spousal support amounts and durations to understand your long-term position.",
};

export default function Page() {
  return (
    <SeoLandingTemplate config={{
      locale: "en",
      badge: "Alimony Analysis",
      headline: "See the Long-Term Financial Impact of Alimony — Before You Agree",
      intro: "Alimony (spousal support) is one of the most financially significant and negotiable elements of a divorce settlement. SettleLens models how different support amounts and durations affect your 10-year net worth and monthly cash flow — giving you data to guide your negotiation.",
      sections: [
        { heading: "How Alimony Affects Your Cash Flow", body: "Whether you're paying or receiving spousal support, alimony changes your monthly financial picture immediately. SettleLens adds alimony to your post-settlement budget alongside housing, child support, and investment returns — showing you whether your plan is sustainable month by month." },
        { heading: "Duration Matters as Much as Amount", body: "Five years of $2,000/month is very different from 10 years of $1,500/month — especially when inflation is factored in. SettleLens models different duration and amount combinations so you can see the cumulative 10-year cost or benefit of each option." },
        { heading: "Jurisdiction-Specific Formulas", body: "Alimony guidelines vary significantly by state. Some states use income-shares models, others use discretionary judicial standards. SettleLens applies jurisdiction-aware assumptions for all US states, UK, Germany, France, Spain, and Turkey — with appropriate confidence labels." },
        { heading: "Compare the Offer Against Your Baseline", body: "If your spouse has proposed a specific alimony arrangement, enter it into SettleLens alongside your own position. The side-by-side 10-year comparison shows you exactly how much the difference matters financially." },
      ],
      faq: [
        { q: "Can SettleLens predict what a judge will award?", a: "No. Alimony decisions involve judicial discretion and many personal factors. SettleLens models the financial impact of different amounts — it does not predict legal outcomes." },
        { q: "Does the model account for modification over time?", a: "You can model different durations and enter potential modification scenarios as separate runs. SettleLens does not automatically model court-ordered modifications." },
      ],
      ctaText: "Model My Alimony Scenarios",
      ctaHref: "/en/register",
      ctaSub: "Start free — no credit card required",
      disclaimer: "SettleLens provides financial scenario modeling for informational purposes only. Not legal advice. Alimony determination involves judicial discretion. Always consult a qualified family law attorney.",
    }} />
  );
}
