"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type DisclaimerProps = {
  variant?: "short" | "full";
  className?: string;
};

export function Disclaimer({ variant = "short", className }: DisclaimerProps) {
  const t = useTranslations("disclaimer");
  return (
    <div
      className={cn(
        "rounded-md border border-[var(--sand)] bg-[var(--cream)] px-4 py-2.5 text-xs text-[var(--brown)]",
        className
      )}
    >
      <span className="font-ui">⚠ </span>
      {t(variant)}
    </div>
  );
}
