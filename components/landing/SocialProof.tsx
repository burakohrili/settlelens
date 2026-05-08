"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function SocialProof() {
  const t = useTranslations("social");
  const quotes = t.raw("quotes") as Array<{ text: string; author: string }>;
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function start() {
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % quotes.length);
    }, 4000);
  }

  function stop() {
    if (timerRef.current) clearInterval(timerRef.current);
  }

  useEffect(() => {
    start();
    return stop;
  });

  return (
    <section
      className="bg-[#0F1A25] py-24 px-4"
      onMouseEnter={stop}
      onMouseLeave={start}
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-display text-3xl font-bold text-[var(--cream)] mb-12">{t("title")}</h2>

        <div className="relative min-h-[160px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="flex justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-[var(--gold)] text-lg">★</span>
                ))}
              </div>
              <p className="font-display italic text-xl text-[var(--cream)] leading-relaxed">
                &ldquo;{quotes[active].text}&rdquo;
              </p>
              <p className="font-mono text-xs text-[var(--sand)] tracking-widest uppercase">
                — {quotes[active].author}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {quotes.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === active ? "bg-[var(--gold)] w-5" : "bg-[var(--sand)]/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
