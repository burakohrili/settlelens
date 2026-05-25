import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "Ehegattenunterhalt berechnen — Nachehelicher Unterhalt 2026 | SettleLens",
  description:
    "Trennungsunterhalt und nachehelicher Unterhalt berechnen. Die 3/7-Methode erklärt, Dauer, Befristung und finanzielle Auswirkungen über 10 Jahre.",
};

export default function Page() {
  return (
    <SeoLandingTemplate
      config={{
        locale: "de",
        badge: "Ehegattenunterhalt",
        headline:
          "Ehegattenunterhalt berechnen — Trennungsunterhalt & Nachehelicher Unterhalt 2026",
        intro:
          "Ehegattenunterhalt umfasst zwei Phasen: Trennungsunterhalt während der Trennungszeit (§1361 BGB) und nachehelicher Unterhalt nach der Scheidung (§1569 BGB). Beide wirken sich massiv auf Ihre monatliche Finanzlage aus — und über 10 Jahre kann der Unterschied zwischen verschiedenen Unterhaltsszenarien mehr als €50.000 betragen. SettleLens modelliert beide Phasen für Ihre individuelle Situation.",
        sections: [
          {
            heading: "Trennungsunterhalt vs. nachehelicher Unterhalt",
            body: "Trennungsunterhalt (§1361 BGB) gilt ab dem Moment der Trennung bis zur rechtskräftigen Scheidung. Er dient der Aufrechterhaltung des ehelichen Lebensstandards und ist in der Regel höher als nachehelicher Unterhalt. Nach der Scheidung greift der nacheheliche Unterhalt (§1569 ff. BGB), der an strengere Voraussetzungen geknüpft ist — insbesondere die eigene Erwerbsobliegenheit des Unterhaltsberechtigten.",
          },
          {
            heading: "Wie wird der Ehegattenunterhalt berechnet? Die 3/7-Methode",
            body: "Die gängige Berechnungsmethode: Der Unterhaltsberechtigte erhält 3/7 der Differenz der bereinigten Nettoeinkommen. Beispiel: Einkommen A = €3.500 netto, Einkommen B = €1.400 netto. Differenz: €2.100. Unterhalt: €2.100 × 3/7 = €900/Monat. Das bereinigte Einkommen berücksichtigt Abzüge wie berufsbedingte Aufwendungen, Krankenversicherung und Altersvorsorge. Achtung: Gerichte wenden unterschiedliche Methoden an — SettleLens modelliert Szenarien auf Basis dieser Standardmethode.",
          },
          {
            heading: "Dauer und Befristung des nachehelichen Unterhalts",
            body: "Seit der Reform 2009 ist Befristung die Regel, nicht die Ausnahme. Der Grundsatz: Jeder Ehegatte muss nach der Scheidung für sich selbst sorgen. Unbefristeter Unterhalt kommt nur bei sehr langer Ehe (15+ Jahre) oder wenn ein Kind unter 3 Jahren zu betreuen ist (§1570 BGB) in Betracht. Bei kurzen Ehen unter 5 Jahren wird Unterhalt oft vollständig versagt. SettleLens modelliert befristete Szenarien (z.B. 3, 5, 8 Jahre) und zeigt die Langzeitwirkung.",
          },
          {
            heading: "Finanzielle Gesamtwirkung: Was €600/Monat bedeutet",
            body: "€600 Unterhalt monatlich klingt überschaubar — über 5 Jahre sind das €36.000, über 8 Jahre €57.600. Für den Zahlungspflichtigen reduziert sich das monatliche Cashflow-Budget erheblich; für den Empfänger stellt es eine planbare Einkommensergänzung dar. SettleLens rechnet beide Seiten: Wie wirkt sich der Unterhalt auf Ihr 1-, 3-, 5- und 10-Jahres-Nettovermögen aus? Wo liegt Ihr monatlicher Cashflow-Break-even?",
          },
          {
            heading: "Häufige Irrtümer beim Ehegattenunterhalt",
            body: "Irrtum 1: 'Der Mann zahlt immer.' — Unterhalt richtet sich nach den Einkommensverhältnissen, nicht nach dem Geschlecht. Irrtum 2: 'Unterhalt gilt ewig.' — Befristung ist heute die Norm. Irrtum 3: 'Unterhalt ist unabhängig von meiner Altersvorsorge.' — Eigene Altersvorsorge kann als Abzugsposten anerkannt werden. Irrtum 4: 'Einkommensveränderungen ändern nichts.' — Wesentliche Änderungen berechtigen zur Abänderungsklage.",
          },
        ],
        faq: [
          {
            q: "Kann Unterhalt rückwirkend verlangt werden?",
            a: "Ja, Trennungsunterhalt kann ab dem Zeitpunkt der Trennung rückwirkend verlangt werden — allerdings nur, wenn er rechtzeitig angemahnt oder gerichtlich geltend gemacht wurde. Nachehelicher Unterhalt kann ab Rechtskraft der Scheidung, in bestimmten Fällen auch früher, verlangt werden. Verjährungsfristen gelten.",
          },
          {
            q: "Was passiert, wenn der Unterhaltspflichtige sein Einkommen verschleiert?",
            a: "Gerichte können Auskunftspflichten anordnen (§1580 BGB). Wer Einkünfte verschleiert, riskiert strafrechtliche Konsequenzen. Bei begründetem Verdacht können Kontoauskünfte, Steuerbescheide und Einkommensnachweise angefordert werden. SettleLens hilft Ihnen, Ihre eigene Seite transparent darzustellen — für Ihre Unterlagen und Ihren Anwalt.",
          },
          {
            q: "Verringert sich der Unterhalt, wenn mein Ex-Partner erneut heiratet?",
            a: "Ja. Bei Wiederheirat des Unterhaltsberechtigten erlischt der nacheheliche Unterhalt vollständig (§1586 BGB). Lebt der Berechtigte in einer verfestigten nichtehelichen Lebensgemeinschaft, kann eine Herabsetzung oder Wegfall möglich sein. Umgekehrt beeinflusst eine Wiederheirat des Zahlungspflichtigen den Unterhalt nicht automatisch.",
          },
        ],
        relatedLinks: [
          { title: "Finanzielle Auswirkungen modellieren", href: "/de/unterhalt-finanzielle-auswirkungen", description: "10-Jahres-Projektion für verschiedene Unterhaltsszenarien" },
          { title: "Kindesunterhalt bei Scheidung", href: "/de/kindesunterhalt-scheidung", description: "Düsseldorfer Tabelle 2026 und Selbstbehalt erklärt" },
          { title: "Scheidungsvereinbarung simulieren", href: "/de/scheidungsvereinbarung-simulator", description: "Gesamtpaket modellieren: Unterhalt + Vermögen + Haus" },
          { title: "Szenarien vergleichen", href: "/de/scheidung-szenarien-vergleichen", description: "Ihr Vorschlag vs. Angebot des Partners — Zahlen sprechen lassen" },
        ],
        ctaText: "Meine Unterhaltsszenarien modellieren",
        ctaHref: "/de/register",
        ctaSub: "Kostenlos starten — keine Kreditkarte erforderlich",
        disclaimer:
          "SettleLens bietet Finanzmodellierung zu Informationszwecken an. Unterhaltsbeträge werden von Gerichten individuell festgesetzt. Diese Berechnung basiert auf der 3/7-Standardmethode und kann von Ihrer tatsächlichen Situation abweichen. Konsultieren Sie stets einen qualifizierten Familienrechtsanwalt.",
      }}
    />
  );
}
