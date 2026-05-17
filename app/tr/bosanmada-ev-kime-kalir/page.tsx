import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "Boşanmada Ev Kime Kalır? Finansal Analiz | SettleLens",
  description: "Boşanmada evi kim almalı? Evi almanın, satmanın veya eşe devretmenin 10 yıllık finansal etkisini yan yana görün. TMK 218-241 kapsamında analiz.",
};

export default function Page() {
  return (
    <SeoLandingTemplate config={{
      locale: "tr",
      badge: "Ev Senaryosu Analizi",
      headline: "Boşanmada Evi Kim Almalı? Her Senaryonun Mali Etkisini Karşılaştırın",
      intro: "Ev, çoğu boşanmada en büyük ve en duygusal karar olmaya devam eder. SettleLens, üç temel senaryoyu finansal olarak modelleyerek size rakamları gösterir — kararı siz verirsiniz.",
      sections: [
        {
          heading: "Senaryo 1: Evi Ben Alıyorum",
          body: "Evi almanız durumunda net öz varlığınız evin değeri kadar artar, ancak aylık ipotek yükü devam eder. SettleLens, gelir seviyenize ve diğer borçlarınıza göre bu yükü taşıyıp taşıyamayacağınızı 10 yıllık nakit akışı projeksiyonuyla gösterir.",
        },
        {
          heading: "Senaryo 2: Ev Eşimde Kalıyor",
          body: "Evi eşinize devretmeniz durumunda elde edeceğiniz dengeleme ödemesi veya diğer varlıklardan aldığınız pay, uzun vadeli net servetinizi nasıl etkiler? Bu senaryo kısa vadede nakit yaratabilir, ancak konut maliyetleri ve kira yükünü de beraberinde getirir.",
        },
        {
          heading: "Senaryo 3: Evi Satıyoruz",
          body: "Ortak satış, her iki tarafın da ev öz varlığından pay alması anlamına gelir. Satış geliri borçları kapattıktan sonra kalan miktarın nasıl paylaşıldığı ve bu paranın yatırıma dönüştürülmesi halinde 10 yıllık etkisi SettleLens ile modellenebilir.",
        },
        {
          heading: "İpoteğiniz Varsa Dikkat",
          body: "İpotek borcu olan bir evi devralan taraf, gelir yetersizse ciddi finansal baskıyla karşılaşabilir. SettleLens, ipotek bakiyenizi ve aylık ödemenizi hesaba katarak her senaryonun sürdürülebilirliğini analiz eder.",
        },
      ],
      faq: [
        { q: "Ev değeri nasıl belirlenir?", a: "SettleLens'e piyasa değerini kullanıcı beyanı olarak girersiniz. Resmi süreçlerde bağımsız gayrimenkul değerleme raporu gerekebilir." },
        { q: "Birlikte ipotek borcumuz var, kim öder?", a: "İpotek borcu kime ait olacağı müzakereye açıktır. SettleLens, her tarafın borcu üstlenmesi halinde nakit akışını ayrı ayrı projekte eder." },
      ],
      ctaText: "Ev Senaryolarımı Karşılaştır",
      ctaHref: "/tr/register",
      ctaSub: "Ücretsiz başlayın — kredi kartı gerekmez",
      disclaimer: "SettleLens finansal modelleme aracıdır, hukuki tavsiye vermez. Ev paylaşımı kararları için nitelikli bir aile hukuku avukatıyla çalışmanızı öneririz.",
    }} />
  );
}
