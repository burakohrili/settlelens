import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "Impact pension alimentaire divorce | SettleLens",
  description: "Modélisez l'impact financier à long terme de la pension alimentaire lors d'un divorce. Projection sur 10 ans incluant l'inflation.",
};

export default function Page() {
  return (
    <SeoLandingTemplate config={{
      locale: "fr",
      badge: "Pension alimentaire",
      headline: "Impact financier de la pension alimentaire lors du divorce — Projection sur 10 ans",
      intro: "La pension alimentaire — pour conjoint ou pour enfants — est l'un des éléments les plus négociables et les plus impactants d'un accord de divorce. SettleLens modélise comment différents montants et durées affectent votre patrimoine net et votre trésorerie mensuelle sur 10 ans.",
      sections: [
        { heading: "Prestation compensatoire (pension pour conjoint)", body: "La prestation compensatoire vise à compenser la disparité de niveau de vie créée par le divorce. Elle peut être versée sous forme de capital ou de rente. SettleLens intègre vos hypothèses de montant et de durée dans votre projection financière complète." },
        { heading: "Pension alimentaire pour enfants", body: "Le montant de la pension pour enfants dépend des revenus du parent débiteur, du mode de garde et de l'âge de l'enfant. SettleLens projette la charge totale jusqu'à la majorité de chaque enfant et l'intègre dans votre flux de trésorerie mensuel." },
        { heading: "Inflation et valeur réelle des pensions", body: "Une pension fixée aujourd'hui perdra de la valeur réelle avec l'inflation. SettleLens applique un taux d'inflation paramétrable à vos projections pour que vous compreniez la valeur réelle des versements sur 10 ans." },
        { heading: "Comparer les propositions", body: "Votre conjoint a proposé un montant de pension ? Saisissez-le dans SettleLens et comparez-le à votre propre position. La différence sur 10 ans vous montre ce qui est réellement en jeu dans la négociation." },
      ],
      faq: [
        { q: "SettleLens peut-il calculer le montant exact de ma pension ?", a: "Non. Le montant est fixé par le juge aux affaires familiales selon de nombreux critères individuels. SettleLens modélise l'impact financier de différents montants — pour vous donner un cadre de référence pour la négociation." },
        { q: "Combien de temps dure en général la prestation compensatoire ?", a: "Elle peut être versée en capital (en une fois) ou sous forme de rente dont la durée est fixée par le juge. SettleLens intègre cette durée dans la projection globale." },
      ],
      ctaText: "Modéliser mes scénarios de pension",
      ctaHref: "/fr/register",
      ctaSub: "Commencer gratuitement — sans carte bancaire",
      disclaimer: "SettleLens fournit une modélisation financière à titre informatif uniquement. Ce n'est pas un conseil juridique. Les montants de pension sont fixés par le tribunal. Consultez toujours un avocat spécialisé en droit de la famille.",
    }} />
  );
}
