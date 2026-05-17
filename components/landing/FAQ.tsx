"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

type FAQItem = { q: string; a: string };

const FAQ_DATA: Record<string, { title: string; items: FAQItem[] }> = {
  en: {
    title: "Frequently Asked Questions",
    items: [
      {
        q: "Which plan is right for me?",
        a: "If you have a single decision to make — one offer to evaluate, one house scenario to model — the Clarified plan (one-time) is usually enough. If you're in an ongoing process with multiple offers coming in over months, Strategist gives you unlimited scenarios. Not sure? Start free and upgrade when you're ready.",
      },
      {
        q: "What happens when my access period ends?",
        a: "Your data stays safe in your account. After the access period you move to the free Discovery level — you can still view your inventory and previously generated summaries, but running new AI analyses requires upgrading again.",
      },
      {
        q: "What is your refund policy?",
        a: "If SettleLens isn't what you expected, contact support@settlelens.com within 7 days of purchase and we'll refund you in full. No questions asked.",
      },
      {
        q: "Will my attorney trust the export?",
        a: "The PDF and Excel outputs are clearly labeled as financial modeling tools, not legal documents. Most attorneys appreciate having organized, numbered figures to work from — it saves them (and you) time. The output states our methodology and includes the confidence level for each jurisdiction.",
      },
      {
        q: "Is my financial data secure?",
        a: "Yes. All data is encrypted at rest (AES-256) and in transit (TLS 1.3). Each user can only access their own records — enforced at the database level (Row Level Security). We never sell or share your data with third parties. You can export or permanently delete everything at any time.",
      },
      {
        q: "Does SettleLens replace a lawyer?",
        a: "No. SettleLens is a financial preparation tool. It helps you understand the numbers before you negotiate — so your time with your attorney is spent on strategy, not on basic arithmetic. We always recommend working with a qualified family law attorney for any binding decision.",
      },
      {
        q: "What does the free plan include?",
        a: "The free plan lets you build a complete asset and debt inventory, see your net worth summary, and run a basic house scenario (who keeps the house, who pays what). No AI analysis, no 10-year projection — but enough to understand where you stand before committing to a paid plan.",
      },
      {
        q: "Can I use SettleLens for a contested divorce?",
        a: "Yes. The financial modeling works regardless of how contested the process is. That said, if your situation involves hidden assets, offshore accounts, domestic violence, or complex business ownership, we show a high-risk notice and recommend professional legal support first.",
      },
    ],
  },
  tr: {
    title: "Sık Sorulan Sorular",
    items: [
      {
        q: "Hangi paketi seçmeliyim?",
        a: "Tek bir karar verecekseniz — bir teklifi değerlendirmek ya da bir ev senaryosu modellemek — tek seferlik Clarified planı genellikle yeterlidir. Aylarca sürecek, birden fazla teklif gelecek bir süreçteyseniz Strategist sınırsız senaryo sunar. Emin değilseniz ücretsiz başlayın, hazır olduğunuzda geçiş yapın.",
      },
      {
        q: "Erişim sürem bitince ne olur?",
        a: "Verileriniz hesabınızda güvende kalır. Süre sona erdiğinde ücretsiz Discovery seviyesine düşersiniz — envanterinizi ve önceki özetleri görüntüleyebilirsiniz, yeni AI analizi için tekrar geçiş yapmanız gerekir.",
      },
      {
        q: "İade politikanız ne?",
        a: "SettleLens beklediğiniz gibi değilse, satın alma tarihinden itibaren 7 gün içinde support@settlelens.com adresine yazın; soru sormadan tam iade yaparız.",
      },
      {
        q: "Avukatım Excel çıktısına güvenir mi?",
        a: "PDF ve Excel çıktıları, hukuki belge değil finansal modelleme aracı olarak açıkça etiketlenir. Çoğu avukat, organize ve numaralandırılmış rakamlarla çalışmayı tercih eder — hem size hem avukata zaman kazandırır. Çıktıda metodoloji ve her yargı alanı için güven düzeyi belirtilir.",
      },
      {
        q: "Finansal verilerim güvende mi?",
        a: "Evet. Tüm veriler beklemedeyken (AES-256) ve iletimde (TLS 1.3) şifrelenir. Her kullanıcı yalnızca kendi kayıtlarına erişebilir — bu veritabanı düzeyinde zorlanır (Row Level Security). Verilerinizi asla satmaz veya üçüncü taraflarla paylaşmayız. İstediğiniz zaman tüm verilerinizi dışa aktarabilir veya kalıcı olarak silebilirsiniz.",
      },
      {
        q: "SettleLens avukatın yerini alır mı?",
        a: "Hayır. SettleLens bir finansal hazırlık aracıdır. Müzakere etmeden önce rakamları anlamanıza yardımcı olur — avukatınızla geçirdiğiniz süre temel aritmetik yerine strateji üzerine harcanır. Bağlayıcı her karar için nitelikli bir aile hukuku avukatıyla çalışmanızı her zaman öneririz.",
      },
      {
        q: "Ücretsiz plan ne içeriyor?",
        a: "Ücretsiz plan; tam varlık ve borç envanteri oluşturmanıza, net varlık özetinizi görmenize ve basit bir ev senaryosu çalıştırmanıza (evi kim alacak, kim ne ödeyecek) olanak tanır. AI analizi ve 10 yıllık projeksiyon yok — ama ücretli plana geçmeden önce durumunuzu anlamak için yeterli.",
      },
      {
        q: "Çekişmeli boşanmada SettleLens işe yarar mı?",
        a: "Evet. Sürecin ne kadar tartışmalı olduğundan bağımsız olarak finansal modelleme çalışır. Ancak durumunuz gizlenmiş varlıklar, yurt dışı hesaplar, ev içi şiddet veya karmaşık iş ortaklığı içeriyorsa yüksek risk bildirimi gösterir ve önce profesyonel hukuki destek almanızı öneririz.",
      },
    ],
  },
  de: {
    title: "Häufige Fragen",
    items: [
      {
        q: "Welcher Plan ist der richtige für mich?",
        a: "Wenn Sie eine einzige Entscheidung treffen müssen — ein Angebot bewerten oder ein Haushalts-Szenario modellieren — reicht der Clarified-Plan (einmalig) in der Regel aus. Wenn Sie sich in einem laufenden Prozess befinden, bei dem über Monate mehrere Angebote eingehen, bietet Strategist unbegrenzte Szenarien. Unsicher? Starten Sie kostenlos und wechseln Sie, wenn Sie bereit sind.",
      },
      {
        q: "Was passiert, wenn mein Zugangszeitraum abläuft?",
        a: "Ihre Daten bleiben sicher in Ihrem Konto. Nach dem Ablauf wechseln Sie zur kostenlosen Discovery-Stufe — Sie können Ihr Inventar und frühere Zusammenfassungen weiterhin einsehen, aber für neue KI-Analysen ist ein erneutes Upgrade erforderlich.",
      },
      {
        q: "Wie lautet Ihre Rückgaberichtlinie?",
        a: "Wenn SettleLens nicht Ihren Erwartungen entspricht, schreiben Sie uns innerhalb von 7 Tagen nach dem Kauf an support@settlelens.com — wir erstatten Ihnen den vollen Betrag, ohne Fragen zu stellen.",
      },
      {
        q: "Vertraut mein Anwalt dem Export?",
        a: "Die PDF- und Excel-Ausgaben sind klar als Finanzmodellierungswerkzeuge — nicht als Rechtsdokumente — gekennzeichnet. Die meisten Anwälte schätzen es, mit geordneten, nummerierten Zahlen zu arbeiten — das spart ihnen (und Ihnen) Zeit. Die Ausgabe enthält unsere Methodik und das Konfidenzniveau für jede Rechtsordnung.",
      },
      {
        q: "Sind meine Finanzdaten sicher?",
        a: "Ja. Alle Daten werden im Ruhezustand (AES-256) und während der Übertragung (TLS 1.3) verschlüsselt. Jeder Nutzer kann nur auf seine eigenen Daten zugreifen — auf Datenbankebene erzwungen (Row Level Security). Wir verkaufen oder teilen Ihre Daten niemals mit Dritten. Sie können alle Ihre Daten jederzeit exportieren oder dauerhaft löschen.",
      },
      {
        q: "Ersetzt SettleLens einen Anwalt?",
        a: "Nein. SettleLens ist ein finanzielles Vorbereitungswerkzeug. Es hilft Ihnen, die Zahlen zu verstehen, bevor Sie verhandeln — damit Ihre Zeit mit Ihrem Anwalt für Strategie genutzt wird, nicht für einfache Berechnungen. Wir empfehlen immer, bei jeder verbindlichen Entscheidung mit einem qualifizierten Familienrechtsanwalt zusammenzuarbeiten.",
      },
      {
        q: "Was ist im kostenlosen Plan enthalten?",
        a: "Der kostenlose Plan ermöglicht es Ihnen, ein vollständiges Vermögens- und Schuldeninventar zu erstellen, Ihre Nettovermögensübersicht einzusehen und ein grundlegendes Haushaltsszenario auszuführen. Keine KI-Analyse, keine 10-Jahres-Projektion — aber genug, um Ihre Situation zu verstehen, bevor Sie zu einem bezahlten Plan wechseln.",
      },
      {
        q: "Kann ich SettleLens bei einem streitigen Scheidungsverfahren nutzen?",
        a: "Ja. Die Finanzmodellierung funktioniert unabhängig davon, wie strittig der Prozess ist. Wenn Ihre Situation versteckte Vermögenswerte, Offshore-Konten, häusliche Gewalt oder komplexe Unternehmensbeteiligungen umfasst, zeigen wir einen Hochrisikohinweis an und empfehlen zunächst professionelle rechtliche Unterstützung.",
      },
    ],
  },
  fr: {
    title: "Questions fréquentes",
    items: [
      {
        q: "Quelle formule me convient ?",
        a: "Si vous avez une seule décision à prendre — évaluer une offre, modéliser un scénario immobilier — la formule Clarified (paiement unique) suffit généralement. Si vous êtes dans un processus long avec plusieurs offres sur des mois, Strategist offre des scénarios illimités. Pas sûr(e) ? Commencez gratuitement et passez à l'offre supérieure quand vous êtes prêt(e).",
      },
      {
        q: "Que se passe-t-il à l'expiration de ma période d'accès ?",
        a: "Vos données restent en sécurité dans votre compte. Après la période d'accès, vous repassez au niveau Discovery gratuit — vous pouvez toujours consulter votre inventaire et vos résumés précédents, mais une nouvelle analyse IA nécessite un renouvellement.",
      },
      {
        q: "Quelle est votre politique de remboursement ?",
        a: "Si SettleLens ne répond pas à vos attentes, contactez support@settlelens.com dans les 7 jours suivant votre achat — nous vous remboursons intégralement, sans question.",
      },
      {
        q: "Mon avocat fera-t-il confiance à l'export ?",
        a: "Les sorties PDF et Excel sont clairement identifiées comme des outils de modélisation financière, pas des documents juridiques. La plupart des avocats apprécient de travailler avec des chiffres organisés et numérotés — cela leur fait (et vous fait) gagner du temps. La sortie indique notre méthodologie et le niveau de confiance par juridiction.",
      },
      {
        q: "Mes données financières sont-elles sécurisées ?",
        a: "Oui. Toutes les données sont chiffrées au repos (AES-256) et en transit (TLS 1.3). Chaque utilisateur n'accède qu'à ses propres données — appliqué au niveau de la base de données (Row Level Security). Nous ne vendons ni ne partageons jamais vos données. Vous pouvez exporter ou supprimer définitivement toutes vos données à tout moment.",
      },
      {
        q: "SettleLens remplace-t-il un avocat ?",
        a: "Non. SettleLens est un outil de préparation financière. Il vous aide à comprendre les chiffres avant de négocier — pour que votre temps avec votre avocat soit consacré à la stratégie, pas à l'arithmétique de base. Nous recommandons toujours de travailler avec un avocat en droit de la famille qualifié pour toute décision contraignante.",
      },
      {
        q: "Qu'est-ce que la formule gratuite inclut ?",
        a: "La formule gratuite vous permet de créer un inventaire complet d'actifs et de dettes, de voir votre résumé de patrimoine net, et de simuler un scénario immobilier de base. Pas d'analyse IA, pas de projection sur 10 ans — mais suffisant pour comprendre votre situation avant de passer à une formule payante.",
      },
      {
        q: "Puis-je utiliser SettleLens pour un divorce contentieux ?",
        a: "Oui. La modélisation financière fonctionne quelle que soit la conflictualité du processus. Cependant, si votre situation implique des actifs cachés, des comptes offshore, des violences conjugales ou une propriété d'entreprise complexe, nous affichons un avertissement de risque élevé et recommandons d'abord un accompagnement juridique professionnel.",
      },
    ],
  },
  es: {
    title: "Preguntas frecuentes",
    items: [
      {
        q: "¿Qué plan me conviene?",
        a: "Si tienes una sola decisión que tomar — evaluar una oferta o modelar un escenario de vivienda — el plan Clarified (pago único) suele ser suficiente. Si estás en un proceso largo con varias ofertas durante meses, Strategist ofrece escenarios ilimitados. ¿No estás seguro/a? Empieza gratis y haz el cambio cuando estés listo/a.",
      },
      {
        q: "¿Qué ocurre cuando expira mi período de acceso?",
        a: "Tus datos se mantienen seguros en tu cuenta. Tras el período de acceso pasas al nivel Discovery gratuito — puedes seguir viendo tu inventario y resúmenes anteriores, pero para nuevos análisis de IA necesitas volver a actualizar.",
      },
      {
        q: "¿Cuál es vuestra política de devolución?",
        a: "Si SettleLens no es lo que esperabas, escríbenos a support@settlelens.com en los 7 días siguientes a la compra y te devolvemos el importe completo sin preguntas.",
      },
      {
        q: "¿Confiará mi abogado/a en el archivo exportado?",
        a: "Los PDF y Excel están claramente identificados como herramientas de modelización financiera, no como documentos legales. La mayoría de abogados agradecen trabajar con cifras ordenadas y numeradas — les ahorra (y te ahorra) tiempo. El documento indica nuestra metodología y el nivel de confianza por jurisdicción.",
      },
      {
        q: "¿Están seguros mis datos financieros?",
        a: "Sí. Todos los datos están cifrados en reposo (AES-256) y en tránsito (TLS 1.3). Cada usuario solo accede a sus propios registros — aplicado a nivel de base de datos (Row Level Security). Nunca vendemos ni compartimos tus datos con terceros. Puedes exportar o eliminar permanentemente todos tus datos en cualquier momento.",
      },
      {
        q: "¿SettleLens sustituye a un abogado/a?",
        a: "No. SettleLens es una herramienta de preparación financiera. Te ayuda a entender los números antes de negociar — para que tu tiempo con tu abogado/a se dedique a la estrategia, no a la aritmética básica. Siempre recomendamos trabajar con un abogado/a de derecho de familia cualificado para cualquier decisión vinculante.",
      },
      {
        q: "¿Qué incluye el plan gratuito?",
        a: "El plan gratuito te permite crear un inventario completo de activos y deudas, ver tu resumen de patrimonio neto y ejecutar un escenario básico de vivienda. Sin análisis de IA, sin proyección a 10 años — pero suficiente para entender tu situación antes de comprometerte con un plan de pago.",
      },
      {
        q: "¿Puedo usar SettleLens en un divorcio contencioso?",
        a: "Sí. La modelización financiera funciona independientemente del nivel de conflicto. Sin embargo, si tu situación implica activos ocultos, cuentas offshore, violencia doméstica o participaciones empresariales complejas, mostramos un aviso de alto riesgo y recomendamos apoyo jurídico profesional antes de continuar.",
      },
    ],
  },
  ar: {
    title: "الأسئلة الشائعة",
    items: [
      {
        q: "أي خطة تناسبني؟",
        a: "إذا كان لديك قرار واحد فقط — تقييم عرض أو نمذجة سيناريو المسكن — فعادةً ما تكون خطة Clarified (دفعة واحدة) كافية. إذا كنت في عملية مستمرة مع عروض متعددة على مدى أشهر، فإن Strategist يوفر سيناريوهات غير محدودة.",
      },
      {
        q: "ماذا يحدث عند انتهاء مدة الوصول؟",
        a: "تبقى بياناتك آمنة في حسابك. بعد انتهاء المدة تنتقل إلى مستوى Discovery المجاني — يمكنك الاطلاع على مخزونك والملخصات السابقة، لكن التحليل بالذكاء الاصطناعي يتطلب ترقية جديدة.",
      },
      {
        q: "ما هي سياسة الاسترداد؟",
        a: "إذا لم يكن SettleLens ما توقعته، تواصل مع support@settlelens.com في غضون 7 أيام من الشراء وسنعيد المبلغ كاملاً دون أسئلة.",
      },
      {
        q: "هل ستثق المحكمة أو المحامي في التقرير المصدَّر؟",
        a: "ملفات PDF وExcel مُصنَّفة بوضوح كأدوات نمذجة مالية وليست وثائق قانونية. معظم المحامين يقدّرون العمل بأرقام منظمة — مما يوفر وقتهم ووقتك.",
      },
      {
        q: "هل بياناتي المالية آمنة؟",
        a: "نعم. جميع البيانات مشفّرة في وضع السكون (AES-256) وأثناء النقل (TLS 1.3). لا نبيع بياناتك ولا نشاركها مع أطراف ثالثة. يمكنك تصدير بياناتك أو حذفها نهائياً في أي وقت.",
      },
      {
        q: "هل يستبدل SettleLens محامياً؟",
        a: "لا. SettleLens أداة إعداد مالي. يساعدك على فهم الأرقام قبل التفاوض — حتى يُخصَّص وقتك مع محاميك للاستراتيجية لا للحسابات الأساسية. نوصي دائماً بالعمل مع محامٍ متخصص في قانون الأسرة لأي قرار ملزم.",
      },
      {
        q: "ماذا يشمل الخطة المجانية؟",
        a: "تتيح لك الخطة المجانية إنشاء قائمة جرد كاملة للأصول والديون، ورؤية ملخص صافي ثروتك، وتشغيل سيناريو مسكن أساسي. لا تحليل بالذكاء الاصطناعي ولا توقعات 10 سنوات — لكنها كافية لفهم وضعك.",
      },
      {
        q: "هل يمكنني استخدام SettleLens في الطلاق المتنازع عليه؟",
        a: "نعم. تعمل النمذجة المالية بصرف النظر عن مستوى النزاع. ومع ذلك، إذا تضمّن وضعك أصولاً مخفية أو حسابات خارجية أو عنفاً أسرياً، فسنعرض تحذير مخاطر عالية ونوصي بالحصول على دعم قانوني متخصص أولاً.",
      },
    ],
  },
};

export function FAQ() {
  const locale = useLocale();
  const data = FAQ_DATA[locale] ?? FAQ_DATA.en;
  const [open, setOpen] = useState<number | null>(null);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <section id="faq" className="bg-white py-24 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-[var(--navy)] text-center mb-12">
          {data.title}
        </h2>

        <div className="space-y-2">
          {data.items.map((item, i) => (
            <div
              key={i}
              className="border border-[var(--sand)] rounded-xl overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left font-ui text-sm font-medium text-[var(--navy)] hover:bg-[var(--cream)] transition-colors"
                aria-expanded={open === i}
              >
                <span>{item.q}</span>
                <ChevronDown
                  size={16}
                  className={`flex-shrink-0 ml-4 transition-transform ${open === i ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <div className="px-5 pb-5 pt-1 border-t border-[var(--sand)] bg-[var(--cream)]">
                      <p className="font-body text-sm text-[var(--brown)] leading-relaxed">
                        {item.a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center font-ui text-xs text-[var(--brown)]">
          {locale === "tr"
            ? "Başka sorunuz mu var? "
            : locale === "de"
            ? "Weitere Fragen? "
            : locale === "fr"
            ? "D'autres questions ? "
            : locale === "es"
            ? "¿Otras preguntas? "
            : locale === "ar"
            ? "أسئلة أخرى؟ "
            : "More questions? "}
          <a href={`/${locale}/contact`} className="text-[var(--slate)] underline underline-offset-2 hover:text-[var(--navy)]">
            {locale === "tr"
              ? "Bize yazın"
              : locale === "de"
              ? "Schreiben Sie uns"
              : locale === "fr"
              ? "Écrivez-nous"
              : locale === "es"
              ? "Escríbenos"
              : locale === "ar"
              ? "راسلنا"
              : "Contact us"}
          </a>
        </p>
      </div>
    </section>
  );
}
