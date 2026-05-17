import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "Calculadora acuerdo divorcio | SettleLens",
  description: "Modela el reparto de bienes en el divorcio. Compara tus escenarios a 10 años — patrimonio neto y flujo de caja mensual.",
};

export default function Page() {
  return (
    <SeoLandingTemplate config={{
      locale: "es",
      badge: "Reparto de bienes",
      headline: "Calculadora de acuerdo de divorcio — Modela antes de negociar",
      intro: "El reparto de bienes es una de las decisiones más importantes en un divorcio. SettleLens te permite modelar distintos escenarios de reparto y ver su impacto financiero a 10 años — patrimonio neto y flujo de caja mensual.",
      sections: [
        { heading: "Sociedad de gananciales (CC Art. 1344)", body: "En España, los bienes adquiridos durante el matrimonio se reparten en principio a partes iguales. SettleLens aplica estas reglas a tus activos y deudas para darte una estimación de tu posición financiera tras el divorcio." },
        { heading: "Bienes privativos vs. bienes gananciales", body: "Los bienes recibidos por herencia o donación son en principio privativos de cada cónyuge. SettleLens te ayuda a categorizar correctamente tus activos para excluir los bienes privativos del reparto y obtener una modelización más precisa." },
        { heading: "Comparar varios escenarios de reparto", body: "¿Tu cónyuge propone una distribución distinta? Introdúcela en SettleLens como segundo escenario y compara la diferencia a 10 años. Verás de un vistazo qué impacto tiene esa propuesta en tu patrimonio futuro." },
        { heading: "Proyección a 10 años", body: "SettleLens proyecta tu patrimonio neto a 1, 3, 5 y 10 años integrando tus ingresos, gastos, pensiones alimenticias e hipotecas — según cada escenario de reparto que modeles." },
      ],
      faq: [
        { q: "¿SettleLens calcula exactamente mi parte legal?", a: "No. SettleLens es una herramienta de modelización financiera, no jurídica. Aplica hipótesis generales basadas en el derecho español. Tu abogado o notario establecerá el reparto definitivo." },
        { q: "¿Qué ocurre si tenemos capitulaciones matrimoniales?", a: "Si optasteis por separación de bienes u otro régimen económico, indícalo en SettleLens. La herramienta adaptará sus hipótesis a tu situación." },
      ],
      ctaText: "Modelar mi reparto de bienes",
      ctaHref: "/es/register",
      ctaSub: "Empieza gratis — sin tarjeta de crédito",
      disclaimer: "SettleLens ofrece modelización financiera únicamente con fines informativos. No es asesoramiento jurídico. Consulta siempre a un abogado o notario especializado en derecho de familia.",
    }} />
  );
}
