import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "Keep or Sell the House in Divorce? | SettleLens",
  description: "Should you keep the house in your divorce? Compare the 10-year financial impact of keeping, selling, or transferring the home — with real numbers.",
};

export default function Page() {
  return (
    <SeoLandingTemplate config={{
      locale: "en",
      badge: "House Decision Analysis",
      headline: "Keep or Sell the House in Divorce? See the Real Numbers.",
      intro: "The house is often the biggest financial decision in divorce — and the most emotionally charged. SettleLens removes the emotion and shows you the 10-year financial impact of each path, so you can decide based on facts.",
      sections: [
        { heading: "Option A: You Keep the House", body: "Keeping the home means you retain the equity but take on the full mortgage, insurance, taxes, and maintenance costs. SettleLens checks whether your post-settlement income can support this monthly burden — and projects your net worth at year 10 under this scenario." },
        { heading: "Option B: Your Spouse Keeps the House", body: "Transferring the home means receiving a cash buyout or offsetting assets. SettleLens models what you do with those proceeds — investing, renting, or purchasing a smaller property — and compares the 10-year outcome against keeping the house." },
        { heading: "Option C: Sell and Split", body: "A clean sale distributes equity between both parties. SettleLens models how your share of the sale proceeds, combined with your other settlement terms, positions you financially over 10 years." },
        { heading: "The Hidden Costs of Keeping the Home", body: "Mortgage affordability on a single income is just one risk. Property taxes, HOA fees, major repairs, and reduced liquidity are common traps. SettleLens flags these pressure points and shows their cumulative impact." },
      ],
      faq: [
        { q: "How do I enter my home's value?", a: "You enter your current estimated market value and remaining mortgage balance. SettleLens uses these to calculate net equity and models each ownership scenario from there." },
        { q: "What if we have a shared mortgage?", a: "Joint mortgage liability is a key negotiation point. SettleLens lets you model who retains the mortgage and the financial impact for both parties — helping you prepare for that discussion." },
      ],
      ctaText: "Compare My House Scenarios",
      ctaHref: "/en/register",
      ctaSub: "Start free — no credit card required",
      disclaimer: "SettleLens provides financial scenario modeling for informational purposes only. Not legal or financial advice. Consult a qualified family law attorney for decisions affecting your legal rights.",
    }} />
  );
}
