"use client";

import { useLocale } from "next-intl";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink } from "lucide-react";

const CONTENT: Record<string, { quote: string; attribution: string; company: string }> = {
  en: {
    quote: "During divorce, people face not only legal uncertainty but financial uncertainty. SettleLens was built to reduce that uncertainty — to help users arrive at their attorney meetings with a clearer picture of what they're looking at. Our goal is not to make decisions for anyone. Our goal is to make the financial picture visible before decisions are made.",
    attribution: "Burak Ohrili — Founder, Noesis",
    company: "Noesis · Bornova, İzmir",
  },
  tr: {
    quote: "Boşanma sürecinde insanlar çoğu zaman yalnızca hukuki değil, finansal olarak da belirsizlik yaşar. SettleLens, bu belirsizliği azaltmak ve kullanıcıların avukat görüşmesine daha hazırlıklı gitmesini sağlamak için geliştirildi. Amacımız karar vermek değil; karar öncesi tabloyu görünür hale getirmek.",
    attribution: "Burak Ohrili — Kurucu, Noesis",
    company: "Noesis · Bornova, İzmir",
  },
  de: {
    quote: "Bei einer Scheidung sind Menschen nicht nur mit rechtlicher, sondern auch mit finanzieller Ungewissheit konfrontiert. SettleLens wurde entwickelt, um diese Ungewissheit zu reduzieren — damit Nutzer besser vorbereitet zum Anwalt gehen. Unser Ziel ist nicht, Entscheidungen zu treffen. Unser Ziel ist es, das Finanzbild sichtbar zu machen, bevor Entscheidungen getroffen werden.",
    attribution: "Burak Ohrili — Gründer, Noesis",
    company: "Noesis · Bornova, İzmir",
  },
  fr: {
    quote: "Lors d'un divorce, les gens font face non seulement à une incertitude juridique, mais aussi financière. SettleLens a été conçu pour réduire cette incertitude — pour aider les utilisateurs à arriver à leurs réunions avec leur avocat avec une image plus claire de leur situation. Notre objectif n'est pas de prendre des décisions. Notre objectif est de rendre le tableau financier visible avant que les décisions soient prises.",
    attribution: "Burak Ohrili — Fondateur, Noesis",
    company: "Noesis · Bornova, İzmir",
  },
  es: {
    quote: "Durante un divorcio, las personas enfrentan no solo incertidumbre legal, sino también financiera. SettleLens fue creado para reducir esa incertidumbre — para ayudar a los usuarios a llegar a sus reuniones con el abogado con una imagen más clara de lo que tienen. Nuestro objetivo no es tomar decisiones por nadie. Nuestro objetivo es hacer visible el panorama financiero antes de que se tomen decisiones.",
    attribution: "Burak Ohrili — Fundador, Noesis",
    company: "Noesis · Bornova, İzmir",
  },
  ar: {
    quote: "أثناء الطلاق، يواجه الناس ليس فقط عدم اليقين القانوني، بل أيضاً عدم اليقين المالي. تم تطوير SettleLens لتقليل هذا الغموض — لمساعدة المستخدمين على الوصول إلى اجتماعاتهم مع محاميهم بصورة أوضح عما ينتظرهم. هدفنا ليس اتخاذ القرارات لأحد. هدفنا هو جعل الصورة المالية مرئية قبل اتخاذ القرارات.",
    attribution: "براق أوهريلي — المؤسس، Noesis",
    company: "Noesis · بورنوفا، إزمير",
  },
};

export function FounderNote() {
  const locale = useLocale();
  const c = CONTENT[locale] ?? CONTENT.en;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="bg-[var(--cream)] py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          {/* Large quote mark */}
          <span
            aria-hidden
            className="absolute -top-6 -left-2 font-display text-8xl text-[var(--gold)]/20 leading-none select-none"
          >
            &ldquo;
          </span>

          <blockquote className="relative bg-white border border-[var(--sand)] rounded-2xl px-8 pt-10 pb-8 shadow-sm">
            <p className="font-body text-lg text-[var(--navy)] leading-relaxed mb-8">
              {c.quote}
            </p>

            <div className="flex items-center gap-4 border-t border-[var(--sand)] pt-6">
              {/* Avatar placeholder */}
              <div className="w-12 h-12 rounded-full bg-[var(--navy)] flex items-center justify-center shrink-0">
                <span className="font-display text-lg font-bold text-[var(--gold)]">B</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-ui font-semibold text-[var(--navy)] text-sm">{c.attribution}</p>
                <p className="font-ui text-xs text-[var(--brown)] mt-0.5">{c.company}</p>
              </div>
              <a
                href="https://linkedin.com/in/burakohrili"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex items-center gap-1 font-ui text-xs text-[var(--brown)] hover:text-[var(--gold)] transition-colors shrink-0"
              >
                <span>in</span>
                <ExternalLink size={10} />
              </a>
            </div>
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
}
