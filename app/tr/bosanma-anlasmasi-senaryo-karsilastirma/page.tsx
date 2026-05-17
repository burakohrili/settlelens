import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "Boşanma Anlaşması Senaryolarını Karşılaştırın | SettleLens",
  description: "Farklı boşanma anlaşması senaryolarının 10 yıllık finansal etkisini yan yana görün. Eşin teklifini kendi senaryonuzla karşılaştırın.",
};

export default function Page() {
  return (
    <SeoLandingTemplate config={{
      locale: "tr",
      badge: "Senaryo Karşılaştırma",
      headline: "Farklı Boşanma Anlaşması Senaryolarının Mali Sonuçlarını Karşılaştırın",
      intro: "Eşinizden bir teklif geldi. Ya da avukatınız birkaç farklı seçenek sundu. SettleLens, her senaryonun 10 yıl sonra sizi nerede bırakacağını somut rakamlarla gösterir — duygusal değil, finansal bir perspektifle.",
      sections: [
        {
          heading: "Teklif Analizi: Eşin Teklifini Modelleyin",
          body: "Eşinizden gelen teklife göre ev, nakit, emeklilik ve nafaka değişkenlerini SettleLens'e girin. Sistem, bu teklifin 10 yıllık net servetinizi ve aylık nakit akışınızı nasıl etkilediğini hesaplar. Kendi başlangıç senaryonuzla kıyaslayarak farkı görün.",
        },
        {
          heading: "Yan Yana Karşılaştırma",
          body: "SettleLens'te aynı anda üç senaryoyu modelleyip yan yana karşılaştırabilirsiniz: Kendi önerdiğiniz koşullar, eşin teklifi ve arabulucu önerisi. Her birinin 1. yıl, 3. yıl, 5. yıl ve 10. yıl net servetini tabloda görürsünüz.",
        },
        {
          heading: "Müzakere Noktalarını Belirleyin",
          body: "Senaryo karşılaştırması, müzakerede hangi kalemlerin en büyük etkiyi yarattığını ortaya çıkarır. Örneğin, nafaka tutarındaki küçük bir değişiklik 10 yılda büyük bir fark yaratabilir. Bu noktaları bilmek, avukatınızla yapacağınız müzakereyi çok daha güçlü kılar.",
        },
      ],
      faq: [
        { q: "Eşimden henüz teklif gelmediyse bu aracı kullanabilir miyim?", a: "Evet. Farklı varsayımları kendi başınıza girebilirsiniz — evin kim alacağı, nafaka ne kadar olacak, emeklilik nasıl bölünecek. Bu 'ya olursa' senaryoları, müzakereye hazır gitmenizi sağlar." },
        { q: "Kaç senaryo oluşturabilirim?", a: "Ücretsiz Discovery planında 3 senaryo oluşturabilirsiniz (AI analizi yoktur). Ücretli planlarda sınırsız senaryo ve 10 yıllık AI projeksiyonu mevcuttur." },
      ],
      ctaText: "Senaryolarımı Karşılaştır",
      ctaHref: "/tr/register",
      ctaSub: "Ücretsiz başlayın — kredi kartı gerekmez",
      disclaimer: "SettleLens finansal modelleme sunar; hukuki tavsiye vermez. Senaryo sonuçları tahmindir ve kullanıcı girdisine dayanır. Nitelikli bir aile hukuku avukatıyla çalışmanızı öneririz.",
    }} />
  );
}
