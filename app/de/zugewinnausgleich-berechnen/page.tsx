import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "Zugewinnausgleich berechnen — Schritt-für-Schritt 2026 | SettleLens",
  description:
    "So berechnen Sie den Zugewinnausgleich bei Scheidung. Formel, Beispielrechnung und häufige Fehler — BGB §1363 verständlich erklärt.",
};

export default function Page() {
  return (
    <SeoLandingTemplate
      config={{
        locale: "de",
        badge: "Zugewinnausgleich berechnen",
        headline:
          "Zugewinnausgleich berechnen — Die vollständige Anleitung für 2026",
        intro:
          "Der Zugewinnausgleich ist die häufigste Vermögensregelung bei Scheidungen in Deutschland. Nach BGB §1363 wird der Vermögenszuwachs beider Parteien während der Ehe ermittelt und ausgeglichen. Diese Schritt-für-Schritt-Anleitung erklärt die Formel, zeigt ein konkretes Rechenbeispiel und hilft Ihnen, typische Fehler zu vermeiden.",
        sections: [
          {
            heading: "Die Zugewinnausgleich-Formel",
            body: "Die Grundformel ist: Ausgleichsforderung = (Zugewinn A − Zugewinn B) ÷ 2. Dabei ist Zugewinn = Endvermögen − Anfangsvermögen. Beispiel: Partei A hat €200.000 Endvermögen und €50.000 Anfangsvermögen → Zugewinn A = €150.000. Partei B: €80.000 − €10.000 = €70.000. Ausgleich: (€150.000 − €70.000) ÷ 2 = €40.000, die Partei B von Partei A erhält.",
          },
          {
            heading: "Schritt 1: Anfangsvermögen ermitteln",
            body: "Das Anfangsvermögen ist der Wert Ihres gesamten Vermögens am Tag der Eheschließung — abzüglich bestehender Schulden. Wichtig: Erbschaften und Schenkungen, die während der Ehe eingehen, werden dem Anfangsvermögen hinzugerechnet (privilegierter Erwerb). Sie erhöhen also Ihren Anfangsvermögenswert und senken den Zugewinn. Belege aus dem Ehebeginn (Kontostände, Grundbuchauszüge) sind daher unbedingt zu sichern.",
          },
          {
            heading: "Schritt 2: Endvermögen ermitteln",
            body: "Stichtag für das Endvermögen ist der Tag, an dem der Scheidungsantrag dem anderen Eheteil zugestellt wird — nicht das Trennungsdatum. Alle Vermögenswerte an diesem Stichtag werden bewertet: Immobilien, Bankguthaben, Wertpapiere, Fahrzeuge, Unternehmensbeteiligungen, Rentenanwartschaften. Schulden werden vollständig abgezogen. Ist das Endvermögen negativ, wird es auf null gesetzt.",
          },
          {
            heading: "Schritt 3: Zugewinn beider Parteien getrennt berechnen",
            body: "Zugewinn A = Endvermögen A − Anfangsvermögen A. Zugewinn B = Endvermögen B − Anfangsvermögen B. Ergibt die Rechnung einen negativen Zugewinn (Endvermögen < Anfangsvermögen), wird dieser auf null gesetzt — negativer Zugewinn mindert keine Ausgleichsforderung. Beide Parteien haben Auskunftspflichten; Gerichte können Vermögensauskünfte anordnen.",
          },
          {
            heading: "Schritt 4: Ausgleichsforderung berechnen",
            body: "Die Partei mit dem höheren Zugewinn zahlt der anderen die Hälfte der Differenz. Aus unserem Beispiel: Partei A hat €150.000 Zugewinn, Partei B €70.000. Differenz: €80.000. Ausgleich: €40.000. Diese Forderung ist eine Geldschuld — sie berechtigt nicht automatisch zu einem Anteil an einzelnen Vermögenswerten. Die Zahlung kann aus anderen Mitteln beglichen werden.",
          },
          {
            heading: "Häufige Fehler — und wie SettleLens hilft",
            body: "Die häufigsten Fehler: Vergessene Verbindlichkeiten im Endvermögen, falscher Stichtag (Trennung statt Zustellung), nicht dokumentierte Erbschaften und Schenkungen, vergessene Rentenanwartschaften. SettleLens führt Sie durch alle Vermögenskategorien strukturiert, berechnet Szenarien bei verschiedenen Anfangsvermögensannahmen und zeigt die Auswirkungen auf Ihr 10-Jahres-Nettovermögen.",
          },
        ],
        checklist: [
          "Vollständige Vermögensliste zum Eheschließungsdatum erstellen",
          "Kontoauszüge und Depotauszüge vom Beginn der Ehe sichern",
          "Immobilienwert bei Eheschließung dokumentieren (Kaufvertrag)",
          "Erbschaften und Schenkungen während der Ehe belegen",
          "Aktuellen Grundbuchauszug für alle Immobilien einholen",
          "Aktuelle Rentenauskunft der Deutschen Rentenversicherung anfordern",
          "Unternehmensanteile professionell bewerten lassen",
          "Schuldenstand beider Parteien aktuell erfassen",
          "Kryptowährungen und digitale Assets dokumentieren",
          "Steuerliche Verbindlichkeiten (offene Steuerbescheide) prüfen",
        ],
        faq: [
          {
            q: "Was passiert bei negativem Zugewinn?",
            a: "Ergibt sich ein negativer Zugewinn (das Endvermögen ist geringer als das Anfangsvermögen), wird dieser für die Berechnung auf null gesetzt. Der Ehegatte mit negativem Zugewinn zahlt nichts, erhält aber auch keine Ausgleichsleistung. Schulden aus der Ehe können jedoch separat verteilt werden.",
          },
          {
            q: "Kann ich den Zugewinnausgleich vertraglich ändern oder ausschließen?",
            a: "Ja. Durch einen notariell beurkundeten Ehevertrag können Ehegatten die Zugewinngemeinschaft modifizieren oder vollständig auf Gütertrennung umstellen. Auch im laufenden Scheidungsverfahren kann eine einvernehmliche Regelung (Scheidungsfolgenvereinbarung) den gesetzlichen Ausgleich ersetzen. SettleLens hilft Ihnen, verschiedene Vertragsszenarien finanziell zu modellieren.",
          },
          {
            q: "Gilt der Zugewinnausgleich für alle Ehepaare in Deutschland?",
            a: "Der Zugewinnausgleich gilt automatisch für alle Ehepaare, die keinen anderslautenden Ehevertrag geschlossen haben. Schätzungsweise über 90 % aller deutschen Ehen unterliegen der gesetzlichen Zugewinngemeinschaft. Ausnahme: Ehen, die im Ausland geschlossen wurden und einem anderen Güterrecht unterliegen.",
          },
        ],
        relatedLinks: [
          { title: "Zugewinnausgleich-Rechner", href: "/de/zugewinnausgleich-rechner", description: "Online-Modellierung Ihres Zugewinnausgleichs mit 10-Jahres-Projektion" },
          { title: "Was bedeutet Zugewinnausgleich?", href: "/de/was-bedeutet-zugewinnausgleich", description: "Verständliche Erklärung des Begriffs und der gesetzlichen Grundlagen" },
          { title: "Finanzplanung bei Scheidung", href: "/de/scheidung-finanzplanung", description: "Gesamtübersicht aller finanziellen Aspekte Ihrer Scheidung" },
          { title: "Szenarien vergleichen", href: "/de/scheidung-szenarien-vergleichen", description: "Verschiedene Einigungsoptionen nebeneinander analysieren" },
        ],
        ctaText: "Meinen Zugewinnausgleich modellieren",
        ctaHref: "/de/register",
        ctaSub: "Kostenlos starten — keine Kreditkarte erforderlich",
        disclaimer:
          "SettleLens bietet Finanzmodellierung zu Informationszwecken an. Kein Rechtsrat. Die tatsächliche Berechnung des Zugewinnausgleichs hängt von Ihrem individuellen Sachverhalt ab. Konsultieren Sie stets einen qualifizierten Familienrechtsanwalt.",
      }}
    />
  );
}
