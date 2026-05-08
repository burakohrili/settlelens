import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

const CHECKLIST_TOPICS = [
  {
    slug: "before-consulting-lawyer",
    title: "Divorce Financial Checklist: Before Consulting a Lawyer",
    description: "Organize your financial picture before your first attorney meeting. This checklist helps you prepare the documents and numbers your lawyer needs.",
    items: [
      { heading: "Income Documentation", checks: ["Last 3 years of tax returns (joint and individual)", "Recent pay stubs (last 3 months)", "Spouse's income documents if available", "Self-employment income records, P&L statements", "Investment and rental income statements"] },
      { heading: "Asset Inventory", checks: ["Real estate — address, estimated value, mortgage balance", "Bank and brokerage account statements (last 6 months)", "Retirement accounts — 401(k), IRA, pension statements", "Vehicles — make, model, year, current value, loan balance", "Business interests — ownership percentage, estimated value"] },
      { heading: "Debt Records", checks: ["Mortgage statement with payoff amount", "Car loan statements", "Credit card balances for all accounts (joint and individual)", "Student loan balances", "Any other personal loans or lines of credit"] },
      { heading: "Insurance", checks: ["Life insurance policies — face value, cash value", "Health insurance coverage details", "Disability insurance"] },
      { heading: "Legal Documents", checks: ["Marriage certificate", "Prenuptial or postnuptial agreement (if applicable)", "Any existing court orders (child support, custody)", "Wills and trusts"] },
    ],
  },
  {
    slug: "hidden-assets",
    title: "How to Identify Hidden Assets in Divorce",
    description: "Asset concealment is more common than most people realize. Learn the warning signs and what steps you can take to protect your financial interests.",
    items: [
      { heading: "Warning Signs of Hidden Assets", checks: ["Sudden decline in business income or revenue", "Large cash withdrawals you cannot account for", "Unexplained loans repaid to friends or family", "New debt you were not aware of", "Business expenses that seem unusually high", "Overpayment of taxes (to receive a refund after divorce)"] },
      { heading: "Documents to Request", checks: ["Business financial statements and tax returns", "Bank statements for all accounts (personal and business)", "Credit card statements", "Cryptocurrency exchange account history", "Offshore bank account disclosures (FBAR filings)", "Pension and deferred compensation plan documents"] },
      { heading: "Professional Help", checks: ["Forensic accountant — traces financial irregularities", "Certified divorce financial analyst (CDFA)", "Private investigator (for lifestyle investigations)", "Attorney subpoena power — requires formal discovery"] },
      { heading: "Red Flags in Specific Asset Types", checks: ["Real estate — look for deeds transferred to relatives", "Business — look for inflated salaries to employees who are family", "Crypto — check for wallet addresses not disclosed", "Collectibles — art, jewelry, wine collections often undervalued"] },
    ],
  },
  {
    slug: "house-decision",
    title: "Keeping vs. Selling the House in Divorce: Financial Checklist",
    description: "The house is often the biggest financial decision in a divorce. Use this checklist to evaluate whether keeping, selling, or transferring the home makes financial sense.",
    items: [
      { heading: "If You Want to Keep the House", checks: ["Can you qualify for the mortgage alone? (Check debt-to-income ratio)", "Can you afford monthly payments on your post-divorce income?", "Budget for maintenance, taxes, and insurance alone", "Factor in the opportunity cost — what else could you do with the equity?", "Get a current appraisal to ensure fair equity calculation"] },
      { heading: "If You Want to Sell", checks: ["Estimate net sale proceeds (value − mortgage − 6% selling costs)", "Agree on listing price and timeline with your attorney", "Clarify how proceeds will be split", "Plan for capital gains tax implications if equity exceeds $250K ($500K married)"] },
      { heading: "If Your Spouse Keeps the House", checks: ["Ensure your name is removed from the mortgage (refinance required)", "Get the buyout amount in writing — based on current equity", "Confirm deed transfer is completed at closing", "Check that the transfer does not trigger a taxable event"] },
      { heading: "10-Year Financial Comparison", checks: ["Model 'I keep' vs 'sell' vs 'spouse keeps' in SettleLens", "Compare net worth at year 5 and year 10 under each scenario", "Factor in mortgage payments vs investing the equity elsewhere", "Consider school districts, relocation costs, and emotional factors separately"] },
    ],
  },
  {
    slug: "retirement-accounts",
    title: "Dividing Retirement Accounts in Divorce: Financial Checklist",
    description: "Retirement accounts are often the largest marital asset. This checklist ensures you don't miss any accounts or make costly errors in the division process.",
    items: [
      { heading: "Locate All Retirement Accounts", checks: ["401(k) and 403(b) from current and prior employers", "Traditional IRA and Roth IRA accounts", "Defined benefit (pension) plans", "Military retirement (USFSPA)", "Federal government retirement (FERS/CSRS)", "Stock option and deferred compensation plans"] },
      { heading: "Determine the Marital Portion", checks: ["Date of marriage and date of separation are the key dates", "Request a benefit statement for the marriage start date", "Calculate contributions and growth during the marriage", "Identify any pre-marital balance that is separate property"] },
      { heading: "QDRO Process Checklist", checks: ["Hire a QDRO attorney — do not use a general template", "Request plan administrator's pre-approval of QDRO language", "Get the QDRO signed by the judge at the same time as the divorce decree", "Submit the approved QDRO to the plan administrator immediately", "Confirm the transfer within 60 days of submission"] },
      { heading: "Tax Considerations", checks: ["Traditional 401(k)/IRA: taxable at withdrawal — discount for present value", "Roth IRA: tax-free growth — may be worth more than a traditional account of equal size", "Pension: get actuarial valuation for offset method", "Do not withdraw funds directly — roll over to avoid 10% penalty"] },
    ],
  },
  {
    slug: "business-owner",
    title: "Divorce Financial Checklist for Business Owners",
    description: "Business ownership adds significant complexity to a divorce. This checklist covers valuation, income calculation, and how to protect your business interests.",
    items: [
      { heading: "Business Valuation", checks: ["Hire a certified business valuator (CBV/ABV/CVA)", "Determine the marital portion (how much of the business was built during the marriage?)", "Choose valuation method: income approach, market approach, or asset approach", "Separate personal goodwill (non-marital) from enterprise goodwill (marital)", "Get valuations from both parties — expect different numbers"] },
      { heading: "Income Calculation", checks: ["Business income for alimony/support purposes differs from the P&L", "Add back non-business expenses paid through the business", "Identify owner perks (vehicle, phone, travel) that are really compensation", "Average income over 3–5 years if highly variable"] },
      { heading: "Settlement Options", checks: ["Buy-out: one spouse keeps business, pays the other their share", "Co-ownership: both remain owners (usually not recommended)", "Sale: sell the business and split proceeds", "Structured payments: buy-out paid over time (reduces liquidity pressure)"] },
      { heading: "Protect Your Business During the Divorce", checks: ["Do not make major business decisions without attorney's advice", "Document all business expenses carefully", "Do not comingle personal and business funds", "Keep employees and partners informed appropriately — rumors hurt value"] },
    ],
  },
  {
    slug: "children-support",
    title: "Child Support and Custody: Financial Planning Checklist",
    description: "Child support and custody arrangements have major long-term financial implications. This checklist helps you understand and plan for the full cost picture.",
    items: [
      { heading: "Child Support Calculation Inputs", checks: ["Each parent's gross monthly income", "Percentage of overnight custody time (parenting time)", "Number of children and their ages", "Health insurance premium for children", "Work-related childcare costs", "State-specific guideline formula"] },
      { heading: "Child-Related Expenses to Address", checks: ["Health insurance: who provides it and at what cost?", "Out-of-pocket medical expenses: how are extraordinary costs split?", "Childcare and after-school programs", "Educational expenses: private school, tutoring, college savings", "Extracurricular activities: who pays?", "Transportation between homes"] },
      { heading: "Custody Arrangement Financial Impact", checks: ["50/50 custody often reduces child support significantly", "Primary custody reduces your net income but increases your support received", "Tax exemption for dependents: negotiate who claims each child", "Child Tax Credit eligibility — tied to who claims the dependent"] },
      { heading: "Long-Term Planning", checks: ["College savings: 529 plan contributions post-divorce", "Life insurance: ensure child support is protected if paying parent dies", "Estate planning: update beneficiaries and guardianship designations", "Disability insurance: protect child support income stream"] },
    ],
  },
];

type Props = {
  params: Promise<{ topic: string }>;
};

export function generateStaticParams() {
  return CHECKLIST_TOPICS.map((t) => ({ topic: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic } = await params;
  const checklist = CHECKLIST_TOPICS.find((t) => t.slug === topic);
  if (!checklist) return {};

  return {
    title: `${checklist.title} | SettleLens`,
    description: checklist.description,
    alternates: {
      canonical: `https://settlelens.com/en/divorce-checklist-${topic}`,
    },
  };
}

export default async function DivorceChecklistPage({ params }: Props) {
  const { topic } = await params;
  const checklist = CHECKLIST_TOPICS.find((t) => t.slug === topic);
  if (!checklist) notFound();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: checklist.title,
    description: checklist.description,
    step: checklist.items.map((section) => ({
      "@type": "HowToSection",
      name: section.heading,
      itemListElement: section.checks.map((item, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        text: item,
      })),
    })),
  };

  const totalItems = checklist.items.reduce((sum, s) => sum + s.checks.length, 0);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="mx-auto max-w-3xl px-4 py-12">
        <nav className="mb-6 text-sm text-[#8B7355]">
          <Link href="/en/blog" className="hover:text-[#C8973A]">← Blog</Link>
        </nav>

        <h1
          className="text-3xl font-bold text-[#1C2B3A] leading-tight sm:text-4xl"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          {checklist.title}
        </h1>
        <p className="mt-3 text-lg text-[#8B7355]">{checklist.description}</p>

        <div className="mt-2 text-sm text-[#8B7355]">
          {totalItems} items across {checklist.items.length} categories
        </div>

        <div className="mt-8 space-y-8">
          {checklist.items.map((section, si) => (
            <div key={si} className="rounded-xl border border-[#D4C5B0] bg-white p-6">
              <h2
                className="text-lg font-bold text-[#1C2B3A] mb-4"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                {section.heading}
              </h2>
              <ul className="space-y-2">
                {section.checks.map((item, ii) => (
                  <li key={ii} className="flex items-start gap-3">
                    <span className="mt-1 h-4 w-4 shrink-0 rounded border-2 border-[#C8973A]" />
                    <span className="text-sm text-[#2E4D6B]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-xl bg-[#1C2B3A] p-8 text-center text-white">
          <h2
            className="text-xl font-bold"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            See the financial impact of your decisions
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            SettleLens models your settlement scenarios so you can negotiate with clarity.
          </p>
          <Link
            href="/en/register"
            className="mt-4 inline-block rounded-lg bg-[#C8973A] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            Start Free Analysis →
          </Link>
        </div>

        <p className="mt-6 text-xs text-center text-[#8B7355]">
          SettleLens provides financial scenario modeling for informational purposes only. Not legal advice. Always consult a qualified family law attorney before making settlement decisions.
        </p>
      </div>
    </>
  );
}
