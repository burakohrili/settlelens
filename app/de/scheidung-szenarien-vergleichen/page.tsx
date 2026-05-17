import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "Scheidungsszenarien vergleichen | SettleLens",
  description: "Vergleichen Sie bis zu 3 Scheidungsszenarien nebeneinander. Sehen Sie das 10-Jahres-Nettovermögen und den monatlichen Cashflow jeder Option.",
};

export default function Page() {
  return (
    <SeoLandingTemplate config={{
      locale: "de",
      badge: "Szenarienvergleich",
      headline: "Scheidungsszenarien nebeneinander vergleichen — Mit konkreten Zahlen",
      intro: "Sie haben mehrere Optionen. Jede führt Sie in eine andere finanzielle Position — in fünf, zehn Jahren. SettleLens stellt diese Optionen nebeneinander, damit Sie sehen, welcher Weg wohin führt — bevor Sie sich festlegen.",
      sections: [
        { heading: "Warum der Vergleich entscheidend ist", body: "Vereinbarungen, die auf dem Papier ähnlich aussehen, können über die Zeit dramatisch unterschiedliche Ergebnisse liefern. Eine Differenz von €300/Monat beim Unterhalt über 8 Jahre ergibt €28.800. SettleLens macht diese Unterschiede sichtbar." },
        { heading: "Bis zu 3 Szenarien vergleichen", body: "Erstellen Sie Ihr bevorzugtes Szenario, geben Sie das Angebot Ihres Partners als zweites ein und fügen Sie einen Kompromissvorschlag als drittes hinzu. Die Vergleichstabelle zeigt Nettovermögen in Jahr 1, 3, 5 und 10 — sowie monatlichen Cashflow — für alle Szenarien gleichzeitig." },
        { heading: "Anwalt gezielt einsetzen", body: "Mit dem Szenarienvergleich sehen Sie, welche Punkte finanziell am stärksten ins Gewicht fallen. Das gibt Ihnen und Ihrem Anwalt eine klare Verhandlungspriorität." },
      ],
      faq: [
        { q: "Wie viele Szenarien kann ich erstellen?", a: "Im kostenlosen Discovery-Plan sind 3 Szenarien möglich (ohne KI-Analyse). In den Bezahlplänen sind unbegrenzte Szenarien mit 10-Jahres-KI-Prognose enthalten." },
        { q: "Kann ich ein Szenario nach der Erstellung ändern?", a: "Ja. Alle Szenarien sind editierbar. Ändern Sie eine Variable — Immobilienaufteilung, Unterhalt, Versorgungsausgleich — und die Projektion aktualisiert sich sofort." },
      ],
      ctaText: "Meine Szenarien vergleichen",
      ctaHref: "/de/register",
      ctaSub: "Kostenlos starten — keine Kreditkarte erforderlich",
      disclaimer: "SettleLens bietet Finanzmodellierung zu Informationszwecken an. Keine Rechtsberatung. Konsultieren Sie stets einen qualifizierten Familienrechtsanwalt.",
    }} />
  );
}
