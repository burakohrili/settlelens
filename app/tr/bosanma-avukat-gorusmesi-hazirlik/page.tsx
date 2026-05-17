import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "Boşanma Avukat Görüşmesine Nasıl Hazırlanılır? | SettleLens",
  description: "Boşanma avukatınızla ilk görüşmeden önce finansal tablonuzu hazırlayın. Varlık envanteri, senaryo analizi ve hazırlık rehberi.",
};

export default function Page() {
  return (
    <SeoLandingTemplate config={{
      locale: "tr",
      badge: "Avukat Hazırlığı",
      headline: "Avukatınızla İlk Görüşmeye Finansal Olarak Hazır Gidin",
      intro: "İlk avukat görüşmesinde temel finansal verilerinizi hazır götürmeniz hem zaman hem para tasarrufu sağlar. SettleLens, bu verileri sistematik biçimde düzenlemenize ve avukata hazır bir finansal özet oluşturmanıza yardımcı olur.",
      checklist: [
        "Tüm varlıklarınızın güncel değerlerini listeleyin (gayrimenkul, araç, banka, yatırım)",
        "Ortak ve bireysel borçlarınızı belgeleyin (ipotek bakiyesi, kredi kartı, kişisel kredi)",
        "Her iki tarafın yıllık brüt ve net gelirini not edin",
        "Evlilik tarihini ve hangi varlıkların evlilik öncesi edinildiğini belirtin",
        "Çocuk sayısını, yaşlarını ve mevcut velayet düzenlemesini hazırlayın",
        "Emeklilik hesaplarınızı (BES, kıdem, SGK) listeleyin",
        "Eşten gelen veya hazırladığınız anlaşma tekliflerini yanınıza alın",
        "10 yıllık nakit akışı projeksiyonunuzu SettleLens ile hazırlayın",
      ],
      sections: [
        {
          heading: "Hazırlıklı Gitmek Neden Önemli?",
          body: "Avukat saati pahalıdır. Görüşme boyunca rakamları bulmak yerine strateji konuşabilmek için verileri önceden hazırlamak kritik önem taşır. Araştırmalar, hazırlıklı müvekkillerin avukatlarıyla daha kısa sürede daha verimli kararlar aldığını göstermektedir.",
        },
        {
          heading: "SettleLens ile Hazırlık",
          body: "SettleLens'te varlık ve borç envanterinizi doldurduktan sonra, farklı anlaşma senaryolarını modelleyebilir ve Lawyer Edition ile avukata hazır PDF + Excel çıktısı alabilirsiniz. Bu çıktıyı görüşmeye götürerek tartışmayı somut rakamlara taşırsınız.",
        },
        {
          heading: "Avukata Soracağınız Sorular",
          body: "Finansal tablonuzu netleştirdikten sonra avukata şunları sorabilirsiniz: Bu senaryoda ipotek borcunu kim üstlenmeli? Nafaka talebim için güçlü bir argümanım var mı? Emeklilik hesabımın paylaşımı nasıl işler? SettleLens, bu soruları oluşturmanıza da yardımcı olur.",
        },
      ],
      faq: [
        { q: "İlk görüşmede avukattan ne beklenmeli?", a: "İlk görüşmede avukat genellikle durumunuzu değerlendirir, hukuki seçeneklerinizi açıklar ve olası süreci anlatır. Finansal verilerinizi hazır götürmeniz bu değerlendirmeyi çok daha verimli hale getirir." },
        { q: "SettleLens çıktısını avukata direkt verebilir miyim?", a: "Evet. SettleLens'in Lawyer Edition PDF ve Excel çıktısı avukata hazır finansal özet olarak tasarlanmıştır. Hukuki belge değildir — ancak düzenli ve sayfalı yapısıyla avukatın kolayca başvurabileceği bir referans sunar." },
      ],
      ctaText: "Avukat Hazırlığıma Başla",
      ctaHref: "/tr/register",
      ctaSub: "Ücretsiz başlayın — kredi kartı gerekmez",
      disclaimer: "SettleLens finansal modelleme sunar; hukuki tavsiye vermez. Boşanma süreci bireysel koşullara göre farklılık gösterir. Nitelikli bir aile hukuku avukatıyla çalışmanızı öneririz.",
    }} />
  );
}
