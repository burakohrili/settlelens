import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/layout/LegalPageLayout";
import { getTranslations } from "next-intl/server";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "about" });
  return {
    title: `${t("title")} — SettleLens`,
    description: t("story_p").slice(0, 160),
    alternates: { canonical: `https://settlelens.com/${lang}/about` },
  };
}

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
