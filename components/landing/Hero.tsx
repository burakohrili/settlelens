"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const TRUST_BADGES: Record<string, string[]> = {
  tr: ["🛡️ KVKK Uyumlu", "🔒 Veri satılmaz", "🔐 AES-256"],
  en: ["🛡️ GDPR-class privacy", "🔒 Data never sold", "🔐 AES-256"],
  de: ["🛡️ DSGVO-konform", "🔒 Daten nicht verkauft", "🔐 AES-256"],
  fr: ["🛡️ Conforme RGPD", "🔒 Données non vendues", "🔐 AES-256"],
  es: ["🛡️ Conforme RGPD", "🔒 Datos nunca vendidos", "🔐 AES-256"],
  ar: ["🛡️ متوافق GDPR", "🔒 البيانات لا تُباع", "🔐 AES-256"],
};

export function Hero() {
  const t = useTranslations("hero");
  const lang = useLocale();
  const badges = TRUST_BADGES[lang] ?? TRUST_BADGES.en;

  const variants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
  };

  return (
    <section className="relative min-h-screen bg-[var(--navy)] flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1C2B3A] via-[#2E4D6B]/40 to-[#1C2B3A] animate-pulse" style={{ animationDuration: "8s" }} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
        {/* Badge */}
        <motion.div custom={0} initial="hidden" animate="visible" variants={variants}>
          <span className="font-mono text-xs tracking-[0.25em] text-[var(--gold)] uppercase bg-[var(--gold)]/10 border border-[var(--gold)]/30 px-4 py-1.5 rounded-full">
            {t("badge")}
          </span>
        </motion.div>

        {/* H1 */}
        <motion.h1 custom={1} initial="hidden" animate="visible" variants={variants}
          className="font-display text-4xl sm:text-5xl lg:text-[52px] font-bold text-[var(--cream)] italic leading-tight">
          {t("h1").split("\n").map((line, i) => (
            <span key={i}>{line}{i < t("h1").split("\n").length - 1 && <br />}</span>
          ))}
        </motion.h1>

        {/* H2 */}
        <motion.p custom={2} initial="hidden" animate="visible" variants={variants}
          className="font-body text-lg sm:text-xl text-[#D4C5B0] max-w-[560px] mx-auto leading-relaxed">
          {t("h2")}
        </motion.p>

        {/* Sub-tagline */}
        <motion.p custom={2.5} initial="hidden" animate="visible" variants={variants}
          className="font-ui text-xs text-[var(--sand)] tracking-wide">
          {t("subTagline")}
        </motion.p>

        {/* CTA */}
        <motion.div custom={3} initial="hidden" animate="visible" variants={variants} className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link
            href={`/${lang}/register`}
            className={cn(
              buttonVariants(),
              "h-14 px-8 bg-[var(--gold)] text-[var(--navy)] font-display font-bold text-lg hover:bg-[var(--gold)]/90 hover:scale-105 transition-transform"
            )}
          >
            {t("cta")}
          </Link>
        </motion.div>

        {/* Sub note */}
        <motion.p custom={4} initial="hidden" animate="visible" variants={variants}
          className="font-body text-sm text-[#8B7355]">
          {t("sub")}
        </motion.p>

        {/* Trust badge strip */}
        <motion.div custom={5} initial="hidden" animate="visible" variants={variants}
          className="flex flex-wrap justify-center gap-3 pt-2">
          {badges.map((badge) => (
            <span key={badge} className="font-ui text-xs text-[var(--sand)]/70 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
              {badge}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[var(--cream)]/50"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <ChevronDown size={24} />
      </motion.div>
    </section>
  );
}
