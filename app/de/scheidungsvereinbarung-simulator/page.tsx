import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "Scheidungsvereinbarung Simulator | SettleLens",
  description: "Simulieren Sie verschiedene Scheidungsvereinbarungen und sehen Sie das finanzielle Ergebnis. Vergleichen Sie Ihren Vorschlag mit dem Angebot Ihres Partners.",
};

export default function Page() {
  return (
    <SeoLandingTemplate config={{
      locale: "de",
      badge: "Vereinbarungssimulator",
      headline: "Simulieren Sie jede Scheidungsvereinbarung — Und sehen Sie das finanzielle Ergebnis",
      intro: "Was passiert finanziell, wenn Sie dieses Angebot annehmen? Was wenn Sie gegenhalten? SettleLens lässt Sie beliebige Scheidungsszenarien aufbauen und zeigt das 10-Jahres-Finanzergebnis für jeden Ansatz.",
      sections: [
        { heading: "Scheidungsszenario in Minuten aufbauen", body: "Geben Sie Vermögen, Schulden, Einkommen und die geplante Aufteilung ein: Wer behält die Immobilie, wie werden Rentenansprüche geteilt, wie hoch ist der Unterhalt? SettleLens berechnet Ihr Nettovermögen jetzt sowie in Jahr 1, 3, 5 und 10." },
        { heading: "Angebot des Partners analysieren", body: "Wenn Sie ein Angebot von Ihrem Ehepartner oder dessen Anwalt erhalten, geben Sie es als separates Szenario in SettleLens ein. Das System vergleicht es mit Ihrer Ausgangslage und zeigt die 10-Jahres-Differenz im Nettovermögen und Cashflow." },
        { heading: "'Was-wäre-wenn' Varianten testen", body: "Was wenn Sie auf einen höheren Unterhalt bestehen? Was wenn Sie die Immobilie aufgeben, um das Hypothekenrisiko zu vermeiden? SettleLens macht es einfach, Varianten zu testen und das beste finanzielle Ergebnis zu identifizieren." },
        { heading: "Anwalt einbinden", body: "Die Lawyer Edition exportiert Ihren Szenarienvergleich als PDF und Excel — damit Ihr Anwalt die Zahlen direkt in der Besprechung nutzen kann." },
      ],
      faq: [
        { q: "Wie genau ist der Simulator?", a: "Der Simulator basiert auf Ihren Eingaben und wendet das deutsche Zugewinnausgleichsrecht (BGB §1363) an. Es ist eine Finanzschätzung, keine Rechtsbeurteilung — stets mit Zuverlässigkeitsstufe gekennzeichnet." },
        { q: "Kann ich nachträglich Änderungen vornehmen?", a: "Ja. Alle Szenarien sind jederzeit editierbar. Ändern Sie eine Variable — Hausaufteilung, Unterhalt, Rentenaufteilung — und die Projektion aktualisiert sich sofort." },
      ],
      ctaText: "Meine Scheidungsvereinbarung simulieren",
      ctaHref: "/de/register",
      ctaSub: "Kostenlos starten — keine Kreditkarte erforderlich",
      disclaimer: "SettleLens bietet Finanzmodellierung zu Informationszwecken an. Keine Rechtsberatung. Konsultieren Sie immer einen qualifizierten Familienrechtsanwalt.",
    }} />
  );
}
