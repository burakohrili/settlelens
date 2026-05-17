import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "Comparer scénarios divorce | SettleLens",
  description: "Comparez jusqu'à 3 scénarios de divorce côte à côte. Visualisez le patrimoine net sur 10 ans et le flux de trésorerie mensuel de chaque option.",
};

export default function Page() {
  return (
    <SeoLandingTemplate config={{
      locale: "fr",
      badge: "Comparaison de scénarios",
      headline: "Comparer des scénarios de divorce côte à côte — Avec des chiffres concrets",
      intro: "Vous avez plusieurs options. Chacune vous amène dans une position financière différente — dans cinq ans, dans dix ans. SettleLens met ces options côte à côte pour vous montrer où mène chaque chemin — avant que vous vous engagiez.",
      sections: [
        { heading: "Pourquoi la comparaison est décisive", body: "Des accords qui paraissent similaires sur le papier peuvent produire des résultats très différents dans la durée. Une différence de 300 €/mois de pension sur 8 ans représente 28 800 €. SettleLens rend ces écarts visibles." },
        { heading: "Comparer jusqu'à 3 scénarios", body: "Créez votre scénario préféré, saisissez la proposition de votre conjoint comme second scénario, et ajoutez un compromis comme troisième. Le tableau comparatif affiche patrimoine net en année 1, 3, 5 et 10 — ainsi que le flux de trésorerie mensuel — pour tous les scénarios simultanément." },
        { heading: "Orienter la négociation avec votre avocat", body: "Avec la comparaison de scénarios, vous identifiez les points qui pèsent le plus financièrement. Vous et votre avocat disposez alors d'une hiérarchie claire des priorités de négociation." },
      ],
      faq: [
        { q: "Combien de scénarios puis-je créer ?", a: "Dans le plan Discovery gratuit, 3 scénarios sont possibles (sans analyse IA). Dans les plans payants, les scénarios sont illimités avec projection IA sur 10 ans." },
        { q: "Puis-je modifier un scénario après l'avoir créé ?", a: "Oui. Tous les scénarios sont modifiables. Changez une variable — répartition immobilière, pension, droits à la retraite — et la projection se met à jour immédiatement." },
      ],
      ctaText: "Comparer mes scénarios",
      ctaHref: "/fr/register",
      ctaSub: "Commencer gratuitement — sans carte bancaire",
      disclaimer: "SettleLens fournit une modélisation financière à titre informatif uniquement. Ce n'est pas un conseil juridique. Consultez toujours un avocat qualifié en droit de la famille.",
    }} />
  );
}
