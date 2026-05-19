"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

type Props = {
  value: number;
  onChange: (val: number) => void;
  placeholder?: string;
  className?: string;
  prefix?: string;
  min?: number;
  max?: number;
  disabled?: boolean;
};

const LOCALE_MAP: Record<string, string> = {
  tr: "tr-TR",
  de: "de-DE",
  fr: "fr-FR",
  es: "es-ES",
  ar: "ar-SA",
  en: "en-US",
};

const DEFAULT_PLACEHOLDER: Record<string, string> = {
  tr: "Örn: 500.000",
  de: "Z.B. 500.000",
  fr: "Ex: 500 000",
  es: "Ej: 500.000",
  ar: "مثال: 500,000",
  en: "e.g. 500,000",
};

export function NumericInput({
  value,
  onChange,
  placeholder,
  className,
  prefix,
  min,
  max,
  disabled,
}: Props) {
  const locale = useLocale();
  const numberLocale = LOCALE_MAP[locale] ?? "en-US";
  const [focused, setFocused] = useState(false);

  const displayValue = focused
    ? value === 0 ? "" : value.toString()
    : value === 0 ? "" : new Intl.NumberFormat(numberLocale).format(value);

  return (
    <div className="relative">
      {prefix && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--brown)] text-sm pointer-events-none">
          {prefix}
        </span>
      )}
      <input
        type="text"
        inputMode="numeric"
        value={displayValue}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^0-9]/g, "");
          const num = raw === "" ? 0 : Number(raw);
          if (min !== undefined && num < min) return;
          if (max !== undefined && num > max) return;
          onChange(num);
        }}
        placeholder={placeholder ?? DEFAULT_PLACEHOLDER[locale] ?? "e.g. 500,000"}
        className={cn(prefix ? "pl-7" : "", className)}
      />
    </div>
  );
}
