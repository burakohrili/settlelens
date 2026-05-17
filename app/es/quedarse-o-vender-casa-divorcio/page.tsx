import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "¿Quedarse o vender la casa en el divorcio? | SettleLens",
  description: "Compara el impacto financiero a 10 años de cada opción: quedarse con la casa, cedérsela a tu cónyuge o venderla. Cifras reales para decidir.",
};

export default function Page() {
  return (
    <SeoLandingTemplate config={{
      locale: "es",
      badge: "Decisión inmobiliaria",
      headline: "¿Quedarse o vender la casa en el divorcio? Las cifras reales.",
      intro: "La vivienda familiar es habitualmente el bien más importante en un divorcio — y la decisión más cargada emocionalmente. SettleLens te muestra el impacto financiero real de cada opción a 10 años, para que puedas decidir basándote en hechos.",
      sections: [
        { heading: "Opción A: Te quedas la casa", body: "Conservar la vivienda significa mantener el valor patrimonial — pero también asumir en solitario la hipoteca, el IBI, el seguro y los gastos de mantenimiento. SettleLens comprueba si tus ingresos post-divorcio pueden soportar esa carga y proyecta tu patrimonio neto a 10 años." },
        { heading: "Opción B: Tu cónyuge se queda la casa", body: "Al ceder la vivienda, recibes una compensación económica u otros activos a cambio. SettleLens modela cómo podrías utilizar esos fondos — alquiler, nueva compra o inversión — y compara el resultado a 10 años con la opción de conservación." },
        { heading: "Opción C: Venta del inmueble", body: "Una venta permite distribuir el producto neto entre ambas partes. SettleLens calcula tu parte del precio de venta y muestra cómo se integra en tu situación financiera global a 10 años." },
        { heading: "Los costes ocultos de quedarse la casa", body: "Más allá de la hipoteca, los gastos de comunidad, reformas e IBI pueden hacer que quedarse sea más caro de lo previsto. SettleLens cuantifica estas cargas y su efecto acumulado sobre tu flujo de caja." },
      ],
      faq: [
        { q: "¿Cómo introduzco el valor de la vivienda?", a: "Indica el valor de mercado actual y el capital pendiente de la hipoteca. SettleLens calcula el valor neto (equity) y modela cada escenario a partir de esos datos." },
        { q: "¿Y si los dos figuramos como propietarios?", a: "En caso de copropiedad, la transmisión a uno de los cónyuges requiere por lo general escritura notarial. La modelización financiera en SettleLens te ayuda a comprender las consecuencias económicas de cada opción de transmisión." },
      ],
      ctaText: "Comparar mis escenarios inmobiliarios",
      ctaHref: "/es/register",
      ctaSub: "Empieza gratis — sin tarjeta de crédito",
      disclaimer: "SettleLens ofrece modelización financiera únicamente con fines informativos. No es asesoramiento jurídico. Las decisiones inmobiliarias en el divorcio deben consultarse siempre con un abogado o notario especializado.",
    }} />
  );
}
