import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "Impacto pensión alimenticia divorcio | SettleLens",
  description: "Modela el impacto financiero a largo plazo de la pensión alimenticia en el divorcio. Proyección a 10 años incluyendo inflación.",
};

export default function Page() {
  return (
    <SeoLandingTemplate config={{
      locale: "es",
      badge: "Pensión alimenticia",
      headline: "Impacto financiero de la pensión alimenticia en el divorcio — Proyección a 10 años",
      intro: "La pensión alimenticia — compensatoria o para hijos — es uno de los elementos más negociables y de mayor impacto en un acuerdo de divorcio. SettleLens modela cómo distintos importes y duraciones afectan a tu patrimonio neto y tu flujo de caja mensual a 10 años.",
      sections: [
        { heading: "Pensión compensatoria", body: "La pensión compensatoria tiene como objetivo compensar el desequilibrio económico que el divorcio produce entre los cónyuges. Puede ser temporal o indefinida. SettleLens integra tus hipótesis de importe y duración en tu proyección financiera completa." },
        { heading: "Pensión alimenticia para hijos", body: "El importe de la pensión para hijos depende de los ingresos del progenitor obligado al pago, del régimen de custodia y de la edad de cada hijo. SettleLens proyecta la carga total hasta la mayoría de edad y la integra en tu flujo de caja mensual." },
        { heading: "Inflación y valor real de las pensiones", body: "Una pensión fijada hoy perderá valor real con la inflación. SettleLens aplica una tasa de inflación configurable a tus proyecciones para que comprendas el valor real de los pagos a 10 años." },
        { heading: "Comparar las propuestas", body: "¿Tu cónyuge ha propuesto un importe de pensión? Introdúcelo en SettleLens y compáralo con tu propia posición. La diferencia a 10 años te muestra lo que realmente está en juego en la negociación." },
      ],
      faq: [
        { q: "¿SettleLens puede calcular el importe exacto de mi pensión?", a: "No. El importe lo fija el juez según numerosos criterios individuales. SettleLens modela el impacto financiero de distintos importes — como marco de referencia para la negociación." },
        { q: "¿Cuánto dura habitualmente la pensión compensatoria?", a: "Puede ser temporal o indefinida, según lo determine el juez. SettleLens integra esa duración en la proyección global." },
      ],
      ctaText: "Modelar mis escenarios de pensión",
      ctaHref: "/es/register",
      ctaSub: "Empieza gratis — sin tarjeta de crédito",
      disclaimer: "SettleLens ofrece modelización financiera únicamente con fines informativos. No es asesoramiento jurídico. Los importes de la pensión son fijados por el tribunal. Consulta siempre a un abogado especializado en derecho de familia.",
    }} />
  );
}
