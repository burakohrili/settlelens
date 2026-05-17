import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "Boşanmanın 10 Yıllık Finansal Etkisi | SettleLens",
  description: "Boşanma kararının 10 yıl sonrasındaki finansal etkisini görün. Net servet projeksiyonu, aylık nakit akışı ve senaryo karşılaştırması.",
};

export default function Page() {
  return (
    <SeoLandingTemplate config={{
      locale: "tr",
      badge: "10 Yıllık Projeksiyon",
      headline: "Boşanma Kararının 10 Yıl Sonrasındaki Finansal Etkisini Görün",
      intro: "Boşanmada alınan kararların etkisi yıllarca devam eder. SettleLens, bugün verdiğiniz kararların 1., 3., 5. ve 10. yılda net servetinizi ve aylık nakit akışınızı nasıl şekillendireceğini modelleyerek uzun vadeli perspektif sunar.",
      sections: [
        {
          heading: "Kısa Vadeli Görünen Kaybın Uzun Vadeli Kazancı Olabilir",
          body: "Bazı anlaşma unsurları kısa vadede dezavantajlı görünürken 10 yıllık perspektifte avantajlı olabilir. Örneğin, evi almak aylık nakit akışını zorlarken mülk değer artışı sayesinde 10 yılda güçlü bir net servet pozisyonu yaratabilir. SettleLens bu denklemi rakamlarla gösterir.",
        },
        {
          heading: "Enflasyon ve Yatırım Getirisi",
          body: "Türkiye'de enflasyon projeksiyon hesaplamalarında kritik bir değişkendir. SettleLens, kullanıcının belirlediği enflasyon oranını (örneğin %30-50) ve yatırım getirisini (%5-10) 10 yıllık modele dahil ederek gerçekçi bir projeksiyon sunar.",
        },
        {
          heading: "Nafaka ve Çocuk Nafakasının Uzun Vadesi",
          body: "Nafaka ödemeleri yıllarca devam edebilir. SettleLens, her yıl ödeyeceğiniz veya alacağınız nafakayı kümülatif olarak hesaplar ve bu ödemenin toplam nakit akışı içindeki payını gösterir.",
        },
        {
          heading: "Üç Senaryoyu Yan Yana Görün",
          body: "Farklı anlaşma koşullarını üç farklı senaryo olarak girip 10 yıllık projeksiyon grafiğini karşılaştırın. Hangi senaryonun sizi daha güçlü bir finansal pozisyona taşıdığı grafikte net olarak görünür.",
        },
      ],
      faq: [
        { q: "Projeksiyon ne kadar güvenilir?", a: "Projeksiyon, girdiğiniz verilere ve seçtiğiniz varsayımlara (enflasyon, yatırım getirisi, nafaka süresi) dayanır. SettleLens tahmin aralığını ve güven seviyesini raporla birlikte gösterir. Gerçek sonuçlar farklı olabilir." },
        { q: "10 yıllık projeksiyon hangi planlarla mevcut?", a: "10 yıllık AI projeksiyonu Senaryo Paketi ve üzeri planlarda mevcuttur. Ücretsiz Discovery planında temel net servet özeti sunulur." },
      ],
      ctaText: "10 Yıllık Projeksiyonumu Gör",
      ctaHref: "/tr/register",
      ctaSub: "Ücretsiz başlayın — kredi kartı gerekmez",
      disclaimer: "SettleLens finansal modelleme sunar; hukuki veya yatırım danışmanlığı vermez. Projeksiyon sonuçları tahmindir. Nitelikli bir aile hukuku avukatıyla çalışmanızı öneririz.",
    }} />
  );
}
