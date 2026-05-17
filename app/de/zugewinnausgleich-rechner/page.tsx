import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "Zugewinnausgleich Rechner | SettleLens",
  description: "Zugewinnausgleich bei Scheidung berechnen. Modellieren Sie den Vermögensausgleich nach BGB §1363 mit 10-Jahres-Projektion — vor der Anwaltsberatung.",
};

export default function Page() {
  return (
    <SeoLandingTemplate config={{
      locale: "de",
      badge: "Zugewinnausgleich",
      headline: "Zugewinnausgleich bei Scheidung — Finanziell Vorbereitet in die Verhandlung",
      intro: "Der Zugewinnausgleich ist das Herzstück der deutschen Scheidungsfinanzen. SettleLens modelliert, wie das während der Ehe erworbene Vermögen beider Parteien ausgeglichen wird — und zeigt die finanziellen Auswirkungen über 10 Jahre.",
      sections: [
        { heading: "Was ist der Zugewinnausgleich?", body: "Bei der gesetzlichen Zugewinngemeinschaft (BGB §1363) wird beim Scheidungsantrag der Zugewinn beider Parteien ermittelt. Der Ehegatte mit dem niedrigeren Zugewinn erhält den hälftigen Differenzbetrag als Ausgleichszahlung. SettleLens hilft Ihnen, Anfangsvermögen und Endvermögen beider Parteien zu strukturieren." },
        { heading: "Anfangsvermögen vs. Endvermögen", body: "Das Anfangsvermögen ist der Wert Ihres Vermögens zu Beginn der Ehe (zuzüglich Erbschaften und Schenkungen während der Ehe). Das Endvermögen ist der Wert zum Zeitpunkt der Zustellung des Scheidungsantrags. Schulden werden abgezogen. SettleLens führt Sie durch beide Berechnungen." },
        { heading: "Privilegierter Erwerb (Erbschaften, Schenkungen)", body: "Erbschaften und Schenkungen, die während der Ehe anfallen, werden dem Anfangsvermögen hinzugerechnet — sie sind also nicht Teil des Zugewinns. SettleLens ermöglicht es, diese Beträge korrekt zu kategorisieren und vom Ausgleich auszuschließen." },
        { heading: "Modellieren Sie verschiedene Ausgleichsszenarien", body: "Was wäre, wenn der Zugewinnausgleich anders berechnet würde? Was wäre bei einer anderen Anfangsvermögensangabe des Partners? SettleLens lässt Sie verschiedene Annahmen testen und die jeweiligen Ausgleichsbeträge vergleichen." },
      ],
      faq: [
        { q: "Kann ich den Zugewinnausgleich vertraglich ausschließen?", a: "Ja, durch einen notariell beglaubigten Ehevertrag können Sie Gütertrennung vereinbaren. Besteht bereits ein Ehevertrag, wenden Sie sich an Ihren Anwalt für eine Überprüfung." },
        { q: "Was passiert mit Schulden beim Zugewinnausgleich?", a: "Schulden mindern das Endvermögen. Ist das Endvermögen einer Partei negativ, wird ihr Anfangsvermögen auf null gesetzt — ein negatives Anfangsvermögen wird hingegen berücksichtigt." },
      ],
      ctaText: "Meinen Zugewinnausgleich modellieren",
      ctaHref: "/de/register",
      ctaSub: "Kostenlos starten — keine Kreditkarte erforderlich",
      disclaimer: "SettleLens bietet Finanzmodellierung zu Informationszwecken an. Kein Rechtsrat. Konsultieren Sie stets einen qualifizierten Familienrechtsanwalt für bindende Entscheidungen.",
    }} />
  );
}
