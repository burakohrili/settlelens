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
    { key: "trust", href: `/${locale}/trust`, label: "Trust & Privacy" },
    { key: "methodology", href: `/${locale}/methodology`, label: "Methodology" },
  ];

  return (
    <footer className="bg-[#111923] pt-12 pb-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Col 1: Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className="font-display text-lg font-semibold text-[var(--gold)]">
              SettleLens
            </p>
            <p className="mt-1 font-ui text-xs text-[var(--sand)]">
              See Your Settlement Clearly
            </p>
            <p className="mt-3 font-ui text-xs leading-relaxed text-[var(--brown)]">
              {t("disclaimer")}
            </p>
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
              Product
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
              Legal
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
              Company
            </p>
            <ul className="mt-3 space-y-2">
              {companyLinks.map(({ key, href, label }) => (
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
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-[var(--slate)] pt-6 sm:flex-row">
          <p className="font-ui text-xs text-[var(--brown)]">{t("copyright")}</p>
          <LanguageSwitcher variant="dark" />
        </div>
      </div>
    </footer>
  );
}
