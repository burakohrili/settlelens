import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "Compare Divorce Settlement Scenarios | SettleLens",
  description: "Compare up to 3 divorce settlement scenarios side by side. See the 10-year net worth and monthly cash flow impact of each option.",
};

export default function Page() {
  return (
    <SeoLandingTemplate config={{
      locale: "en",
      badge: "Scenario Comparison",
      headline: "Compare Divorce Settlement Scenarios Side by Side",
      intro: "You have options. Each one leaves you in a different financial position five, ten years from now. SettleLens puts them side by side so you can see which path leads where — before you commit to anything.",
      sections: [
        { heading: "Why Side-by-Side Comparison Matters", body: "Settlement terms that look similar on paper can produce dramatically different outcomes over time. A $500/month difference in alimony over 8 years is $48,000. A different retirement split can mean tens of thousands less at retirement. SettleLens makes these differences visible." },
        { heading: "Compare Up to 3 Scenarios", body: "Build your preferred scenario, enter your spouse's offer as a second, and add a middle-ground option as a third. The comparison table shows net worth at year 1, 3, 5, and 10 — and monthly cash flow — for each scenario simultaneously." },
        { heading: "The Offer Analysis Feature", body: "When you receive a formal offer, SettleLens can analyze it against your baseline scenario specifically. It highlights the key financial differences and generates a list of points worth discussing with your attorney." },
        { heading: "Share with Your Attorney", body: "The Lawyer Edition exports your scenario comparison to PDF and Excel. Your attorney can review the comparison during your meeting — focusing the conversation on which terms matter most financially." },
      ],
      faq: [
        { q: "How many scenarios can I create?", a: "Free Discovery plan includes 3 scenarios (without AI analysis). Paid plans include unlimited scenarios with 10-year AI projections." },
        { q: "Can I modify a scenario after creating it?", a: "Yes. All scenarios are editable. You can adjust any variable — house outcome, alimony, retirement split — and the projection updates immediately." },
      ],
      ctaText: "Compare My Scenarios",
      ctaHref: "/en/register",
      ctaSub: "Start free — no credit card required",
      disclaimer: "SettleLens provides financial scenario modeling for informational purposes only. Not legal advice. Always consult a qualified family law attorney before making settlement decisions.",
    }} />
  );
}
