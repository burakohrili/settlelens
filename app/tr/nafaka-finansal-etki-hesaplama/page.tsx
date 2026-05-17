import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "Nafakanın Finansal Etkisi Nasıl Hesaplanır? | SettleLens",
  description: "Yoksulluk nafakası ve çocuk nafakasının 10 yıllık finansal etkisini modelleyin. TMK 175 ve TMK 182 kapsamında nafaka analizi.",
};

export default function Page() {
  return (
    <SeoLandingTemplate config={{
      locale: "tr",
      badge: "Nafaka Analizi",
      headline: "Nafaka Ödemelerinin 10 Yıllık Finansal Etkisini Modelleyin",
      intro: "Nafaka, boşanma sonrası aylık nakit akışınızı doğrudan etkileyen en kritik kalemlerden biridir. SettleLens, farklı nafaka tutarlarının ve sürelerinin uzun vadeli finansal tablonuzu nasıl değiştireceğini görselleştirir.",
      sections: [
        {
          heading: "Yoksulluk Nafakası (TMK Madde 175)",
          body: "Yoksulluk nafakası, boşanma sonucu yoksulluğa düşecek tarafın, diğer taraftan talep edebileceği süresiz veya süreli bir ödeme biçimidir. Mahkemeler, tarafların ekonomik durumunu, evlilik süresini ve tarafların ihtiyaçlarını değerlendirerek tutarı belirler. SettleLens, bu tutarı aylık bazda nakit akışınıza dahil ederek ne ödeyeceğinizi veya alacağınızı projekte eder.",
        },
        {
          heading: "Çocuk Nafakası (TMK Madde 182)",
          body: "Velayeti olmayan taraf, çocuğun bakım, eğitim ve sağlık giderleri için iştirak nafakası öder. Bu tutar çocuğun yaşına, eğitim durumuna ve tarafların gelir seviyesine göre değişir. SettleLens, çocuk başına aylık ödemeyi hesaba katarak her iki tarafın nakit akışını ayrı ayrı modelleyebilir.",
        },
        {
          heading: "Enflasyon Etkisi",
          body: "Türkiye'de yüksek enflasyon ortamında sabit belirlenen nafaka tutarları, yıllar içinde reel değer kaybeder. SettleLens, kullanıcı tarafından belirlenen enflasyon oranını hesaba katarak 10 yıllık reel nakit akışını gösterir — böylece uzun vadedeki finansal pozisyonunuzu gerçekçi biçimde değerlendirebilirsiniz.",
        },
        {
          heading: "Nafaka Tutarı Müzakerede Nasıl Kullanılır?",
          body: "Eşinizin teklifini SettleLens'e girerek 10 yılda size ne kazandırıp ne kaybettireceğini görebilirsiniz. Bu rakamları avukatınızla paylaşarak müzakere pozisyonunuzu güçlendirebilirsiniz.",
        },
      ],
      faq: [
        { q: "SettleLens kesin nafaka miktarını hesaplar mı?", a: "Hayır. Nafaka tutarı mahkeme kararıyla belirlenir ve birçok bireysel faktöre bağlıdır. SettleLens, farklı tutarların finansal etkisini modelleyerek size bir referans çerçevesi sunar." },
        { q: "Nafaka ne kadar süreyle devam eder?", a: "Yoksulluk nafakasında mahkeme süresiz veya belirli bir süre için karar verebilir. Çocuk nafakası ise çocuğun 18 yaşını doldurmasına (veya öğrenimini tamamlamasına) dek devam eder. SettleLens bu süreyi dahil ederek toplam ödeme yükünü gösterir." },
      ],
      ctaText: "Nafaka Senaryolarımı Gör",
      ctaHref: "/tr/register",
      ctaSub: "Ücretsiz başlayın — kredi kartı gerekmez",
      disclaimer: "SettleLens finansal modelleme sunar; hukuki tavsiye vermez. Nafaka miktarı ve süresi mahkeme kararıyla belirlenir. Detaylı bilgi için nitelikli bir aile hukuku avukatına danışın.",
    }} />
  );
}
