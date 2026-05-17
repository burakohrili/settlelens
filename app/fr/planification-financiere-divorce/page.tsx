import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "Planification financière divorce | SettleLens",
  description: "Préparez votre avenir financier après un divorce. Projetez votre patrimoine net sur 10 ans et optimisez votre accord de divorce.",
};

export default function Page() {
  return (
    <SeoLandingTemplate config={{
      locale: "fr",
      badge: "Planification financière",
      headline: "Planification financière du divorce — Préparez votre avenir sur 10 ans",
      intro: "Un divorce est aussi une décision financière majeure. SettleLens vous aide à modéliser votre situation après le divorce — revenus, charges, patrimoine — pour que vous entriez dans la négociation avec des chiffres concrets.",
      sections: [
        { heading: "Évaluer votre situation financière post-divorce", body: "SettleLens calcule votre patrimoine net actuel en intégrant tous vos actifs (immobilier, comptes bancaires, épargne retraite) et vos dettes. C'est le point de départ de toute planification financière solide." },
        { heading: "Modéliser l'impact des pensions alimentaires", body: "Pension alimentaire pour conjoint ou pour enfants : SettleLens intègre ces montants dans votre projection mensuelle et annuelle. Vous voyez immédiatement l'impact sur votre flux de trésorerie et votre épargne sur 10 ans." },
        { heading: "Préparer la négociation avec votre avocat", body: "Plutôt que d'arriver à votre rendez-vous sans chiffres précis, utilisez SettleLens pour structurer vos hypothèses. Votre avocat pourra ainsi se concentrer sur la stratégie juridique, pas sur les calculs de base." },
        { heading: "Anticiper l'inflation et l'évolution des revenus", body: "SettleLens applique un taux d'inflation paramétrable à vos projections. Les pensions fixes perdent de la valeur réelle avec le temps — la modélisation sur 10 ans vous le montre clairement." },
      ],
      faq: [
        { q: "SettleLens remplace-t-il un conseiller financier ?", a: "Non. SettleLens est un outil de modélisation pour vous aider à vous préparer. Un conseiller financier ou un avocat spécialisé reste indispensable pour les décisions définitives." },
        { q: "Puis-je modifier mes données après les avoir saisies ?", a: "Oui. Tous les scénarios sont modifiables à tout moment. Changez un paramètre — montant de la pension, valeur du bien immobilier — et la projection se met à jour immédiatement." },
      ],
      ctaText: "Planifier ma situation financière",
      ctaHref: "/fr/register",
      ctaSub: "Commencer gratuitement — sans carte bancaire",
      disclaimer: "SettleLens fournit une modélisation financière à titre informatif uniquement. Ce n'est pas un conseil juridique ou financier. Consultez toujours un professionnel qualifié.",
    }} />
  );
}
