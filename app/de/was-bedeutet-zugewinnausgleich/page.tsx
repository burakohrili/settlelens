import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "Was bedeutet Zugewinnausgleich? Einfach erklärt | SettleLens",
  description:
    "Zugewinnausgleich einfach erklärt: Was es ist, für wen es gilt, wann es berechnet wird — und wie Sie sich mit SettleLens finanziell vorbereiten.",
};

export default function Page() {
  return (
    <SeoLandingTemplate
      config={{
        locale: "de",
        badge: "Grundlagen Scheidungsrecht",
        headline:
          "Was bedeutet Zugewinnausgleich? — Einfach und verständlich erklärt",
        intro:
          "Wenn deutsche Ehepaare sich scheiden lassen, stellt sich fast immer die Frage: Wie wird das gemeinsame Vermögen aufgeteilt? Die Antwort lautet in über 90% aller Fälle: Zugewinnausgleich. Aber was bedeutet das genau — und wie betrifft es Sie persönlich? Diese Seite erklärt den Zugewinnausgleich ohne Juristendeutsch.",
        sections: [
          {
            heading: "Zugewinngemeinschaft: Der gesetzliche Standard in Deutschland",
            body: "Ohne Ehevertrag gilt in Deutschland automatisch die Zugewinngemeinschaft nach BGB §1363. Das bedeutet nicht, dass das Vermögen beider Parteien gemeinsam wird — jeder behält sein eigenes Vermögen. Was sich ändert: Beim Ende der Ehe (Scheidung oder Tod) wird ausgeglichen, wer während der Ehe mehr Vermögen hinzugewonnen hat. Über 90% aller deutschen Ehen unterliegen diesem Regime, weil die meisten Paare keinen Ehevertrag schließen.",
          },
          {
            heading: "Was ist der 'Zugewinn'?",
            body: "Der Zugewinn ist der Vermögenszuwachs während der Ehe — also die Differenz zwischen dem Vermögen bei Eheschließung (Anfangsvermögen) und dem Vermögen zum Zeitpunkt der Scheidung (Endvermögen). Einfaches Beispiel: Sie hatten bei der Hochzeit €30.000 auf dem Konto. Bei Einreichung des Scheidungsantrags besitzen Sie €200.000. Ihr Zugewinn beträgt €170.000. Erbschaften und Schenkungen während der Ehe zählen nicht zum Zugewinn — sie werden dem Anfangsvermögen hinzugerechnet.",
          },
          {
            heading: "Wann wird ausgeglichen — und wann nicht?",
            body: "Der Zugewinnausgleich wird fällig bei: Einreichung eines Scheidungsantrags, Tod eines Ehegatten (über erhöhtes Erbrecht), oder einvernehmlicher Aufhebung der Zugewinngemeinschaft. Wichtig: Trennung allein löst keinen Ausgleich aus. Stichtag für das Endvermögen ist die gerichtliche Zustellung des Scheidungsantrags — nicht der Tag des Auszugs. Deshalb ist der Zeitpunkt der Scheidungseinreichung finanziell bedeutsam.",
          },
          {
            heading: "Alternativen: Gütertrennung und Gütergemeinschaft",
            body: "Durch einen notariellen Ehevertrag können Paare andere Güterstände vereinbaren. Gütertrennung: Kein Ausgleich beim Ende der Ehe — jeder behält, was er hat. Sinnvoll für Unternehmer und Selbstständige. Gütergemeinschaft: Das gesamte Vermögen wird gemeinsames Eigentum — sehr selten gewählt. Eine modifizierte Zugewinngemeinschaft kann bestimmte Vermögensarten ausschließen. SettleLens modelliert den finanziellen Unterschied zwischen Zugewinnausgleich und Gütertrennung für Ihre Situation.",
          },
          {
            heading: "Was SettleLens für Sie berechnet",
            body: "SettleLens modelliert den Zugewinnausgleich auf Basis der Informationen, die Sie eingeben: Anfangsvermögen, aktuelles Endvermögen, Erbschaften, Schulden, Immobilienwerte. Sie sehen den voraussichtlichen Ausgleichsbetrag, verschiedene Szenarien bei unterschiedlichen Anfangsvermögensannahmen und — wichtiger — die Auswirkungen auf Ihre 10-Jahres-Finanzlage nach der Scheidung. Das ist keine rechtlich verbindliche Berechnung, aber eine solide Grundlage für das Gespräch mit Ihrem Anwalt.",
          },
        ],
        faq: [
          {
            q: "Gilt der Zugewinnausgleich automatisch, ohne dass ich etwas tun muss?",
            a: "Ja. Die Zugewinngemeinschaft entsteht automatisch mit der Eheschließung, sofern kein Ehevertrag vorliegt. Der Zugewinnausgleich muss aber aktiv eingefordert werden — er entsteht nicht von alleine. Im Scheidungsverfahren kann er als Scheidungsfolgesache verhandelt oder eigenständig geltend gemacht werden.",
          },
          {
            q: "Kann ich den Zugewinnausgleich ablehnen oder reduzieren?",
            a: "Im Rahmen einer einvernehmlichen Scheidung können Sie mit Ihrem Ehepartner individuelle Regelungen treffen, die vom gesetzlichen Ausgleich abweichen. Diese müssen notariell beurkundet werden. Wenn der Anspruch unbillig erscheint (z.B. weil Vermögen kurz vor Scheidungsantrag verschoben wurde), kann auch eine Anpassung durch das Gericht beantragt werden.",
          },
        ],
        relatedLinks: [
          { title: "Zugewinnausgleich berechnen", href: "/de/zugewinnausgleich-berechnen", description: "Schritt-für-Schritt-Anleitung mit Formel und Beispielrechnung" },
          { title: "Zugewinnausgleich-Rechner", href: "/de/zugewinnausgleich-rechner", description: "Ihr Zugewinnausgleich als 10-Jahres-Projektion modelliert" },
          { title: "Finanzplanung bei Scheidung", href: "/de/scheidung-finanzplanung", description: "Alle finanziellen Aspekte Ihrer Scheidung im Überblick" },
          { title: "Scheidungsvereinbarung simulieren", href: "/de/scheidungsvereinbarung-simulator", description: "Verschiedene Einigungsszenarien finanziell vergleichen" },
        ],
        ctaText: "Meinen Zugewinnausgleich kostenlos modellieren",
        ctaHref: "/de/register",
        ctaSub: "Kostenlos starten — keine Kreditkarte erforderlich",
        disclaimer:
          "SettleLens bietet Finanzmodellierung zu Informationszwecken an. Kein Rechtsrat. Konsultieren Sie stets einen qualifizierten Familienrechtsanwalt für Ihre individuelle Situation.",
      }}
    />
  );
}
