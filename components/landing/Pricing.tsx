"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Check } from "lucide-react";

export function Pricing() {
  const t = useTranslations("pricing");
  const lang = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const plans = t.raw("plans") as Array<{
    id: string; name: string; price: string; period: string;
    badge?: string; features: string[]; cta: string;
  }>;

  return (
    <section ref={ref} className="bg-[var(--cream)] py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-display text-3xl sm:text-4xl font-bold text-[var(--navy)] text-center mb-12"
        >
          {t("title")}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {plans.map((plan, i) => {
            const isPopular = !!plan.badge;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.6 }}
                className={cn(
                  "rounded-xl border p-6 flex flex-col relative",
                  isPopular
                    ? "bg-[var(--navy)] text-[var(--cream)] border-[var(--navy)] scale-105 shadow-xl"
                    : "bg-white border-[var(--sand)]"
                )}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-[var(--gold)] text-[var(--navy)] font-ui text-xs font-bold px-3 py-1 rounded-full">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="mb-4">
                  <p className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: isPopular ? "#C8973A" : "#8B7355" }}>
                    {plan.name}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono text-4xl font-bold" style={{ color: isPopular ? "#fff" : "#1C2B3A" }}>
                      {plan.price}
                    </span>
                  </div>
                  <p className="font-body text-xs mt-1" style={{ color: isPopular ? "#a0b0c0" : "#8B7355" }}>
                    {plan.period}
                  </p>
                </div>

                <ul className="space-y-2 flex-1 mb-6">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <Check size={14} className={cn("mt-0.5 flex-shrink-0", isPopular ? "text-[var(--gold)]" : "text-[var(--gold)]")} />
                      <span className="font-body text-sm" style={{ color: isPopular ? "#d0d0d0" : "#8B7355" }}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/${lang}/register`}
                  className={cn(
                    buttonVariants(),
                    "text-center w-full",
                    isPopular
                      ? "bg-[var(--gold)] text-[var(--navy)] hover:bg-[var(--gold)]/90 font-bold"
                      : "bg-transparent border border-[var(--sand)] text-[var(--navy)] hover:bg-[var(--sand)]"
                  )}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center font-ui text-xs text-[var(--brown)] mt-8"
        >
          All plans: Secure, private. Financial modeling, not legal advice.
        </motion.p>
      </div>
    </section>
  );
}
