"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeadModalProps {
  open: boolean;
  onClose: () => void;
  initialStage?: string;
}

const CONTENT: Record<string, {
  step1Title: string; step1Sub: string;
  options1: { value: string; label: string }[];
  step2Title: string; step2Sub: string;
  options2: { value: string; label: string }[];
  step3Title: string; step3Sub: string;
  emailPlaceholder: string; ctaLabel: string;
  disclaimer: string;
}> = {
  en: {
    step1Title: "Where are you in the process?",
    step1Sub: "This helps us tailor your experience.",
    options1: [
      { value: "considering", label: "Considering divorce" },
      { value: "started", label: "Process has started" },
      { value: "negotiating", label: "Currently negotiating" },
      { value: "finalizing", label: "Almost finalized" },
    ],
    step2Title: "How soon do you need clarity?",
    step2Sub: "We'll help you get there.",
    options2: [
      { value: "urgent", label: "This week" },
      { value: "soon", label: "In the next month" },
      { value: "planning", label: "I'm planning ahead" },
      { value: "unsure", label: "Not sure yet" },
    ],
    step3Title: "See your financial picture for free.",
    step3Sub: "Start with a free account — no credit card required.",
    emailPlaceholder: "Your email address",
    ctaLabel: "Start Free Analysis →",
    disclaimer: "Financial modeling, not legal advice.",
  },
  tr: {
    step1Title: "Süreçte neredesiniz?",
    step1Sub: "Bu bilgi deneyiminizi kişiselleştirmemize yardımcı olur.",
    options1: [
      { value: "considering", label: "Boşanmayı düşünüyorum" },
      { value: "started", label: "Süreç başladı" },
      { value: "negotiating", label: "Şu an müzakeredeyim" },
      { value: "finalizing", label: "Neredeyse tamamlandı" },
    ],
    step2Title: "Ne kadar acele bir netliğe ihtiyacınız var?",
    step2Sub: "Size ulaşmanıza yardımcı olacağız.",
    options2: [
      { value: "urgent", label: "Bu hafta" },
      { value: "soon", label: "Önümüzdeki ay içinde" },
      { value: "planning", label: "Önceden planlıyorum" },
      { value: "unsure", label: "Henüz emin değilim" },
    ],
    step3Title: "Finansal tablonuzu ücretsiz görün.",
    step3Sub: "Ücretsiz hesap oluşturun — kredi kartı gerekmez.",
    emailPlaceholder: "E-posta adresiniz",
    ctaLabel: "Ücretsiz Analiz Başlat →",
    disclaimer: "Finansal modelleme — hukuki tavsiye değil.",
  },
  de: {
    step1Title: "Wo stehen Sie im Prozess?",
    step1Sub: "Das hilft uns, Ihre Erfahrung anzupassen.",
    options1: [
      { value: "considering", label: "Scheidung in Betracht ziehen" },
      { value: "started", label: "Prozess hat begonnen" },
      { value: "negotiating", label: "Derzeit in Verhandlung" },
      { value: "finalizing", label: "Fast abgeschlossen" },
    ],
    step2Title: "Wie schnell brauchen Sie Klarheit?",
    step2Sub: "Wir helfen Ihnen.",
    options2: [
      { value: "urgent", label: "Diese Woche" },
      { value: "soon", label: "Im nächsten Monat" },
      { value: "planning", label: "Ich plane voraus" },
      { value: "unsure", label: "Noch nicht sicher" },
    ],
    step3Title: "Sehen Sie Ihr Finanzbild kostenlos.",
    step3Sub: "Kostenloses Konto erstellen — keine Kreditkarte erforderlich.",
    emailPlaceholder: "Ihre E-Mail-Adresse",
    ctaLabel: "Kostenlose Analyse starten →",
    disclaimer: "Finanzmodellierung — keine Rechtsberatung.",
  },
  fr: {
    step1Title: "Où en êtes-vous dans le processus ?",
    step1Sub: "Cela nous aide à personnaliser votre expérience.",
    options1: [
      { value: "considering", label: "J'envisage le divorce" },
      { value: "started", label: "Le processus a commencé" },
      { value: "negotiating", label: "En cours de négociation" },
      { value: "finalizing", label: "Presque finalisé" },
    ],
    step2Title: "De quelle urgence avez-vous besoin de clarté ?",
    step2Sub: "Nous vous aiderons à y arriver.",
    options2: [
      { value: "urgent", label: "Cette semaine" },
      { value: "soon", label: "Dans le mois prochain" },
      { value: "planning", label: "Je planifie à l'avance" },
      { value: "unsure", label: "Pas encore sûr" },
    ],
    step3Title: "Voyez votre tableau financier gratuitement.",
    step3Sub: "Créez un compte gratuit — aucune carte de crédit requise.",
    emailPlaceholder: "Votre adresse e-mail",
    ctaLabel: "Commencer l'analyse gratuite →",
    disclaimer: "Modélisation financière — pas de conseil juridique.",
  },
  es: {
    step1Title: "¿Dónde estás en el proceso?",
    step1Sub: "Esto nos ayuda a personalizar tu experiencia.",
    options1: [
      { value: "considering", label: "Considerando el divorcio" },
      { value: "started", label: "El proceso ha comenzado" },
      { value: "negotiating", label: "Actualmente negociando" },
      { value: "finalizing", label: "Casi finalizado" },
    ],
    step2Title: "¿Con qué urgencia necesitas claridad?",
    step2Sub: "Te ayudaremos a lograrlo.",
    options2: [
      { value: "urgent", label: "Esta semana" },
      { value: "soon", label: "En el próximo mes" },
      { value: "planning", label: "Estoy planificando con antelación" },
      { value: "unsure", label: "Aún no estoy seguro/a" },
    ],
    step3Title: "Ve tu panorama financiero gratis.",
    step3Sub: "Crea una cuenta gratuita — no se requiere tarjeta de crédito.",
    emailPlaceholder: "Tu correo electrónico",
    ctaLabel: "Iniciar análisis gratuito →",
    disclaimer: "Modelización financiera — no asesoramiento legal.",
  },
  ar: {
    step1Title: "أين أنت في العملية؟",
    step1Sub: "هذا يساعدنا على تخصيص تجربتك.",
    options1: [
      { value: "considering", label: "أفكر في الطلاق" },
      { value: "started", label: "بدأت العملية" },
      { value: "negotiating", label: "أتفاوض حالياً" },
      { value: "finalizing", label: "على وشك الانتهاء" },
    ],
    step2Title: "كم تحتاج من الوقت للحصول على وضوح؟",
    step2Sub: "سنساعدك على الوصول إلى ذلك.",
    options2: [
      { value: "urgent", label: "هذا الأسبوع" },
      { value: "soon", label: "خلال الشهر القادم" },
      { value: "planning", label: "أخطط مسبقاً" },
      { value: "unsure", label: "لست متأكداً بعد" },
    ],
    step3Title: "شاهد صورتك المالية مجاناً.",
    step3Sub: "أنشئ حساباً مجانياً — لا تحتاج إلى بطاقة ائتمان.",
    emailPlaceholder: "بريدك الإلكتروني",
    ctaLabel: "بدء التحليل المجاني ←",
    disclaimer: "نمذجة مالية — ليست استشارة قانونية.",
  },
};

export function LeadModal({ open, onClose, initialStage }: LeadModalProps) {
  const locale = useLocale();
  const router = useRouter();
  const c = CONTENT[locale] ?? CONTENT.en;

  const [step, setStep] = useState(1);
  const [stage, setStage] = useState(initialStage ?? "");
  const [timeline, setTimeline] = useState("");
  const [email, setEmail] = useState("");

  function handleClose() {
    setStep(1);
    setStage("");
    setTimeline("");
    setEmail("");
    onClose();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    const q = email ? `?email=${encodeURIComponent(email)}` : "";
    router.push(`/${locale}/register${q}`);
    handleClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="lead-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
          <motion.div
            key="lead-modal-card"
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Progress bar */}
            <div className="h-1 bg-[var(--sand)]">
              <div
                className="h-full bg-[var(--gold)] transition-all duration-500"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>

            <div className="px-8 py-8">
              {/* Close */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-[var(--brown)] hover:text-[var(--navy)] transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                    <h2 className="font-display text-xl font-bold text-[var(--navy)] mb-1">{c.step1Title}</h2>
                    <p className="font-body text-sm text-[var(--brown)] mb-6">{c.step1Sub}</p>
                    <div className="space-y-2">
                      {c.options1.map((o) => (
                        <button
                          key={o.value}
                          onClick={() => { setStage(o.value); setStep(2); }}
                          className={cn(
                            "w-full text-left px-4 py-3 rounded-lg border font-ui text-sm transition-all",
                            stage === o.value
                              ? "border-[var(--gold)] bg-[var(--gold)]/5 text-[var(--navy)] font-semibold"
                              : "border-[var(--sand)] text-[var(--brown)] hover:border-[var(--navy)] hover:text-[var(--navy)]"
                          )}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                    <h2 className="font-display text-xl font-bold text-[var(--navy)] mb-1">{c.step2Title}</h2>
                    <p className="font-body text-sm text-[var(--brown)] mb-6">{c.step2Sub}</p>
                    <div className="space-y-2">
                      {c.options2.map((o) => (
                        <button
                          key={o.value}
                          onClick={() => { setTimeline(o.value); setStep(3); }}
                          className={cn(
                            "w-full text-left px-4 py-3 rounded-lg border font-ui text-sm transition-all",
                            timeline === o.value
                              ? "border-[var(--gold)] bg-[var(--gold)]/5 text-[var(--navy)] font-semibold"
                              : "border-[var(--sand)] text-[var(--brown)] hover:border-[var(--navy)] hover:text-[var(--navy)]"
                          )}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                    <h2 className="font-display text-xl font-bold text-[var(--navy)] mb-1">{c.step3Title}</h2>
                    <p className="font-body text-sm text-[var(--brown)] mb-6">{c.step3Sub}</p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={c.emailPlaceholder}
                        className="w-full px-4 py-3 rounded-lg border border-[var(--sand)] font-body text-sm text-[var(--navy)] placeholder-[var(--brown)]/60 focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]/30 transition-colors"
                      />
                      <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 bg-[var(--gold)] text-[var(--navy)] font-ui font-bold py-3 rounded-lg hover:bg-[var(--gold)]/90 transition-colors"
                      >
                        {c.ctaLabel} <ChevronRight size={16} />
                      </button>
                    </form>
                    <p className="font-ui text-[11px] text-[var(--brown)] text-center mt-4 opacity-70">{c.disclaimer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
