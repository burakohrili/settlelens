"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { ChevronRight } from "lucide-react";

const EN_LINKS = [
  { title: "How Is Alimony Calculated?", href: "/en/how-is-alimony-calculated", desc: "Income-based formulas, state variations, duration rules" },
  { title: "What Is Equitable Distribution?", href: "/en/what-is-equitable-distribution", desc: "How 41 US states divide marital property" },
  { title: "Divorce Financial Settlement UK", href: "/en/divorce-financial-settlement-uk", desc: "MCA 1973 Section 25 — England & Wales guide" },
  { title: "What Is a QDRO?", href: "/en/what-is-a-qdro", desc: "Splitting retirement accounts in divorce" },
  { title: "Child Support in Divorce", href: "/en/child-support-divorce", desc: "Income shares model, guidelines, 10-year cost" },
  { title: "Consent Order Divorce UK", href: "/en/consent-order-divorce-uk", desc: "Why verbal agreements aren't enough" },
];

const TR_LINKS = [
  { title: "Nafaka Nasıl Hesaplanır?", href: "/tr/nafaka-finansal-etki-hesaplama", desc: "TMK 175 kapsamında nafaka ve 10 yıllık etki" },
  { title: "Mal Paylaşımı Hesaplama", href: "/tr/bosanma-mal-paylasimi-hesaplama", desc: "Edinilmiş mallara katılma rejimi" },
  { title: "Boşanmada Evi Kime Kalır?", href: "/tr/bosanmada-ev-kime-kalir", desc: "Evi satmak mı, kalmak mı? Finansal karşılaştırma" },
  { title: "Avukat Hazırlık Kılavuzu", href: "/tr/bosanma-avukat-gorusmesi-hazirlik", desc: "İlk görüşmeye hazır gitmek için kontrol listesi" },
];

const DE_LINKS = [
  { title: "Zugewinnausgleich berechnen", href: "/de/zugewinnausgleich-berechnen", desc: "BGB §1363 — Nettozugewinn Schritt für Schritt" },
  { title: "Ehegattenunterhalt berechnen", href: "/de/ehegattenunterhalt-berechnen", desc: "Unterhaltshöhe und Dauer berechnen" },
  { title: "Kindesunterhalt Scheidung", href: "/de/kindesunterhalt-scheidung", desc: "Düsseldorfer Tabelle und Einkommensmodell" },
  { title: "Haus behalten oder verkaufen?", href: "/de/scheidung-haus-behalten-oder-verkaufen", desc: "Finanzielle Konsequenzen im Vergleich" },
];

const HEADINGS: Record<string, string> = {
  en: "Explore Your Situation",
  tr: "Durumunuzu Derinlemesine İnceleyin",
  de: "Ihr Thema vertiefen",
  fr: "Approfondir votre situation",
  es: "Explore su situación",
  ar: "استكشف وضعك",
};

const SUBHEADINGS: Record<string, string> = {
  en: "In-depth guides covering every major divorce financial decision",
  tr: "Her büyük boşanma finansal kararı için kapsamlı rehberler",
  de: "Ausführliche Leitfäden für alle wichtigen Scheidungsfinanzentscheidungen",
  fr: "Guides approfondis sur les principales décisions financières de divorce",
  es: "Guías detalladas sobre las principales decisiones financieras del divorcio",
  ar: "أدلة متعمقة تغطي كل قرار مالي رئيسي في الطلاق",
};

export function SeoLinksSection() {
  const lang = useLocale();
  const links = lang === "tr" ? TR_LINKS : lang === "de" ? DE_LINKS : EN_LINKS;
  const heading = HEADINGS[lang] ?? HEADINGS.en;
  const subheading = SUBHEADINGS[lang] ?? SUBHEADINGS.en;

  return (
    <section className="bg-[var(--cream)] py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[var(--navy)] mb-3">{heading}</h2>
          <p className="font-body text-[var(--brown)] max-w-xl mx-auto">{subheading}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex flex-col gap-2 border border-[var(--sand)] rounded-xl p-5 bg-white hover:border-[var(--gold)] hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-ui text-sm font-semibold text-[var(--navy)] leading-snug">{link.title}</span>
                <ChevronRight size={14} className="text-[var(--gold)] shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <span className="font-body text-xs text-[var(--brown)]">{link.desc}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
