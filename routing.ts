export const locales = ["en", "tr", "de", "fr", "es", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
