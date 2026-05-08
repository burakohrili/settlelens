import { TR_CITIES } from "@/lib/seo-locations";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ sehir: string }>;
};

export function generateStaticParams() {
  return TR_CITIES.map((c) => ({ sehir: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sehir } = await params;
  const city = TR_CITIES.find((c) => c.slug === sehir);
  if (!city) return {};

  return {
    title: `${city.name} Boşanma Hesaplama — Mal Paylaşımı | SettleLens`,
    description: `${city.name}'da boşanmada mal paylaşımı nasıl yapılır? TMK 179 katılma alacağı hesaplama, nafaka tahmini ve 10 yıllık finansal projeksiyon. Ücretsiz analiz.`,
    alternates: {
      canonical: `https://settlelens.com/tr/bosanma-hesaplama-${sehir}`,
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
    name: `${city.name}'da boşanmada mal paylaşımı nasıl hesaplanır`,
    description: `TMK Madde 179 uyarınca ${city.name}'daki boşanma davalarında katılma alacağı hesaplama rehberi.`,
    step: [
      { "@type": "HowToStep", name: "Varlıklarınızı girin", text: "Ev, araç, banka hesapları ve emeklilik birikimlerini listeleyin." },
      { "@type": "HowToStep", name: "Borçları belirtin", text: "Konut kredisi, araç kredisi ve kredi kartı borçlarını ekleyin." },
      { "@type": "HowToStep", name: "Gelir bilgilerini girin", text: "Her iki eşin yıllık net gelirini nafaka tahmini için girin." },
      { "@type": "HowToStep", name: "Senaryoları karşılaştırın", text: "Evi tutmak, satmak veya eşe bırakmak gibi farklı senaryoların 10 yıllık etkisini görün." },
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
          <span>{city.name} Boşanma Hesaplama</span>
        </nav>

        <h1
          className="text-3xl font-bold text-[#1C2B3A] leading-tight sm:text-4xl"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          {city.name} Boşanma Mal Paylaşımı Hesaplama
        </h1>

        <div className="mt-3 inline-block rounded-full bg-[#F7F3EE] px-3 py-1 text-sm text-[#2E4D6B]">
          🇹🇷 TMK 179 — Edinilmiş Mallara Katılma Rejimi
        </div>

        <div className="mt-8 prose prose-slate max-w-none">
          <h2>Türkiye'de Boşanmada Mal Paylaşımı Nasıl Çalışır?</h2>
          <p>
            Türk Medeni Kanunu (TMK) Madde 179 uyarınca, boşanmada her eş diğer eşin evlilik süresinde edindiği malların yarısını talep edebilir. Bu kural <strong>edinilmiş mallara katılma rejimi</strong> olarak bilinir ve yasal mal rejimidir.
          </p>
          <p>
            {city.name}'daki aile mahkemeleri bu formülü uygular. Hesaplama şehirden şehire değişmez — ancak varlıkların değerlemesi (özellikle konut ve işyeri) yerel piyasa koşullarına göre farklılık gösterebilir.
          </p>

          <h2>Katılma Alacağı Nasıl Hesaplanır?</h2>
          <ol>
            <li>Her eşin <strong>net artık değeri</strong> hesaplanır (edinilmiş mallar eksi edinilmiş mal borçları)</li>
            <li>Her eş, diğer eşin net artık değerinin <strong>yarısını</strong> talep edebilir</li>
            <li>Daha yüksek net artık değere sahip eş, farkın yarısını öder</li>
          </ol>

          <h2>Hangi Mallar Paylaşıma Tabi?</h2>
          <ul>
            <li>Evlilik süresinde kazanılan maaş ve gelirler</li>
            <li>Evlilik süresinde satın alınan konut ve araçlar</li>
            <li>Evlilik süresinde biriktirilen banka mevduatları</li>
            <li>Evlilik süresinde edinilen hisse senedi ve yatırımlar</li>
            <li>Evlilik süresinde kurulan veya büyütülen işletmeler</li>
          </ul>

          <h2>Hangi Mallar Paylaşıma Tabi Değil?</h2>
          <ul>
            <li>Evlenmeden önce sahip olunan mallar</li>
            <li>Evlilik süresinde miras veya bağış yoluyla edinilen mallar</li>
            <li>Manevi tazminat alacakları</li>
          </ul>

          <h2>SettleLens ile {city.name} Boşanma Analizinizi Yapın</h2>
          <ol>
            <li><strong>Varlıklarınızı girin</strong> — ev, araç, banka, emeklilik ve yatırımlar</li>
            <li><strong>Borçlarınızı girin</strong> — konut kredisi, araç kredisi, kredi kartları</li>
            <li><strong>Gelir bilgilerini girin</strong> — nafaka tahmini için her iki eşin geliri</li>
            <li><strong>Senaryoları karşılaştırın</strong> — evi tutmak, satmak veya eşe bırakmak</li>
            <li><strong>10 yıllık projeksiyonu görün</strong> — her senaryonun uzun vadeli finansal etkisi</li>
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
            Müzakereye başlamadan önce farklı kararların finansal etkisini görün.
          </p>
          <Link
            href="/tr/register"
            className="mt-4 inline-block rounded-lg bg-[#C8973A] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            Ücretsiz Analiz Başlat →
          </Link>
        </div>

        <p className="mt-6 text-xs text-center text-[#8B7355]">
          SettleLens yalnızca finansal modelleme sunar. Hukuki tavsiye değildir. Karar vermeden önce nitelikli bir aile avukatına danışınız.
        </p>
      </div>
    </>
  );
}
