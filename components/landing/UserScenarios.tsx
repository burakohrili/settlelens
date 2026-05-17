"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ChevronRight } from "lucide-react";
import { LeadModal } from "./LeadModal";

export function UserScenarios() {
  const t = useTranslations("userScenarios");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const cards = t.raw("cards") as Array<{ icon: string; title: string; desc: string }>;

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState("");

  const stageMap: Record<number, string> = {
    0: "considering",
    1: "started",
    2: "negotiating",
  };

  function handleCardClick(i: number) {
    setSelectedStage(stageMap[i] ?? "");
    setModalOpen(true);
  }

  return (
    <>
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
              <motion.button
                key={i}
                type="button"
                onClick={() => handleCardClick(i)}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.12, duration: 0.6 }}
                className="group bg-white rounded-xl border border-[var(--sand)] p-6 shadow-sm hover:border-l-[3px] hover:border-l-[var(--gold)] hover:shadow-md transition-all duration-200 space-y-3 text-left w-full cursor-pointer"
              >
                <span className="text-3xl">{card.icon}</span>
                <h3 className="font-display text-lg font-bold text-[var(--navy)]">{card.title}</h3>
                <p className="font-body text-sm text-[var(--brown)] leading-relaxed">{card.desc}</p>
                <div className="flex items-center gap-1 font-ui text-xs text-[var(--gold)] font-semibold pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>{t("cardCta") || "Start free"}</span>
                  <ChevronRight size={12} />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <LeadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialStage={selectedStage}
      />
    </>
  );
}
