import { DE_STATES } from "@/lib/seo-locations";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ bundesland: string }>;
};

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return DE_STATES.map((s) => ({ bundesland: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { bundesland } = await params;
  const state = DE_STATES.find((s) => s.slug === bundesland);
  if (!state) return {};

  return {
    title: `Scheidungsrechner ${state.name} – Zugewinnausgleich | SettleLens`,
    description: `Scheidung in ${state.name}: Wie wird der Zugewinnausgleich berechnet? Modellieren Sie Ihre finanzielle Situation kostenlos mit SettleLens.`,
    alternates: {
      canonical: `https://settlelens.com/de/scheidung-rechner/${bundesland}`,
    },
  };
}

export default async function DEStateSEOPage({ params }: Props) {
  const { bundesland } = await params;
  const state = DE_STATES.find((s) => s.slug === bundesland);
  if (!state) notFound();

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `Zugewinnausgleich bei Scheidung in ${state.name} berechnen`,
    description: `Schritt-für-Schritt-Anleitung zur Berechnung des Zugewinnausgleichs gemäß BGB §1363 bei einer Scheidung in ${state.name}.`,
    step: [
      { "@type": "HowToStep", name: "Anfangsvermögen bestimmen", text: "Erfassen Sie das Vermögen beider Ehegatten zum Zeitpunkt der Eheschließung." },
      { "@type": "HowToStep", name: "Endvermögen bestimmen", text: "Erfassen Sie das aktuelle Vermögen beider Ehegatten (Stichtag: Zustellung Scheidungsantrag)." },
      { "@type": "HowToStep", name: "Zugewinn berechnen", text: "Zugewinn = Endvermögen − Anfangsvermögen für jeden Ehegatten." },
      { "@type": "HowToStep", name: "Ausgleichsforderung ermitteln", text: "Ausgleichsforderung = (Zugewinn A − Zugewinn B) ÷ 2" },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      <div className="mx-auto max-w-3xl px-4 py-12">
        <nav className="mb-6 text-sm text-[#8B7355]">
          <Link href="/de" className="hover:text-[#C8973A]">Startseite</Link>
          {" / "}
          <span>Scheidungsrechner – {state.name}</span>
        </nav>

        <h1
          className="text-3xl font-bold text-[#1C2B3A] leading-tight sm:text-4xl"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Scheidungsrechner {state.name} – Zugewinnausgleich berechnen
        </h1>

        <div className="mt-3 inline-block rounded-full bg-[#F7F3EE] px-3 py-1 text-sm text-[#2E4D6B]">
          🇩🇪 BGB §1363 – Zugewinngemeinschaft
        </div>

        <div className="mt-8 prose prose-slate max-w-none">
          <h2>Wie funktioniert die Scheidung in {state.name}?</h2>
          <p>
            In {state.name} – wie in ganz Deutschland – gilt bei der Scheidung das <strong>Zugewinnausgleichsprinzip</strong> gemäß BGB §§ 1363 ff., sofern kein abweichender Güterstand vereinbart wurde. Der während der Ehe erzielte Vermögenszuwachs wird hälftig ausgeglichen.
          </p>
          <p>
            Das Familienrecht ist Bundesrecht – es gelten dieselben Regeln in {state.name} wie im Rest Deutschlands. Regionale Unterschiede können sich jedoch bei der Bewertung von Immobilien, Unternehmen und Renten ergeben.
          </p>

          <h2>Die Zugewinnausgleich-Formel</h2>
          <p>Die Berechnung folgt dieser Formel:</p>
          <ol>
            <li><strong>Zugewinn jedes Ehegatten</strong> = Endvermögen − Anfangsvermögen</li>
            <li><strong>Differenz</strong> = Zugewinn A − Zugewinn B</li>
            <li><strong>Ausgleichsforderung</strong> = Differenz ÷ 2</li>
          </ol>

          <h2>Was gehört zum Endvermögen?</h2>
          <ul>
            <li>Immobilien (aktueller Verkehrswert abzüglich Restschuld)</li>
            <li>Bankguthaben und Sparkonten</li>
            <li>Wertpapiere und Investmentfonds</li>
            <li>Fahrzeuge (aktueller Marktwert)</li>
            <li>Betriebsvermögen und GmbH-Anteile</li>
            <li>Betriebliche Altersvorsorge (vereinfacht)</li>
          </ul>

          <h2>Was mindert das Anfangsvermögen nicht?</h2>
          <ul>
            <li>Erbschaften und Schenkungen während der Ehe (werden dem Anfangsvermögen zugerechnet)</li>
            <li>Schmerzensgeldzahlungen für immateriellen Schaden</li>
          </ul>

          <h2>Versorgungsausgleich in {state.name}</h2>
          <p>
            Neben dem Zugewinnausgleich werden beim Familiengericht {state.name} die Rentenanwartschaften beider Ehegatten automatisch ausgeglichen (Versorgungsausgleich). Dieser wird vom Gericht von Amts wegen durchgeführt und erfordert Auskünfte der Rentenversicherungsträger.
          </p>

          <h2>So nutzen Sie SettleLens für Ihre Scheidung in {state.name}</h2>
          <ol>
            <li><strong>Anfangsvermögen eingeben</strong> – Vermögen bei Eheschließung (indexiert)</li>
            <li><strong>Aktuelles Vermögen erfassen</strong> – Immobilien, Konten, Fahrzeuge, Altersvorsorge</li>
            <li><strong>Schulden angeben</strong> – Immobilienkredit, Konsumkredite</li>
            <li><strong>Szenarien vergleichen</strong> – Immobilie behalten, verkaufen oder übertragen</li>
            <li><strong>10-Jahres-Projektion</strong> – langfristige finanzielle Auswirkungen jedes Szenarios</li>
          </ol>
        </div>

        <div className="mt-8 rounded-xl bg-[#1C2B3A] p-8 text-center text-white">
          <h2
            className="text-xl font-bold"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Ihre Scheidung in {state.name} kostenlos modellieren
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Verstehen Sie die finanziellen Folgen Ihrer Entscheidungen – bevor Sie verhandeln.
          </p>
          <Link
            href="/de/register"
            className="mt-4 inline-block rounded-lg bg-[#C8973A] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            Kostenlose Analyse starten →
          </Link>
        </div>

        <p className="mt-6 text-xs text-center text-[#8B7355]">
          SettleLens ist ein Finanzmodellierungstool und kein Rechtsberater. Wenden Sie sich an einen Fachanwalt für Familienrecht, bevor Sie Entscheidungen treffen.
        </p>
      </div>
    </>
  );
}
