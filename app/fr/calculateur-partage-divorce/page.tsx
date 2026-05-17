import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "Calculateur de partage des biens divorce | SettleLens",
  description: "Modélisez le partage des biens lors d'un divorce. Comparez vos scénarios sur 10 ans — patrimoine net et flux de trésorerie mensuel.",
};

export default function Page() {
  return (
    <SeoLandingTemplate config={{
      locale: "fr",
      badge: "Partage des biens",
      headline: "Calculateur de partage des biens lors du divorce — Modélisez avant de négocier",
      intro: "Le partage des biens est l'une des décisions les plus importantes d'un divorce. SettleLens vous permet de modéliser différents scénarios de partage et d'en voir l'impact financier sur 10 ans — patrimoine net et trésorerie mensuelle.",
      sections: [
        { heading: "Communauté d'acquêts (Code civil Art. 1401)", body: "En France, les biens acquis pendant le mariage sont en principe partagés à parts égales entre les époux. SettleLens applique ces règles à vos actifs et dettes pour vous donner une estimation de votre position financière après le divorce." },
        { heading: "Biens propres vs. biens communs", body: "Les biens reçus par héritage ou donation restent en principe propres à chaque époux. SettleLens vous aide à catégoriser vos actifs correctement afin d'exclure les biens propres du partage et d'obtenir une modélisation plus précise." },
        { heading: "Comparer plusieurs scénarios de partage", body: "Votre conjoint propose une répartition différente ? Saisissez-la dans SettleLens comme second scénario et comparez la différence sur 10 ans. Vous verrez en un coup d'œil quel impact cette proposition a sur votre patrimoine futur." },
        { heading: "Projection sur 10 ans", body: "SettleLens projette votre patrimoine net à 1, 3, 5 et 10 ans en intégrant vos revenus, charges, pensions alimentaires et hypothèques — selon chaque scénario de partage que vous modélisez." },
      ],
      faq: [
        { q: "SettleLens calcule-t-il exactement ma part légale ?", a: "Non. SettleLens est un outil de modélisation financière, pas un outil juridique. Il applique des hypothèses générales issues du droit français. Votre avocat ou notaire établira le partage définitif." },
        { q: "Que faire si nous avons un contrat de mariage ?", a: "Si vous avez opté pour la séparation de biens ou un autre régime matrimonial, précisez-le dans SettleLens. L'outil adaptera ses hypothèses à votre situation." },
      ],
      ctaText: "Modéliser mon partage de biens",
      ctaHref: "/fr/register",
      ctaSub: "Commencer gratuitement — sans carte bancaire",
      disclaimer: "SettleLens fournit une modélisation financière à titre informatif uniquement. Ce n'est pas un conseil juridique. Consultez toujours un avocat ou notaire qualifié en droit de la famille.",
    }} />
  );
}
