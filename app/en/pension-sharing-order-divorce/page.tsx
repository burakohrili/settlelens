import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "Pension Sharing Order in Divorce — UK Guide | SettleLens",
  description:
    "How pension sharing orders work in UK divorce: which pensions qualify, how the percentage is calculated, what it costs, how long it takes, and how to model the long-term retirement impact.",
};

export default function Page() {
  return (
    <SeoLandingTemplate
      config={{
        locale: "en",
        badge: "UK Divorce Law — Pensions",
        headline: "Pension Sharing Order in Divorce — UK Complete Guide",
        intro:
          "Pensions are often the largest asset in a UK divorce after the family home — yet they are the most commonly overlooked or undervalued. A pension sharing order (PSO) is a court order that transfers a specified percentage of one spouse's pension rights into a separate pension in the other spouse's name. This guide explains how pension sharing orders work, which pensions qualify, what the process and costs are, and how to model the long-term financial impact before you agree to a split.",
        sections: [
          {
            heading: "What Is a Pension Sharing Order?",
            body: "A pension sharing order (PSO) is a legally binding court order, made under the Welfare Reform and Pensions Act 1999, that splits pension rights on divorce. The order specifies a percentage — say 40% — of the 'transfer value' of the pension at the date of the order. That percentage is transferred to the receiving spouse as a 'pension credit', creating a separate pension entitlement that they own outright. The paying spouse retains the remaining 'pension debit'. Unlike a pension attachment (earmarking) order, a pension sharing order gives the receiving spouse their own, independent pension — they are not dependent on the payer's decisions about when to retire or take benefits. PSOs are included in a consent order or made by the court at a Financial Remedy Hearing.",
          },
          {
            heading: "Which Pensions Qualify for Pension Sharing?",
            body: "Most private and occupational pension schemes can be subject to a pension sharing order, including: (1) Defined contribution pensions (personal pensions, SIPPs, workplace money purchase schemes). (2) Defined benefit pensions (final salary and career average schemes). (3) Additional State Pension (formerly SERPS/S2P) — though not the basic State Pension. (4) Public sector pensions: NHS, teachers, civil service, police, armed forces, local government pensions — all can be shared, though some have specific rules. (5) AVCs (Additional Voluntary Contributions). Exclusions: the new State Pension (post-April 2016) cannot be shared. Overseas pensions may be harder to share depending on the scheme jurisdiction. Always check with the specific pension provider before agreeing to a share.",
          },
          {
            heading: "How Is the Pension Sharing Percentage Calculated?",
            body: "Pension sharing does not automatically mean 50/50. The percentage is determined as part of the overall financial settlement and depends on: (1) The Cash Equivalent Transfer Value (CETV) of each pension — the scheme calculates this on request. (2) Whether offsetting is preferred: one spouse keeps their full pension; the other receives extra property, savings, or a lump sum of equivalent value. (3) The age difference between the parties — a pension worth £200,000 to a 45-year-old is worth more than the same CETV to a 60-year-old, because it will grow longer. Pension actuaries are often instructed in higher-value cases to 'equalise' pension income in retirement rather than simply split the CETV equally. Without specialist advice, a simple 50/50 CETV split can be unfair.",
          },
          {
            heading: "The Pension Sharing Process and Costs",
            body: "Step 1: Request CETVs from all pension schemes (allow 3 months — schemes have a legal obligation to provide within 3 months of request). Step 2: Instruct a pension actuary if the pensions are defined benefit or if 'income equalisation' is required (cost: £500–£2,000 typically). Step 3: The pension sharing order is drafted as part of the consent order and includes a pension annex specifying the scheme, the percentage, and the implementation date. Step 4: Once the consent order is sealed, it is sent to the pension scheme administrator. Step 5: The scheme implements the order — transferring the pension credit to the receiving spouse's new or existing pension. Timeline: 4–6 months after the order is sealed. Scheme implementation charges: typically £500–£1,500, often split between the parties or paid by one party as agreed.",
          },
          {
            heading: "Pension Sharing vs. Pension Offsetting",
            body: "Pension offsetting is an alternative: instead of splitting the pension, one spouse keeps their full pension while the other receives a larger share of other assets (property, savings) of equivalent value. Offsetting is simpler and avoids scheme implementation costs and delay. However, it involves comparing illiquid retirement assets (pensions) with liquid assets (cash, property equity), which can lead to unfair outcomes if the valuation method is wrong. A pension worth £200,000 CETV may generate significantly more income in retirement than £200,000 in property equity — depending on age, investment growth, and pension type. SettleLens models both approaches: comparing your net worth trajectory under pension sharing vs. offsetting scenarios helps you decide which genuinely works better for your situation.",
          },
          {
            heading: "The Long-Term Retirement Impact",
            body: "Pension sharing decisions have consequences that play out over decades. A 50% share of a £300,000 defined contribution pension at age 45 — growing at 5% annually — becomes approximately £775,000 by age 67. The same decision at age 55 gives only 12 years of growth. For defined benefit pensions, a 40% share of a £40,000/year final salary pension means £16,000/year in retirement — for life. These numbers are rarely visible in the heat of divorce negotiations. SettleLens allows you to project pension sharing scenarios alongside all other settlement variables to give you a clearer picture of your retirement financial position under each option.",
          },
        ],
        checklist: [
          "Request Cash Equivalent Transfer Values (CETVs) from all pension schemes",
          "Note the date of each CETV — values change; CETVs expire after 12 months",
          "Check whether any pensions are defined benefit (final salary) schemes",
          "Consider instructing a pension actuary for income equalisation analysis",
          "Identify any public sector pensions with specific sharing rules",
          "Decide between pension sharing and pension offsetting for each scheme",
          "Include a pension sharing annex in the draft consent order",
          "Check the scheme's implementation charge and who will pay it",
          "Confirm where the pension credit will be invested (new or existing pension)",
          "Instruct a financial adviser to review the pension credit investment options",
        ],
        faq: [
          {
            q: "Can a pension sharing order be made years after the divorce?",
            a: "In England and Wales, a pension sharing order can only be made as part of the divorce financial proceedings. Once a clean break consent order is sealed — or once a financial application is dismissed — it is very difficult to make further pension claims. However, if no consent order was made, a financial remedy application can be made at any time after the divorce, even years later (the court's jurisdiction continues until dismissed). This is one of the strongest arguments for obtaining a consent order that includes a pension sharing or offsetting arrangement at the time of divorce.",
          },
          {
            q: "What happens to the pension sharing order if the pension scheme goes into wind-up?",
            a: "If a defined benefit pension scheme enters the Pension Protection Fund (PPF) after a pension sharing order is made, the pension credit holder receives PPF-level benefits (typically 90% of expected pension, subject to the PPF compensation cap). The pension credit is protected by the PPF in the same way as other scheme members' benefits. For defined contribution schemes going into administration, the underlying investments are held in trust and are not an asset of the scheme provider — they are generally protected.",
          },
          {
            q: "Is a pension sharing order different from a QDRO in the US?",
            a: "Yes. A Qualified Domestic Relations Order (QDRO) is the US equivalent — a court order splitting employer-sponsored retirement plans (401k, 403b, pension). The mechanics are similar: a court order directs the plan to create a separate account for the non-member spouse. Key differences: UK pension sharing orders apply to all types of pension (not just employer schemes); the UK process involves submitting the order to the pension scheme administrator (not an IRS-approved plan administrator); and UK implementation charges and timelines differ. If you have pensions in both countries, specialist cross-border advice is required.",
          },
        ],
        relatedLinks: [
          { title: "Divorce Financial Settlement UK", href: "/en/divorce-financial-settlement-uk", description: "How the overall financial settlement works under MCA 1973 Section 25" },
          { title: "What Is a QDRO?", href: "/en/what-is-a-qdro", description: "How US retirement accounts are split in divorce — the QDRO equivalent" },
          { title: "10-Year Divorce Financial Impact", href: "/en/10-year-divorce-financial-impact", description: "Project your retirement and net worth trajectory under different scenarios" },
          { title: "Compare Settlement Scenarios", href: "/en/compare-divorce-settlement-scenarios", description: "Model pension sharing vs. offsetting side by side" },
        ],
        ctaText: "Model My Pension Scenarios",
        ctaHref: "/en/register",
        ctaSub: "Free to start — no credit card required",
        disclaimer:
          "SettleLens provides financial scenario modeling for informational purposes only. Not legal or financial advice. Pension sharing in England and Wales requires a court-sealed pension sharing order. Always consult a qualified family law solicitor and a pension specialist or actuary before agreeing to any pension sharing arrangement.",
      }}
    />
  );
}
