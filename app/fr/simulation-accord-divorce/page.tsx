import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "Simulation accord de divorce | SettleLens",
  description: "Simulez différents accords de divorce et visualisez le résultat financier. Comparez votre proposition avec l'offre de votre conjoint.",
};

export default function Page() {
  return (
    <SeoLandingTemplate config={{
      locale: "fr",
      badge: "Simulateur d'accord",
      headline: "Simulez chaque accord de divorce — Et visualisez le résultat financier",
      intro: "Que se passe-t-il financièrement si vous acceptez cette proposition ? Et si vous contre-proposez ? SettleLens vous permet de construire n'importe quel scénario de divorce et d'en voir le résultat financier sur 10 ans.",
      sections: [
        { heading: "Construire un scénario de divorce en quelques minutes", body: "Saisissez vos actifs, dettes, revenus et la répartition envisagée : qui garde le logement, comment se partagent les droits à la retraite, quel montant de pension ? SettleLens calcule votre patrimoine net aujourd'hui et à 1, 3, 5 et 10 ans." },
        { heading: "Analyser l'offre de votre conjoint", body: "Vous avez reçu une proposition de votre conjoint ou de son avocat ? Saisissez-la comme scénario distinct dans SettleLens. L'outil la compare à votre position de référence et affiche la différence de patrimoine et de trésorerie sur 10 ans." },
        { heading: "Tester des variantes 'et si ?'", body: "Que se passe-t-il si vous insistez pour une pension plus élevée ? Ou si vous renoncez au logement pour éviter le risque de crédit ? SettleLens rend facile le test de variantes et l'identification du meilleur résultat financier." },
        { heading: "Intégrer votre avocat", body: "L'édition Professional exporte votre comparaison de scénarios en PDF et Excel — afin que votre avocat puisse utiliser les chiffres directement lors de vos entretiens." },
      ],
      faq: [
        { q: "Quelle est la précision du simulateur ?", a: "Le simulateur repose sur vos données et applique les règles générales du droit français (communauté d'acquêts, Code civil Art. 1401). C'est une estimation financière, pas une évaluation juridique — toujours indiquée avec son niveau de fiabilité." },
        { q: "Puis-je modifier un scénario après l'avoir créé ?", a: "Oui. Tous les scénarios sont modifiables à tout moment. Changez un paramètre — répartition du logement, pension, droits à la retraite — et la projection se met à jour immédiatement." },
      ],
      ctaText: "Simuler mon accord de divorce",
      ctaHref: "/fr/register",
      ctaSub: "Commencer gratuitement — sans carte bancaire",
      disclaimer: "SettleLens fournit une modélisation financière à titre informatif uniquement. Ce n'est pas un conseil juridique. Consultez toujours un avocat qualifié en droit de la famille.",
    }} />
  );
}
