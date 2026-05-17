"use client";

import { useEffect } from "react";

export function LocaleSync({ locale }: { locale: string }) {
  useEffect(() => {
    const maxAge = 365 * 24 * 60 * 60;
    document.cookie = `SETTLELENS_LOCALE=${locale}; path=/; max-age=${maxAge}; SameSite=Lax`;
  }, [locale]);
  return null;
}
