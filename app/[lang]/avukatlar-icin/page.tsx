import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Check, FileText, Users, BarChart3, Shield } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ lang: string }> };

const CONTENT: Record<string, {
  title: string; sub: string;
  badge: string; headline: string; body: string;
  benefits: { icon: string; title: string; desc: string }[];
  features: string[];
  cta: string; ctaSub: string;
  disclaimer: string;
}> = {
  en: {
    badge: "Lawyer Edition",
    title: "For Lawyers — SettleLens",
    sub: "Help clients arrive at every meeting financially prepared.",
    headline: "Your clients deserve clarity before they walk in.",
    body: "SettleLens is a financial scenario modeling tool. When clients complete their asset and debt inventory before meeting with you, your sessions can focus on strategy — not data collection. The Lawyer Edition generates attorney-ready financial summaries your clients can share with you directly.",
    benefits: [
      { icon: "BarChart3", title: "Organized financial picture", desc: "Assets, debts, income, and settlement scenarios — structured before the first meeting." },
      { icon: "FileText", title: "Attorney-ready PDF & Excel", desc: "Clearly labeled financial modeling output. Not a legal document — but organized for professional review." },
      { icon: "Users", title: "Scenario comparison", desc: "Clients can compare up to 3 settlement scenarios side by side, with 10-year projections." },
      { icon: "Shield", title: "Privacy by design", desc: "Client data is encrypted, row-level secured, and never shared with third parties. GDPR compliant." },
    ],
    features: [
      "Unlimited AI-powered scenario analyses",
      "Attorney-ready Excel + PDF export",
      "10-year financial projection with inflation modeling",
      "Evidence organizer for asset documentation",
      "Multi-scenario side-by-side comparison",
      "Priority support",
    ],
    cta: "Get Lawyer Edition",
    ctaSub: "$79/month · cancel anytime",
    disclaimer: "SettleLens provides financial modeling for informational purposes only. It is not a legal document and does not constitute legal advice. For professional legal guidance, always consult a qualified family law attorney.",
  },
  tr: {
    badge: "Lawyer Edition",
    title: "Avukatlar İçin — SettleLens",
    sub: "Müvekkillerinizin her görüşmeye finansal olarak hazır gelmesini sağlayın.",
    headline: "Müvekkilleriniz içeri adım atmadan önce tabloyu görsün.",
    body: "SettleLens bir finansal senaryo modelleme aracıdır. Müvekkilleriniz sizinle görüşmeden önce varlık ve borç envanterini tamamladığında, oturumlarınız veri toplamak yerine stratejiye odaklanabilir. Lawyer Edition, müvekkillerinizin doğrudan sizinle paylaşabileceği avukata hazır finansal özetler oluşturur.",
    benefits: [
      { icon: "BarChart3", title: "Düzenli finansal tablo", desc: "Varlıklar, borçlar, gelirler ve anlaşma senaryoları — ilk görüşmeden önce yapılandırılmış." },
      { icon: "FileText", title: "Avukata hazır PDF ve Excel", desc: "Açıkça etiketlenmiş finansal modelleme çıktısı. Hukuki belge değil — profesyonel inceleme için düzenlenmiş." },
      { icon: "Users", title: "Senaryo karşılaştırması", desc: "Müvekkiller 3'e kadar anlaşma senaryosunu 10 yıllık projeksiyon ile yan yana karşılaştırabilir." },
      { icon: "Shield", title: "Tasarımda gizlilik", desc: "Müvekkil verileri şifreli, satır düzeyinde güvenli ve üçüncü taraflarla hiçbir zaman paylaşılmaz. KVKK ve GDPR uyumlu." },
    ],
    features: [
      "Sınırsız AI destekli senaryo analizi",
      "Avukata hazır Excel ve PDF dışa aktarım",
      "Enflasyon modellemeli 10 yıllık finansal projeksiyon",
      "Varlık belgelemeleri için kanıt düzenleyici",
      "Çoklu senaryo yan yana karşılaştırma",
      "Öncelikli destek",
    ],
    cta: "Lawyer Edition Alın",
    ctaSub: "₺1.999/ay · istediğinizde iptal",
    disclaimer: "SettleLens yalnızca bilgilendirme amaçlı finansal modelleme sunar. Hukuki belge değildir ve hukuki tavsiye teşkil etmez. Profesyonel hukuki rehberlik için nitelikli bir aile hukuku avukatına başvurun.",
  },
  de: {
    badge: "Lawyer Edition",
    title: "Für Anwälte — SettleLens",
    sub: "Helfen Sie Mandanten, finanziell vorbereitet in jedes Gespräch zu gehen.",
    headline: "Ihre Mandanten verdienen Klarheit, bevor sie hereinkommen.",
    body: "SettleLens ist ein Finanzmodellierungswerkzeug. Wenn Mandanten ihr Vermögens- und Schuldeninventar vor dem Gespräch mit Ihnen vervollständigen, können Ihre Sitzungen sich auf Strategie konzentrieren — nicht auf Datenerfassung. Die Lawyer Edition erstellt anwaltsbereite Finanzübersichten, die Ihre Mandanten direkt mit Ihnen teilen können.",
    benefits: [
      { icon: "BarChart3", title: "Strukturiertes Finanzbild", desc: "Vermögen, Schulden, Einkommen und Verhandlungsszenarien — strukturiert vor dem ersten Gespräch." },
      { icon: "FileText", title: "Anwaltsbereite PDF & Excel", desc: "Klar gekennzeichnete Finanzmodellierungsausgabe. Kein rechtliches Dokument — aber für professionelle Überprüfung organisiert." },
      { icon: "Users", title: "Szenarienvergleich", desc: "Mandanten können bis zu 3 Einigungsszenarien mit 10-Jahres-Prognosen nebeneinander vergleichen." },
      { icon: "Shield", title: "Datenschutz by Design", desc: "Mandantendaten sind verschlüsselt, zeilensicher und werden nie an Dritte weitergegeben. DSGVO-konform." },
    ],
    features: [
      "Unbegrenzte KI-gestützte Szenarienanalysen",
      "Anwaltsbereite Excel + PDF-Export",
      "10-Jahres-Finanzprognose mit Inflationsmodellierung",
      "Beweismittelorganisator für Vermögensdokumentation",
      "Mehrere Szenarien im Seitenvergleich",
      "Prioritätssupport",
    ],
    cta: "Lawyer Edition kaufen",
    ctaSub: "€74/Monat · jederzeit kündbar",
    disclaimer: "SettleLens bietet Finanzmodellierung nur zu Informationszwecken an. Es handelt sich nicht um ein Rechtsdokument und stellt keine Rechtsberatung dar. Für professionelle Rechtsberatung wenden Sie sich stets an einen qualifizierten Familienrechtsanwalt.",
  },
  fr: {
    badge: "Lawyer Edition",
    title: "Pour les avocats — SettleLens",
    sub: "Aidez vos clients à arriver financièrement préparés à chaque réunion.",
    headline: "Vos clients méritent la clarté avant d'entrer.",
    body: "SettleLens est un outil de modélisation de scénarios financiers. Lorsque vos clients complètent leur inventaire d'actifs et de dettes avant de vous rencontrer, vos séances peuvent se concentrer sur la stratégie — pas sur la collecte de données. La Lawyer Edition génère des bilans financiers prêts pour les avocats que vos clients peuvent partager directement avec vous.",
    benefits: [
      { icon: "BarChart3", title: "Image financière organisée", desc: "Actifs, dettes, revenus et scénarios de règlement — structurés avant la première réunion." },
      { icon: "FileText", title: "PDF & Excel prêt pour l'avocat", desc: "Résultats de modélisation financière clairement étiquetés. Pas un document légal — mais organisé pour une révision professionnelle." },
      { icon: "Users", title: "Comparaison de scénarios", desc: "Les clients peuvent comparer jusqu'à 3 scénarios de règlement côte à côte avec des projections sur 10 ans." },
      { icon: "Shield", title: "Confidentialité by design", desc: "Les données client sont chiffrées, sécurisées au niveau des lignes, jamais partagées avec des tiers. Conforme RGPD." },
    ],
    features: [
      "Analyses de scénarios IA illimitées",
      "Export Excel + PDF prêt pour les avocats",
      "Projection financière sur 10 ans avec modélisation de l'inflation",
      "Organisateur de preuves pour la documentation des actifs",
      "Comparaison multi-scénarios côte à côte",
      "Support prioritaire",
    ],
    cta: "Obtenir Lawyer Edition",
    ctaSub: "€74/mois · résiliable à tout moment",
    disclaimer: "SettleLens fournit une modélisation financière à des fins d'information uniquement. Ce n'est pas un document légal et ne constitue pas un conseil juridique. Pour des conseils juridiques professionnels, consultez toujours un avocat spécialisé en droit de la famille.",
  },
  es: {
    badge: "Lawyer Edition",
    title: "Para abogados — SettleLens",
    sub: "Ayuda a tus clientes a llegar financieramente preparados a cada reunión.",
    headline: "Tus clientes merecen claridad antes de entrar.",
    body: "SettleLens es una herramienta de modelización de escenarios financieros. Cuando los clientes completan su inventario de activos y deudas antes de reunirse contigo, tus sesiones pueden centrarse en la estrategia, no en la recopilación de datos. La Lawyer Edition genera resúmenes financieros listos para abogados que tus clientes pueden compartir directamente contigo.",
    benefits: [
      { icon: "BarChart3", title: "Imagen financiera organizada", desc: "Activos, deudas, ingresos y escenarios de acuerdo — estructurados antes de la primera reunión." },
      { icon: "FileText", title: "PDF y Excel para abogados", desc: "Resultados de modelización financiera claramente etiquetados. No es un documento legal — pero organizado para revisión profesional." },
      { icon: "Users", title: "Comparación de escenarios", desc: "Los clientes pueden comparar hasta 3 escenarios de acuerdo lado a lado con proyecciones a 10 años." },
      { icon: "Shield", title: "Privacidad by design", desc: "Los datos del cliente están cifrados, seguros a nivel de fila y nunca se comparten con terceros. Conforme al RGPD." },
    ],
    features: [
      "Análisis de escenarios IA ilimitados",
      "Exportación Excel + PDF para abogados",
      "Proyección financiera a 10 años con modelización de inflación",
      "Organizador de evidencias para documentación de activos",
      "Comparación multi-escenario lado a lado",
      "Soporte prioritario",
    ],
    cta: "Obtener Lawyer Edition",
    ctaSub: "€74/mes · cancela cuando quieras",
    disclaimer: "SettleLens proporciona modelización financiera solo con fines informativos. No es un documento legal ni constituye asesoramiento jurídico. Para orientación legal profesional, consulte siempre a un abogado de derecho de familia cualificado.",
  },
  ar: {
    badge: "Lawyer Edition",
    title: "للمحامين — SettleLens",
    sub: "ساعد موكليك على الوصول إلى كل اجتماع مستعدين مالياً.",
    headline: "موكلوك يستحقون الوضوح قبل أن يدخلوا.",
    body: "SettleLens هو أداة نمذجة السيناريوهات المالية. عندما يستكمل موكلوك قائمة جردهم للأصول والديون قبل الاجتماع معك، يمكن لجلساتك أن تركز على الاستراتيجية — لا على جمع البيانات. تنشئ Lawyer Edition ملخصات مالية جاهزة للمحامين يمكن لموكليك مشاركتها معك مباشرةً.",
    benefits: [
      { icon: "BarChart3", title: "صورة مالية منظمة", desc: "الأصول والديون والدخل وسيناريوهات التسوية — منظمة قبل الاجتماع الأول." },
      { icon: "FileText", title: "PDF وExcel جاهز للمحامي", desc: "مخرجات نمذجة مالية موضحة بوضوح. ليست وثيقة قانونية — لكنها منظمة للمراجعة المهنية." },
      { icon: "Users", title: "مقارنة السيناريوهات", desc: "يمكن للعملاء مقارنة ما يصل إلى 3 سيناريوهات تسوية جنباً إلى جنب مع توقعات 10 سنوات." },
      { icon: "Shield", title: "الخصوصية بالتصميم", desc: "بيانات العميل مشفرة وآمنة على مستوى الصف ولا تُشارك أبداً مع أطراف ثالثة. متوافقة مع GDPR." },
    ],
    features: [
      "تحليلات سيناريو بالذكاء الاصطناعي غير محدودة",
      "تصدير Excel + PDF جاهز للمحامين",
      "توقع مالي 10 سنوات مع نمذجة التضخم",
      "منظم أدلة لتوثيق الأصول",
      "مقارنة متعددة السيناريوهات جنباً إلى جنب",
      "دعم ذو أولوية",
    ],
    cta: "احصل على Lawyer Edition",
    ctaSub: "$79/شهر · يمكنك الإلغاء في أي وقت",
    disclaimer: "توفر SettleLens نمذجة مالية للأغراض المعلوماتية فقط. إنها ليست وثيقة قانونية ولا تشكل مشورة قانونية. للحصول على إرشادات قانونية مهنية، استشر دائماً محامياً متخصصاً في قانون الأسرة.",
  },
};

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  const c = CONTENT[lang] ?? CONTENT.en;
  return { title: c.title, description: c.sub };
}

export default async function ForLawyersPage({ params }: Props) {
  const { lang } = await params;
  const c = CONTENT[lang] ?? CONTENT.en;

  const iconMap: Record<string, React.ElementType> = {
    BarChart3, FileText, Users, Shield,
  };

  return (
    <>
      <Header />
      <main className="bg-[var(--cream)] min-h-screen">
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-4 py-24 text-center">
          <span className="inline-block bg-[var(--gold)]/10 text-[var(--gold)] font-ui text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4">
            {c.badge}
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-[var(--navy)] mb-6 leading-tight">
            {c.headline}
          </h1>
          <p className="font-body text-lg text-[var(--brown)] max-w-2xl mx-auto mb-10">
            {c.body}
          </p>
          <Link
            href={`/${lang}/register`}
            className={cn(buttonVariants(), "bg-[var(--gold)] text-[var(--navy)] font-bold hover:bg-[var(--gold)]/90 text-base px-8 py-6")}
          >
            {c.cta}
          </Link>
          <p className="font-ui text-xs text-[var(--brown)] mt-3 opacity-70">{c.ctaSub}</p>
        </section>

        {/* Benefits */}
        <section className="bg-white py-20 px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8">
            {c.benefits.map((b) => {
              const Icon = iconMap[b.icon] ?? BarChart3;
              return (
                <div key={b.title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--gold)]/10 flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-[var(--gold)]" />
                  </div>
                  <div>
                    <h3 className="font-ui font-semibold text-[var(--navy)] mb-1">{b.title}</h3>
                    <p className="font-body text-sm text-[var(--brown)]">{b.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Features + CTA */}
        <section className="max-w-3xl mx-auto px-4 py-20">
          <div className="bg-[var(--navy)] rounded-2xl p-8 sm:p-12">
            <p className="font-ui text-xs font-bold uppercase tracking-widest text-[var(--gold)] mb-4">{c.badge}</p>
            <ul className="space-y-3 mb-8">
              {c.features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <Check size={16} className="text-[var(--gold)] mt-0.5 shrink-0" />
                  <span className="font-body text-[var(--cream)] text-sm">{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href={`/${lang}/register`}
              className={cn(buttonVariants(), "bg-[var(--gold)] text-[var(--navy)] font-bold hover:bg-[var(--gold)]/90 w-full text-center")}
            >
              {c.cta}
            </Link>
            <p className="font-ui text-xs text-[var(--sand)] mt-3 text-center opacity-70">{c.ctaSub}</p>
          </div>
        </section>

        {/* Disclaimer */}
        <div className="max-w-3xl mx-auto px-4 pb-20">
          <p className="font-ui text-xs text-[var(--brown)] text-center leading-relaxed opacity-70">
            {c.disclaimer}
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
