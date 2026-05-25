import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "What Is a QDRO? Retirement Accounts in Divorce Explained | SettleLens",
  description:
    "QDRO explained: what it is, which retirement accounts need one, how the process works, what it costs, and how to model your retirement share in divorce.",
};

export default function Page() {
  return (
    <SeoLandingTemplate
      config={{
        locale: "en",
        badge: "Retirement in Divorce",
        headline:
          "What Is a QDRO? — Retirement Accounts in Divorce Explained",
        intro:
          "Retirement accounts are often the largest single asset in a divorce — and among the most mishandled. A mistake with a 401(k) division can trigger a 10% early withdrawal penalty plus income taxes, turning a $100,000 retirement asset into $65,000 in cash. The Qualified Domestic Relations Order (QDRO) is the legal mechanism that allows retirement accounts to be divided in divorce without these penalties. Here's what you need to know.",
        sections: [
          {
            heading: "What Is a QDRO?",
            body: "A Qualified Domestic Relations Order (QDRO) is a court order that instructs a retirement plan administrator to pay a portion of the account to an alternate payee — typically an ex-spouse. The key benefit: a properly executed QDRO allows the transfer to happen without triggering the 10% early withdrawal penalty or immediate income taxes. The alternate payee can roll the funds into their own IRA or keep them in the plan, and taxes are only paid when funds are eventually withdrawn. Important: IRAs (Traditional, Roth, SEP) do not use QDROs — they use a simpler \"transfer incident to divorce.\"",
          },
          {
            heading: "Which Retirement Accounts Need a QDRO?",
            body: "Accounts governed by ERISA (employer-sponsored plans) require a QDRO: 401(k), 403(b), 457(b) plans, defined benefit (pension) plans, and profit-sharing plans. Accounts that do NOT use a QDRO: Traditional IRA, Roth IRA, SEP-IRA, and SIMPLE IRA (these use a transfer incident to divorce, which is simpler). Special cases: Federal government employees with FERS or CSRS pensions use a different order called a Court Order Acceptable for Processing (COAP). Military pensions use the Uniformed Services Former Spouses' Protection Act (USFSPA) and require at least 10 years of marriage overlapping with 10 years of service (the \"10/10 rule\") for direct payment.",
          },
          {
            heading: "The QDRO Process — Step by Step",
            body: "Step 1: Your divorce attorney (or a QDRO specialist) drafts the QDRO language. Step 2: Submit the draft to the plan administrator for pre-approval before the divorce is final — this prevents expensive revisions later. Step 3: The judge signs the divorce decree and the QDRO simultaneously. Step 4: The approved QDRO is submitted to the plan administrator. Step 5: The plan administrator implements the transfer, typically within 18–90 days. Timeline: allow 3–6 months from divorce finalization to completed transfer. Cost: a QDRO attorney typically charges $500–$1,500; some plans have their own forms. Do not use generic online templates — plan-specific language is required.",
          },
          {
            heading: "How Much of the Retirement Account Do You Receive?",
            body: "Most agreements divide only the marital portion — contributions and investment growth during the marriage. Pre-marital balances and post-separation growth typically remain with the account owner. For defined benefit pensions, the most common approach is the \"coverture fraction\": years of service during the marriage ÷ total years of service × total benefit × 50%. An alternative to splitting the retirement account is the offset method: the account owner keeps their entire pension, and the other spouse receives equivalent value in other marital assets (cash, home equity). SettleLens models both approaches and shows the 10-year net worth projection for each.",
          },
          {
            heading: "Modeling the Retirement Impact in SettleLens",
            body: "Retirement accounts often represent 30–60% of total marital wealth for couples in their 40s and 50s. A $200,000 401(k) split 50/50 gives each spouse $100,000 — but after different investment decisions and withdrawal timing, the 10-year impact diverges significantly. A Roth IRA of $80,000 may be worth more than a Traditional IRA of $100,000 due to the tax difference at withdrawal. SettleLens helps you model different retirement split percentages, compare the offset method vs. direct split, and project how each scenario affects your long-term net worth.",
          },
        ],
        faq: [
          {
            q: "Do I have to split my 401(k) in a divorce?",
            a: "No — it's a marital asset, not an automatically divided one. You can negotiate to keep your 401(k) intact and compensate your spouse with equivalent value from other marital assets (home equity, cash, investments). This is called the offset method. Whether this is financially advantageous depends on the specific assets involved, tax implications, and your post-divorce financial needs.",
          },
          {
            q: "How long does the QDRO process take from start to finish?",
            a: "The full process typically takes 3–6 months after the divorce is finalized: 2–4 weeks for drafting, 2–8 weeks for plan administrator pre-approval, and 30–90 days for the plan to implement the transfer after receiving the signed QDRO. Some large employers process QDROs faster; government and pension plans can take longer. Start early — do not wait until after the divorce is final to begin the QDRO process.",
          },
          {
            q: "Can I get a QDRO years after the divorce was finalized?",
            a: "Technically yes, but delays create significant complications. The retirement account may have changed value. The plan administrator may require re-submission. If the account owner retires before the QDRO is filed, it can disrupt payments. Most importantly, if the account owner dies before the QDRO is issued, you may lose your rights to the benefit entirely. Do not delay — finalize the QDRO concurrent with the divorce decree.",
          },
        ],
        relatedLinks: [
          { title: "Retirement Accounts Divorce Checklist", href: "/en/divorce-checklist/retirement-accounts", description: "Complete checklist for locating, valuing, and dividing retirement accounts" },
          { title: "Equitable Distribution — Step by Step", href: "/en/equitable-distribution-divorce", description: "How all marital property is identified, valued, and divided" },
          { title: "10-Year Net Worth Projections", href: "/en/10-year-divorce-financial-impact", description: "Model how different retirement splits affect your long-term financial position" },
          { title: "Offset vs. Split — Compare Scenarios", href: "/en/compare-divorce-settlement-scenarios", description: "Keep the 401(k) or trade it for home equity? See the numbers." },
        ],
        ctaText: "Model My Retirement Division",
        ctaHref: "/en/register",
        ctaSub: "Free to start — no credit card required",
        disclaimer:
          "SettleLens provides financial scenario modeling for informational purposes only. Not legal advice. QDRO requirements vary by plan and jurisdiction. Always work with a qualified QDRO specialist and family law attorney.",
      }}
    />
  );
}
