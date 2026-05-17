import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "Checklist rendez-vous avocat divorce | SettleLens",
  description: "Préparez votre premier rendez-vous avec un avocat spécialisé en divorce. Liste de documents, questions à poser et données financières à rassembler.",
};

export default function Page() {
  return (
    <SeoLandingTemplate config={{
      locale: "fr",
      badge: "Préparation juridique",
      headline: "Préparez votre rendez-vous avec votre avocat divorce — Checklist complète",
      intro: "Un rendez-vous avec un avocat spécialisé en divorce peut coûter plusieurs centaines d'euros. Arriver préparé vous permet d'utiliser ce temps de manière optimale. SettleLens vous aide à rassembler et structurer toutes les informations financières dont votre avocat aura besoin.",
      checklist: [
        "Relevés bancaires des 12 derniers mois (comptes joints et individuels)",
        "Acte de propriété et dernier avis de taxe foncière pour l'immobilier",
        "Capital restant dû sur le(s) prêt(s) immobilier(s)",
        "Relevés de compte épargne retraite (PER, assurance-vie, etc.)",
        "Bulletins de salaire des 3 derniers mois pour chaque époux",
        "Dernière déclaration de revenus commune",
        "Liste de toutes les dettes : crédits à la consommation, prêts personnels",
        "Contrat de mariage (si applicable) — régime matrimonial choisi",
        "Documents relatifs aux donations et héritages reçus pendant le mariage",
        "Estimation de la valeur de marché actuelle du logement familial",
      ],
      sections: [
        { heading: "Pourquoi se préparer financièrement ?", body: "Votre avocat est expert en droit de la famille, pas en comptabilité personnelle. Plus vous arriverez avec des chiffres clairs, plus il pourra se concentrer sur la stratégie juridique qui vous convient." },
        { heading: "SettleLens comme outil de préparation", body: "SettleLens vous permet de saisir l'ensemble de votre inventaire patrimonial — actifs, dettes, revenus — et de le présenter de manière structurée. Vous pouvez exporter un résumé à partager avec votre avocat." },
      ],
      faq: [
        { q: "Dois-je apporter tous ces documents dès le premier rendez-vous ?", a: "Pas nécessairement, mais plus vous en apportez, plus le rendez-vous sera productif. Commencez par les documents financiers essentiels : relevés bancaires, avis d'imposition et justificatifs du bien immobilier." },
        { q: "SettleLens peut-il remplacer mon avocat ?", a: "Non. SettleLens est un outil de modélisation financière pour vous aider à mieux vous préparer. Un avocat spécialisé reste indispensable pour toute procédure de divorce." },
      ],
      ctaText: "Préparer mon dossier financier",
      ctaHref: "/fr/register",
      ctaSub: "Commencer gratuitement — sans carte bancaire",
      disclaimer: "SettleLens fournit une modélisation financière à titre informatif uniquement. Ce n'est pas un conseil juridique. Consultez toujours un avocat spécialisé en droit de la famille.",
    }} />
  );
}
