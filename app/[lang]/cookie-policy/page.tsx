import { LegalPageLayout } from "@/components/layout/LegalPageLayout";
import { getTranslations } from "next-intl/server";

export default async function CookiePolicyPage() {
  const t = await getTranslations("cookie_policy");

  return (
    <LegalPageLayout title={t("title")} lastUpdated="May 2026">
      <p>{t("intro")}</p>

      <h2>{t("essential_title")}</h2>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-[var(--sand)]">
            <th className="py-2 text-left font-semibold">Cookie</th>
            <th className="py-2 text-left font-semibold">{t("col_purpose")}</th>
            <th className="py-2 text-left font-semibold">{t("col_duration")}</th>
            <th className="py-2 text-left font-semibold">{t("col_type")}</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-[var(--sand)]/50">
            <td className="py-2 font-mono text-xs">sb-*</td>
            <td className="py-2">{t("sb_purpose")}</td>
            <td className="py-2">{t("sb_duration")}</td>
            <td className="py-2">1st party</td>
          </tr>
          <tr className="border-b border-[var(--sand)]/50">
            <td className="py-2 font-mono text-xs">sl_cookie_consent</td>
            <td className="py-2">{t("consent_purpose")}</td>
            <td className="py-2">{t("consent_duration")}</td>
            <td className="py-2">1st party</td>
          </tr>
        </tbody>
      </table>

      <h2>{t("analytics_title")}</h2>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-[var(--sand)]">
            <th className="py-2 text-left font-semibold">Cookie</th>
            <th className="py-2 text-left font-semibold">{t("col_purpose")}</th>
            <th className="py-2 text-left font-semibold">{t("col_duration")}</th>
            <th className="py-2 text-left font-semibold">{t("col_type")}</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-[var(--sand)]/50">
            <td className="py-2 font-mono text-xs">ph_*</td>
            <td className="py-2">
              {t("ph_purpose_label")}{" "}
              <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer" className="underline text-[var(--slate)]">
                {t("ph_privacy_link")}
              </a>
            </td>
            <td className="py-2">{t("ph_duration")}</td>
            <td className="py-2">3rd party</td>
          </tr>
        </tbody>
      </table>

      <h2>{t("marketing_title")}</h2>
      <p className="text-[var(--gain)] font-semibold">{t("marketing_not_used")}</p>

      <h2>{t("manage_title")}</h2>
      <p>{t("manage_p")}</p>
    </LegalPageLayout>
  );
}
