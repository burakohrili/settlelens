import { LegalPageLayout } from "@/components/layout/LegalPageLayout";
import { getLocale } from "next-intl/server";

export default async function AboutPage() {
  const locale = await getLocale();
  const isTR = locale === "tr";
  const isDE = locale === "de";

  return (
    <LegalPageLayout
      title={isTR ? "Hakkında" : isDE ? "Über uns" : "About SettleLens"}
    >
      <h2>{isTR ? "İsim Arkasındaki Hikaye" : isDE ? "Die Geschichte hinter dem Namen" : "The Story Behind the Name"}</h2>
      <p>
        <strong>SettleLens = Settle + Lens.</strong>{" "}
        {isTR
          ? "Anlaşmanın sisini geçip görebilmek için bir mercek. Boşanma, hayatın en stresli finansal olaylarından biridir — ve çoğu insan bu süreçte gerçek rakamları asla göremez."
          : isDE
          ? "Eine Linse, um durch den Nebel der Einigung zu sehen. Scheidung ist eines der stressigsten finanziellen Ereignisse im Leben — und die meisten Menschen sehen dabei nie die echten Zahlen."
          : "A lens to see through the settlement fog. Divorce is one of life's most financially stressful events — and most people never see the real numbers."}
      </p>

      <h2>{isTR ? "Misyonumuz" : isDE ? "Unsere Mission" : "Our Mission"}</h2>
      <p>
        {isTR
          ? "SettleLens'in misyonu, insanlara avukatlarıyla daha hazırlıklı görüşme imkânı tanımak ve finansal kararlarını netleştirmektir. Bir avukat yerine geçmiyoruz — avukata gitmeden önce daha net düşünmenize yardımcı oluyoruz."
          : isDE
          ? "Die Mission von SettleLens ist es, Menschen zu ermöglichen, besser vorbereitet mit ihren Anwälten zu sprechen und finanzielle Entscheidungen zu klären. Wir ersetzen keinen Anwalt — wir helfen Ihnen, klarer zu denken, bevor Sie zum Anwalt gehen."
          : "SettleLens's mission is to help people walk into lawyer meetings better prepared and to clarify their financial decisions. We don't replace a lawyer — we help you think more clearly before you see one."}
      </p>

      <h2>{isTR ? "Sorumluluk Reddi" : isDE ? "Haftungsausschluss" : "Our Responsibility"}</h2>
      <p>
        {isTR
          ? "SettleLens finansal modelleme sunuyor — hukuki tahmin değil. Çıktılar, girdiğiniz bilgilere dayalı tahminlerdir ve kesin yasal hakları temsil etmez. Her zaman nitelikli bir avukata danışın."
          : isDE
          ? "SettleLens bietet Finanzmodellierung — keine rechtliche Vorhersage. Ergebnisse sind Schätzungen basierend auf Ihren Eingaben. Konsultieren Sie immer einen qualifizierten Anwalt."
          : "SettleLens provides financial modeling — not legal prediction. Outputs are estimates based on what you enter and do not represent definitive legal entitlements. Always consult a qualified attorney."}
      </p>
    </LegalPageLayout>
  );
}
