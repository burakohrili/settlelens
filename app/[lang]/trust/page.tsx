import { LegalPageLayout } from "@/components/layout/LegalPageLayout";
import { getLocale } from "next-intl/server";
import { Shield, Lock, Eye, Download, Trash2, CreditCard, Database } from "lucide-react";

export default async function TrustPage() {
  const locale = await getLocale();
  const isTR = locale === "tr";

  const title = isTR
    ? "Hayatın En Hassas Anlarından Biri İçin Tasarlandı"
    : "Built for One of Life's Most Sensitive Moments";

  return (
    <LegalPageLayout title={title}>
      <p className="text-base leading-relaxed">
        {isTR
          ? "Boşanma sürecinde insanlar hayatlarının en kişisel finansal verilerini paylaşmak zorunda kalır. SettleLens bu güveni hak etmek için tasarlanmıştır."
          : "During divorce, people must share the most personal financial data of their lives. SettleLens is designed to earn and keep that trust."}
      </p>

      <div className="mt-8 space-y-6">
        {/* Section 1 */}
        <div className="flex gap-4">
          <Database className="mt-1 shrink-0 text-[var(--gold)]" size={20} />
          <div>
            <h2 className="!mt-0">{isTR ? "Ne Topluyoruz ve Neden" : "What We Collect and Why"}</h2>
            <ul>
              <li>{isTR ? "Yalnızca siz girersiniz: varlık, borç, gelir, senaryo verileri" : "Only what you enter: assets, debts, income, scenario data"}</li>
              <li>{isTR ? "Onaylarsanız: anonim analitik (PostHog)" : "If you consent: anonymous analytics (PostHog)"}</li>
              <li>{isTR ? "Hiçbir zaman: reklam verisi, davranışsal profil" : "Never: advertising data, behavioral profiles"}</li>
            </ul>
          </div>
        </div>

        {/* Section 2 */}
        <div className="flex gap-4">
          <Shield className="mt-1 shrink-0 text-[var(--gold)]" size={20} />
          <div>
            <h2 className="!mt-0">{isTR ? "Yapay Zeka Nasıl Çalışır" : "How AI Analysis Works"}</h2>
            <p>
              {isTR
                ? "Yapay zeka bir hesap makinesidir — hâkim değil. Senaryonuzu analiz eder, projeksiyonlar üretir, risk faktörlerini belirtir. Karar vermez, tahmin yapmaz, sizin adınıza konuşmaz."
                : "AI is a calculator, not a judge. It analyzes your scenario, generates projections, and flags risk factors. It does not make decisions, predict outcomes, or speak on your behalf."}
            </p>
            <p className="mt-2">
              {isTR
                ? "Verileriniz Anthropic'te saklanmaz ve model eğitiminde kullanılmaz."
                : "Your data is not stored at Anthropic and is not used for model training."}
            </p>
          </div>
        </div>

        {/* Section 3 */}
        <div className="flex gap-4">
          <Eye className="mt-1 shrink-0 text-[var(--danger)]" size={20} />
          <div>
            <h2 className="!mt-0">{isTR ? "Yapay Zekanın Yapmadıkları" : "What AI Does NOT Do"}</h2>
            <ul>
              <li>{isTR ? "Mahkeme sonucunu tahmin etmez" : "Does not predict court outcomes"}</li>
              <li>{isTR ? "\"Teklifi kabul et/reddet\" demez" : "Does not say \"accept\" or \"reject\" any offer"}</li>
              <li>{isTR ? "Hukuki tavsiye vermez" : "Does not provide legal advice"}</li>
              <li>{isTR ? "Varlık gizleme veya transfer önermez" : "Does not suggest hiding or transferring assets"}</li>
              <li>{isTR ? "\"Avukata gerek yok\" demez" : "Does not say you don't need a lawyer"}</li>
            </ul>
          </div>
        </div>

        {/* Section 4 */}
        <div className="flex gap-4">
          <Download className="mt-1 shrink-0 text-[var(--gold)]" size={20} />
          <div>
            <h2 className="!mt-0">{isTR ? "Veri Haklarınız" : "Your Data Rights"}</h2>
            <ul>
              <li>
                {isTR ? "Dışa aktarma" : "Export"}: <a href="/settings/privacy">{isTR ? "Ayarlar → Gizlilik → JSON indir" : "Settings → Privacy → Download JSON"}</a>
              </li>
              <li>
                {isTR ? "Hesap silme" : "Delete account"}: <a href="/settings/privacy">{isTR ? "Ayarlar → Gizlilik → Hesabı Sil (30 gün içinde kalıcı)" : "Settings → Privacy → Delete Account (permanent within 30 days)"}</a>
              </li>
              <li>GDPR{isTR ? " ve KVKK kapsamında tasarlanmıştır." : " and KVKK compliant by design."}</li>
            </ul>
          </div>
        </div>

        {/* Section 5 */}
        <div className="flex gap-4">
          <CreditCard className="mt-1 shrink-0 text-[var(--gold)]" size={20} />
          <div>
            <h2 className="!mt-0">{isTR ? "Ödeme Güvenliği" : "Payment Security"}</h2>
            <p>
              {isTR
                ? "Ödemeler Paddle tarafından işlenir (Merchant of Record). Kart bilgileri hiçbir zaman SettleLens sunucularına ulaşmaz. Abonelik yönetimi Paddle portalında yapılır."
                : "Payments are processed by Paddle (Merchant of Record). Card details never reach SettleLens servers. Subscription management is handled in the Paddle portal."}
            </p>
          </div>
        </div>

        {/* Section 6 */}
        <div className="flex gap-4">
          <Lock className="mt-1 shrink-0 text-[var(--gold)]" size={20} />
          <div>
            <h2 className="!mt-0">{isTR ? "Verilerinizi Kim Görebilir" : "Who Can See Your Data"}</h2>
            <p className="rounded-md border border-[var(--gain)]/40 bg-[var(--gain)]/10 p-3 font-semibold text-[var(--navy)]">
              {isTR
                ? "Hiçbir Anthropic çalışanı, SettleLens ekip üyesi veya üçüncü taraf finansal verilerinize erişmemiştir. Senaryolarınızı, varlıklarınızı ve raporlarınızı yalnızca siz görebilirsiniz."
                : "No Anthropic employee, SettleLens team member, or third party has accessed your financial data. Only you can see your scenarios, assets, and reports."}
            </p>
            <p className="mt-2">
              {isTR
                ? "Supabase Row Level Security: her sorgu auth.uid() = user_id koşulunu zorunlu kılar."
                : "Supabase Row Level Security: every query enforces auth.uid() = user_id."}
            </p>
          </div>
        </div>
      </div>
    </LegalPageLayout>
  );
}
