"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

export function TrustSection() {
  const t = useTranslations("trust");
  const lang = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const cards = t.raw("cards") as Array<{ icon: string; title: string; desc: string }>;

  return (
    <section ref={ref} className="bg-[var(--cream)] py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-display text-3xl sm:text-4xl font-bold text-[var(--navy)] text-center mb-12"
        >
          {t("title")}
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.6 }}
              className="bg-white rounded-xl border border-[var(--sand)] p-5 flex gap-4"
            >
              <span className="text-2xl flex-shrink-0">{card.icon}</span>
              <div>
                <h3 className="font-ui text-sm font-semibold text-[var(--navy)] mb-1">{card.title}</h3>
                <p className="font-body text-sm text-[var(--brown)]">{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-6 text-center"
        >
          <Link href={`/${lang}/trust`} className="font-ui text-sm text-[var(--gold)] hover:underline">
            {t("link")}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
