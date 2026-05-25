import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "What Is Equitable Distribution in Divorce? | SettleLens",
  description:
    "Equitable distribution explained: how states divide marital property in divorce, what factors judges consider, and how to model your financial outcome.",
};

export default function Page() {
  return (
    <SeoLandingTemplate
      config={{
        locale: "en",
        badge: "Property Division Basics",
        headline:
          "What Is Equitable Distribution in Divorce? — Explained Clearly",
        intro:
          "When a marriage ends in the United States, one of the first questions is: how will property be divided? If you live in one of the 41 equitable distribution states, the answer is not \"50/50\" — it's \"fairly.\" But what does \"fair\" actually mean in practice, and how do you prepare financially? This page explains equitable distribution without legal jargon.",
        sections: [
          {
            heading: "The Two Property Systems in the US",
            body: "The United States uses two different systems for dividing marital property. Community property states (California, Texas, Arizona, Nevada, Washington, New Mexico, Idaho, Louisiana, Wisconsin) split marital assets 50/50 by default. The other 41 states use equitable distribution — meaning a judge divides property in a way that is considered fair, which is not necessarily equal. Over 80% of Americans live in equitable distribution states, yet most people don't fully understand how it works until they're in the middle of a divorce.",
          },
          {
            heading: "What Is Marital Property?",
            body: "Marital property generally includes everything acquired during the marriage: home equity, retirement account growth, bank balances, investment portfolios, and business appreciation. Separate property — assets you owned before marriage, inheritances, and gifts received by you alone — typically stays with you. The catch: if separate property gets mixed with marital funds (\"commingling\"), it can lose its separate status. A $50,000 inheritance deposited into a joint account may become marital property in many states.",
          },
          {
            heading: "The 'Equitable' Factors Judges Consider",
            body: "Courts weigh a range of factors when deciding what's equitable. Common considerations include: length of the marriage, each spouse's financial contributions (income, savings), non-financial contributions (raising children, supporting the other's career), each spouse's earning capacity going forward, age and health, child custody arrangements, and the standard of living established during the marriage. There is no formula — the judge has broad discretion. This is precisely why financial modeling before negotiations matters.",
          },
          {
            heading: "Why Financial Modeling Matters More in Equitable States",
            body: "In a community property state, the math is relatively simple: each spouse gets roughly half. In an equitable distribution state, the range of possible outcomes is wide. A judge might award 55/45, 60/40, or even 70/30 depending on the circumstances. The difference between a 50/50 and a 60/40 split on $400,000 in marital assets is $40,000 — a significant financial difference. SettleLens helps you model these scenarios so you can see the 10-year financial impact of each possible outcome before you sign anything.",
          },
          {
            heading: "What SettleLens Models for You",
            body: "SettleLens lets you enter your complete asset and debt picture, classify what's marital vs. separate, and then run multiple settlement scenarios side by side. You can model a 50/50 split, a 60/40 outcome favoring you, or a 40/60 scenario reflecting your spouse's counter-proposal — and see the projected net worth at year 1, 3, 5, and 10 for each. That gives you a concrete financial basis for negotiation, and a clearer picture to bring to your attorney.",
          },
        ],
        faq: [
          {
            q: "Does equitable distribution mean I get exactly half?",
            a: "No. 'Equitable' means fair, not equal. A judge considers many factors — length of marriage, each spouse's contributions, earning capacity, child custody, and more — and may award anywhere from 40% to 60% or beyond depending on the circumstances. If you want to understand the financial range, SettleLens helps you model multiple split scenarios.",
          },
          {
            q: "Do I need a lawyer to determine my equitable share?",
            a: "Yes — equitable distribution involves legal judgment that only a qualified family law attorney can provide. SettleLens is a financial planning tool, not a legal predictor. Use it to organize your asset picture and model financial scenarios before and during your attorney consultations.",
          },
          {
            q: "How do I know if I live in a community property or equitable distribution state?",
            a: "Community property states are: California, Texas, Arizona, Nevada, Washington, New Mexico, Idaho, Louisiana, and Wisconsin. All other states use equitable distribution. SettleLens automatically applies the appropriate framework when you select your state.",
          },
        ],
        relatedLinks: [
          { title: "Equitable Distribution — Step by Step", href: "/en/equitable-distribution-divorce", description: "How property division actually works: identify, classify, value, and model" },
          { title: "Compare Settlement Scenarios", href: "/en/compare-divorce-settlement-scenarios", description: "Put multiple proposals side by side and see the financial difference" },
          { title: "Divorce Financial Planning Guide", href: "/en/divorce-financial-planning", description: "All financial aspects of your divorce in one place" },
          { title: "California Divorce Calculator", href: "/en/divorce-calculator/california", description: "Community property rules — how California divides marital assets" },
        ],
        ctaText: "Model My Property Division Scenarios",
        ctaHref: "/en/register",
        ctaSub: "Free to start — no credit card required",
        disclaimer:
          "SettleLens provides financial scenario modeling for informational purposes only. Not legal advice. Equitable distribution outcomes depend on your specific facts and jurisdiction. Always consult a qualified family law attorney.",
      }}
    />
  );
}
