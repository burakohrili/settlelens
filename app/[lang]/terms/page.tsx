import { LegalPageLayout } from "@/components/layout/LegalPageLayout";
import { getTranslations } from "next-intl/server";

export default async function TermsPage() {
  const t = await getTranslations("terms");

  return (
    <LegalPageLayout title={t("title")} lastUpdated="May 2026">
      <h2>1. {t("s1")}</h2>
      <p>{t("s1_p")}</p>

      <h2>2. {t("s2")}</h2>
      <div className="rounded-md border-2 border-[var(--danger)] bg-[var(--danger)]/10 p-4 font-semibold">
        {t("s2_warning")}
      </div>
      <p className="mt-3">{t("s2_p")}</p>

      <h2>3. {t("s3")}</h2>
      <ul>
        <li>{t("s3_li1")}</li>
        <li>{t("s3_li2")}</li>
        <li>{t("s3_li3")}</li>
      </ul>

      <h2>4. {t("s4")}</h2>
      <p>{t("s4_p")}</p>

      <h2>5. {t("s5")}</h2>
      <ul>
        <li>{t("s5_li1")}</li>
        <li>{t("s5_li2")}</li>
        <li>{t("s5_li3")}</li>
      </ul>

      <h2>6. {t("s6")}</h2>
      <p>{t("s6_p")}</p>

      <h2>7. {t("s7")}</h2>
      <p>{t("s7_p")}</p>

      <h2>8. {t("s8")}</h2>
      <p>{t("s8_p")}</p>

      <h2>9. {t("s9")}</h2>
      <p>{t("s9_p")}</p>

      <h2>10. {t("s10")}</h2>
      <p>{t("s10_p")}</p>

      <h2>11. {t("s11")}</h2>
      <p>{t("s11_p")}</p>
    </LegalPageLayout>
  );
}
