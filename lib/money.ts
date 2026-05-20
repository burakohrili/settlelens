const LOCALE_MAP: Record<string, string> = {
  en: "en-US",
  tr: "tr-TR",
  de: "de-DE",
  fr: "fr-FR",
  es: "es-ES",
  ar: "ar-SA",
};

export function formatMoney(
  amount: number,
  currency: string,
  locale: string = "en"
): string {
  const bcp47 = LOCALE_MAP[locale] ?? "en-US";
  return new Intl.NumberFormat(bcp47, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount || 0);
}
