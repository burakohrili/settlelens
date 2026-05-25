import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const DE_CHECKLIST_TOPICS = [
  {
    slug: "vor-anwaltsgespraech",
    title: "Checkliste: Vor dem Anwaltsgespräch bei Scheidung",
    description:
      "Was Sie zum ersten Anwaltsgespräch mitbringen müssen. Vollständige Checkliste für Ihren Scheidungsfall — Dokumente, Finanzen und Fragen, die Sie stellen sollten.",
    items: [
      {
        heading: "Persönliche Dokumente",
        checks: [
          "Heiratsurkunde (Original oder beglaubigte Kopie)",
          "Geburtsurkunden beider Ehegatten",
          "Geburtsurkunden aller gemeinsamen Kinder",
          "Personalausweis oder Reisepass",
          "Ggf. Scheidungsurteil aus früheren Ehen",
        ],
      },
      {
        heading: "Vermögens- und Einkommensnachweise",
        checks: [
          "Letzten 3 Steuerbescheide (gemeinsam und einzeln)",
          "Aktuelle Gehaltsabrechnungen (letzten 3 Monate)",
          "Kontoauszüge aller Bankkonten (letzten 6 Monate)",
          "Depotauszüge und Wertpapierübersichten",
          "Nachweise zu Miet- und Kapitaleinkünften",
        ],
      },
      {
        heading: "Immobilien und Fahrzeuge",
        checks: [
          "Aktueller Grundbuchauszug für alle Immobilien",
          "Kaufvertrag der Immobilien (für Anfangsvermögen)",
          "Aktuelle Immobilienbewertung oder Gutachten",
          "Kreditvertrag und aktueller Kontostand der Hypothek",
          "Fahrzeugscheine und aktuelle Fahrzeugwerte",
        ],
      },
      {
        heading: "Altersvorsorge und Versicherungen",
        checks: [
          "Aktuelle Rentenauskunft der Deutschen Rentenversicherung (kostenlos online abrufbar)",
          "Betriebliche Altersvorsorge-Auszüge (bAV, Pensionskasse)",
          "Private Rentenversicherung — aktueller Rückkaufswert",
          "Lebensversicherungen — Rückkaufswert und Versicherungsnehmer",
          "Kranken- und Berufsunfähigkeitsversicherung prüfen",
        ],
      },
      {
        heading: "Schulden und Verbindlichkeiten",
        checks: [
          "Vollständige Schuldenübersicht beider Parteien",
          "Hypothekenvertrag mit Restschuld und Ablösebetrag",
          "Kreditkartenabrechnungen aller Karten (gemeinsam und einzeln)",
          "Ratenkreditverträge und Restschulden",
          "Eventuell bestehende private Darlehen dokumentieren",
        ],
      },
      {
        heading: "Rechtliche Dokumente",
        checks: [
          "Ehevertrag (falls vorhanden — unbedingt mitbringen)",
          "Bestehende Unterhaltsvereinbarungen oder Gerichtsbeschlüsse",
          "Testament und Erbverträge",
          "Vollmachten, die widerrufen werden sollten",
          "Gesellschaftsverträge (bei Unternehmensbeteiligung)",
        ],
      },
    ],
  },
  {
    slug: "vermoegensdokumentation",
    title: "Checkliste: Vermögen und Schulden bei Scheidung dokumentieren",
    description:
      "Eine vollständige Vermögensdokumentation ist die Grundlage des Zugewinnausgleichs. Diese Checkliste stellt sicher, dass Sie nichts vergessen — und Ihr Anwalt alle Zahlen hat.",
    items: [
      {
        heading: "Immobilien",
        checks: [
          "Für jede Immobilie: Adresse, Kaufdatum, Kaufpreis, aktueller Marktwert",
          "Grundbuchauszug (zeigt Eigentumsverhältnisse und Belastungen)",
          "Gutachten oder Maklereinschätzung für aktuellen Wert",
          "Hypothekendarlehen: Restschuld, monatliche Rate, Zinssatz",
          "Vermietete Objekte: Mieteinnahmen der letzten 12 Monate",
        ],
      },
      {
        heading: "Bankkonten und Wertpapiere",
        checks: [
          "Alle Girokonten — Kontonummern, Bank, aktueller Saldo",
          "Sparkonten und Tagesgeldkonten mit aktuellem Stand",
          "Wertpapierdepots — aktueller Wert, Depot-Auszug",
          "Festgeldanlagen mit Fälligkeitsdatum und Betrag",
          "Ausländische Konten oder Auslandsanlagen dokumentieren",
        ],
      },
      {
        heading: "Altersvorsorge (für Versorgungsausgleich)",
        checks: [
          "Gesetzliche Rentenversicherung — Rentenauskunft beim DRV abrufen",
          "Betriebliche Altersvorsorge — alle bAV-Verträge mit Arbeitgeber klären",
          "Riester- und Rürup-Verträge — aktueller Wert und Vertragsnummer",
          "Private Lebens- und Rentenversicherungen mit Rückkaufswert",
          "Beamtenpension: Aktuelle Versorgungsauskunft beim Dienstherrn anfordern",
        ],
      },
      {
        heading: "Unternehmensanteile und Beteiligungen",
        checks: [
          "GmbH/AG-Anteile: Gesellschaftsvertrag, aktueller Anteilswert",
          "Personengesellschaften (KG, OHG): Kapitalanteile laut letzter Bilanz",
          "Freiberufliche Praxis oder Einzelunternehmen: Ertragswert bestimmen lassen",
          "Stille Beteiligungen und Private-Equity-Anteile",
          "Urheberrechte, Patente, Lizenzen mit wirtschaftlichem Wert",
        ],
      },
      {
        heading: "Bewegliches Vermögen",
        checks: [
          "Fahrzeuge: Marke, Modell, Jahr, aktueller Marktwert (z.B. Schwacke/DAT)",
          "Hochwertige Kunstgegenstände, Antiquitäten, Sammlungen",
          "Schmuck und Edelmetalle mit Wertangabe",
          "Kryptowährungen: Wallet-Adressen, aktueller Wert in EUR",
          "Wertvolle Elektronik oder Sportausrüstung dokumentieren",
        ],
      },
      {
        heading: "Schulden vollständig erfassen",
        checks: [
          "Alle Hypotheken und Grundschulden mit Restschuld",
          "Konsumentenkredite und Ratendarlehen",
          "Kreditkartenschulden aller Karten",
          "Private Darlehen (auch von Familienangehörigen)",
          "Steuerschulden und offene Steuerbescheide",
        ],
      },
    ],
  },
  {
    slug: "hausbeurteilung",
    title: "Checkliste: Immobilien bei der Scheidung bewerten und entscheiden",
    description:
      "Das Haus ist oft der größte Vermögenswert bei einer Scheidung. Diese Checkliste hilft Ihnen, den Wert zu ermitteln und die richtige Entscheidung zu treffen.",
    items: [
      {
        heading: "Immobilienwert ermitteln",
        checks: [
          "Unabhängiges Wertgutachten durch zertifizierten Sachverständigen einholen",
          "Vergleichswerte ähnlicher Objekte in der Umgebung recherchieren",
          "Maklereinschätzung (mehrere Makler befragen — kostenlos)",
          "Bodenrichtwert der Gemeinde als Orientierung nutzen",
          "Renovierungs- und Instandhaltungsrückstand wertmindernd berücksichtigen",
        ],
      },
      {
        heading: "Hypothek und Finanzierung klären",
        checks: [
          "Aktuellen Restschuldbetrag bei der Bank erfragen",
          "Vorfälligkeitsentschädigung bei vorzeitiger Ablösung berechnen lassen",
          "Kreditnehmer-Situation klären: Wer haftet nach Übertragung?",
          "Umschuldungsmöglichkeiten für den übernehmenden Ehegatten prüfen",
          "Kann der übernehmende Ehegatte die Hypothek alleine tragen?",
        ],
      },
      {
        heading: "Szenario A: Ich behalte das Haus",
        checks: [
          "Kann ich die monatliche Rate + Nebenkosten alleine stemmen?",
          "Reicht mein Einkommen für eine Refinanzierung auf meinen Namen?",
          "Ausgleichszahlung an den Partner: Woher kommt das Geld?",
          "Steuerliche Auswirkungen der Übertragung prüfen (Grunderwerbsteuer?)",
          "SettleLens: 10-Jahres-Nettovermögensprojektion für Szenario 'Ich behalte'",
        ],
      },
      {
        heading: "Szenario B: Partner behält das Haus",
        checks: [
          "Welche Ausgleichszahlung erhalte ich? (Marktwert − Restschuld) ÷ 2",
          "Wann erhalte ich die Auszahlung? Sofort oder auf Raten?",
          "Wie investiere ich den erhaltenen Betrag? (Miete, Neukauf, Anlage)",
          "Bin ich von der Hypothek vollständig entlassen?",
          "SettleLens: Vergleich 'Partner behält' vs. 'Ich behalte' über 5 Jahre",
        ],
      },
      {
        heading: "Szenario C: Gemeinsamer Verkauf",
        checks: [
          "Einigung über Verkaufszeitpunkt und Mindestpreis",
          "Maklerauswahl und Provision klären",
          "Wer bewohnt das Haus bis zum Verkauf? Nutzungsentschädigung?",
          "Steuerliche Behandlung des Verkaufsgewinns (Spekulationssteuer?)",
          "SettleLens: Verkaufserlös-Projektion und Nettovermögen nach Verkauf",
        ],
      },
    ],
  },
  {
    slug: "unterhaltsplanung",
    title: "Checkliste: Unterhalt bei Scheidung planen und absichern",
    description:
      "Unterhalt ist oft der langfristig bedeutsamste Faktor nach der Scheidung. Diese Checkliste hilft Ihnen, Ehegatten- und Kindesunterhalt zu planen und abzusichern.",
    items: [
      {
        heading: "Einkommenssituation beider Parteien klären",
        checks: [
          "Aktuelles Nettoeinkommen beider Ehegatten dokumentieren",
          "Berufsbedingte Aufwendungen für bereinigtes Einkommen ermitteln",
          "Selbstständige: Durchschnittseinkommen der letzten 3 Jahre berechnen",
          "Nebeneinkünfte (Vermietung, Kapitalerträge) vollständig erfassen",
          "Fiktives Einkommen prüfen: Könnten beide Parteien mehr verdienen?",
        ],
      },
      {
        heading: "Ehegattenunterhalt (§1361/§1569 BGB)",
        checks: [
          "Trennungsunterhalt berechnen: 3/7 der Nettoeinkommensdifferenz",
          "Ehedauer und Kinderbetreuung als Faktoren für Dauer notieren",
          "Voraussichtliche Befristung des nachehelichen Unterhalts einschätzen",
          "Eigene Erwerbsobliegenheit prüfen: Was kann ich realistisch verdienen?",
          "SettleLens: Monatlichen Cashflow mit und ohne Unterhalt modellieren",
        ],
      },
      {
        heading: "Kindesunterhalt (Düsseldorfer Tabelle 2026)",
        checks: [
          "Aktuelles Nettoeinkommen des zahlungspflichtigen Elternteils ermitteln",
          "Alter jedes Kindes und zutreffende Altersgruppe bestimmen",
          "Kindergeld-Anrechnung klären (hälftig auf Barunterhalt)",
          "Selbstbehalt prüfen: €1.450 (Erwerbstätige) oder €1.200 (Nicht-Erwerbstätige)",
          "Ausbildungsdauer der Kinder einplanen (Unterhalt bis Ausbildungsabschluss)",
        ],
      },
      {
        heading: "Unterhaltstitel und Vollstreckung",
        checks: [
          "Notarielle Unterhaltsurkunde (vollstreckbarer Titel ohne Gerichtsverfahren)",
          "Gerichtlicher Vergleich im Scheidungsverfahren als Vollstreckungsgrundlage",
          "Jugendamts-Beistandschaft für Kindesunterhalt prüfen (kostenlos)",
          "Unterhaltsvorschuss: Wenn zahlungspflichtige Person nicht zahlt",
          "Düsseldorfer Tabelle-Anpassungen alle 2 Jahre automatisch einplanen",
        ],
      },
      {
        heading: "Langfristige Unterhaltsplanung",
        checks: [
          "Gesamtkosten des Unterhalts über die voraussichtliche Laufzeit berechnen",
          "Inflationsanpassung einkalkulieren (SettleLens rechnet automatisch)",
          "Steuerwirkung des Unterhalts prüfen (Realsplitting für Zahler möglich)",
          "Karriereentwicklung beider Parteien in Szenarien einbeziehen",
          "SettleLens: 10-Jahres-Nettovermögen mit verschiedenen Unterhaltsszenarien",
        ],
      },
    ],
  },
];

type Props = { params: Promise<{ thema: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return DE_CHECKLIST_TOPICS.map((t) => ({ thema: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { thema } = await params;
  const checklist = DE_CHECKLIST_TOPICS.find((t) => t.slug === thema);
  if (!checklist) return {};
  return {
    title: `${checklist.title} | SettleLens`,
    description: checklist.description,
    alternates: {
      canonical: `https://settlelens.com/de/scheidung-checkliste/${thema}`,
    },
  };
}

export default async function GermanChecklistPage({ params }: Props) {
  const { thema } = await params;
  const checklist = DE_CHECKLIST_TOPICS.find((t) => t.slug === thema);
  if (!checklist) notFound();

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: checklist.title,
    description: checklist.description,
    step: checklist.items.map((section) => ({
      "@type": "HowToSection",
      name: section.heading,
      itemListElement: section.checks.map((item, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        text: item,
      })),
    })),
  };

  const totalItems = checklist.items.reduce((sum, s) => sum + s.checks.length, 0);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <Header />
      <main className="bg-[var(--cream)] min-h-screen">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <nav className="mb-6 text-sm text-[var(--brown)]">
            <Link href="/de/scheidung-finanzplanung" className="hover:text-[var(--gold)]">
              ← Scheidung Finanzplanung
            </Link>
          </nav>

          <h1
            className="text-3xl font-bold text-[var(--navy)] leading-tight sm:text-4xl"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            {checklist.title}
          </h1>
          <p className="mt-3 text-lg text-[var(--brown)]">{checklist.description}</p>
          <div className="mt-2 text-sm text-[var(--brown)] opacity-70">
            {totalItems} Punkte in {checklist.items.length} Kategorien
          </div>

          <div className="mt-8 space-y-8">
            {checklist.items.map((section, si) => (
              <div
                key={si}
                className="rounded-xl border border-[var(--sand)] bg-white p-6"
              >
                <h2
                  className="text-lg font-bold text-[var(--navy)] mb-4"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  {section.heading}
                </h2>
                <ul className="space-y-2">
                  {section.checks.map((item, ii) => (
                    <li key={ii} className="flex items-start gap-3">
                      <span className="mt-1 h-4 w-4 shrink-0 rounded border-2 border-[var(--gold)]" />
                      <span className="text-sm text-[var(--slate)]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Related checklists */}
          <div className="mt-10 rounded-xl border border-[var(--sand)] bg-white p-6">
            <h2
              className="text-base font-bold text-[var(--navy)] mb-4"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Weitere Checklisten
            </h2>
            <ul className="space-y-2">
              {DE_CHECKLIST_TOPICS.filter((t) => t.slug !== thema).map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/de/scheidung-checkliste/${t.slug}`}
                    className="text-sm text-[var(--slate)] hover:text-[var(--gold)] underline underline-offset-2"
                  >
                    {t.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="mt-10 rounded-xl bg-[var(--navy)] p-8 text-center text-white">
            <h2
              className="text-xl font-bold mb-3"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Jetzt finanziell vorbereiten
            </h2>
            <p className="text-sm text-[var(--sand)] mb-6 opacity-80">
              Erfassen Sie Ihr Vermögen, modellieren Sie Szenarien und erhalten Sie eine
              10-Jahres-Projektion — kostenlos starten.
            </p>
            <Link
              href="/de/register"
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--gold)] px-6 py-3 text-sm font-bold text-[var(--navy)] hover:opacity-90 transition-opacity"
            >
              Kostenlos starten →
            </Link>
          </div>

          {/* Disclaimer */}
          <p className="mt-8 text-xs text-[var(--brown)] text-center leading-relaxed opacity-60">
            SettleLens bietet Finanzmodellierung zu Informationszwecken an. Kein Rechtsrat.
            Konsultieren Sie stets einen qualifizierten Familienrechtsanwalt.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
