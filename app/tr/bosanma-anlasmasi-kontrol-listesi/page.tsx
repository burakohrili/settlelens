import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "Boşanma Anlaşması Kontrol Listesi | SettleLens",
  description: "Boşanma anlaşması imzalamadan önce kontrol etmeniz gereken finansal kalemler. Varlık, borç, nafaka ve emeklilik haklarınızı gözden geçirin.",
};

export default function Page() {
  return (
    <SeoLandingTemplate config={{
      locale: "tr",
      badge: "Kontrol Listesi",
      headline: "Boşanma Anlaşması İmzalamadan Önce Kontrol Edin",
      intro: "Bir boşanma anlaşması onlarca finansal kalemi kapsar. İmzalamadan önce aşağıdaki maddeleri gözden geçirin — her birinin uzun vadeli mali etkisini anlamak, daha bilinçli bir müzakere sürdürmenizi sağlar.",
      checklist: [
        "Ev ve diğer gayrimenkullerin güncel piyasa değeri belirlendi mi?",
        "Ortak banka hesapları ve yatırım hesapları listelendi mi?",
        "Evlilik öncesi ve sonrası edinilen varlıklar ayrıştırıldı mı? (Edinilmiş mal / Kişisel mal)",
        "Araç, tekne, tatil evi gibi taşınır değerler envantere alındı mı?",
        "Kredi kartı, ipotek, kişisel kredi gibi ortak borçların kime kalacağı netleştirildi mi?",
        "Yoksulluk nafakası tutarı ve süresi müzakere edildi mi?",
        "Çocuk nafakasının miktarı ve ödeme takvimi belirlendi mi?",
        "Emeklilik hesapları (BES, SGK hakkı) paylaşıma dahil edildi mi?",
        "Şirket payı veya işletme değeri varsa bağımsız değerleme yapıldı mı?",
        "Kripto varlıklar veya dijital varlıklar listelendi mi?",
        "10 yıllık nakit akışı projeksiyonu yapıldı mı?",
        "Anlaşmanın vergi etkileri (gayrimenkul devir vergisi vb.) hesaplandı mı?",
      ],
      sections: [
        {
          heading: "Neden Bu Liste Önemli?",
          body: "Boşanma anlaşmaları genellikle geri alınamaz niteliktedir. Gözden kaçan bir varlık veya yanlış hesaplanan bir nafaka tutarı, on yıllar boyunca finansal dengenizi etkileyebilir. SettleLens, bu kalemlerin her birini sistematik olarak girmenize ve anlık net servet etkisini görmenize olanak tanır.",
        },
        {
          heading: "Avukatınızla Daha Verimli Çalışın",
          body: "Bu listeyi SettleLens'te tamamlamanız durumunda, avukatınızla görüşmeye rakamlarla hazır gelirsiniz. Avukatın temel veri toplamak yerine stratejik değerlendirme yapmasını sağlarsınız — bu hem süreyi hem de maliyeti azaltır.",
        },
      ],
      faq: [
        { q: "Bu listeyi SettleLens'te nasıl kullanabilirim?", a: "SettleLens'te ücretsiz hesap oluşturarak varlık ve borç envanteri bölümünü doldurabilirsiniz. Her kalem girildikçe net servetiniz anlık olarak güncellenir." },
        { q: "Anlaşmada gözden kaçırdığım bir varlık olursa ne olur?", a: "Türk hukukunda anlaşma sonrası ortaya çıkan gizlenen varlıklar için hukuki başvuru yolları mevcuttur. Bu nedenle kapsamlı bir envanter oluşturmak kritik önem taşır." },
      ],
      ctaText: "Envanterimi Oluştur",
      ctaHref: "/tr/register",
      ctaSub: "Ücretsiz başlayın — kredi kartı gerekmez",
      disclaimer: "SettleLens finansal modelleme sunar; hukuki tavsiye vermez. Her durum farklıdır. Boşanma anlaşmanızı imzalamadan önce nitelikli bir aile hukuku avukatıyla çalışın.",
    }} />
  );
}
