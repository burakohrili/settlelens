import { LegalPageLayout } from "@/components/layout/LegalPageLayout";
import { getTranslations, getLocale } from "next-intl/server";

export default async function PrivacyPage() {
  const t = await getTranslations("privacy");
  const locale = await getLocale();
  const isTR = locale === "tr";
  const isDE = locale === "de";

  return (
    <LegalPageLayout title={t("title")} lastUpdated="May 2026">
      <h2>1. {t("s1_title")}</h2>
      <p>{t("s1_p")}</p>

      <h2>2. {t("s2_title")}</h2>
      <ul>
        <li>{t("s2_li1")}</li>
        <li>{t("s2_li2")}</li>
        <li>{t("s2_li3")}</li>
        <li>{t("s2_li4")}</li>
      </ul>

      <h2>3. {t("s3_title")}</h2>
      <ul>
        <li>{t("s3_li1")}</li>
        <li>{t("s3_li2")}</li>
        <li>{t("s3_li3")}</li>
      </ul>

      <h2>4. {t("s4_title")}</h2>
      <p>{t("s4_p")}</p>

      <h2>5. {t("s5_title")}</h2>
      <ul>
        <li><strong>Paddle</strong> — {t("s5_paddle")}</li>
        <li><strong>Supabase</strong> — {t("s5_supabase")}</li>
        <li><strong>Resend</strong> — {t("s5_resend")}</li>
        <li><strong>PostHog</strong> — {t("s5_posthog")}</li>
      </ul>
      <p>{t("s5_note")}</p>

      <h2>6. {t("s6_title")}</h2>
      <ul>
        <li>{t("s6_li1")}</li>
        <li>{t("s6_li2")}</li>
        <li>{t("s6_li3")}</li>
        <li>{t("s6_li4")}</li>
        <li>{t("s6_li5")}</li>
      </ul>
      <p>{t("s6_contact")}</p>

      {isTR && (
        <>
          <h2>{t("kvkk_title")}</h2>
          <p>{t("kvkk_p")}</p>
        </>
      )}

      {isDE && (
        <>
          <h2>{t("dsgvo_title")}</h2>
          <p>{t("dsgvo_p")}</p>
        </>
      )}

      <h2>7. {t("s7_title")}</h2>
      <p>{t("s7_p")}</p>

      <h2>8. {t("s8_title")}</h2>
      <p>{t("s8_p")}</p>

      <h2>9. {t("s9_title")}</h2>
      <p>privacy@settlelens.com</p>
    </LegalPageLayout>
  );
}
