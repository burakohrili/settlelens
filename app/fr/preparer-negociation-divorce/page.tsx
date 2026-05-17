import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "Préparer la négociation divorce | SettleLens",
  description: "Préparez votre négociation de divorce avec des données financières solides. Modélisez votre position sur 10 ans avant de rencontrer votre avocat.",
};

export default function Page() {
  return (
    <SeoLandingTemplate config={{
      locale: "fr",
      badge: "Préparation à la négociation",
      headline: "Préparer la négociation de votre divorce — Entrez avec des chiffres, pas des intuitions",
      intro: "Une négociation de divorce bien préparée commence par une compréhension précise de votre situation financière. SettleLens modélise votre patrimoine actuel et futur pour chaque option envisagée — afin que vous sachiez ce qui est réellement en jeu avant d'ouvrir les discussions.",
      sections: [
        { heading: "Connaître votre point de départ", body: "Avant toute négociation, vous devez connaître votre patrimoine net réel — actifs moins dettes. SettleLens vous guide pour inventorier l'ensemble de vos avoirs et calculer votre point de départ financier." },
        { heading: "Identifier vos priorités financières", body: "Conservez-vous le logement coûte que coûte ? Maximisez-vous votre épargne retraite ? SettleLens modélise l'impact de chaque choix sur votre situation à 10 ans — vous aidant à identifier ce qui compte vraiment pour vous." },
        { heading: "Analyser l'offre adverse", body: "Lorsque votre conjoint ou son avocat fait une proposition, SettleLens vous permet de la modéliser en quelques minutes et de voir sa valeur réelle à long terme — pas seulement en chiffres bruts actuels." },
        { heading: "Construire votre contre-proposition", body: "Avec les projections SettleLens, vous pouvez construire une contre-proposition étayée par des données financières concrètes. Votre avocat dispose ainsi d'une base solide pour la négociation." },
      ],
      faq: [
        { q: "À quel moment de la procédure dois-je utiliser SettleLens ?", a: "Le plus tôt possible — idéalement avant votre premier rendez-vous avec votre avocat. Plus vous comprenez votre situation financière tôt, plus vous prenez de meilleures décisions pendant la procédure." },
        { q: "SettleLens m'aide-t-il à évaluer si une offre est acceptable ?", a: "SettleLens vous montre les conséquences financières projetées de chaque offre sur 10 ans. L'évaluation juridique de l'acceptabilité d'une offre relève de votre avocat." },
      ],
      ctaText: "Préparer ma négociation",
      ctaHref: "/fr/register",
      ctaSub: "Commencer gratuitement — sans carte bancaire",
      disclaimer: "SettleLens fournit une modélisation financière à titre informatif uniquement. Ce n'est pas un conseil juridique. Consultez toujours un avocat qualifié en droit de la famille avant de prendre toute décision.",
    }} />
  );
}
