import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ExternalLink } from "lucide-react";

export function Footer() {
  const locale = useLocale();
  const t = useTranslations("footer");
  const links = t.raw("links") as Record<string, string>;

  const productLinks = [
    { key: "howItWorks", href: `/${locale}/#how-it-works` },
    { key: "pricing", href: `/${locale}/#pricing` },
    { key: "blog", href: `/${locale}/blog` },
  ];

  const legalLinks = [
    { key: "privacy", href: `/${locale}/privacy` },
    { key: "terms", href: `/${locale}/terms` },
    { key: "cookies", href: `/${locale}/cookie-policy` },
    ...(locale === "tr"
      ? [{ key: "kvkk", href: `/tr/aydinlatma-metni`, label: "KVKK" }]
      : []),
    ...(locale === "de"
      ? [{ key: "impressum", href: `/de/impressum`, label: "Impressum" }]
      : []),
  ];

  const companyLinks = [
    { key: "about", href: `/${locale}/about` },
    { key: "contact", href: `/${locale}/contact` },
    { key: "trust", href: `/${locale}/trust` },
    { key: "methodology", href: `/${locale}/methodology` },
  ];

  return (
    <footer className="bg-[#111923] pt-12 pb-6" dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Col 1: Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className="font-display text-lg font-semibold text-[var(--gold)]">
              SettleLens
            </p>
            <p className="mt-1 font-ui text-xs text-[var(--sand)]">
              {t("tagline")}
            </p>
            <p className="mt-3 font-ui text-xs leading-relaxed text-[var(--brown)]">
              {t("disclaimer")}
            </p>
            {/* Trust badges */}
            <div className="mt-4 flex flex-wrap gap-2">
              {["AES-256", "GDPR", "KVKK"].map((b) => (
                <span key={b} className="inline-block font-ui text-[9px] font-semibold tracking-wide text-[var(--brown)]/70 border border-[var(--slate)]/40 rounded px-1.5 py-0.5">
                  {b}
                </span>
              ))}
            </div>
            <div className="mt-4 flex gap-3">
              <a
                href="https://twitter.com/settlelens"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X / Twitter"
                className="font-ui text-[10px] text-[var(--brown)] hover:text-[var(--gold)] transition-colors flex items-center gap-0.5"
              >
                𝕏 <ExternalLink size={10} />
              </a>
              <a
                href="https://linkedin.com/company/settlelens"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="font-ui text-[10px] text-[var(--brown)] hover:text-[var(--gold)] transition-colors flex items-center gap-0.5"
              >
                in <ExternalLink size={10} />
              </a>
            </div>
          </div>

          {/* Col 2: Product */}
          <div>
            <p className="font-ui text-xs font-semibold uppercase tracking-widest text-[var(--sand)]">
              {t("product")}
            </p>
            <ul className="mt-3 space-y-2">
              {productLinks.map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="font-ui text-sm text-[var(--brown)] hover:text-[var(--cream)] transition-colors"
                  >
                    {links[key]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Legal */}
          <div>
            <p className="font-ui text-xs font-semibold uppercase tracking-widest text-[var(--sand)]">
              {t("legal")}
            </p>
            <ul className="mt-3 space-y-2">
              {legalLinks.map(({ key, href, label }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="font-ui text-sm text-[var(--brown)] hover:text-[var(--cream)] transition-colors"
                  >
                    {label ?? links[key]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Company */}
          <div>
            <p className="font-ui text-xs font-semibold uppercase tracking-widest text-[var(--sand)]">
              {t("company")}
            </p>
            <ul className="mt-3 space-y-2">
              {companyLinks.map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="font-ui text-sm text-[var(--brown)] hover:text-[var(--cream)] transition-colors"
                  >
                    {links[key]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Locale-specific compliance notes */}
        {locale === "fr" && (
          <div className="mt-6 rounded-md border border-[var(--slate)] px-4 py-2 font-ui text-xs text-[var(--brown)]">
            🇫🇷 Conforme au RGPD · Données traitées sur le territoire de l&apos;UE · Délégué à la protection des données : <a href="mailto:privacy@settlelens.com" className="hover:text-[var(--cream)] underline">privacy@settlelens.com</a> · <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--cream)] underline">CNIL</a>
          </div>
        )}
        {locale === "es" && (
          <div className="mt-6 rounded-md border border-[var(--slate)] px-4 py-2 font-ui text-xs text-[var(--brown)]">
            🇪🇸 Conforme al RGPD · Datos tratados en la UE · Delegado de protección de datos: <a href="mailto:privacy@settlelens.com" className="hover:text-[var(--cream)] underline">privacy@settlelens.com</a> · <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--cream)] underline">AEPD</a> · Los precios incluyen IVA aplicable
          </div>
        )}
        {locale === "de" && (
          <div className="mt-6 rounded-md border border-[var(--slate)] px-4 py-2 font-ui text-xs text-[var(--brown)]">
            🇩🇪 DSGVO-konform · Daten in der EU verarbeitet · Datenschutzbeauftragter: <a href="mailto:privacy@settlelens.com" className="hover:text-[var(--cream)] underline">privacy@settlelens.com</a> · Alle Preise inkl. MwSt.
          </div>
        )}

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-[var(--slate)] pt-6 sm:flex-row">
          <p className="font-ui text-xs text-[var(--brown)]">{t("copyright")}</p>
          {/* Payment method badges */}
          <div className="flex items-center gap-2" aria-label="Payment methods">
            {/* Paddle */}
            <span className="inline-flex items-center border border-[var(--slate)]/50 rounded px-2 py-0.5 font-ui text-[9px] font-bold text-[var(--brown)]/60 tracking-wide">
              PADDLE
            </span>
            {/* Visa */}
            <span className="inline-flex items-center border border-[var(--slate)]/50 rounded px-2 py-0.5 font-ui text-[9px] font-bold text-[var(--brown)]/60 tracking-wide italic">
              VISA
            </span>
            {/* Mastercard — two overlapping circles */}
            <span className="inline-flex items-center gap-0 border border-[var(--slate)]/50 rounded px-2 py-0.5">
              <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-label="Mastercard">
                <circle cx="6" cy="6" r="5" fill="#EB001B" opacity="0.6" />
                <circle cx="12" cy="6" r="5" fill="#F79E1B" opacity="0.6" />
              </svg>
            </span>
          </div>
          <LanguageSwitcher variant="dark" />
        </div>
      </div>
    </footer>
  );
}
