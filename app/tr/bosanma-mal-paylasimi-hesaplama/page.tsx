import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata = {
  title: "Boşanmada Mal Paylaşımı Hesaplama | SettleLens",
  description: "Boşanmada mal paylaşımının finansal etkisini modelleyin. TMK 218-241 Edinilmiş Mallara Katılma Rejimine göre varlık ve borç dağılımınızı analiz edin.",
};

export default function Page() {
  return (
    <SeoLandingTemplate config={{
      locale: "tr",
      badge: "Mal Paylaşımı Analizi",
      headline: "Boşanmada Mal Paylaşımının Finansal Etkisini Görün",
      intro: "Türkiye'de boşanmada mal paylaşımı TMK Madde 218-241 kapsamında Edinilmiş Mallara Katılma Rejimine göre belirlenir. SettleLens, evlilik süresinde edinilen varlıkların eşler arasında nasıl paylaşılabileceğini finansal senaryo olarak modeller.",
      sections: [
        {
          heading: "Edinilmiş Mallara Katılma Rejimi Nedir?",
          body: "TMK 218-241 uyarınca, evlilik birliği süresince edinilen varlıklar (edinilmiş mallar) eşler arasında eşit olarak paylaşılır. Evlilik öncesi edinilen veya miras yoluyla gelen kişisel mallar bu hesaplamanın dışında tutulur. SettleLens, hangi varlığınızın edinilmiş mal, hangisinin kişisel mal sayıldığını kategorize etmenize yardımcı olur.",
        },
        {
          heading: "Hangi Varlıklar Paylaşıma Dahil Edilir?",
          body: "Evlilik birliği süresince elde edilen maaş, iş gelirleri, yatırımlar, birlikte satın alınan gayrimenkuller ve araçlar paylaşıma dahildir. Evlilik öncesi sahip olunan mülkler, miras ve kişisel bağışlar ise genellikle kişisel mal sayılır. SettleLens, her varlığı doğru kategoriye koyarak net artık değerinizi hesaplar.",
        },
        {
          heading: "Nafaka ve Diğer Ödemeler",
          body: "Mal paylaşımına ek olarak, mahkemeler yoksulluk nafakası (TMK 175) ve çocuk nafakası (TMK 182) talep edilmesine hükmedebilir. SettleLens, bu ödemelerin aylık nakit akışınız ve 10 yıllık net servetiniz üzerindeki etkisini yan yana senaryo olarak modelleyebilir.",
        },
        {
          heading: "Avukatınızdan Önce Tabloyu Görün",
          body: "SettleLens bir hukuki tavsiye aracı değildir. Ancak avukatınızla görüşmeden önce finansal tablonuzu netleştirmenizi sağlar — böylece görüşme sürenizi strateji tartışmasına harcarsınız, temel rakamları bulmaya değil.",
        },
      ],
      faq: [
        { q: "SettleLens mal paylaşım miktarını kesin olarak hesaplar mı?", a: "Hayır. SettleLens finansal modelleme sunar. Gerçek paylaşım miktarı mahkeme kararına, avukat müzakeresine ve varlıkların doğrulanmasına bağlıdır. SettleLens bu sürece hazırlık için tasarlanmıştır." },
        { q: "Kişisel mallarımı sisteme girmem şart mı?", a: "Hayır. Yalnızca edinilmiş mallarınızı girerek analiz yaptırabilirsiniz. Kişisel mallarınızı girmek isterseniz, SettleLens bunları hesaplamadan ayrı tutar." },
        { q: "Yüksek değerli gayrimenkulüm varsa ne yapmalıyım?", a: "Gayrimenkulün mevcut piyasa değerini kullanıcı beyanı olarak girebilirsiniz. Karmaşık varlık değerlemelerinde bağımsız eksper raporu gerekebilir — SettleLens bunu raporunuzda hatırlatır." },
      ],
      ctaText: "Ücretsiz Analiz Başlat",
      ctaHref: "/tr/register",
      ctaSub: "Kredi kartı gerekmez · Veriler şifreli",
      disclaimer: "SettleLens yalnızca bilgilendirme amaçlı finansal modelleme sunar. TMK hükümleri ve bireysel koşullar farklılık gösterebilir. Herhangi bir karar vermeden önce nitelikli bir aile hukuku avukatına danışın.",
    }} />
  );
}
