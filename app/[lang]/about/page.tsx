import { LegalPageLayout } from "@/components/layout/LegalPageLayout";
import { getTranslations } from "next-intl/server";

export default async function AboutPage() {
  const t = await getTranslations("about");

  return (
    <LegalPageLayout title={t("title")}>
      <h2>{t("story_title")}</h2>
      <p>
        <strong>SettleLens = Settle + Lens.</strong>{" "}
        {t("story_p")}
      </p>

      <h2>{t("mission_title")}</h2>
      <p>{t("mission_p")}</p>

      <h2>{t("responsibility_title")}</h2>
      <p>{t("responsibility_p")}</p>
    </LegalPageLayout>
  );
}
