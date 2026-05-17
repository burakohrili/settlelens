"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronRight, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

type Lang = "en" | "tr" | "de" | "fr" | "es" | "ar";

type WizardData = {
  title: string;
  subtitle: string;
  questions: Array<{
    q: string;
    options: Array<{ label: string; value: string }>;
  }>;
  results: Record<string, { plan: string; reason: string; cta: string }>;
  restart: string;
};

const WIZARD: Record<Lang, WizardData> = {
  en: {
    title: "Not sure which plan?",
    subtitle: "3 quick questions — we'll point you to the right one.",
    questions: [
      {
        q: "Where are you in the process?",
        options: [
          { label: "Just exploring options", value: "early" },
          { label: "Actively negotiating", value: "active" },
          { label: "Have a specific offer to evaluate", value: "offer" },
        ],
      },
      {
        q: "What's your main goal?",
        options: [
          { label: "Understand my financial position", value: "understand" },
          { label: "Compare multiple scenarios", value: "compare" },
          { label: "Prepare documents for my lawyer", value: "lawyer" },
        ],
      },
      {
        q: "How long do you need access?",
        options: [
          { label: "Just for one decision (days)", value: "short" },
          { label: "Several months of negotiation", value: "long" },
          { label: "Ongoing — I'm a legal professional", value: "pro" },
        ],
      },
    ],
    results: {
      default: { plan: "Scenario Package", reason: "3 analyses and 30-day access — ideal for a focused negotiation.", cta: "Get Scenario Package — $19" },
      compare_long: { plan: "Process Package", reason: "Unlimited scenarios and 6-month access for the full process.", cta: "Get Process Package — $149" },
      lawyer_pro: { plan: "Lawyer Edition", reason: "Attorney-ready exports and multi-client management.", cta: "Get Lawyer Edition — $79/mo" },
      early: { plan: "Discovery (Free)", reason: "Start free — see your net worth summary, no payment needed.", cta: "Start Free" },
    },
    restart: "Start over",
  },
  tr: {
    title: "Hangi planı seçmeli?",
    subtitle: "3 hızlı soru — size en uygun planı bulalım.",
    questions: [
      {
        q: "Sürecinizin neresindesisiniz?",
        options: [
          { label: "Seçenekleri araştırıyorum", value: "early" },
          { label: "Aktif olarak müzakere ediyorum", value: "active" },
          { label: "Değerlendirmem gereken bir teklifim var", value: "offer" },
        ],
      },
      {
        q: "Temel hedefiniz nedir?",
        options: [
          { label: "Finansal durumumu anlamak", value: "understand" },
          { label: "Birden fazla senaryoyu karşılaştırmak", value: "compare" },
          { label: "Avukatım için belge hazırlamak", value: "lawyer" },
        ],
      },
      {
        q: "Ne kadar süre erişim gerekiyor?",
        options: [
          { label: "Tek bir karar için (birkaç gün)", value: "short" },
          { label: "Aylarca süren müzakere için", value: "long" },
          { label: "Süregelen — Hukuk profesyoneliyim", value: "pro" },
        ],
      },
    ],
    results: {
      default: { plan: "Senaryo Paketi", reason: "3 analiz ve 30 günlük erişim — odaklı müzakere için ideal.", cta: "Senaryo Paketi Al — 499 ₺" },
      compare_long: { plan: "Süreç Paketi", reason: "Sınırsız senaryo ve 6 aylık erişim — tam süreç için.", cta: "Süreç Paketi Al — 3.999 ₺" },
      lawyer_pro: { plan: "Lawyer Edition", reason: "Uzun vadeli kullanım için avukatlığa hazır dışa aktarma.", cta: "Lawyer Edition Al — 1.999 ₺/ay" },
      early: { plan: "Discovery (Ücretsiz)", reason: "Ücretsiz başlayın — net varlık özetinizi görün, ödeme gerekmez.", cta: "Ücretsiz Başla" },
    },
    restart: "Yeniden başla",
  },
  de: {
    title: "Welcher Plan ist der richtige?",
    subtitle: "3 kurze Fragen — wir empfehlen den passenden Plan.",
    questions: [
      {
        q: "Wo stehen Sie im Prozess?",
        options: [
          { label: "Ich erkunde meine Optionen", value: "early" },
          { label: "Ich verhandle aktiv", value: "active" },
          { label: "Ich habe ein konkretes Angebot zu prüfen", value: "offer" },
        ],
      },
      {
        q: "Was ist Ihr Hauptziel?",
        options: [
          { label: "Meine finanzielle Situation verstehen", value: "understand" },
          { label: "Mehrere Szenarien vergleichen", value: "compare" },
          { label: "Unterlagen für meinen Anwalt vorbereiten", value: "lawyer" },
        ],
      },
      {
        q: "Wie lange benötigen Sie Zugang?",
        options: [
          { label: "Nur für eine Entscheidung (Tage)", value: "short" },
          { label: "Mehrere Monate Verhandlung", value: "long" },
          { label: "Dauerhaft — ich bin Rechtsfachmann", value: "pro" },
        ],
      },
    ],
    results: {
      default: { plan: "Szenario-Paket", reason: "3 Analysen und 30 Tage Zugang — ideal für eine gezielte Verhandlung.", cta: "Szenario-Paket holen — 18 €" },
      compare_long: { plan: "Prozess-Paket", reason: "Unbegrenzte Szenarien und 6 Monate Zugang für den vollen Prozess.", cta: "Prozess-Paket holen — 139 €" },
      lawyer_pro: { plan: "Lawyer Edition", reason: "Anwaltsgerechte Exporte für langfristige Nutzung.", cta: "Lawyer Edition holen — 74 €/Monat" },
      early: { plan: "Discovery (Kostenlos)", reason: "Kostenlos starten — Nettovermögensübersicht ohne Zahlung.", cta: "Kostenlos starten" },
    },
    restart: "Neu starten",
  },
  fr: {
    title: "Quel plan vous convient ?",
    subtitle: "3 questions rapides — nous vous orientons vers le bon choix.",
    questions: [
      {
        q: "Où en êtes-vous dans votre démarche ?",
        options: [
          { label: "J'explore mes options", value: "early" },
          { label: "Je négocie activement", value: "active" },
          { label: "J'ai une offre précise à évaluer", value: "offer" },
        ],
      },
      {
        q: "Quel est votre objectif principal ?",
        options: [
          { label: "Comprendre ma situation financière", value: "understand" },
          { label: "Comparer plusieurs scénarios", value: "compare" },
          { label: "Préparer des documents pour mon avocat", value: "lawyer" },
        ],
      },
      {
        q: "De combien de temps d'accès avez-vous besoin ?",
        options: [
          { label: "Pour une seule décision (quelques jours)", value: "short" },
          { label: "Plusieurs mois de négociation", value: "long" },
          { label: "En continu — je suis professionnel du droit", value: "pro" },
        ],
      },
    ],
    results: {
      default: { plan: "Pack Scénario", reason: "3 analyses et 30 jours d'accès — idéal pour une négociation ciblée.", cta: "Obtenir le Pack Scénario — 18 €" },
      compare_long: { plan: "Pack Processus", reason: "Scénarios illimités et 6 mois d'accès pour tout le processus.", cta: "Obtenir le Pack Processus — 139 €" },
      lawyer_pro: { plan: "Lawyer Edition", reason: "Exports prêts pour avocat pour un usage prolongé.", cta: "Obtenir Lawyer Edition — 74 €/mois" },
      early: { plan: "Discovery (Gratuit)", reason: "Commencez gratuitement — résumé de votre patrimoine net sans paiement.", cta: "Commencer gratuitement" },
    },
    restart: "Recommencer",
  },
  es: {
    title: "¿No sabes qué plan elegir?",
    subtitle: "3 preguntas rápidas — te ayudamos a encontrar el ideal.",
    questions: [
      {
        q: "¿En qué punto del proceso estás?",
        options: [
          { label: "Estoy explorando opciones", value: "early" },
          { label: "Estoy negociando activamente", value: "active" },
          { label: "Tengo una oferta concreta que evaluar", value: "offer" },
        ],
      },
      {
        q: "¿Cuál es tu objetivo principal?",
        options: [
          { label: "Entender mi situación financiera", value: "understand" },
          { label: "Comparar varios escenarios", value: "compare" },
          { label: "Preparar documentos para mi abogado", value: "lawyer" },
        ],
      },
      {
        q: "¿Cuánto tiempo necesitas acceso?",
        options: [
          { label: "Solo para una decisión (días)", value: "short" },
          { label: "Varios meses de negociación", value: "long" },
          { label: "De forma continua — soy profesional jurídico", value: "pro" },
        ],
      },
    ],
    results: {
      default: { plan: "Paquete Escenario", reason: "3 análisis y 30 días de acceso — ideal para una negociación enfocada.", cta: "Obtener Paquete Escenario — 18 €" },
      compare_long: { plan: "Paquete Proceso", reason: "Escenarios ilimitados y 6 meses de acceso para todo el proceso.", cta: "Obtener Paquete Proceso — 139 €" },
      lawyer_pro: { plan: "Lawyer Edition", reason: "Exportaciones listas para abogado en uso prolongado.", cta: "Obtener Lawyer Edition — 74 €/mes" },
      early: { plan: "Discovery (Gratis)", reason: "Empieza gratis — resumen de patrimonio neto sin pago.", cta: "Empezar gratis" },
    },
    restart: "Volver a empezar",
  },
  ar: {
    title: "لست متأكداً من الخطة المناسبة؟",
    subtitle: "٣ أسئلة سريعة — سنرشدك إلى الخيار الأنسب.",
    questions: [
      {
        q: "أين أنت في العملية؟",
        options: [
          { label: "أستكشف خياراتي", value: "early" },
          { label: "أتفاوض بنشاط", value: "active" },
          { label: "لديّ عرض محدد لتقييمه", value: "offer" },
        ],
      },
      {
        q: "ما هدفك الرئيسي؟",
        options: [
          { label: "فهم وضعي المالي", value: "understand" },
          { label: "مقارنة سيناريوهات متعددة", value: "compare" },
          { label: "إعداد وثائق لمحاميّ", value: "lawyer" },
        ],
      },
      {
        q: "كم من الوقت تحتاج للوصول؟",
        options: [
          { label: "لقرار واحد فقط (أيام)", value: "short" },
          { label: "عدة أشهر من التفاوض", value: "long" },
          { label: "باستمرار — أنا محترف قانوني", value: "pro" },
        ],
      },
    ],
    results: {
      default: { plan: "حزمة السيناريو", reason: "3 تحليلات ووصول 30 يوماً — مثالي للتفاوض المركّز.", cta: "احصل على حزمة السيناريو — $19" },
      compare_long: { plan: "حزمة العملية", reason: "سيناريوهات غير محدودة ووصول 6 أشهر للعملية الكاملة.", cta: "احصل على حزمة العملية — $149" },
      lawyer_pro: { plan: "Lawyer Edition", reason: "صادرات جاهزة للمحامي للاستخدام الممتد.", cta: "احصل على Lawyer Edition — $79/شهر" },
      early: { plan: "Discovery (مجاني)", reason: "ابدأ مجاناً — ملخص صافي الثروة بدون دفع.", cta: "ابدأ مجاناً" },
    },
    restart: "البدء من جديد",
  },
};

function getResult(answers: string[], data: WizardData): { plan: string; reason: string; cta: string } {
  const [q1, q2, q3] = answers;
  if (q1 === "early") return data.results.early;
  if (q2 === "lawyer" || q3 === "pro") return data.results.lawyer_pro;
  if (q2 === "compare" && q3 === "long") return data.results.compare_long;
  return data.results.default;
}

export function PricingWizard() {
  const locale = useLocale() as Lang;
  const data = WIZARD[locale] ?? WIZARD.en;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const done = answers.length === data.questions.length;
  const result = done ? getResult(answers, data) : null;

  function pick(value: string) {
    const next = [...answers, value];
    setAnswers(next);
    if (next.length < data.questions.length) setStep(step + 1);
  }

  function restart() {
    setAnswers([]);
    setStep(0);
  }

  return (
    <section className="py-16 bg-[var(--navy)]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[var(--cream)] italic">
            {data.title}
          </h2>
          <p className="font-body text-[#a0b0c0] mt-2">{data.subtitle}</p>
        </div>

        <div className="bg-[var(--slate)]/30 rounded-2xl border border-[var(--sand)]/20 p-6">
          {/* Progress dots */}
          <div className="flex gap-1.5 mb-6">
            {data.questions.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors",
                  i < answers.length ? "bg-[var(--gold)]" : "bg-white/20"
                )}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <p className="font-ui text-xs text-[var(--gold)] uppercase tracking-widest mb-3">
                  {step + 1} / {data.questions.length}
                </p>
                <h3 className="font-display text-lg font-bold text-[var(--cream)] mb-4">
                  {data.questions[step].q}
                </h3>
                <div className="space-y-2">
                  {data.questions[step].options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => pick(opt.value)}
                      className="w-full text-left rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-ui text-sm text-[var(--cream)] hover:border-[var(--gold)]/60 hover:bg-[var(--gold)]/10 transition-all flex items-center justify-between group"
                    >
                      <span>{opt.label}</span>
                      <ChevronRight size={14} className="text-[var(--gold)]/50 group-hover:text-[var(--gold)] transition-colors shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <p className="font-ui text-xs text-[var(--gold)] uppercase tracking-widest mb-2">
                  {locale === "tr" ? "Önerimiz" : locale === "de" ? "Unsere Empfehlung" : locale === "fr" ? "Notre recommandation" : locale === "es" ? "Nuestra recomendación" : locale === "ar" ? "توصيتنا" : "Our recommendation"}
                </p>
                <h3 className="font-display text-2xl font-bold text-[var(--cream)] mb-3">
                  {result!.plan}
                </h3>
                <p className="font-body text-[#a0b0c0] text-sm mb-6 max-w-sm mx-auto">
                  {result!.reason}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href={`/${locale}/register`}
                    className={cn(
                      buttonVariants(),
                      "bg-[var(--gold)] text-[var(--navy)] font-semibold hover:bg-[var(--gold)]/90"
                    )}
                  >
                    {result!.cta}
                  </Link>
                  <button
                    onClick={restart}
                    className="flex items-center justify-center gap-1.5 font-ui text-sm text-[#a0b0c0] hover:text-[var(--cream)] transition-colors"
                  >
                    <RotateCcw size={13} /> {data.restart}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
