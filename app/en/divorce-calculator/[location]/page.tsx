import { US_STATES } from "@/lib/seo-locations";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ location: string }>;
};

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return US_STATES.map((s) => ({ location: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { location } = await params;
  const state = US_STATES.find((s) => s.slug === location);
  if (!state) return {};

  const regime = state.isCommProperty
    ? "community property state"
    : "equitable distribution state";

  return {
    title: `Divorce Settlement Calculator - ${state.name} | SettleLens`,
    description: `Model your divorce settlement in ${state.name}. ${state.name} is a ${regime}. See 10-year financial projections for different scenarios. Free analysis.`,
    alternates: {
      canonical: `https://settlelens.com/en/divorce-calculator/${location}`,
    },
  };
}

export default async function USStateSEOPage({ params }: Props) {
  const { location } = await params;
  const state = US_STATES.find((s) => s.slug === location);
  if (!state) notFound();

  const isComm = state.isCommProperty;

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to calculate a divorce settlement in ${state.name}`,
    description: `Step-by-step guide to modeling your financial position in a ${state.name} divorce.`,
    step: [
      { "@type": "HowToStep", name: "Enter your assets and debts", text: "List all marital assets (home, retirement accounts, investments) and shared debts." },
      { "@type": "HowToStep", name: "Enter income information", text: "Provide annual income for both spouses to model alimony and cash flow scenarios." },
      { "@type": "HowToStep", name: "Build settlement scenarios", text: "Compare different outcomes: who keeps the house, retirement splits, alimony terms." },
      { "@type": "HowToStep", name: "Review 10-year projections", text: "See the long-term financial impact of each scenario before you negotiate." },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      <div className="mx-auto max-w-3xl px-4 py-12">
        <nav className="mb-6 text-sm text-[#8B7355]">
          <Link href="/en" className="hover:text-[#C8973A]">Home</Link>
          {" / "}
          <span>Divorce Calculator - {state.name}</span>
        </nav>

        <h1
          className="text-3xl font-bold text-[#1C2B3A] leading-tight sm:text-4xl"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Divorce Settlement Calculator - {state.name}
        </h1>

        <div className="mt-3 inline-block rounded-full bg-[#F7F3EE] px-3 py-1 text-sm text-[#2E4D6B]">
          {isComm ? "Community Property State" : "Equitable Distribution State"}
        </div>

        <div className="mt-8 prose prose-slate max-w-none">
          <h2>How Divorce Works in {state.name}</h2>

          {isComm ? (
            <>
              <p>
                <strong>{state.name}</strong> is a <strong>community property state</strong>. Under this rule, nearly all assets and debts acquired during the marriage are owned equally (50/50) by both spouses, regardless of who earned the money or whose name is on the account.
              </p>
              <p>
                The starting point for any settlement negotiation in {state.name} is an equal division of all marital property. Courts can deviate from this in limited circumstances, but 50/50 is the default.
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>{state.name}</strong> follows <strong>equitable distribution</strong>. This does not mean equal; it means fair, based on the circumstances of the marriage. Judges consider factors like length of the marriage, each spouse&apos;s financial situation, contributions to the household, and future earning potential.
              </p>
              <p>
                In practice, many equitable distribution cases settle close to 50/50, but the outcome can vary significantly depending on the facts.
              </p>
            </>
          )}

          <h2>What Is Considered Marital Property in {state.name}?</h2>
          <ul>
            <li>Income earned by either spouse during the marriage</li>
            <li>Real estate purchased with marital funds</li>
            <li>Retirement account contributions made during the marriage</li>
            <li>Savings, investments, and bank accounts accumulated jointly</li>
            <li>Business interests developed during the marriage</li>
          </ul>

          <h2>{state.alimonyName} in {state.name}</h2>
          <p>
            {state.alimonyName} (spousal support) may be awarded in {state.name} based on the length of the marriage, each spouse&apos;s income and earning capacity, and the standard of living established during the marriage. The amount and duration vary widely and are often the most negotiated part of a settlement.
          </p>

          <h2>How to Use SettleLens for Your {state.name} Divorce</h2>
          <ol>
            <li><strong>Enter your assets</strong>: home equity, retirement accounts, savings, vehicles</li>
            <li><strong>Enter your debts</strong>: mortgage, car loans, credit cards</li>
            <li><strong>Enter income</strong>: yours and your spouse&apos;s annual gross income</li>
            <li><strong>Build scenarios</strong>: who keeps the house? How is retirement divided?</li>
            <li><strong>See projections</strong>: compare 10-year net worth under each scenario</li>
          </ol>

          <p>
            SettleLens applies {isComm ? "community property rules" : "equitable distribution assumptions"} for {state.name} to give you a starting point for negotiations.
          </p>
        </div>

        <div className="mt-8 rounded-xl bg-[#1C2B3A] p-8 text-center text-white">
          <h2
            className="text-xl font-bold"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Model your {state.name} settlement for free
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            See the 10-year financial impact of your divorce decisions before you negotiate.
          </p>
          <Link
            href="/en/register"
            className="mt-4 inline-block rounded-lg bg-[#C8973A] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            Start Free Analysis
          </Link>
        </div>

        <p className="mt-6 text-xs text-center text-[#8B7355]">
          SettleLens provides financial scenario modeling for informational purposes only. Not legal advice. Consult a licensed {state.name} family law attorney before making settlement decisions.
        </p>
      </div>
    </>
  );
}
