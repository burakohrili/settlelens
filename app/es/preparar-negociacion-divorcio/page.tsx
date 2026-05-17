import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "Preparar negociación divorcio | SettleLens",
  description: "Prepara tu negociación de divorcio con datos financieros sólidos. Modela tu posición a 10 años antes de reunirte con tu abogado.",
};

export default function Page() {
  return (
    <SeoLandingTemplate config={{
      locale: "es",
      badge: "Preparación para la negociación",
      headline: "Prepara la negociación de tu divorcio — Entra con cifras, no con intuiciones",
      intro: "Una negociación de divorcio bien preparada empieza por una comprensión precisa de tu situación financiera. SettleLens modela tu patrimonio actual y futuro para cada opción considerada — para que sepas lo que realmente está en juego antes de abrir las conversaciones.",
      sections: [
        { heading: "Conoce tu punto de partida", body: "Antes de cualquier negociación, debes conocer tu patrimonio neto real — activos menos deudas. SettleLens te guía para inventariar todos tus bienes y calcular tu punto de partida financiero." },
        { heading: "Identifica tus prioridades financieras", body: "¿Conservas la vivienda a toda costa? ¿Maximizas tu plan de pensiones? SettleLens modela el impacto de cada elección en tu situación a 10 años — ayudándote a identificar lo que realmente importa para ti." },
        { heading: "Analiza la oferta de la parte contraria", body: "Cuando tu cónyuge o su abogado hacen una propuesta, SettleLens te permite modelarla en minutos y ver su valor real a largo plazo — no solo en cifras brutas actuales." },
        { heading: "Construye tu contrapropuesta", body: "Con las proyecciones de SettleLens, puedes construir una contrapropuesta respaldada por datos financieros concretos. Tu abogado dispondrá así de una base sólida para la negociación." },
      ],
      faq: [
        { q: "¿En qué momento del procedimiento debo usar SettleLens?", a: "Cuanto antes, mejor — idealmente antes de tu primera cita con tu abogado. Cuanto antes comprendas tu situación financiera, mejores decisiones tomarás durante el procedimiento." },
        { q: "¿SettleLens me ayuda a evaluar si una oferta es aceptable?", a: "SettleLens te muestra las consecuencias financieras proyectadas de cada oferta a 10 años. La valoración jurídica de si una oferta es aceptable corresponde a tu abogado." },
      ],
      ctaText: "Preparar mi negociación",
      ctaHref: "/es/register",
      ctaSub: "Empieza gratis — sin tarjeta de crédito",
      disclaimer: "SettleLens ofrece modelización financiera únicamente con fines informativos. No es asesoramiento jurídico. Consulta siempre a un abogado cualificado en derecho de familia antes de tomar cualquier decisión.",
    }} />
  );
}
