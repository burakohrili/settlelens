import { LegalPageLayout } from "@/components/layout/LegalPageLayout";
import { getLocale } from "next-intl/server";

export default async function PrivacyPage() {
  const locale = await getLocale();
  const isTR = locale === "tr";
  const isDE = locale === "de";

  return (
    <LegalPageLayout title={isTR ? "Gizlilik Politikası" : isDE ? "Datenschutzerklärung" : "Privacy Policy"} lastUpdated="May 2026">
      <h2>1. {isTR ? "Biz Kimiz" : isDE ? "Wer wir sind" : "Who We Are"}</h2>
      <p>
        {isTR
          ? "SettleLens, boşanma anlaşmaları için finansal modelleme sunan bir araçtır. Şirket bilgileri: support@settlelens.com · privacy@settlelens.com"
          : isDE
          ? "SettleLens ist ein Tool zur Finanzmodellierung für Scheidungsvereinbarungen. Kontakt: support@settlelens.com · privacy@settlelens.com"
          : "SettleLens is a financial modeling tool for divorce settlements. Contact: support@settlelens.com · privacy@settlelens.com"}
      </p>

      <h2>2. {isTR ? "Topladığımız Veriler" : isDE ? "Daten, die wir erheben" : "Data We Collect"}</h2>
      <ul>
        <li>{isTR ? "Hesap bilgileri: ad, e-posta, ülke" : isDE ? "Kontodaten: Name, E-Mail, Land" : "Account information: name, email, country"}</li>
        <li>{isTR ? "Finansal veriler: varlık, borç, gelir (yalnızca sizin girdiniz)" : isDE ? "Finanzdaten: Vermögen, Schulden, Einkommen (nur von Ihnen eingegeben)" : "Financial data: assets, debts, income (entered by you only)"}</li>
        <li>{isTR ? "Kullanım verileri: analitik (onayınızla)" : isDE ? "Nutzungsdaten: Analysen (mit Ihrer Einwilligung)" : "Usage data: analytics (with your consent)"}</li>
        <li>{isTR ? "Ödeme verileri: Paddle tarafından işlenir, kart bilgileri SettleLens'e iletilmez" : isDE ? "Zahlungsdaten: Verarbeitung durch Paddle, Kartendaten werden nicht an SettleLens übermittelt" : "Payment data: processed by Paddle, card details never reach SettleLens"}</li>
      </ul>

      <h2>3. {isTR ? "Verileri Nasıl Kullanıyoruz" : isDE ? "Wie wir Daten verwenden" : "How We Use Data"}</h2>
      <ul>
        <li>{isTR ? "Hizmet sunumu: senaryo analizi, rapor oluşturma" : isDE ? "Diensterbringung: Szenarioanalyse, Berichtserstellung" : "Service delivery: scenario analysis, report generation"}</li>
        <li>{isTR ? "Hesap yönetimi ve faturalama" : isDE ? "Kontoverwaltung und Abrechnung" : "Account management and billing"}</li>
        <li>{isTR ? "Hizmet iyileştirme (anonim, toplu)" : isDE ? "Serviceverbesserung (anonym, aggregiert)" : "Service improvement (anonymous, aggregated)"}</li>
      </ul>

      <h2>4. {isTR ? "Yapay Zeka İşleme" : isDE ? "KI-Verarbeitung" : "AI Processing"}</h2>
      <p>
        {isTR
          ? "Finansal senaryolarınız Anthropic'in Claude API'si aracılığıyla analiz edilir. Verileriniz Anthropic'te saklanmaz ve model eğitiminde kullanılmaz. Hassas finansal veriler hiçbir zaman geliştirici konsoluna yazdırılmaz."
          : isDE
          ? "Ihre Finanzszenarien werden über die Claude API von Anthropic analysiert. Ihre Daten werden nicht bei Anthropic gespeichert und nicht für das Modelltraining verwendet."
          : "Your financial scenarios are analyzed via Anthropic's Claude API. Your data is not stored at Anthropic and is not used for model training. Sensitive financial data is never logged to developer consoles."}
      </p>

      <h2>5. {isTR ? "Veri Paylaşımı" : isDE ? "Datenweitergabe" : "Data Sharing"}</h2>
      <ul>
        <li><strong>Paddle</strong> — {isTR ? "ödeme işlemleri (Merchant of Record)" : isDE ? "Zahlungsabwicklung (Merchant of Record)" : "payment processing (Merchant of Record)"}</li>
        <li><strong>Supabase</strong> — {isTR ? "veritabanı (EU sunucuları)" : isDE ? "Datenbank (EU-Server)" : "database (EU servers)"}</li>
        <li><strong>Resend</strong> — {isTR ? "e-posta iletişimi" : isDE ? "E-Mail-Kommunikation" : "email delivery"}</li>
        <li><strong>PostHog</strong> — {isTR ? "analitik (yalnızca onay ile)" : isDE ? "Analytik (nur mit Einwilligung)" : "analytics (consent only)"}</li>
      </ul>
      <p>{isTR ? "Verilerinizi reklam amaçlı üçüncü taraflara satmıyor veya aktarmıyoruz." : isDE ? "Wir verkaufen oder übermitteln Ihre Daten nicht zu Werbezwecken an Dritte." : "We never sell or transfer your data to third parties for advertising purposes."}</p>

      <h2>6. {isTR ? "Haklarınız" : isDE ? "Ihre Rechte" : "Your Rights"}</h2>
      <ul>
        <li>{isTR ? "Erişim: verilerinizin bir kopyasını talep edin" : isDE ? "Auskunft: Fordern Sie eine Kopie Ihrer Daten an" : "Access: request a copy of your data"}</li>
        <li>{isTR ? "Düzeltme: hatalı verileri düzeltin" : isDE ? "Berichtigung: fehlerhafte Daten korrigieren" : "Rectification: correct inaccurate data"}</li>
        <li>{isTR ? "Silme: hesabınızı ve tüm verilerinizi silin (30 gün içinde kalıcı)" : isDE ? "Löschung: Konto und alle Daten löschen (dauerhaft innerhalb von 30 Tagen)" : "Erasure: delete your account and all data (permanent within 30 days)"}</li>
        <li>{isTR ? "Taşınabilirlik: verilerinizi JSON formatında indirin" : isDE ? "Datenübertragbarkeit: Daten im JSON-Format herunterladen" : "Portability: download your data in JSON format"}</li>
        <li>{isTR ? "İtiraz: belirli işlemlere itiraz edin" : isDE ? "Widerspruch: bestimmten Verarbeitungen widersprechen" : "Objection: object to certain processing"}</li>
      </ul>
      <p>
        {isTR
          ? "Haklarınızı kullanmak için: privacy@settlelens.com"
          : isDE
          ? "Zur Ausübung Ihrer Rechte: privacy@settlelens.com"
          : "To exercise your rights: privacy@settlelens.com"}
      </p>

      {isTR && (
        <>
          <h2>KVKK Kapsamındaki Ek Haklarınız (Madde 11)</h2>
          <p>Türkiye'deki kullanıcılar KVKK Madde 11 kapsamında ek haklara sahiptir: veri sorumlusuna başvuru hakkı, yurt dışı aktarım hakkında bilgi alma, zararın tazminini talep etme. Veri Sorumlusu: SettleLens — privacy@settlelens.com</p>
        </>
      )}

      {isDE && (
        <>
          <h2>DSGVO-Rechte (Art. 15–22 DSGVO)</h2>
          <p>Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Verantwortlicher: SettleLens — privacy@settlelens.com</p>
        </>
      )}

      <h2>7. {isTR ? "Veri Saklama" : isDE ? "Datenspeicherung" : "Data Retention"}</h2>
      <p>
        {isTR
          ? "Finansal veriler hesabınız aktif olduğu sürece saklanır. Hesabı sildiğinizde veriler 30 gün sonra kalıcı olarak silinir. Denetim logları düzenleyici gereksinimler nedeniyle 2 yıl saklanır (kişisel veri içermez)."
          : isDE
          ? "Finanzdaten werden gespeichert, solange Ihr Konto aktiv ist. Nach der Kontolöschung werden Daten innerhalb von 30 Tagen dauerhaft gelöscht. Audit-Logs werden 2 Jahre aufbewahrt (ohne personenbezogene Daten)."
          : "Financial data is retained while your account is active. On account deletion, data is permanently deleted within 30 days. Audit logs are retained for 2 years for regulatory reasons (no personal data)."}
      </p>

      <h2>8. {isTR ? "Güvenlik" : isDE ? "Sicherheit" : "Security"}</h2>
      <p>
        {isTR
          ? "Supabase Row Level Security: yalnızca siz kendi verilerinize erişebilirsiniz. Veriler aktarım ve depolamada şifrelenir. Paddle ödeme güvenliğini yönetir; SettleLens kart verisi saklamaz."
          : isDE
          ? "Supabase Row Level Security: nur Sie können auf Ihre eigenen Daten zugreifen. Daten werden bei Übertragung und Speicherung verschlüsselt."
          : "Supabase Row Level Security: only you can access your own data. Data is encrypted in transit and at rest. Paddle manages payment security; SettleLens stores no card data."}
      </p>

      <h2>9. {isTR ? "İletişim" : isDE ? "Kontakt" : "Contact"}</h2>
      <p>
        privacy@settlelens.com
      </p>
    </LegalPageLayout>
  );
}
