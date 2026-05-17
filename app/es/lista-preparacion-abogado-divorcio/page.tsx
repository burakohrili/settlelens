import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "Lista preparación abogado divorcio | SettleLens",
  description: "Prepara tu primera cita con un abogado especialista en divorcios. Documentos necesarios, preguntas clave y datos financieros que debes reunir.",
};

export default function Page() {
  return (
    <SeoLandingTemplate config={{
      locale: "es",
      badge: "Preparación jurídica",
      headline: "Prepara tu cita con el abogado de divorcio — Lista de verificación completa",
      intro: "Una consulta con un abogado especializado en divorcios puede costar varios cientos de euros. Llegar preparado te permite aprovechar ese tiempo al máximo. SettleLens te ayuda a reunir y estructurar toda la información financiera que tu abogado necesitará.",
      checklist: [
        "Extractos bancarios de los últimos 12 meses (cuentas conjuntas e individuales)",
        "Escritura de propiedad y último recibo del IBI para los inmuebles",
        "Capital pendiente de la(s) hipoteca(s)",
        "Extractos de planes de pensiones y otros productos de ahorro",
        "Nóminas de los últimos 3 meses de cada cónyuge",
        "Última declaración de la renta conjunta",
        "Listado de todas las deudas: créditos al consumo, préstamos personales",
        "Capitulaciones matrimoniales (si las hay) — régimen económico elegido",
        "Documentación sobre herencias y donaciones recibidas durante el matrimonio",
        "Estimación del valor de mercado actual de la vivienda familiar",
      ],
      sections: [
        { heading: "¿Por qué prepararse financieramente?", body: "Tu abogado es experto en derecho de familia, no en contabilidad personal. Cuanto más claro llegues con las cifras, más podrá concentrarse en la estrategia jurídica adecuada para tu caso." },
        { heading: "SettleLens como herramienta de preparación", body: "SettleLens te permite introducir todo tu inventario patrimonial — activos, deudas, ingresos — y presentarlo de forma estructurada. Puedes exportar un resumen para compartir con tu abogado." },
      ],
      faq: [
        { q: "¿Debo llevar todos estos documentos a la primera cita?", a: "No necesariamente, pero cuantos más lleves, más productiva será la cita. Empieza por los documentos financieros esenciales: extractos bancarios, declaración de la renta y documentación del inmueble." },
        { q: "¿SettleLens puede reemplazar a mi abogado?", a: "No. SettleLens es una herramienta de modelización financiera para ayudarte a prepararte mejor. Un abogado especializado sigue siendo imprescindible para cualquier procedimiento de divorcio." },
      ],
      ctaText: "Preparar mi expediente financiero",
      ctaHref: "/es/register",
      ctaSub: "Empieza gratis — sin tarjeta de crédito",
      disclaimer: "SettleLens ofrece modelización financiera únicamente con fines informativos. No es asesoramiento jurídico. Consulta siempre a un abogado especializado en derecho de familia.",
    }} />
  );
}
