"use client";

import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function UserScenarios() {
  const t = useTranslations("userScenarios");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const cards = t.raw("cards") as Array<{ icon: string; title: string; desc: string }>;

  return (
    <section ref={ref} className="bg-[var(--cream)] py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 space-y-3"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[var(--navy)]">{t("title")}</h2>
          <p className="font-body text-[var(--brown)] max-w-lg mx-auto">{t("sub")}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.12, duration: 0.6 }}
              className="group bg-white rounded-xl border border-[var(--sand)] p-6 shadow-sm hover:border-l-[3px] hover:border-l-[var(--gold)] transition-all duration-200 space-y-3"
            >
              <span className="text-3xl">{card.icon}</span>
              <h3 className="font-display text-lg font-bold text-[var(--navy)]">{card.title}</h3>
              <p className="font-body text-sm text-[var(--brown)] leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
