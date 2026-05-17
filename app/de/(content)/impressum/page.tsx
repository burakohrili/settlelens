import { LegalPageLayout } from "@/components/layout/LegalPageLayout";

export const metadata = {
  title: "Impressum — SettleLens",
  robots: { index: false },
};

export default function ImpressumPage() {
  return (
    <LegalPageLayout title="Impressum">
      <h2>Angaben gemäß § 5 TMG</h2>
      <p>
        <strong>Neosis Social</strong><br />
        Gaziosmanpaşa Mahallesi, 5499/1 Sokak No:9<br />
        Bornova / İzmir<br />
        Türkei
      </p>

      <h2>Vertreten durch</h2>
      <p>Burak Ohrili (Geschäftsführer)</p>

      <h2>Kontakt</h2>
      <p>
        E-Mail: <a href="mailto:hello@settlelens.com">hello@settlelens.com</a>
      </p>

      <h2>Steuerliche Angaben</h2>
      <p>
        Türkische Steuernummer (Vergi Numarası): 35509755908<br />
        Zuständiges Finanzamt: Ege Vergi Dairesi, İzmir, Türkei
      </p>

      <h2>Verantwortlicher i.S.d. § 18 Abs. 2 MStV</h2>
      <p>
        Burak Ohrili<br />
        Gaziosmanpaşa Mahallesi, 5499/1 Sokak No:9<br />
        Bornova / İzmir, Türkei
      </p>

      <h2>Hinweis zur Dienstleistung</h2>
      <p>
        SettleLens ist ein Werkzeug zur finanziellen Szenariomodellierung. Die Inhalte dienen ausschließlich der allgemeinen Information und Finanzmodellierung — <strong>keine Rechts- oder Steuerberatung</strong>. Für rechtliche Entscheidungen wenden Sie sich bitte an einen qualifizierten Rechtsanwalt oder Steuerberater.
      </p>

      <h2>Haftungsausschluss</h2>
      <p>
        Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte übernehmen wir jedoch keine Gewähr. Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.
      </p>

      <h2>Haftung für Links</h2>
      <p>
        Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
      </p>

      <h2>Datenschutz</h2>
      <p>
        Informationen zur Datenverarbeitung finden Sie in unserer <a href="/de/privacy">Datenschutzerklärung</a>. Wir verarbeiten personenbezogene Daten gemäß der Datenschutz-Grundverordnung (DSGVO).
      </p>

      <h2>Streitschlichtung</h2>
      <p>
        Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
        <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">
          https://ec.europa.eu/consumers/odr/
        </a>
        .<br />
        Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
      </p>
    </LegalPageLayout>
  );
}
