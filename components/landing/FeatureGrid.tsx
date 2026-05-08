"use client";

import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { LayoutGrid, Globe, FileText } from "lucide-react";

const ICONS = [LayoutGrid, Globe, FileText];

export function FeatureGrid() {
  const t = useTranslations("features");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const items = t.raw("items") as Array<{ title: string; desc: string }>;

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.12, duration: 0.6 }}
                className="group bg-white rounded-xl border border-[var(--sand)] p-6 shadow-sm hover:border-l-[3px] hover:border-l-[var(--gold)] transition-all duration-200 space-y-3"
              >
                <div className="w-10 h-10 rounded-lg bg-[var(--gold)]/10 flex items-center justify-center">
                  <Icon size={20} className="text-[var(--gold)]" />
                </div>
                <h3 className="font-display text-lg font-bold text-[var(--navy)]">{item.title}</h3>
                <p className="font-body text-sm text-[var(--brown)] leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
