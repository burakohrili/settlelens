"use client";

import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function HowItWorks() {
  const t = useTranslations("howItWorks");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const steps = t.raw("steps") as Array<{ n: string; title: string; desc: string }>;

  return (
    <section id="how-it-works" ref={ref} className="bg-white py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-display text-3xl sm:text-4xl font-bold text-[var(--navy)] text-center mb-16"
        >
          {t("title")}
        </motion.h2>

        <div className="relative">
          {/* Connector line — desktop only */}
          <div className="hidden md:block absolute top-10 left-[16.666%] right-[16.666%] h-px bg-[var(--sand)]" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15 + i * 0.15, duration: 0.6 }}
                className="text-center space-y-3 relative"
              >
                <div className="w-20 h-20 rounded-full bg-[var(--cream)] border border-[var(--sand)] flex items-center justify-center mx-auto relative z-10">
                  <span className="font-mono text-3xl font-bold text-[var(--gold)]">{step.n}</span>
                </div>
                <h3 className="font-display text-xl font-bold text-[var(--navy)]">{step.title}</h3>
                <p className="font-body text-[var(--brown)] text-sm leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
