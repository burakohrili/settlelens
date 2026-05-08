"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

export function CountryCoverage() {
  const t = useTranslations("countryCoverage");
  const lang = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const countries = t.raw("countries") as Array<{ flag: string; name: string; law: string }>;

  return (
    <section ref={ref} className="bg-[var(--navy)] py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 space-y-3"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[var(--cream)]">{t("title")}</h2>
          <p className="font-body text-[#a0b0c0] max-w-lg mx-auto">{t("sub")}</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {countries.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
              className="rounded-xl border border-[var(--sand)]/20 bg-[var(--slate)]/30 p-4 text-center space-y-1"
            >
              <span className="text-3xl">{c.flag}</span>
              <p className="font-ui text-sm font-semibold text-[var(--cream)]">{c.name}</p>
              <p className="font-ui text-xs text-[#8B9BB0]">{c.law}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8 text-center space-y-2"
        >
          <p className="font-body text-xs text-[#6b7f90] max-w-lg mx-auto">{t("note")}</p>
          <Link href={`/${lang}/methodology`} className="font-ui text-sm text-[var(--gold)] hover:underline">
            {t("link")}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
