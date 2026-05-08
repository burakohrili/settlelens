import { LegalPageLayout } from "@/components/layout/LegalPageLayout";
import { getLocale } from "next-intl/server";

export default async function CookiePolicyPage() {
  const locale = await getLocale();
  const isTR = locale === "tr";
  const isDE = locale === "de";

  const title = isTR ? "Çerez Politikası" : isDE ? "Cookie-Richtlinie" : "Cookie Policy";

  return (
    <LegalPageLayout title={title} lastUpdated="May 2026">
      <p>
        {isTR
          ? "Bu sayfa SettleLens'in çerez kullanımını açıklar. Çerez tercihlerinizi istediğiniz zaman değiştirebilirsiniz."
          : isDE
          ? "Diese Seite erklärt die Cookie-Verwendung von SettleLens."
          : "This page explains how SettleLens uses cookies. You can change your cookie preferences at any time."}
      </p>

      <h2>{isTR ? "Zorunlu Çerezler (Her Zaman Aktif)" : isDE ? "Notwendige Cookies (immer aktiv)" : "Essential Cookies (Always Active)"}</h2>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-[var(--sand)]">
            <th className="py-2 text-left font-semibold">Cookie</th>
            <th className="py-2 text-left font-semibold">{isTR ? "Amaç" : isDE ? "Zweck" : "Purpose"}</th>
            <th className="py-2 text-left font-semibold">{isTR ? "Süre" : isDE ? "Dauer" : "Duration"}</th>
            <th className="py-2 text-left font-semibold">{isTR ? "Tür" : isDE ? "Art" : "Type"}</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-[var(--sand)]/50">
            <td className="py-2 font-mono text-xs">sb-*</td>
            <td className="py-2">{isTR ? "Supabase oturumu" : isDE ? "Supabase-Sitzung" : "Supabase session"}</td>
            <td className="py-2">{isTR ? "Oturum" : isDE ? "Sitzung" : "Session"}</td>
            <td className="py-2">1st party</td>
          </tr>
          <tr className="border-b border-[var(--sand)]/50">
            <td className="py-2 font-mono text-xs">sl_cookie_consent</td>
            <td className="py-2">{isTR ? "Çerez tercihi" : isDE ? "Cookie-Einstellung" : "Cookie preference"}</td>
            <td className="py-2">1 {isTR ? "yıl" : isDE ? "Jahr" : "year"}</td>
            <td className="py-2">1st party</td>
          </tr>
        </tbody>
      </table>

      <h2>{isTR ? "Analitik Çerezler (Onay Gerekli)" : isDE ? "Analyse-Cookies (Einwilligung erforderlich)" : "Analytics Cookies (Consent Required)"}</h2>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-[var(--sand)]">
            <th className="py-2 text-left font-semibold">Cookie</th>
            <th className="py-2 text-left font-semibold">{isTR ? "Amaç" : isDE ? "Zweck" : "Purpose"}</th>
            <th className="py-2 text-left font-semibold">{isTR ? "Süre" : isDE ? "Dauer" : "Duration"}</th>
            <th className="py-2 text-left font-semibold">{isTR ? "Tür" : isDE ? "Art" : "Type"}</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-[var(--sand)]/50">
            <td className="py-2 font-mono text-xs">ph_*</td>
            <td className="py-2">PostHog {isTR ? "analitik" : isDE ? "Analyse" : "analytics"}</td>
            <td className="py-2">1 {isTR ? "yıl" : isDE ? "Jahr" : "year"}</td>
            <td className="py-2">3rd party</td>
          </tr>
        </tbody>
      </table>

      <h2>{isTR ? "Pazarlama Çerezleri" : isDE ? "Marketing-Cookies" : "Marketing Cookies"}</h2>
      <p className="text-[var(--gain)] font-semibold">
        {isTR ? "✓ Kullanılmıyor" : isDE ? "✓ Nicht verwendet" : "✓ Not used"}
      </p>

      <h2>{isTR ? "Tercihlerinizi Değiştirin" : isDE ? "Einstellungen ändern" : "Manage Your Preferences"}</h2>
      <p>
        {isTR
          ? "Sayfanın alt kısmındaki çerez banner'ından tercihlerinizi güncelleyebilirsiniz. localStorage'dan 'sl_cookie_consent' anahtarını silerek de sıfırlayabilirsiniz."
          : isDE
          ? "Sie können Ihre Einstellungen über das Cookie-Banner am unteren Seitenrand aktualisieren."
          : "You can update your preferences via the cookie banner at the bottom of the page, or by clearing 'sl_cookie_consent' from localStorage."}
      </p>
    </LegalPageLayout>
  );
}
