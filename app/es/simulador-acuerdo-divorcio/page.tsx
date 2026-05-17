import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "Simulador acuerdo de divorcio | SettleLens",
  description: "Simula distintos acuerdos de divorcio y visualiza el resultado financiero. Compara tu propuesta con la oferta de tu cónyuge.",
};

export default function Page() {
  return (
    <SeoLandingTemplate config={{
      locale: "es",
      badge: "Simulador de acuerdo",
      headline: "Simula cada acuerdo de divorcio — Y visualiza el resultado financiero",
      intro: "¿Qué ocurre financieramente si aceptas esta propuesta? ¿Y si contrapropones? SettleLens te permite construir cualquier escenario de divorcio y ver el resultado financiero a 10 años.",
      sections: [
        { heading: "Construir un escenario de divorcio en minutos", body: "Introduce tus activos, deudas, ingresos y el reparto previsto: ¿quién se queda el inmueble?, ¿cómo se reparten los planes de pensiones?, ¿qué importe de pensión? SettleLens calcula tu patrimonio neto ahora y a 1, 3, 5 y 10 años." },
        { heading: "Analizar la oferta de tu cónyuge", body: "¿Has recibido una propuesta de tu cónyuge o de su abogado? Introdúcela como escenario separado en SettleLens. La herramienta la compara con tu posición de referencia y muestra la diferencia de patrimonio y flujo de caja a 10 años." },
        { heading: "Probar variantes '¿y si…?'", body: "¿Qué ocurre si insistes en una pensión más alta? ¿O si renuncias al inmueble para evitar el riesgo hipotecario? SettleLens facilita el test de variantes y la identificación del mejor resultado financiero." },
        { heading: "Implicar a tu abogado", body: "La edición Professional exporta tu comparativa de escenarios en PDF y Excel — para que tu abogado pueda utilizar las cifras directamente en las reuniones." },
      ],
      faq: [
        { q: "¿Qué precisión tiene el simulador?", a: "El simulador se basa en tus datos y aplica las reglas generales del derecho español (sociedad de gananciales, CC Art. 1344). Es una estimación financiera, no una valoración jurídica — siempre indicada con su nivel de fiabilidad." },
        { q: "¿Puedo modificar un escenario después de crearlo?", a: "Sí. Todos los escenarios son modificables en cualquier momento. Cambia una variable — reparto del inmueble, pensión, plan de pensiones — y la proyección se actualiza de inmediato." },
      ],
      ctaText: "Simular mi acuerdo de divorcio",
      ctaHref: "/es/register",
      ctaSub: "Empieza gratis — sin tarjeta de crédito",
      disclaimer: "SettleLens ofrece modelización financiera únicamente con fines informativos. No es asesoramiento jurídico. Consulta siempre a un abogado cualificado en derecho de familia.",
    }} />
  );
}
