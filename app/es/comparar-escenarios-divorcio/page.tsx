import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "Comparar escenarios divorcio | SettleLens",
  description: "Compara hasta 3 escenarios de divorcio en paralelo. Visualiza el patrimonio neto a 10 años y el flujo de caja mensual de cada opción.",
};

export default function Page() {
  return (
    <SeoLandingTemplate config={{
      locale: "es",
      badge: "Comparación de escenarios",
      headline: "Comparar escenarios de divorcio en paralelo — Con cifras concretas",
      intro: "Tienes varias opciones. Cada una te lleva a una posición financiera diferente — en cinco años, en diez años. SettleLens pone estas opciones en paralelo para que veas adónde conduce cada camino — antes de comprometerte.",
      sections: [
        { heading: "Por qué la comparación es decisiva", body: "Acuerdos que parecen similares sobre el papel pueden producir resultados muy distintos a lo largo del tiempo. Una diferencia de 300 €/mes de pensión durante 8 años representa 28.800 €. SettleLens hace visibles estas diferencias." },
        { heading: "Comparar hasta 3 escenarios", body: "Crea tu escenario preferido, introduce la propuesta de tu cónyuge como segundo escenario y añade un compromiso como tercero. La tabla comparativa muestra el patrimonio neto en el año 1, 3, 5 y 10 — así como el flujo de caja mensual — para todos los escenarios simultáneamente." },
        { heading: "Orientar la negociación con tu abogado", body: "Con la comparación de escenarios, identificas los puntos que más pesan financieramente. Tú y tu abogado disponéis así de una jerarquía clara de prioridades de negociación." },
      ],
      faq: [
        { q: "¿Cuántos escenarios puedo crear?", a: "En el plan Discovery gratuito son posibles 3 escenarios (sin análisis IA). En los planes de pago, los escenarios son ilimitados con proyección IA a 10 años." },
        { q: "¿Puedo modificar un escenario después de crearlo?", a: "Sí. Todos los escenarios son modificables. Cambia una variable — reparto inmobiliario, pensión, plan de pensiones — y la proyección se actualiza de inmediato." },
      ],
      ctaText: "Comparar mis escenarios",
      ctaHref: "/es/register",
      ctaSub: "Empieza gratis — sin tarjeta de crédito",
      disclaimer: "SettleLens ofrece modelización financiera únicamente con fines informativos. No es asesoramiento jurídico. Consulta siempre a un abogado cualificado en derecho de familia.",
    }} />
  );
}
