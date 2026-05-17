import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "Boşanma Sonrası Finansal Planlama | SettleLens",
  description: "Boşanma sürecinde finansal planlamanıza başlayın. Tek gelirle bütçe, varlık yönetimi ve 10 yıllık finansal projeksiyon.",
};

export default function Page() {
  return (
    <SeoLandingTemplate config={{
      locale: "tr",
      badge: "Finansal Planlama",
      headline: "Boşanma Sürecinde Finansal Planlamanıza Başlayın",
      intro: "Boşanma, finansal tablonuzu kökten değiştirir. Tek gelire geçiş, yeni konut maliyetleri ve nafaka ödemeleri — tüm bu değişkenlerin etkisini önceden modellemek, daha sağlam kararlar almanızı sağlar.",
      sections: [
        {
          heading: "Tek Gelire Geçişin Etkisi",
          body: "İki gelirden bire düşmek, aylık nakit akışınızı önemli ölçüde daraltabilir. SettleLens, anlaşma sonrasında elde kalacak gelir, nafaka ödemeleri ve diğer yükümlülükler dahil aylık net pozisyonunuzu hesaplar. Sıkışıklık noktalarını önceden görmenizi sağlar.",
        },
        {
          heading: "Konut Stratejisi",
          body: "Evi almanın mı, kiralamaya geçmenin mi yoksa farklı bir konut stratejisi seçmenin mi daha avantajlı olduğunu SettleLens ile analiz edebilirsiniz. Kira eşdeğeri hesabı, ipotek taşıma kapasitesi ve 5 yıllık mülk değer artışı tahminleri dahil edilebilir.",
        },
        {
          heading: "Emeklilik Planlamasına Etkisi",
          body: "Boşanma anlaşmasında emeklilik hesaplarının paylaşımı, uzun vadeli emeklilik güvencenizi doğrudan etkiler. SettleLens, mevcut emeklilik varlıklarınızın büyüme projeksiyonunu 10 yıl boyunca modelleyebilir.",
        },
        {
          heading: "Acil Nakit Tamponunuzu Belirleyin",
          body: "Boşanma sürecinde beklenmedik masraflar (avukat ücreti, taşınma, yeni mobilya) için likit bir tampon kritiktir. SettleLens, anlaşmadan elde edeceğiniz nakit miktarını ve bu tamponun aylık harcamalar bazında kaç ay yeterli olduğunu hesaplar.",
        },
      ],
      faq: [
        { q: "Boşanma kararı vermeden SettleLens kullanabilir miyim?", a: "Evet. SettleLens, erken aşamada 'ya olursa' senaryolarını modellemek için idealdir. Bu, gerçekten karar vermeden önce finansal tablonuzu anlayarak daha bilinçli ilerlemenizi sağlar." },
        { q: "Farklı gelir senaryoları girebilir miyim?", a: "Evet. Mevcut gelir yerine ileride elde etmeyi planladığınız gelirleri de girebilir, part-time veya tam zamanlı çalışma senaryolarını karşılaştırabilirsiniz." },
      ],
      ctaText: "Finansal Planlamama Başla",
      ctaHref: "/tr/register",
      ctaSub: "Ücretsiz başlayın — kredi kartı gerekmez",
      disclaimer: "SettleLens finansal modelleme sunar; hukuki veya finansal danışmanlık vermez. Önemli finansal kararlar almadan önce nitelikli bir mali müşavir ve aile hukuku avukatıyla çalışmanızı öneririz.",
    }} />
  );
}
