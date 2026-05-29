import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "Form E in Divorce — Financial Disclosure Explained | SettleLens",
  description:
    "What Form E is, what financial information it requires, how to complete it accurately, and why non-disclosure can unravel a settlement years later.",
};

export default function Page() {
  return (
    <SeoLandingTemplate
      config={{
        locale: "en",
        badge: "UK Divorce Law — Financial Disclosure",
        headline: "Form E in Divorce — Complete Financial Disclosure Guide",
        intro:
          "Form E is the standard financial disclosure document used in divorce financial proceedings in England and Wales. It requires both parties to fully disclose their financial position — assets, income, debts, and needs — so the court and both sides can negotiate or adjudicate on a fully informed basis. Failing to complete it accurately — whether deliberately or accidentally — can have serious consequences, including a settlement being set aside years later. This guide explains what Form E requires, how to complete it, and what happens if financial disclosure is incomplete.",
        sections: [
          {
            heading: "What Is Form E?",
            body: "Form E (full title: Financial Statement for a Financial Order) is a 28-page form prescribed by the Family Procedure Rules 2010. It is the standard document used to exchange financial information in all contested divorce financial proceedings in the Family Court in England and Wales. Both parties must complete and exchange their own Form E before the First Directions Appointment (FDA) — the first court hearing in Financial Remedy proceedings. Even in agreed settlements (via a consent order), both parties typically complete a D81 (Statement of Information for a Consent Order) which covers similar financial information in abbreviated form. If proceedings are issued, full Form E is required. A financial remedy application is issued by filing Form A — Form E follows as the first major disclosure step.",
          },
          {
            heading: "What Information Form E Requires",
            body: "Form E is divided into five sections: (1) Property and other assets: the family home (with valuation), any other property, bank and savings accounts, investments and shares, life insurance surrender values, business interests, pensions (with CETVs), vehicles, and any other assets. (2) Income: employment income (with last 12 months of payslips), self-employment income (with 3 years of accounts), investment income, rental income, state benefits. (3) Liabilities: mortgage, credit cards, personal loans, tax liabilities, any other debts. (4) Capital needs: what accommodation you need and at what cost, any specific capital needs including legal costs, children's needs. (5) Income needs: your monthly budget going forward — housing, utilities, food, transport, childcare, insurance, and other regular outgoings.",
          },
          {
            heading: "Supporting Documents Required",
            body: "Form E is not a standalone form — it must be accompanied by a package of supporting documents submitted at the same time. Required documents include: last 12 months of bank statements for every account held; last 3 years of tax returns and accounts if self-employed or a director; last 12 months of payslips; mortgage statements; pension statements with Cash Equivalent Transfer Values (CETVs); property valuations; business accounts; investment and share account valuations; credit card and loan statements. The bundle can run to hundreds of pages in complex cases. Courts take non-compliance with documentary requirements seriously: incomplete Form E can delay proceedings and trigger costs sanctions.",
          },
          {
            heading: "The Duty of Full and Frank Disclosure",
            body: "Both parties are under a continuing duty of full and frank financial disclosure throughout divorce financial proceedings. This is not optional: Family Procedure Rule 9.14 imposes this obligation. The duty is ongoing — if your financial circumstances change significantly after filing Form E (you receive an inheritance, sell assets, change job), you must update your disclosure promptly. Deliberate non-disclosure — hiding assets, undervaluing property, structuring transfers to reduce apparent wealth — is a serious contempt of court and can result in: the court drawing adverse inferences and making a larger award against you; the settlement being set aside years later (the Gohil v Gohil [2015] case involved a settlement being set aside 10 years later due to fraud); criminal prosecution in extreme cases.",
          },
          {
            heading: "What Happens If You Suspect Non-Disclosure",
            body: "If you believe your spouse is hiding assets or income, there are legal tools available. Questionnaires: after Form E is exchanged, each party can send a questionnaire requiring the other party to provide further information or documents. Third party subpoenas: the court can order third parties (banks, employers, HMRC) to provide information. Freezing injunctions: if you fear assets are being moved or dissipated, an emergency freezing order can be applied for. Forensic accountants: instructed to trace business income, value complex business interests, or identify asset transfers. The court has wide powers to look behind structures to their economic substance — nominee arrangements and transfers 'to a friend' shortly before proceedings are routinely unpicked.",
          },
          {
            heading: "Form E and Financial Modelling",
            body: "Form E gives you the most complete picture of the marital financial estate available. Once both parties have exchanged Form E, you have the full asset and income picture needed to model settlement outcomes. SettleLens takes the key figures from your financial disclosure — asset values, income, debts, pension CETVs — and models the 10-year financial trajectory of different settlement scenarios. This is most useful in the gap between Form E exchange and the First Directions Appointment, when there is time to analyse the numbers and prepare a realistic negotiating position.",
          },
        ],
        checklist: [
          "Obtain current valuations for all property (estate agent letters or RICS survey)",
          "Request CETV (Cash Equivalent Transfer Value) from all pension schemes",
          "Gather last 12 months of bank statements for every account",
          "Collect last 3 years of P60s, payslips, or self-employment accounts",
          "Obtain mortgage statements and current redemption figures",
          "List all credit cards, loans, and other liabilities with current balances",
          "Note any business interests and obtain business valuations if required",
          "Prepare a realistic monthly budget (income needs section)",
          "Check for any assets in joint names or held by third parties on your behalf",
          "Review draft Form E with your solicitor before signing the statement of truth",
        ],
        faq: [
          {
            q: "Is Form E required if we agree everything without going to court?",
            a: "If you reach a full financial agreement without starting court proceedings, you do not need to complete the full Form E. Instead, you submit a D81 (Statement of Information for a Consent Order) with your consent order application. The D81 is shorter but still requires disclosure of total assets, liabilities, income, and capital needs of both parties. Judges use the D81 to check the consent order is broadly fair. However, if either party later discovers that financial information was withheld from the D81, the consent order may be set aside.",
          },
          {
            q: "How long does it take to prepare Form E?",
            a: "Most solicitors advise allowing 4–8 weeks to compile all the required documents and complete the form accurately. The pension CETV request alone can take up to 3 months, so it should be requested as early as possible — ideally before proceedings are issued. Once Form E is filed, the court timetable typically requires exchange within a further 5 weeks. Starting the document-gathering process early avoids delays and cost applications.",
          },
          {
            q: "Can I use Form E if I am divorcing in Scotland?",
            a: "No. Form E is specific to financial remedy proceedings in England and Wales. In Scotland, financial disclosure is dealt with differently: during negotiations, parties typically prepare voluntary disclosure schedules. If proceedings are raised, the court can order disclosure under Chapter 49 of the Act of Sederunt (Sheriff Court Ordinary Cause Rules). Scotland does not use the English Form E. If you are divorcing in Scotland, consult a Scottish family law solicitor.",
          },
        ],
        relatedLinks: [
          { title: "Divorce Financial Settlement UK", href: "/en/divorce-financial-settlement-uk", description: "How courts divide assets under MCA 1973 Section 25 — the full process" },
          { title: "Consent Order in Divorce UK", href: "/en/consent-order-divorce-uk", description: "How to formalise your agreed settlement in a court-sealed order" },
          { title: "Pension Sharing Order", href: "/en/pension-sharing-order-divorce", description: "How pension CETVs feed into the pension sharing calculation" },
          { title: "Divorce Financial Planning Guide", href: "/en/divorce-financial-planning", description: "Complete guide to planning your finances through a divorce" },
        ],
        ctaText: "Model My Financial Settlement",
        ctaHref: "/en/register",
        ctaSub: "Free to start — no credit card required",
        disclaimer:
          "SettleLens provides financial scenario modeling for informational purposes only. Not legal advice. Form E is a legal document required in Family Court proceedings in England and Wales. Always consult a qualified family law solicitor when completing Form E or preparing financial disclosure.",
      }}
    />
  );
}
