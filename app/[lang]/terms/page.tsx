import { LegalPageLayout } from "@/components/layout/LegalPageLayout";
import { getLocale } from "next-intl/server";

export default async function TermsPage() {
  const locale = await getLocale();
  const isTR = locale === "tr";
  const isDE = locale === "de";

  return (
    <LegalPageLayout
      title={isTR ? "Kullanım Koşulları" : isDE ? "Nutzungsbedingungen" : "Terms of Service"}
      lastUpdated="May 2026"
    >
      <h2>1. {isTR ? "Kabul" : isDE ? "Annahme" : "Acceptance"}</h2>
      <p>
        {isTR
          ? "SettleLens'i kullanarak bu koşulları kabul etmiş olursunuz. Kabul etmiyorsanız hizmeti kullanmayınız."
          : isDE
          ? "Durch die Nutzung von SettleLens stimmen Sie diesen Bedingungen zu."
          : "By using SettleLens, you agree to these terms. If you do not agree, do not use the service."}
      </p>

      <h2>2. {isTR ? "Hizmet Açıklaması" : isDE ? "Leistungsbeschreibung" : "Service Description"}</h2>
      <div className="rounded-md border-2 border-[var(--danger)] bg-[var(--danger)]/10 p-4 font-semibold">
        {isTR
          ? "ÖNEMLİ: SettleLens HUKUKİ TAVSİYE DEĞİLDİR. Finansal modelleme ve senaryo simülasyonu sunar. Herhangi bir karar vermeden önce nitelikli bir avukata danışın."
          : isDE
          ? "WICHTIG: SettleLens IST KEINE RECHTSBERATUNG. Es bietet Finanzmodellierung und Szenario-Simulation. Konsultieren Sie vor Entscheidungen einen qualifizierten Anwalt."
          : "IMPORTANT: SettleLens IS NOT LEGAL ADVICE. It provides financial modeling and scenario simulation only. Always consult a qualified attorney before making any decisions."}
      </div>
      <p className="mt-3">
        {isTR
          ? "SettleLens, kullanıcıların kendi girdiği verilere dayalı finansal senaryolar oluşturmasına ve karşılaştırmasına olanak tanır. Sonuçlar tahmindir, yasal hakları belirlemez."
          : isDE
          ? "SettleLens ermöglicht es Nutzern, Finanzszenarien basierend auf selbst eingegebenen Daten zu erstellen und zu vergleichen. Ergebnisse sind Schätzungen und bestimmen keine Rechtsansprüche."
          : "SettleLens enables users to build and compare financial scenarios based on data they enter. Results are estimates and do not determine legal entitlements."}
      </p>

      <h2>3. {isTR ? "Kullanıcı Hesapları" : isDE ? "Benutzerkonten" : "User Accounts"}</h2>
      <ul>
        <li>{isTR ? "Hesap bilgilerinizin gizliliğinden siz sorumlusunuzdur." : isDE ? "Sie sind für die Vertraulichkeit Ihrer Kontoinformationen verantwortlich." : "You are responsible for maintaining the confidentiality of your account."}</li>
        <li>{isTR ? "Hesabınızı başkalarıyla paylaşmamalısınız." : isDE ? "Sie dürfen Ihr Konto nicht teilen." : "You must not share your account with others."}</li>
        <li>{isTR ? "18 yaş altı kişiler hizmeti kullanamaz." : isDE ? "Personen unter 18 Jahren dürfen den Dienst nicht nutzen." : "Users must be 18 years or older."}</li>
      </ul>

      <h2>4. {isTR ? "Faturalama (Paddle)" : isDE ? "Abrechnung (Paddle)" : "Billing (Paddle)"}</h2>
      <p>
        {isTR
          ? "Ödemeler Paddle tarafından işlenir. Paddle, Merchant of Record'dur. Fatura ve ödeme sorunları için Paddle müşteri hizmetlerine başvurun."
          : isDE
          ? "Zahlungen werden von Paddle verarbeitet. Paddle ist Merchant of Record."
          : "Payments are processed by Paddle, who acts as Merchant of Record. For billing issues, contact Paddle support."}
      </p>

      <h2>5. {isTR ? "İptal ve İade" : isDE ? "Kündigung und Rückerstattung" : "Cancellation & Refund"}</h2>
      <ul>
        <li>{isTR ? "Aylık abonelikler (Strategist / Professional) istediğiniz zaman iptal edilebilir." : isDE ? "Monatsabonnements (Strategist / Professional) können jederzeit gekündigt werden." : "Monthly subscriptions (Strategist / Professional) can be cancelled anytime."}</li>
        <li>{isTR ? "İptal sonrası mevcut dönem sonuna kadar erişim devam eder." : isDE ? "Nach Kündigung bleibt der Zugang bis zum Ende der aktuellen Periode bestehen." : "After cancellation, access continues until the end of the current period."}</li>
        <li>{isTR ? "Clarified (tek seferlik): 7 gün içinde iade talep edilebilir." : isDE ? "Clarified (einmalig): Rückerstattung innerhalb von 7 Tagen möglich." : "Clarified (one-time): refund may be requested within 7 days."}</li>
      </ul>

      <h2>6. {isTR ? "Kabul Edilebilir Kullanım" : isDE ? "Akzeptable Nutzung" : "Acceptable Use"}</h2>
      <p>{isTR ? "Hizmeti yasa dışı amaçlarla, başkalarının verilerini girerek veya sistemi kötüye kullanarak kullanamazsınız." : isDE ? "Sie dürfen den Dienst nicht für illegale Zwecke, mit Daten anderer oder durch Missbrauch des Systems nutzen." : "You may not use the service for illegal purposes, with others' data without consent, or to abuse the system."}</p>

      <h2>7. {isTR ? "Fikri Mülkiyet" : isDE ? "Geistiges Eigentum" : "Intellectual Property"}</h2>
      <p>{isTR ? "SettleLens platformu ve içeriği telif hakkıyla korunmaktadır. Girdiğiniz veriler size aittir." : isDE ? "Die SettleLens-Plattform und deren Inhalte sind urheberrechtlich geschützt. Ihre eingegebenen Daten gehören Ihnen." : "The SettleLens platform and content are copyright protected. Data you enter remains yours."}</p>

      <h2>8. {isTR ? "Garanti Reddi" : isDE ? "Gewährleistungsausschluss" : "Disclaimer of Warranties"}</h2>
      <p>{isTR ? "Hizmet 'olduğu gibi' sunulur. Sonuçların doğruluğu, eksiksizliği veya belirli bir amaca uygunluğu konusunda garanti verilmez." : isDE ? "Der Dienst wird 'wie besehen' bereitgestellt. Keine Garantie für Genauigkeit, Vollständigkeit oder Eignung für einen bestimmten Zweck." : "The service is provided 'as is'. No warranty of accuracy, completeness, or fitness for a particular purpose."}</p>

      <h2>9. {isTR ? "Sorumluluk Sınırlaması" : isDE ? "Haftungsbeschränkung" : "Limitation of Liability"}</h2>
      <p>{isTR ? "SettleLens'in sorumluluğu, ödediğiniz aylık ücretle sınırlıdır. Dolaylı veya sonuçsal zararlardan sorumlu değiliz." : isDE ? "Die Haftung von SettleLens ist auf den gezahlten Monatsbeitrag beschränkt." : "SettleLens liability is limited to the monthly fee you paid. We are not liable for indirect or consequential damages."}</p>

      <h2>10. {isTR ? "Geçerli Hukuk" : isDE ? "Anwendbares Recht" : "Governing Law"}</h2>
      <p>{isTR ? "Bu koşullar Türkiye hukukuna tabidir. Anlaşmazlıklar İstanbul mahkemelerinde çözülür." : isDE ? "Diese Bedingungen unterliegen türkischem Recht. Streitigkeiten werden vor Istanbuler Gerichten beigelegt." : "These terms are governed by Turkish law. Disputes shall be resolved in Istanbul courts."}</p>

      <h2>11. {isTR ? "Değişiklikler" : isDE ? "Änderungen" : "Changes"}</h2>
      <p>{isTR ? "Koşulları değiştirebiliriz. Önemli değişikliklerde e-posta ile bildirim yapılır." : isDE ? "Wir können die Bedingungen ändern. Bei wesentlichen Änderungen erfolgt eine E-Mail-Benachrichtigung." : "We may update these terms. Material changes will be notified by email."}</p>
    </LegalPageLayout>
  );
}
