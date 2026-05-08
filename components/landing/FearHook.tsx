"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

function useCountUp(target: number, inView: boolean, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return count;
}

const STATS = [
  { num: "73%", label: "of divorcing couples overpay in legal fees" },
  { num: "20 min", label: "vs. months of attorney back-and-forth" },
  { num: "50×", label: "estimated ROI vs. average legal fee cost" },
];

export function FearHook() {
  const t = useTranslations("fearHook");
  const lang = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const count = useCountUp(15000, inView);

  return (
    <section ref={ref} className="bg-[var(--cream)] py-24 px-4">
      <div className="max-w-4xl mx-auto text-center space-y-10">
        {/* Big stat */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="space-y-2"
        >
          <p className="font-mono text-7xl sm:text-8xl font-bold text-[var(--navy)]">
            ${count.toLocaleString()}+
          </p>
          <p className="font-body text-lg text-[var(--brown)]">{t("statLabel")}</p>
        </motion.div>

        {/* Hook */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="font-display italic text-2xl sm:text-3xl text-[var(--navy)] max-w-[600px] mx-auto leading-relaxed"
        >
          {t("hook")}
        </motion.p>

        {/* 3 mini stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
              className="text-center space-y-1"
            >
              <p className="font-mono text-3xl font-bold text-[var(--gold)]">{s.num}</p>
              <p className="font-body text-sm text-[var(--brown)]">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Link
            href={`/${lang}/register`}
            className={cn(buttonVariants({ variant: "outline" }), "border-[var(--navy)] text-[var(--navy)] hover:bg-[var(--navy)] hover:text-white transition-colors")}
          >
            {t("cta")}
          </Link>
          <p className="mt-3 font-ui text-xs text-[var(--brown)]">
            Preparation tool — not a replacement for professional legal advice.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
