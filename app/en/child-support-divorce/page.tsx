import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "Child Support in Divorce — How It's Calculated & What It Costs | SettleLens",
  description:
    "How child support is calculated in divorce: income shares model, state guidelines, self-support reserve, and the real 10-year financial impact for both parents.",
};

export default function Page() {
  return (
    <SeoLandingTemplate
      config={{
        locale: "en",
        badge: "Child Support 2026",
        headline:
          "Child Support in Divorce — How It's Calculated and What It Really Costs",
        intro:
          "Child support is often the largest recurring financial obligation to emerge from a divorce — and one of the most frequently miscalculated. $750 per month for a child who is 6 years old today means $108,000 in total payments by the time they turn 18. That number shapes your budget, your housing choices, and your retirement savings for over a decade. SettleLens models child support as part of your full 10-year financial picture.",
        sections: [
          {
            heading: "Who Pays Child Support and Why",
            body: "The non-custodial parent — the one with whom the child spends less than 50% of time — is generally required to pay child support to the custodial parent. The custodial parent fulfills their financial obligation through in-kind support: providing housing, food, clothing, and daily care. In a true 50/50 custody arrangement, both parents' incomes are considered and the direction of payment depends on the income gap between them. Importantly, child support and child custody are separate legal questions — support is owed regardless of whether visitation is occurring.",
          },
          {
            heading: "The Income Shares Model — Used in 41 States",
            body: "The income shares model is based on the principle that a child should receive the same proportion of parental income as if the family were intact. Both parents' incomes are combined, and a state guideline table determines the total child support obligation. Each parent then pays their proportional share. Example: Parent A earns $4,000/month, Parent B earns $2,000/month. Combined: $6,000. State table says $1,100 for one child at $6,000 combined income. Parent A's share: 67% × $1,100 = $737/month. States using this model include Florida, New York, Illinois, Pennsylvania, Ohio, Virginia, Georgia, and many others.",
          },
          {
            heading: "The Percentage of Income Model — Used in 9 States",
            body: "Some states use a simpler model: a flat percentage of the non-custodial parent's income, regardless of the other parent's earnings. Wisconsin: 17% for one child, 25% for two, 29% for three. Texas: 20% net income for one child, 25% for two, up to a ceiling. This model is simpler to calculate but can result in different outcomes than the income shares model depending on the income gap between parents. Always verify your state's specific model and most recent guidelines.",
          },
          {
            heading: "The Self-Support Reserve — When You Can't Pay Full Support",
            body: "Every state includes a self-support reserve — a minimum amount the paying parent must retain for their own subsistence. Federal guidelines recommend approximately $1,200–$1,500/month depending on state. If applying the guideline amount would leave the paying parent below this threshold, the order may be reduced to a minimum amount or $0 in hardship cases. The self-support reserve protects against impoverishing the paying parent, but courts still expect maximum good-faith effort. SettleLens identifies scenarios where support may be reduced based on income levels.",
          },
          {
            heading: "Child Support in Your 10-Year Financial Plan",
            body: "The time dimension is where most parents underestimate the total cost. $750/month for a child currently age 6 runs for 12 years until age 18 — that's $108,000. In many states, support increases as the child ages (different guidelines for different age brackets). College support is required in some states (Massachusetts, New York, Indiana) but not others. SettleLens projects your monthly cash flow impact, total child support obligation to age 18 (and beyond if applicable), and net worth trajectory at 1, 3, 5, and 10 years — with child support fully integrated.",
          },
        ],
        checklist: [
          "Gather income documentation for both parents (pay stubs, tax returns — last 3 years)",
          "Document childcare costs (daycare, after-school programs)",
          "Identify health insurance premiums for the children",
          "Establish the proposed custody schedule (impacts the calculation significantly)",
          "List extraordinary expenses: private school, medical specialists, sports/activities",
          "Check for existing support obligations to children from other relationships",
          "Verify employment type (employed, self-employed, variable income) — affects method",
          "Research your state's specific child support guidelines and any recent updates",
        ],
        faq: [
          {
            q: "Can child support be modified after the divorce is finalized?",
            a: "Yes. Either parent can petition for modification when there is a substantial change in circumstances — typically a significant income change (usually 10–15% or more), a change in custody arrangement, a child's change in needs, or loss of employment. Modifications generally apply from the date of the petition, not retroactively, so file promptly if circumstances change.",
          },
          {
            q: "I'm self-employed — how is my income calculated for child support?",
            a: "Self-employment income is calculated from net income after allowable business deductions, not gross revenue. Courts add back personal expenses run through the business (vehicle, meals, travel) that are really compensation. If income fluctuates, courts may average the last 2–3 years. Courts can also impute income — assigning a higher income based on earning capacity — if they believe you are voluntarily underearning.",
          },
          {
            q: "Does child support automatically end when my child turns 18?",
            a: "It depends on the state. Most states end child support at 18 or high school graduation, whichever comes later. Some states extend support through college if the child attends full-time (Massachusetts, New York, Indiana, and others). Military service typically terminates support. Make sure you understand your state's specific termination rules — and whether college support obligations apply in your case.",
          },
        ],
        relatedLinks: [
          { title: "How Alimony Is Calculated", href: "/en/how-is-alimony-calculated", description: "Spousal support formulas, duration rules, and the 10-year dollar impact" },
          { title: "10-Year Financial Impact Projection", href: "/en/10-year-divorce-financial-impact", description: "Net worth trajectory with all support obligations integrated" },
          { title: "Complete Divorce Financial Planning", href: "/en/divorce-financial-planning", description: "Assets, support, housing, and retirement — the full financial picture" },
          { title: "Children & Support Checklist", href: "/en/divorce-checklist/children-support", description: "Full checklist for child support calculation and custody planning" },
        ],
        ctaText: "Model My Child Support Scenarios",
        ctaHref: "/en/register",
        ctaSub: "Free to start — no credit card required",
        disclaimer:
          "SettleLens provides financial scenario modeling for informational purposes only. Not legal advice. Child support amounts are set by state guidelines and court orders based on individual circumstances. Always consult a qualified family law attorney.",
      }}
    />
  );
}
