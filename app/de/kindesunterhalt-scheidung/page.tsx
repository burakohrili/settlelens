import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "Kindesunterhalt bei Scheidung — Düsseldorfer Tabelle 2026 | SettleLens",
  description:
    "Kindesunterhalt nach Scheidung berechnen. Düsseldorfer Tabelle 2026, Einkommensstufen, Altersgruppen und finanzielle Modellierung für Ihr Familienbudget.",
};

export default function Page() {
  return (
    <SeoLandingTemplate
      config={{
        locale: "de",
        badge: "Kindesunterhalt 2026",
        headline:
          "Kindesunterhalt bei Scheidung — Düsseldorfer Tabelle 2026 und was Sie zahlen",
        intro:
          "Kindesunterhalt ist in vielen Scheidungsfällen die größte laufende finanzielle Verpflichtung — und gleichzeitig der Posten, der am häufigsten falsch eingeschätzt wird. Die Düsseldorfer Tabelle 2026 legt die Beträge nach Einkommen und Kindesalter fest. €700 Unterhalt pro Kind monatlich ergibt über 12 Jahre €100.800 — ein Betrag, der Ihre gesamte Finanzplanung prägt. SettleLens modelliert den Kindesunterhalt als Teil Ihrer 10-Jahres-Projektion.",
        sections: [
          {
            heading: "Wer zahlt Kindesunterhalt und warum?",
            body: "Der Elternteil, bei dem das Kind nicht hauptsächlich lebt (nichtbetreuender Elternteil), schuldet Barunterhalt nach §1601 BGB. Der betreuende Elternteil erfüllt seine Unterhaltspflicht durch Naturalunterhalt (Wohnen, Verpflegung, Betreuung). Bei Wechselmodell (gleichwertige Betreuung beider Eltern) gelten besondere Berechnungsregeln. Unterhaltsansprüche bestehen bis zum Abschluss einer angemessenen Berufsausbildung.",
          },
          {
            heading: "Düsseldorfer Tabelle 2026 — Die wichtigsten Beträge",
            body: "Die Tabelle staffelt Beträge nach Nettoeinkommen des Zahlungspflichtigen (Einkommensstufen) und Alter des Kindes. Einkommensstufe 1 (bis €1.900 netto): 0–5 Jahre €480, 6–11 Jahre €551, 12–17 Jahre €645, ab 18 Jahren €693. Einkommensstufe 4 (€3.200–€3.800 netto): 0–5 Jahre €631, 6–11 Jahre €725, 12–17 Jahre €849, ab 18 Jahren €912. Einkommensstufe 7 (€5.100–€5.700 netto): 0–5 Jahre €805, 6–11 Jahre €925, 12–17 Jahre €1.083, ab 18 Jahren €1.164. Alle Beträge sind Mindestbeträge und können bei höherem Bedarf abweichen.",
          },
          {
            heading: "Selbstbehalt — Wann kann ich nicht den vollen Betrag zahlen?",
            body: "Der Selbstbehalt schützt den Unterhaltspflichtigen vor Überforderung. Gegenüber minderjährigen Kindern gilt für Erwerbstätige ein Selbstbehalt von €1.450/Monat (2026), für Nicht-Erwerbstätige €1.200/Monat. Unterschreitet das bereinigte Einkommen nach Abzug der Unterhaltsbeträge den Selbstbehalt, liegt ein Mangelfall vor — die Beträge werden anteilig gekürzt. SettleLens erkennt Mangelfallsituationen und modelliert die Aufteilung.",
          },
          {
            heading: "Kindesunterhalt in Ihrer 10-Jahres-Finanzplanung",
            body: "Die zeitliche Dimension ist entscheidend: €700 monatlich × 10 Jahre = €84.000. Für ein Kind, das heute 5 Jahre ist, läuft der Unterhalt bis mindestens 18 — also 13 Jahre. Das sind über €109.000 bei gleichbleibendem Betrag. Dazu kommen potenzielle Erhöhungen, wenn das Kind die nächste Altersgruppe erreicht. SettleLens berechnet den monatlichen Cashflow-Impact des Kindesunterhalts und zeigt Ihre Nettovermögensentwicklung nach 1, 3, 5 und 10 Jahren.",
          },
          {
            heading: "Volljährige Kinder in Ausbildung",
            body: "Mit 18 Jahren wird das Kind selbst unterhaltsberechtigt — beide Elternteile haften anteilig. Bei einer Berufsausbildung oder einem Erststudium besteht Anspruch auf Unterhalt bis zum Abschluss. Der Mindestunterhalt für volljährige Kinder im Haushalt eines Elternteils beträgt €693 (Einkommensstufe 1, 2026). Kinder im eigenen Haushalt erhalten höhere Sätze. Planen Sie also über das 18. Lebensjahr hinaus.",
          },
        ],
        checklist: [
          "Aktuelles Nettoeinkommen beider Elternteile ermitteln",
          "Berufsbedingte Aufwendungen für bereinigte Einkommensberechnung dokumentieren",
          "Alter und Anzahl aller unterhaltspflichtigen Kinder erfassen",
          "Bestehende Unterhaltsverpflichtungen gegenüber anderen Personen prüfen",
          "Wohnkosten beider Elternteile für Selbstbehaltberechnung dokumentieren",
          "Kindergeld-Verrechnung klären (wird ab Düsseldorfer Tabelle 2024 hälftig angerechnet)",
          "Ausbildungsweg der Kinder einbeziehen (wann endet Unterhaltspflicht?)",
          "Rentenanwartschaften — reduziert Unterhaltspflicht nur marginal, aber prüfen",
        ],
        faq: [
          {
            q: "Kann der Kindesunterhalt nachträglich angepasst werden?",
            a: "Ja. Bei einer wesentlichen Änderung der Einkommensverhältnisse (Faustregel: >10% Änderung) kann eine Anpassung verlangt werden — nach oben wie nach unten. Auch beim Wechsel in eine höhere Altersgruppe des Kindes steigt der Tabellenunterhalt automatisch. Eine neue Abänderungsvereinbarung oder ein Abänderungsurteil ist jeweils erforderlich.",
          },
          {
            q: "Was passiert bei Teilzeitarbeit des Unterhaltspflichtigen?",
            a: "Gerichte prüfen, ob Teilzeit freiwillig oder notwendig ist. Wer ohne triftigen Grund auf Vollzeiteinkommen verzichtet, kann auf der Basis eines fiktiven Vollzeiteinkommens zur Zahlung verpflichtet werden — die sogenannte Erwerbsobliegenheit. SettleLens modelliert beide Szenarien: tatsächliches vs. fiktives Einkommen.",
          },
          {
            q: "Muss ich Kindesunterhalt zahlen, wenn ich sehr wenig verdiene?",
            a: "Der Selbstbehalt schützt Sie: Erst wenn Ihr bereinigtes Einkommen den Selbstbehalt von €1.450/Monat (Erwerbstätige, 2026) übersteigt, können Unterhaltszahlungen gefordert werden. Im Mangelfall werden die Zahlungen anteilig zwischen allen Unterhaltsgläubigern aufgeteilt. Minderjährige Kinder haben Rang 1 — vor allen anderen Unterhaltsverpflichtungen.",
          },
        ],
        relatedLinks: [
          { title: "Ehegattenunterhalt berechnen", href: "/de/ehegattenunterhalt-berechnen", description: "Trennungsunterhalt und nachehelicher Unterhalt — Methoden und Dauer" },
          { title: "Finanzielle Auswirkungen modellieren", href: "/de/unterhalt-finanzielle-auswirkungen", description: "10-Jahres-Cashflow-Modell mit Unterhalt und Inflation" },
          { title: "Finanzplanung bei Scheidung", href: "/de/scheidung-finanzplanung", description: "Gesamtüberblick: Zugewinn, Unterhalt, Haus, Rente" },
          { title: "Scheidung Checkliste", href: "/de/scheidung-checkliste/unterhaltsplanung", description: "Vollständige Checkliste für die Unterhaltsplanung" },
        ],
        ctaText: "Meinen Kindesunterhalt modellieren",
        ctaHref: "/de/register",
        ctaSub: "Kostenlos starten — keine Kreditkarte erforderlich",
        disclaimer:
          "SettleLens bietet Finanzmodellierung zu Informationszwecken an. Die angezeigten Werte der Düsseldorfer Tabelle 2026 sind Richtwerte; Gerichte können abweichen. Tatsächliche Unterhaltsbeträge hängen von Ihrem individuellen Sachverhalt ab. Konsultieren Sie stets einen qualifizierten Familienrechtsanwalt.",
      }}
    />
  );
}
