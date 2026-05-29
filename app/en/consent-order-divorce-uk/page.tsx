import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "Consent Order in Divorce UK — What It Is and How to Get One | SettleLens",
  description:
    "What a consent order is, why verbal divorce agreements aren't legally binding in England and Wales, how to draft one, and how to model the financial terms before signing.",
};

export default function Page() {
  return (
    <SeoLandingTemplate
      config={{
        locale: "en",
        badge: "UK Divorce Law — England & Wales",
        headline: "Consent Order in Divorce UK — Why You Need One",
        intro:
          "In England and Wales, even if you and your spouse reach a full financial agreement, it is not legally binding unless it is formalised in a court-approved consent order. Without one, either party can make new financial claims years later — even after remarriage. This guide explains what a consent order is, what it includes, how to get one approved, and how to model the financial terms before you commit.",
        sections: [
          {
            heading: "What Is a Consent Order?",
            body: "A consent order is a legal document that records the financial agreement reached between divorcing spouses and is approved by a family court judge. Once sealed by the court, it becomes a legally binding court order. It can cover the family home, savings, investments, pensions, debts, and ongoing maintenance. A consent order is the only way to achieve a 'clean break' — meaning neither party can make future financial claims once it is in place. Without a consent order, a verbal agreement, written agreement, or even a solicitor's letter is not enforceable. In the UK, there is no time limit on making a financial claim after divorce (until it is dismissed by a consent order), which is why solicitors strongly advise formalising all financial agreements.",
          },
          {
            heading: "What a Consent Order Typically Includes",
            body: "A consent order sets out in legally precise terms what happens to each financial asset and liability. Common provisions include: (1) The family home — transfer of ownership, sale and division of proceeds, or a deferred sale (Mesher order). (2) Pensions — pension sharing annex specifying percentage and scheme. (3) Lump sum payments — one spouse pays the other a specified sum by a specified date. (4) Spousal maintenance — amount, frequency, duration, and termination triggers (remarriage, cohabitation, death, time limit). (5) Child maintenance — if agreed (though the Child Maintenance Service has jurisdiction for statutory child support). (6) Clean break clause — explicitly dismisses all future financial claims. A draft consent order is usually prepared by one party's solicitor and reviewed by the other party's solicitor before submission to the court.",
          },
          {
            heading: "The Consent Order Process",
            body: "Step 1: Both parties negotiate and agree on financial terms (often via solicitors or a mediator). Step 2: One party's solicitor drafts the consent order document. Step 3: Both parties sign the order and accompanying statement of information (D81 form — which the court uses to check the settlement is fair). Step 4: The draft order is submitted to the court along with the D81 forms and the court fee (currently £53). Step 5: A judge reviews the order — without a hearing in most cases. The judge will check it is broadly fair and within the range of reasonable outcomes. Step 6: If approved, the judge seals the order and returns sealed copies to both parties. The order becomes legally binding when sealed. Total timeline: 6–12 weeks from submission, assuming no queries from the court.",
          },
          {
            heading: "When a Judge Will Refuse a Consent Order",
            body: "Although judges approve most consent orders without a hearing, they can and do refuse if the agreement appears grossly unfair to one party, if children's interests are not properly considered, or if one party appears to be under duress. Common reasons for refusal: one party receives nothing (even if they agreed), the order does not include a pension sharing annex despite significant pensions existing, the D81 financial disclosure is incomplete or inconsistent, or the maintenance terms are unclear or unenforceable. If the court raises concerns, it will list the matter for a short hearing to investigate further.",
          },
          {
            heading: "Consent Order vs. Separation Agreement",
            body: "A separation agreement is a private contract signed by both parties — it records intentions but is not a court order and is not directly enforceable. If one party fails to comply, the other must go to court to enforce it (usually as a breach of contract claim). It is less reliable than a consent order. A Tomlin order is a consent order that stays the court proceedings and schedules a private agreement as an annex — used when parties want confidentiality for some terms. A clean break consent order is the gold standard: it dismisses all future financial applications in one document, providing certainty for both parties.",
          },
          {
            heading: "Model the Financial Terms Before You Sign",
            body: "A consent order locks in the financial settlement — it is very difficult to vary once sealed. Before agreeing to any terms, it is worth modelling the long-term financial consequences. A 60/40 property split might look reasonable today but could mean significantly different financial trajectories over 10 years depending on maintenance, pensions, and income differences. SettleLens lets you build settlement scenarios and project your 10-year financial position under each, so you go into the signing process with a clear picture of what you are agreeing to.",
          },
        ],
        checklist: [
          "Confirm the financial agreement in writing before instructing a solicitor to draft",
          "Prepare D81 statement of information for both parties",
          "Obtain current values for all assets: home, savings, pensions (CETVs)",
          "List all debts to be assigned or discharged under the order",
          "Agree on pension sharing percentage and specify the scheme name",
          "Include clean break clause dismissing future financial applications",
          "Check maintenance terms: amount, frequency, duration, and termination triggers",
          "Confirm both parties have had independent legal advice (or waived it in writing)",
          "Review the draft order line by line before signing",
          "Pay court fee (currently £53) and submit to the correct family court",
        ],
        faq: [
          {
            q: "Can we use a consent order without solicitors?",
            a: "Yes. It is possible to draft a consent order yourself (known as a 'DIY consent order') and there are template services available online. However, a poorly drafted consent order may be refused by the court or may not achieve the intended outcome — particularly for pensions, which require a separate pension sharing annex that must comply with the specific scheme's requirements. Most family law practitioners recommend at least having a solicitor review the draft before submission. The £53 court fee is the same whether you use solicitors or not.",
          },
          {
            q: "Can a consent order be changed after it is sealed?",
            a: "It is very difficult to vary a sealed consent order. You can apply to the court to set it aside if there was a material non-disclosure of assets, fraud, duress, or a supervening event that invalidates the original basis of the order (the Barder principle — from Barder v Barder [1988]). Routine changes in financial circumstances (job loss, illness) are generally not grounds to set aside a property or capital order, though maintenance orders can be varied if circumstances change significantly.",
          },
          {
            q: "When is the right time to get a consent order?",
            a: "A consent order can only be made after the conditional order (formerly decree nisi) has been granted in the divorce proceedings — but it does not have to wait for the final order (decree absolute). Most solicitors recommend finalising the financial consent order before applying for the final order, because once the final order is granted, certain rights (such as intestacy rights) change. Ideally, the consent order should be sealed before the final order is made.",
          },
        ],
        relatedLinks: [
          { title: "Divorce Financial Settlement UK", href: "/en/divorce-financial-settlement-uk", description: "How courts divide assets under MCA 1973 Section 25" },
          { title: "Spousal Maintenance UK", href: "/en/spousal-maintenance-uk", description: "How maintenance amounts and duration are decided in England and Wales" },
          { title: "Form E Financial Disclosure", href: "/en/form-e-divorce", description: "What Form E is and what financial information it requires" },
          { title: "Compare Settlement Scenarios", href: "/en/compare-divorce-settlement-scenarios", description: "Model different settlement proposals side by side" },
        ],
        ctaText: "Model My Consent Order Scenarios",
        ctaHref: "/en/register",
        ctaSub: "Free to start — no credit card required",
        disclaimer:
          "SettleLens provides financial scenario modeling for informational purposes only. Not legal advice. Consent orders are legal documents that require approval from the family court. Always consult a qualified solicitor before drafting or signing a consent order.",
      }}
    />
  );
}
