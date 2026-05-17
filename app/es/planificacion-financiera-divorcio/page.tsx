import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "Planificación financiera divorcio | SettleLens",
  description: "Prepara tu futuro financiero tras el divorcio. Proyecta tu patrimonio neto a 10 años y optimiza tu acuerdo de divorcio.",
};

export default function Page() {
  return (
    <SeoLandingTemplate config={{
      locale: "es",
      badge: "Planificación financiera",
      headline: "Planificación financiera del divorcio — Prepara tu futuro a 10 años",
      intro: "Un divorcio es también una decisión financiera de gran calado. SettleLens te ayuda a modelar tu situación tras el divorcio — ingresos, gastos, patrimonio — para que entres en la negociación con cifras concretas.",
      sections: [
        { heading: "Evalúa tu situación financiera post-divorcio", body: "SettleLens calcula tu patrimonio neto actual integrando todos tus activos (inmuebles, cuentas bancarias, planes de pensiones) y tus deudas. Es el punto de partida de cualquier planificación financiera sólida." },
        { heading: "Modela el impacto de las pensiones alimenticias", body: "Pensión compensatoria o pensión para hijos: SettleLens integra estos importes en tu proyección mensual y anual. Ves inmediatamente el impacto en tu flujo de caja y tu ahorro a 10 años." },
        { heading: "Prepara la negociación con tu abogado", body: "En lugar de llegar a tu cita sin cifras precisas, usa SettleLens para estructurar tus hipótesis. Tu abogado podrá concentrarse en la estrategia jurídica, no en cálculos básicos." },
        { heading: "Anticipa la inflación y la evolución de ingresos", body: "SettleLens aplica una tasa de inflación configurable a tus proyecciones. Las pensiones fijas pierden valor real con el tiempo — la modelización a 10 años te lo muestra claramente." },
      ],
      faq: [
        { q: "¿SettleLens reemplaza a un asesor financiero?", a: "No. SettleLens es una herramienta de modelización para ayudarte a prepararte. Un asesor financiero o abogado especializado sigue siendo imprescindible para las decisiones definitivas." },
        { q: "¿Puedo modificar mis datos después de introducirlos?", a: "Sí. Todos los escenarios son modificables en cualquier momento. Cambia un parámetro — importe de la pensión, valor del inmueble — y la proyección se actualiza de inmediato." },
      ],
      ctaText: "Planificar mi situación financiera",
      ctaHref: "/es/register",
      ctaSub: "Empieza gratis — sin tarjeta de crédito",
      disclaimer: "SettleLens ofrece modelización financiera únicamente con fines informativos. No es asesoramiento jurídico ni financiero. Consulta siempre a un profesional cualificado.",
    }} />
  );
}
