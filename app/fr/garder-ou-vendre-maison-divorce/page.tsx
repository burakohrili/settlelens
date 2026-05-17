import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "Garder ou vendre la maison lors d'un divorce ? | SettleLens",
  description: "Comparez l'impact financier sur 10 ans de chaque option : garder la maison, la céder à votre conjoint, ou la vendre. Des chiffres concrets pour décider.",
};

export default function Page() {
  return (
    <SeoLandingTemplate config={{
      locale: "fr",
      badge: "Décision immobilière",
      headline: "Garder ou vendre la maison lors du divorce ? Les vrais chiffres.",
      intro: "Le logement familial est souvent le bien le plus important dans un divorce — et la décision la plus chargée émotionnellement. SettleLens vous montre l'impact financier réel de chaque option sur 10 ans, pour que vous puissiez décider sur la base de faits.",
      sections: [
        { heading: "Option A : Vous gardez la maison", body: "Conserver le logement signifie préserver la valeur patrimoniale — mais aussi assumer seul(e) les remboursements du prêt, la taxe foncière, l'assurance et les charges d'entretien. SettleLens vérifie si vos revenus post-divorce peuvent supporter cette charge et projette votre patrimoine net sur 10 ans." },
        { heading: "Option B : Votre conjoint garde la maison", body: "En cédant le logement, vous percevez soit une soulte, soit d'autres actifs en compensation. SettleLens modélise comment vous pourriez utiliser ces fonds — loyer, rachat immobilier ou placement — et compare le résultat sur 10 ans avec l'option de conservation." },
        { heading: "Option C : Vente du bien", body: "Une vente permet de répartir le produit net entre les deux parties. SettleLens calcule votre quote-part du produit de vente et montre comment elle s'intègre dans votre situation financière globale sur 10 ans." },
        { heading: "Les coûts cachés de la conservation", body: "Au-delà du prêt immobilier, les charges de copropriété, les travaux et la taxe foncière peuvent rendre la conservation plus coûteuse que prévu. SettleLens quantifie ces charges et leur effet cumulé sur votre trésorerie." },
      ],
      faq: [
        { q: "Comment saisir la valeur du bien ?", a: "Renseignez la valeur de marché actuelle et le capital restant dû. SettleLens calcule la valeur nette (equity) et modélise chaque scénario à partir de ces données." },
        { q: "Et si nous sommes tous les deux co-propriétaires ?", a: "En cas de co-propriété, le transfert à l'un des époux nécessite en général un acte notarié. La modélisation financière dans SettleLens vous aide à comprendre les conséquences économiques de chaque option de transfert." },
      ],
      ctaText: "Comparer mes scénarios immobiliers",
      ctaHref: "/fr/register",
      ctaSub: "Commencer gratuitement — sans carte bancaire",
      disclaimer: "SettleLens fournit une modélisation financière à titre informatif uniquement. Ce n'est pas un conseil juridique. Les décisions immobilières lors d'un divorce doivent toujours être discutées avec un avocat ou notaire spécialisé.",
    }} />
  );
}
