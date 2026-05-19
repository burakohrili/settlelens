"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  value: number;
  currency?: string;
  integer?: boolean;
  suffix?: string;
  className?: string;
};

export function CountUpNumber({ value, currency, integer = false, suffix, className }: Props) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const duration = 900;
    let start: number | null = null;

    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [value]);

  const formatted = integer
    ? display.toString()
    : currency
    ? new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(display)
    : display.toString();

  return (
    <span className={className}>
      {formatted}
      {suffix && <span className="text-xs font-normal">{suffix}</span>}
    </span>
  );
}
