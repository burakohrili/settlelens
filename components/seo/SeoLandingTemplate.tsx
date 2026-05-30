import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Check, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface SeoFaqItem { q: string; a: string }
export interface SeoSection { heading: string; body: string }

export interface SeoRelatedLink { title: string; href: string; description: string }

export interface SeoPageConfig {
  locale: string;
  badge: string;
  headline: string;
  intro: string;
  sections: SeoSection[];
  checklist?: string[];
  faq?: SeoFaqItem[];
  relatedLinks?: SeoRelatedLink[];
  ctaText: string;
  ctaHref: string;
  ctaSub?: string;
  disclaimer: string;
}

const RELATED_LABEL: Record<string, string> = {
  de: "Verwandte Themen", tr: "İlgili Konular", fr: "Sujets connexes",
  es: "Temas relacionados", ar: "مواضيع ذات صلة", en: "Related Topics",
};

export function SeoLandingTemplate({ config }: { config: SeoPageConfig }) {
  const { locale, badge, headline, intro, sections, checklist, faq, relatedLinks, ctaText, ctaHref, ctaSub, disclaimer } = config;

  return (
    <>
      {faq && faq.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faq.map((item) => ({
                "@type": "Question",
                name: item.q,
                acceptedAnswer: { "@type": "Answer", text: item.a },
              })),
            }),
          }}
        />
      )}
      <Header />
      <main className="bg-[var(--cream)]">

        {/* Hero */}
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-12 text-center">
          <span className="inline-block bg-[var(--gold)]/10 text-[var(--gold)] font-ui text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-5">
            {badge}
          </span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--navy)] mb-6 leading-tight">
            {headline}
          </h1>
          <p className="font-body text-lg text-[var(--brown)] max-w-2xl mx-auto mb-10 leading-relaxed">
            {intro}
          </p>
          <Link
            href={ctaHref}
            className={cn(buttonVariants(), "bg-[var(--gold)] text-[var(--navy)] font-bold hover:bg-[var(--gold)]/90 text-base px-8 py-6 inline-flex items-center gap-2")}
          >
            {ctaText} <ChevronRight size={16} />
          </Link>
          {ctaSub && (
            <p className="font-ui text-xs text-[var(--brown)] mt-3 opacity-70">{ctaSub}</p>
          )}
        </section>

        {/* Content sections */}
        <section className="bg-white py-16 px-4">
          <div className="max-w-3xl mx-auto space-y-10">
            {sections.map((s, i) => (
              <div key={i}>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-[var(--navy)] mb-3">{s.heading}</h2>
                <p className="font-body text-[var(--brown)] leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Checklist */}
        {checklist && checklist.length > 0 && (
          <section className="bg-[var(--cream)] py-16 px-4">
            <div className="max-w-3xl mx-auto">
              <ul className="space-y-3">
                {checklist.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 bg-white border border-[var(--sand)] rounded-lg px-5 py-4">
                    <Check size={16} className="text-[var(--gold)] mt-0.5 shrink-0" />
                    <span className="font-body text-sm text-[var(--navy)]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* FAQ */}
        {faq && faq.length > 0 && (
          <section className="bg-white py-16 px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-display text-2xl font-bold text-[var(--navy)] mb-8 text-center">
                {locale === "tr" ? "Sık Sorulan Sorular" : locale === "de" ? "Häufige Fragen" : locale === "fr" ? "Questions fréquentes" : locale === "es" ? "Preguntas frecuentes" : locale === "ar" ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
              </h2>
              <div className="space-y-4">
                {faq.map((item, i) => (
                  <div key={i} className="border border-[var(--sand)] rounded-xl p-5">
                    <p className="font-ui font-semibold text-[var(--navy)] mb-2">{item.q}</p>
                    <p className="font-body text-sm text-[var(--brown)] leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Related Links */}
        {relatedLinks && relatedLinks.length > 0 && (
          <section className="bg-[var(--cream)] py-12 px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-display text-xl font-bold text-[var(--navy)] mb-6">
                {RELATED_LABEL[locale] ?? RELATED_LABEL.en}
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {relatedLinks.map((link, i) => (
                  <Link
                    key={i}
                    href={link.href}
                    className="flex flex-col gap-1 border border-[var(--sand)] rounded-xl p-4 bg-white hover:border-[var(--slate)] transition-colors"
                  >
                    <span className="font-ui text-sm font-semibold text-[var(--navy)]">{link.title}</span>
                    <span className="font-body text-xs text-[var(--brown)]">{link.description}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <section className="bg-[var(--navy)] py-16 px-4 text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-[var(--cream)] mb-4">{ctaText}</h2>
            <Link
              href={ctaHref}
              className={cn(buttonVariants(), "bg-[var(--gold)] text-[var(--navy)] font-bold hover:bg-[var(--gold)]/90 px-8 py-5")}
            >
              {ctaText} <ChevronRight size={16} className="ml-1" />
            </Link>
            {ctaSub && <p className="font-ui text-xs text-[var(--sand)] mt-4 opacity-70">{ctaSub}</p>}
          </div>
        </section>

        {/* Disclaimer */}
        <div className="max-w-3xl mx-auto px-4 py-8">
          <p className="font-ui text-xs text-[var(--brown)] text-center leading-relaxed opacity-70">{disclaimer}</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
