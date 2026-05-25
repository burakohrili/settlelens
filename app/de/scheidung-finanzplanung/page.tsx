import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "Scheidung Finanzplanung | SettleLens",
  description: "Finanzplanung bei Scheidung: Modellieren Sie Ihre Vermögensaufteilung, Unterhaltszahlungen und 10-Jahres-Nettovermögensprognose nach BGB §1363.",
};

export default function Page() {
  return (
    <SeoLandingTemplate config={{
      locale: "de",
      badge: "Finanzplanung Scheidung",
      headline: "Finanzplanung bei Scheidung — Bevor Sie irgendetwas unterschreiben",
      intro: "Eine Scheidung verändert Ihre Finanzlage dauerhaft. Alleineinkommen, neue Wohnkosten, Unterhaltsleistungen und geteilte Rentenansprüche beeinflussen Ihre langfristige finanzielle Position. SettleLens hilft Ihnen, diese Veränderungen zu modellieren, bevor Entscheidungen getroffen werden.",
      sections: [
        { heading: "Zugewinngemeinschaft: Was wird geteilt?", body: "In Deutschland gilt die Zugewinngemeinschaft (BGB §1363). Bei Scheidung wird der während der Ehe erzielte Vermögenszuwachs beider Ehegatten ausgeglichen — der Zugewinnausgleich. SettleLens berechnet den Zugewinn beider Parteien und modelliert mögliche Ausgleichsbeträge." },
        { heading: "Unterhalt: Ehegattenunterhalt und Kindesunterhalt", body: "Trennungsunterhalt, nachehelicher Unterhalt und Kindesunterhalt können die monatliche Liquidität erheblich belasten oder entlasten. SettleLens integriert alle Unterhaltsleistungen in Ihre Monatskassenrechnung und zeigt die 10-Jahres-Auswirkungen." },
        { heading: "Immobilienentscheidung: Behalten oder Verkaufen?", body: "Die Immobilie ist oft der größte Vermögenswert in einer Ehe. SettleLens vergleicht drei Szenarien — Immobilie behalten, an den Partner übertragen oder gemeinsam verkaufen — und zeigt das jeweilige 10-Jahres-Nettovermögen." },
        { heading: "Rentenansprüche (Versorgungsausgleich)", body: "Beim Versorgungsausgleich werden während der Ehe erworbene Rentenansprüche hälftig aufgeteilt. SettleLens modelliert, wie verschiedene Versorgungsausgleich-Szenarien Ihre langfristige Rentenposition beeinflussen." },
      ],
      faq: [
        { q: "Gilt die Zugewinngemeinschaft automatisch?", a: "Ja, sofern kein Ehevertrag mit anderem Güterstand (z.B. Gütertrennung) geschlossen wurde. SettleLens wendet BGB §1363 als Standard an." },
        { q: "Wie wird der Zugewinn berechnet?", a: "Der Zugewinn ist die Differenz zwischen Anfangsvermögen (Beginn der Ehe) und Endvermögen (Zeitpunkt der Zustellung des Scheidungsantrags). SettleLens unterstützt Sie dabei, Anfangs- und Endvermögen beider Parteien zu strukturieren." },
      ],
      relatedLinks: [
        { title: "Zugewinnausgleich berechnen", href: "/de/zugewinnausgleich-berechnen", description: "Schritt-für-Schritt-Anleitung: Formel, Beispiel, häufige Fehler" },
        { title: "Ehegattenunterhalt berechnen", href: "/de/ehegattenunterhalt-berechnen", description: "Trennungsunterhalt und nachehelicher Unterhalt — 3/7-Methode erklärt" },
        { title: "Kindesunterhalt bei Scheidung", href: "/de/kindesunterhalt-scheidung", description: "Düsseldorfer Tabelle 2026 und Selbstbehalt im Überblick" },
        { title: "Scheidungsvereinbarung simulieren", href: "/de/scheidungsvereinbarung-simulator", description: "Gesamtpaket modellieren: Vermögen + Unterhalt + Haus" },
      ],
      ctaText: "Meine Scheidungsfinanzen planen",
      ctaHref: "/de/register",
      ctaSub: "Kostenlos starten — keine Kreditkarte erforderlich",
      disclaimer: "SettleLens bietet Finanzmodellierung zu Informationszwecken an. Keine Rechtsberatung. Konsultieren Sie stets einen qualifizierten Familienrechtsanwalt.",
    }} />
  );
}
