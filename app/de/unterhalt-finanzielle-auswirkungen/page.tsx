import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "Unterhalt: Finanzielle Auswirkungen modellieren | SettleLens",
  description: "Die langfristigen finanziellen Auswirkungen von Ehegattenunterhalt und Kindesunterhalt bei Scheidung modellieren. 10-Jahres-Projektion inklusive Inflation.",
};

export default function Page() {
  return (
    <SeoLandingTemplate config={{
      locale: "de",
      badge: "Unterhaltsanalyse",
      headline: "Finanzielle Auswirkungen von Unterhalt bei Scheidung Modellieren",
      intro: "Unterhaltszahlungen gehören zu den finanziell bedeutendsten und verhandelbarsten Elementen einer Scheidungsvereinbarung. SettleLens modelliert, wie verschiedene Unterhaltsbeträge und -dauern Ihr 10-Jahres-Nettovermögen und Ihren monatlichen Cashflow beeinflussen.",
      sections: [
        { heading: "Ehegattenunterhalt (§1569 BGB)", body: "Nachehelicher Unterhalt kann befristet oder unbefristet sein, abhängig von Ehedauer, Einkommen und Bedürftigkeit. SettleLens integriert verschiedene Unterhaltsszenarien in Ihre monatliche Liquiditätsrechnung und zeigt die 10-Jahres-Gesamtbelastung oder -entlastung." },
        { heading: "Kindesunterhalt (Düsseldorfer Tabelle)", body: "Der Kindesunterhalt richtet sich nach der Düsseldorfer Tabelle und dem Einkommen des unterhaltspflichtigen Elternteils sowie dem Alter des Kindes. SettleLens berücksichtigt die Tabellenbeträge und projiziert die jährliche Unterhaltsbelastung bis zur Volljährigkeit des Kindes." },
        { heading: "Inflation und reale Kaufkraft", body: "Festbetrag-Unterhaltszahlungen verlieren bei Inflation real an Wert. SettleLens wendet eine konfigurierbare Inflationsrate auf Ihre Projektion an, damit Sie den realen Wert der Zahlungen über 10 Jahre verstehen." },
        { heading: "Angebot vergleichen", body: "Wenn Ihr Ehepartner einen bestimmten Unterhaltsvorschlag gemacht hat, geben Sie ihn in SettleLens ein und vergleichen Sie ihn mit Ihrer eigenen Position. Die 10-Jahres-Differenz zeigt Ihnen, was finanziell auf dem Spiel steht." },
      ],
      faq: [
        { q: "Kann SettleLens den genauen Unterhaltsbetrag berechnen?", a: "Nein. Der Unterhaltsbetrag wird vom Gericht festgesetzt und hängt von vielen individuellen Faktoren ab. SettleLens modelliert die finanziellen Auswirkungen verschiedener Beträge — als Referenzrahmen für Ihre Verhandlung." },
        { q: "Wie lange wird Unterhalt in der Regel gezahlt?", a: "Das variiert stark je nach Einzelfall. Ehegattenunterhalt kann befristet oder unbefristet sein; Kindesunterhalt läuft bis zur Volljährigkeit (bzw. Abschluss der Erstausbildung). SettleLens rechnet diese Dauer in die Gesamtprojektion ein." },
      ],
      ctaText: "Meine Unterhaltsszenarien modellieren",
      ctaHref: "/de/register",
      ctaSub: "Kostenlos starten — keine Kreditkarte erforderlich",
      disclaimer: "SettleLens bietet Finanzmodellierung zu Informationszwecken an. Keine Rechtsberatung. Unterhaltsbeträge werden vom Gericht festgesetzt. Konsultieren Sie stets einen qualifizierten Familienrechtsanwalt.",
    }} />
  );
}
