import { TR_CITIES } from "@/lib/seo-locations";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ sehir: string }>;
};

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return TR_CITIES.map((c) => ({ sehir: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sehir } = await params;
  const city = TR_CITIES.find((c) => c.slug === sehir);
  if (!city) return {};

  return {
    title: `${city.name} Boşanma Mal Paylaşımı Hesaplama | SettleLens`,
    description: `${city.name}'da boşanmada mal paylaşımı nasıl yapılır? TMK 218-241 katılma alacağı hesaplama, nafaka tahmini ve 10 yıllık finansal projeksiyon. Ücretsiz analiz.`,
    alternates: {
      canonical: `https://settlelens.com/tr/bosanma-hesaplama/${sehir}`,
    },
  };
}

export default async function TRCitySEOPage({ params }: Props) {
  const { sehir } = await params;
  const city = TR_CITIES.find((c) => c.slug === sehir);
  if (!city) notFound();

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `${city.name}'da Boşanmada Mal Paylaşımı Nasıl Hesaplanır?`,
    description: `TMK 218-241 kapsamında edinilmiş mallara katılma rejimi uygulanarak ${city.name}'da boşanma mal paylaşımının adım adım hesaplanması.`,
    step: [
      { "@type": "HowToStep", name: "Varlıkları girin", text: "Evlilik süresince edinilen tüm varlıkları (ev, tasarruf, emeklilik) listeleyin." },
      { "@type": "HowToStep", name: "Borçları girin", text: "Ortak borçları ve bireysel borçları kaydedin." },
      { "@type": "HowToStep", name: "Geliri girin", text: "Her iki eşin yıllık net gelirini girin." },
      { "@type": "HowToStep", name: "Senaryoları karşılaştırın", text: "Evi kimin alacağını, nafakayı ve emeklilik paylaşımını farklı senaryolarla modelleyin." },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      <div className="mx-auto max-w-3xl px-4 py-12">
        <nav className="mb-6 text-sm text-[#8B7355]">
          <Link href="/tr" className="hover:text-[#C8973A]">Ana Sayfa</Link>
          {" / "}
          <span>Boşanma Hesaplama – {city.name}</span>
        </nav>

        <h1
          className="text-3xl font-bold text-[#1C2B3A] leading-tight sm:text-4xl"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          {city.name} Boşanma Mal Paylaşımı Hesaplama
        </h1>

        <div className="mt-3 inline-block rounded-full bg-[#F7F3EE] px-3 py-1 text-sm text-[#2E4D6B]">
          🇹🇷 TMK 218-241 – Edinilmiş Mallara Katılma
        </div>

        <div className="mt-8 prose prose-slate max-w-none">
          <h2>{city.name}'da Boşanmada Mal Paylaşımı Nasıl Çalışır?</h2>
          <p>
            Türkiye'de tüm illerde – {city.name} dahil – 1 Ocak 2002'den itibaren <strong>edinilmiş mallara katılma rejimi</strong> (TMK 218-241) geçerlidir. Bu rejim, evlilik süresince her eşin edindiği malların net artık değerinin eşit olarak paylaşılmasını öngörür.
          </p>
          <p>
            Evlilik öncesi sahip olunan mallar, miras yoluyla ya da bağış olarak alınanlar kişisel mal sayılır ve paylaşıma dahil edilmez.
          </p>

          <h2>Katılma Alacağı Hesaplama Formülü</h2>
          <ol>
            <li><strong>Her eşin edinilmiş mal değeri</strong> = Güncel değer − Evlilik öncesi değer − Kişisel katkılar</li>
            <li><strong>Net artık</strong> = Edinilmiş mal değeri − Borçlar</li>
            <li><strong>Katılma alacağı</strong> = (Eş A net artık − Eş B net artık) ÷ 2</li>
          </ol>

          <h2>Hangi Varlıklar Paylaşıma Girer?</h2>
          <ul>
            <li>Evlilik süresince kazanılan maaş ve gelirler</li>
            <li>Ortak satın alınan taşınmazlar</li>
            <li>Evlilik döneminde biriktirilen tasarruflar ve yatırımlar</li>
            <li>İşyeri ve şirket hisseleri (evlilik döneminde edinilen)</li>
            <li>Emeklilik hesaplarına evlilik döneminde yapılan katkılar</li>
          </ul>

          <h2>{city.name}'da Nafaka</h2>
          <p>
            Türk Medeni Kanunu uyarınca {city.name} mahkemeleri, boşanma sonrasında yoksulluğa düşecek olan eşe yoksulluk nafakası bağlayabilir. Nafaka miktarı ve süresi, evliliğin uzunluğu, eşlerin geliri ve yaşam standardı gibi faktörlere göre belirlenir.
          </p>

          <h2>SettleLens ile {city.name} Boşanmasını Nasıl Modellersiniz?</h2>
          <ol>
            <li><strong>Varlıklarınızı girin</strong> – ev, banka hesapları, araçlar, emeklilik</li>
            <li><strong>Borçlarınızı girin</strong> – ipotek, kredi kartları, bireysel krediler</li>
            <li><strong>Gelir bilgisi</strong> – her iki eşin yıllık net geliri</li>
            <li><strong>Senaryolar oluşturun</strong> – evi kim alacak, nafaka tutarı, emeklilik payı</li>
            <li><strong>10 yıllık projeksiyon</strong> – her senaryonun uzun vadeli finansal etkisini görün</li>
          </ol>
        </div>

        <div className="mt-8 rounded-xl bg-[#1C2B3A] p-8 text-center text-white">
          <h2
            className="text-xl font-bold"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            {city.name} boşanma senaryonuzu ücretsiz modelleyin
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Müzakere masasına oturmadan önce finansal tablonuzu görün.
          </p>
          <Link
            href="/tr/register"
            className="mt-4 inline-block rounded-lg bg-[#C8973A] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            Ücretsiz Analizi Başlat →
          </Link>
        </div>

        <p className="mt-6 text-xs text-center text-[#8B7355]">
          SettleLens finansal modelleme aracıdır; hukuki tavsiye vermez. Karar vermeden önce aile hukuku alanında uzman bir avukata danışınız.
        </p>
      </div>
    </>
  );
}
