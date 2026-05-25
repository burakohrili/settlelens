import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "Divorce Lawyer Preparation Checklist | SettleLens",
  description: "What to prepare before your first divorce lawyer meeting. Financial documents, asset inventory, and scenario analysis — get organized before you sit down.",
};

export default function Page() {
  return (
    <SeoLandingTemplate config={{
      locale: "en",
      badge: "Lawyer Preparation",
      headline: "What to Prepare Before Your First Divorce Lawyer Meeting",
      intro: "Attorney time is expensive. Arriving at your first meeting with organized financial data means your lawyer can focus on strategy — not on gathering basic numbers. Here's what to prepare.",
      checklist: [
        "Complete list of all assets with current market values (real estate, vehicles, bank accounts, investments, retirement accounts)",
        "All outstanding debts: mortgage balance, auto loans, credit cards, student loans, personal loans",
        "Both parties' annual gross and net income (pay stubs, tax returns for last 2 years)",
        "List of assets acquired before the marriage (to identify separate vs. marital property)",
        "Children's ages and current custody arrangement (if applicable)",
        "Any prenuptial or postnuptial agreements",
        "Business ownership documents and valuations (if applicable)",
        "Retirement account statements (401k, IRA, pension, QDRO eligibility)",
        "Any existing offers or proposals from your spouse or their attorney",
        "A 10-year financial projection of your post-settlement position",
      ],
      sections: [
        { heading: "Why Preparation Saves You Money", body: "Family law attorneys typically bill $200–$500/hour. Every minute spent gathering documents in a meeting is money spent on administrative work instead of legal strategy. Clients who arrive prepared consistently report shorter, more productive meetings." },
        { heading: "SettleLens Generates Your Financial Summary", body: "After entering your assets, debts, income, and settlement scenarios, SettleLens generates an attorney-ready PDF and Excel summary. This organized output gives your lawyer a clear financial baseline on page one — no back-and-forth required." },
      ],
      faq: [
        { q: "What if I don't have access to all financial documents?", a: "Start with what you have. Your attorney can help obtain formal discovery if documents are inaccessible. SettleLens lets you enter estimated values and flag items that need verification." },
        { q: "Can I share my SettleLens report directly with my attorney?", a: "Yes. The Lawyer Edition PDF is designed for exactly this purpose. It's clearly labeled as financial modeling (not a legal document) and structured for professional review." },
      ],
      relatedLinks: [
        { title: "Equitable Distribution — Step by Step", href: "/en/equitable-distribution-divorce", description: "How property division works in 41 states — identify, value, model" },
        { title: "What Is a QDRO?", href: "/en/what-is-a-qdro", description: "Retirement account division — what your attorney needs to know" },
        { title: "How Is Alimony Calculated?", href: "/en/how-is-alimony-calculated", description: "Spousal support calculation methods and state-by-state variations" },
        { title: "Divorce Financial Planning Guide", href: "/en/divorce-financial-planning", description: "All financial aspects of your divorce — one complete guide" },
      ],
      ctaText: "Build My Financial Summary",
      ctaHref: "/en/register",
      ctaSub: "Start free — no credit card required",
      disclaimer: "SettleLens provides financial modeling for informational purposes only. Not legal or financial advice. Always consult a qualified family law attorney before making any decisions.",
    }} />
  );
}
