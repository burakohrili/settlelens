import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "Scheidung: Haus behalten oder verkaufen? | SettleLens",
  description: "Haus behalten oder verkaufen bei Scheidung? Vergleichen Sie die 10-Jahres-Finanzauswirkungen beider Optionen — mit konkreten Zahlen.",
};

export default function Page() {
  return (
    <SeoLandingTemplate config={{
      locale: "de",
      badge: "Immobilienentscheidung",
      headline: "Haus behalten oder verkaufen bei Scheidung? Die realen Zahlen.",
      intro: "Die Immobilie ist in den meisten Scheidungen der größte Vermögenswert — und die emotional schwierigste Entscheidung. SettleLens zeigt Ihnen die 10-Jahres-Finanzauswirkung jeder Option, damit Sie auf Basis von Fakten entscheiden können.",
      sections: [
        { heading: "Option A: Sie behalten das Haus", body: "Das Haus zu behalten bedeutet, das Eigenkapital zu sichern — aber auch, die volle Hypothekenlast, Grundsteuer, Versicherung und Instandhaltungskosten allein zu tragen. SettleLens prüft, ob Ihr Einkommen nach Scheidung diese Last trägt, und projiziert Ihr Nettovermögen in 10 Jahren." },
        { heading: "Option B: Partner behält das Haus", body: "Beim Übertrag an den Ehepartner erhalten Sie entweder eine Ausgleichszahlung oder andere Vermögenswerte. SettleLens modelliert, wie Sie diese Mittel einsetzen — Miete, Neukauf oder Investition — und vergleicht das 10-Jahres-Ergebnis mit dem Behaltenszenario." },
        { heading: "Option C: Gemeinsamer Verkauf", body: "Ein Verkauf verteilt das Eigenkapital auf beide Parteien. SettleLens zeigt, wie Ihr Anteil am Verkaufserlös kombiniert mit den übrigen Scheidungskonditionen Ihre Finanzposition über 10 Jahre gestaltet." },
        { heading: "Versteckte Kosten des Behaltens", body: "Neben der Hypothek können HOA-Gebühren, Renovierungen, und Grundsteuern das Behalten teurer machen als erwartet. Ggf. sinkt auch die Liquidität erheblich. SettleLens quantifiziert diese Belastungen und zeigt ihren kumulativen Effekt." },
      ],
      faq: [
        { q: "Wie gebe ich den Hauswert ein?", a: "Sie geben den aktuellen Marktwert und die Restschuld der Hypothek ein. SettleLens berechnet daraus das Eigenkapital und modelliert die jeweiligen Szenarien." },
        { q: "Was wenn wir beide im Grundbuch stehen?", a: "Bei gemeinsamer Eigentümerschaft ist die Übertragung notariell zu beglaubigen. Die finanzielle Modellierung in SettleLens hilft Ihnen, die wirtschaftlichen Konsequenzen verschiedener Übertragungsoptionen vorab zu verstehen." },
      ],
      ctaText: "Meine Immobilienszenarien vergleichen",
      ctaHref: "/de/register",
      ctaSub: "Kostenlos starten — keine Kreditkarte erforderlich",
      disclaimer: "SettleLens bietet Finanzmodellierung zu Informationszwecken an. Keine Rechtsberatung. Immobilienentscheidungen bei Scheidung sollten immer mit einem qualifizierten Familienrechtsanwalt besprochen werden.",
    }} />
  );
}
