"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Disclaimer } from "@/components/layout/Disclaimer";

export function FinalCTA() {
  const t = useTranslations("finalCta");
  const lang = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="bg-[var(--navy)] py-28 px-4">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="font-display text-4xl sm:text-5xl font-bold italic text-[var(--cream)]"
        >
          {t("title")}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="font-body text-lg text-[var(--sand)]"
        >
          {t("sub")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="space-y-3"
        >
          <Link
            href={`/${lang}/register`}
            className={cn(
              buttonVariants(),
              "h-16 px-10 bg-[var(--gold)] text-[var(--navy)] font-display font-bold text-xl hover:bg-[var(--gold)]/90 hover:scale-105 transition-transform"
            )}
          >
            {t("cta")}
          </Link>
          <p className="font-ui text-sm text-[var(--sand)]/60">{t("note")}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Disclaimer className="opacity-60" />
        </motion.div>
      </div>
    </section>
  );
}
