import { LegalPageLayout } from "@/components/layout/LegalPageLayout";
import { getTranslations } from "next-intl/server";
import { Shield, Lock, Eye, Download, Trash2, CreditCard, Database } from "lucide-react";

export default async function TrustPage() {
  const t = await getTranslations("trust");

  return (
    <LegalPageLayout title={t("title")}>
      <p className="text-base leading-relaxed">{t("intro")}</p>

      <div className="mt-8 space-y-6">
        <div className="flex gap-4">
          <Database className="mt-1 shrink-0 text-[var(--gold)]" size={20} />
          <div>
            <h2 className="!mt-0">{t("s1_title")}</h2>
            <ul>
              <li>{t("s1_li1")}</li>
              <li>{t("s1_li2")}</li>
              <li>{t("s1_li3")}</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-4">
          <Shield className="mt-1 shrink-0 text-[var(--gold)]" size={20} />
          <div>
            <h2 className="!mt-0">{t("s2_title")}</h2>
            <p>{t("s2_p1")}</p>
            <p className="mt-2">{t("s2_p2")}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <Eye className="mt-1 shrink-0 text-[var(--danger)]" size={20} />
          <div>
            <h2 className="!mt-0">{t("s3_title")}</h2>
            <ul>
              <li>{t("s3_li1")}</li>
              <li>{t("s3_li2")}</li>
              <li>{t("s3_li3")}</li>
              <li>{t("s3_li4")}</li>
              <li>{t("s3_li5")}</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-4">
          <Download className="mt-1 shrink-0 text-[var(--gold)]" size={20} />
          <div>
            <h2 className="!mt-0">{t("s4_title")}</h2>
            <ul>
              <li>
                {t("s4_export")}: <a href="/settings/privacy">{t("s4_export_link")}</a>
              </li>
              <li>
                {t("s4_delete")}: <a href="/settings/privacy">{t("s4_delete_link")}</a>
              </li>
              <li>{t("s4_gdpr")}</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-4">
          <CreditCard className="mt-1 shrink-0 text-[var(--gold)]" size={20} />
          <div>
            <h2 className="!mt-0">{t("s5_title")}</h2>
            <p>{t("s5_p")}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <Lock className="mt-1 shrink-0 text-[var(--gold)]" size={20} />
          <div>
            <h2 className="!mt-0">{t("s6_title")}</h2>
            <p className="rounded-md border border-[var(--gain)]/40 bg-[var(--gain)]/10 p-3 font-semibold text-[var(--navy)]">
              {t("s6_highlight")}
            </p>
            <p className="mt-2">{t("s6_rls")}</p>
          </div>
        </div>
      </div>
    </LegalPageLayout>
  );
}
