"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronRight, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { PLAN_DISPLAY } from "@/lib/plan-prices";

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
      default: { plan: "Clarified", reason: "One scenario analysis + PDF — ideal for a single focused negotiation.", cta: `Get Clarified — ${PLAN_DISPLAY.clarified.prices.en} ${PLAN_DISPLAY.clarified.period.en}` },
      compare_long: { plan: "Strategist", reason: "Unlimited scenarios and projections for the full negotiation process.", cta: `Get Strategist — ${PLAN_DISPLAY.strategist.prices.en}${PLAN_DISPLAY.strategist.period.en}` },
      lawyer_pro: { plan: "Professional", reason: "Attorney-ready financial overview with evidence organizer.", cta: `Get Professional — ${PLAN_DISPLAY.professional.prices.en}${PLAN_DISPLAY.professional.period.en}` },
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
      default: { plan: "Clarified", reason: "Tek senaryo analizi + PDF — tek bir odaklı müzakere için ideal.", cta: `Clarified Al — ${PLAN_DISPLAY.clarified.prices.tr} ${PLAN_DISPLAY.clarified.period.tr}` },
      compare_long: { plan: "Strategist", reason: "Sınırsız senaryo ve projeksiyon — tüm müzakere süreci için.", cta: `Strategist Al — ${PLAN_DISPLAY.strategist.prices.tr}${PLAN_DISPLAY.strategist.period.tr}` },
      lawyer_pro: { plan: "Professional", reason: "Avukatlığa hazır finansal özet ve kanıt düzenleyici.", cta: `Professional Al — ${PLAN_DISPLAY.professional.prices.tr}${PLAN_DISPLAY.professional.period.tr}` },
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
      default: { plan: "Clarified", reason: "Eine Szenarioanalyse + PDF — ideal für eine gezielte Verhandlung.", cta: `Clarified holen — ${PLAN_DISPLAY.clarified.prices.de} ${PLAN_DISPLAY.clarified.period.de}` },
      compare_long: { plan: "Strategist", reason: "Unbegrenzte Szenarien und Projektionen für den gesamten Verhandlungsprozess.", cta: `Strategist holen — ${PLAN_DISPLAY.strategist.prices.de}${PLAN_DISPLAY.strategist.period.de}` },
      lawyer_pro: { plan: "Professional", reason: "Anwaltsgerechte Finanzübersicht mit Belegnachweisen.", cta: `Professional holen — ${PLAN_DISPLAY.professional.prices.de}${PLAN_DISPLAY.professional.period.de}` },
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
      default: { plan: "Clarified", reason: "Une analyse de scénario + PDF — idéal pour une négociation ciblée.", cta: `Obtenir Clarified — ${PLAN_DISPLAY.clarified.prices.fr} ${PLAN_DISPLAY.clarified.period.fr}` },
      compare_long: { plan: "Strategist", reason: "Scénarios illimités et projections pour tout le processus de négociation.", cta: `Obtenir Strategist — ${PLAN_DISPLAY.strategist.prices.fr}${PLAN_DISPLAY.strategist.period.fr}` },
      lawyer_pro: { plan: "Professional", reason: "Vue d'ensemble financière prête pour avocat avec organisateur de preuves.", cta: `Obtenir Professional — ${PLAN_DISPLAY.professional.prices.fr}${PLAN_DISPLAY.professional.period.fr}` },
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
      default: { plan: "Clarified", reason: "Un análisis de escenario + PDF — ideal para una negociación enfocada.", cta: `Obtener Clarified — ${PLAN_DISPLAY.clarified.prices.es} ${PLAN_DISPLAY.clarified.period.es}` },
      compare_long: { plan: "Strategist", reason: "Escenarios ilimitados y proyecciones para todo el proceso de negociación.", cta: `Obtener Strategist — ${PLAN_DISPLAY.strategist.prices.es}${PLAN_DISPLAY.strategist.period.es}` },
      lawyer_pro: { plan: "Professional", reason: "Resumen financiero listo para abogado con organizador de evidencias.", cta: `Obtener Professional — ${PLAN_DISPLAY.professional.prices.es}${PLAN_DISPLAY.professional.period.es}` },
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
      default: { plan: "Clarified", reason: "تحليل سيناريو واحد + PDF — مثالي للتفاوض المركّز.", cta: `احصل على Clarified — ${PLAN_DISPLAY.clarified.prices.ar} ${PLAN_DISPLAY.clarified.period.ar}` },
      compare_long: { plan: "Strategist", reason: "سيناريوهات وتوقعات غير محدودة لعملية التفاوض الكاملة.", cta: `احصل على Strategist — ${PLAN_DISPLAY.strategist.prices.ar}${PLAN_DISPLAY.strategist.period.ar}` },
      lawyer_pro: { plan: "Professional", reason: "ملخص مالي جاهز للمحامي مع منظّم الأدلة.", cta: `احصل على Professional — ${PLAN_DISPLAY.professional.prices.ar}${PLAN_DISPLAY.professional.period.ar}` },
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
