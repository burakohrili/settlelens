"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

export function WhatItDoesNotDo() {
  const t = useTranslations("whatItDoesNot");
  const lang = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const doesList = t.raw("does") as string[];
  const notList = t.raw("not") as string[];

  return (
    <section ref={ref} className="bg-[var(--navy)] py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-display text-2xl sm:text-3xl font-bold text-[var(--cream)] text-center mb-10"
        >
          {t("title")}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Does */}
          <div className="space-y-3">
            <p className="font-mono text-xs tracking-widest text-[var(--gold)] uppercase mb-4">{t("doesTitle")}</p>
            {doesList.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-[var(--gold)] font-bold mt-0.5">✓</span>
                <span className="font-body text-sm text-[var(--cream)]">{item}</span>
              </div>
            ))}
          </div>
          {/* Does not */}
          <div className="space-y-3">
            <p className="font-mono text-xs tracking-widest text-[#E85252] uppercase mb-4">{t("doesNot")}</p>
            {notList.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-[#E85252] font-bold mt-0.5">✗</span>
                <span className="font-body text-sm text-[#a0b0c0]">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8 text-center space-y-2"
        >
          <p className="font-body text-sm text-[#6b7f90]">{t("note")}</p>
          <Link href={`/${lang}/trust`} className="font-ui text-sm text-[var(--gold)] hover:underline">
            {t("link")}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
