"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export function AttorneyPrepCTA() {
  const t = useTranslations("attorneyPrep");
  const lang = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="bg-[var(--cream)] py-24 px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="max-w-2xl mx-auto text-center space-y-6"
      >
        <h2 className="font-display text-3xl sm:text-4xl font-bold italic text-[var(--navy)]">{t("title")}</h2>
        <p className="font-body text-lg text-[var(--brown)] leading-relaxed">{t("sub")}</p>
        <div className="space-y-2">
          <Link
            href={`/${lang}/register`}
            className={cn(buttonVariants(), "h-14 px-8 bg-[var(--gold)] text-[var(--navy)] font-bold text-base hover:bg-[var(--gold)]/90")}
          >
            {t("cta")}
          </Link>
          <p className="font-ui text-xs text-[var(--brown)]">{t("note")}</p>
        </div>
      </motion.div>
    </section>
  );
}
