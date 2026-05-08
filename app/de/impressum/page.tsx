import { LegalPageLayout } from "@/components/layout/LegalPageLayout";

export default function ImpressumPage() {
  return (
    <LegalPageLayout title="Impressum">
      <h2>Angaben gemäß § 5 TMG</h2>
      <p>
        SettleLens<br />
        E-Mail: <a href="mailto:hello@settlelens.com">hello@settlelens.com</a>
      </p>

      <h2>Verantwortlicher</h2>
      <p>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:<br />
      SettleLens — hello@settlelens.com</p>

      <h2>Haftungsausschluss</h2>
      <p>
        Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte übernehmen wir jedoch keine Gewähr. SettleLens bietet keine Rechtsberatung an. Alle Inhalte dienen ausschließlich der allgemeinen Information und Finanzmodellierung.
      </p>

      <h2>Datenschutz</h2>
      <p>
        Informationen zur Datenverarbeitung finden Sie in unserer <a href="/de/privacy">Datenschutzerklärung</a>.
      </p>
    </LegalPageLayout>
  );
}
