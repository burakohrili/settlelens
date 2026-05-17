import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "Divorce Agreement Simulator | SettleLens",
  description: "Simulate different divorce agreement terms and see the financial outcome. Model assets, debts, support, and housing — compare side by side.",
};

export default function Page() {
  return (
    <SeoLandingTemplate config={{
      locale: "en",
      badge: "Agreement Simulator",
      headline: "Simulate Any Divorce Agreement — See the Financial Outcome",
      intro: "What happens if you accept this offer? What if you counter? SettleLens lets you build any settlement scenario from scratch, entering the specific terms under discussion — and shows you the 10-year financial result.",
      sections: [
        { heading: "Build a Settlement Scenario in Minutes", body: "Enter your assets, debts, income, and the proposed split: who keeps the house, how retirement accounts are divided, what alimony looks like. SettleLens calculates your net worth now, at year 1, year 3, year 5, and year 10." },
        { heading: "Test 'What If' Variations", body: "What if you pushed for a different alimony amount? What if you gave up the house to avoid mortgage risk? SettleLens makes it easy to test variations and see which choice produces a stronger financial outcome over time." },
        { heading: "Offer Analysis Mode", body: "When you receive an offer from your spouse or their attorney, enter it directly into SettleLens as a separate scenario. The system compares it against your baseline scenario with a 10-year delta — showing you exactly how much better or worse it leaves you." },
        { heading: "Prepare Your Counter-Proposal", body: "Understanding which elements of the offer are most financially impactful gives you a clear negotiation priority list. SettleLens shows you the line items that matter most — helping you and your attorney focus negotiation energy in the right places." },
      ],
      faq: [
        { q: "How accurate is the simulation?", a: "The simulation is based on the data you enter. It uses jurisdiction-specific legal frameworks for property division and support calculations. It is a financial estimate, not a legal determination — always labeled with a confidence level." },
        { q: "Can I compare my scenario to my spouse's proposal?", a: "Yes. SettleLens supports side-by-side scenario comparison. You can model your proposal and your spouse's offer simultaneously and view the 10-year difference in net worth and cash flow." },
      ],
      ctaText: "Simulate My Settlement",
      ctaHref: "/en/register",
      ctaSub: "Start free — no credit card required",
      disclaimer: "SettleLens provides financial scenario modeling for informational purposes only. Simulation results are estimates based on user-entered data. Not legal advice. Consult a qualified family law attorney.",
    }} />
  );
}
