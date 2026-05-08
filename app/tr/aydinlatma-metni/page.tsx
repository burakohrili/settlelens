import { LegalPageLayout } from "@/components/layout/LegalPageLayout";

export default function KVKKPage() {
  return (
    <LegalPageLayout title="KVKK Aydınlatma Metni" lastUpdated="Mayıs 2026">
      <h2>Veri Sorumlusu</h2>
      <p>
        SettleLens — <a href="mailto:privacy@settlelens.com">privacy@settlelens.com</a>
      </p>

      <h2>İşlenen Kişisel Veriler</h2>
      <ul>
        <li><strong>Kimlik verileri:</strong> Ad, e-posta adresi</li>
        <li><strong>Finansal veriler:</strong> Varlık, borç, gelir bilgileri (kullanıcı tarafından girilir)</li>
        <li><strong>İşlem verileri:</strong> Oluşturulan senaryolar, analizler, raporlar</li>
        <li><strong>Kullanım verileri:</strong> Analitik veriler (onay ile)</li>
      </ul>

      <h2>Kişisel Verilerin İşlenme Amaçları</h2>
      <ul>
        <li>Hizmetin sunulması ve kullanıcı hesabının yönetilmesi</li>
        <li>Finansal senaryo analizi ve rapor oluşturma</li>
        <li>Ödeme işlemlerinin gerçekleştirilmesi</li>
        <li>Hizmet güvenliğinin sağlanması</li>
        <li>Yasal yükümlülüklerin yerine getirilmesi</li>
      </ul>

      <h2>Hukuki Dayanak</h2>
      <ul>
        <li>Sözleşmenin ifası (KVKK Md. 5/2-c)</li>
        <li>Meşru menfaat (KVKK Md. 5/2-f)</li>
        <li>Açık rıza — analitik ve pazarlama iletişimi için (KVKK Md. 5/1)</li>
      </ul>

      <h2>Kişisel Verilerin Aktarımı</h2>
      <p><strong>Yurt içi:</strong> Yetkili kamu kurumlarına yasal zorunluluk halinde.</p>
      <p>
        <strong>Yurt dışı:</strong> Supabase (veritabanı, AB sunucuları), Paddle (ödeme, BK/AB), Anthropic (Claude API, ABD — eğitim verisi olarak kullanılmaz), Resend (e-posta).
        Aktarımlar KVKK Madde 9 kapsamında gerçekleştirilmektedir.
      </p>

      <h2>Kişisel Veri Saklama Süresi</h2>
      <ul>
        <li>Hesap aktifken finansal veriler saklanır.</li>
        <li>Hesap silme talebinden itibaren 30 gün içinde kalıcı olarak silinir.</li>
        <li>Denetim logları 2 yıl saklanır (kişisel veri içermez).</li>
      </ul>

      <h2>KVKK Madde 11 Kapsamındaki Haklarınız</h2>
      <ul>
        <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
        <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme</li>
        <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
        <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
        <li>Eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme</li>
        <li>Kişisel verilerinizin silinmesini veya yok edilmesini isteme</li>
        <li>Uğradığınız zararın giderilmesini talep etme</li>
      </ul>

      <h2>Başvuru Yöntemi</h2>
      <p>
        Haklarınızı kullanmak için: <a href="mailto:privacy@settlelens.com">privacy@settlelens.com</a>
        <br />
        Başvurular 30 gün içinde yanıtlanır.
      </p>
    </LegalPageLayout>
  );
}
