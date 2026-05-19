"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type Props = {
  hasAssets: boolean;
  hasScenarios: boolean;
  hasAnalyses: boolean;
  hasOfferScenario: boolean;
};

export function JourneyProgress({ hasAssets, hasScenarios, hasAnalyses, hasOfferScenario }: Props) {
  const t = useTranslations("dashboard");

  const steps = [
    { key: "step1", done: hasAssets },
    { key: "step2", done: hasScenarios },
    { key: "step3", done: hasAnalyses },
    { key: "step4", done: hasOfferScenario },
    { key: "step5", done: false },
  ] as const;

  const currentIndex = steps.findIndex((s) => !s.done);
  const activeIndex = currentIndex === -1 ? steps.length : currentIndex;

  return (
    <div className="rounded-xl border border-[var(--sand)] bg-white px-4 py-3">
      <p className="font-ui text-xs font-semibold text-[var(--brown)] uppercase tracking-wide mb-3">
        {t("journey.title")}
      </p>

      {/* Desktop: full step track */}
      <div className="hidden md:flex items-center">
        {steps.map((step, i) => {
          const isDone = step.done;
          const isActive = i === activeIndex;
          const isPending = !isDone && !isActive;

          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-300",
                    isDone && "bg-[var(--gain)] text-white",
                    isActive && "ring-2 ring-[var(--gold)] bg-[var(--gold)] text-[var(--navy)]",
                    isPending && "border-2 border-[var(--sand)] bg-white text-[var(--brown)]"
                  )}
                >
                  {isDone ? "✓" : i + 1}
                </div>
                <span
                  className={cn(
                    "font-ui text-xs text-center leading-tight max-w-[72px]",
                    isDone && "text-[var(--brown)] opacity-60",
                    isActive && "text-[var(--navy)] font-medium",
                    isPending && "text-[var(--brown)] opacity-40"
                  )}
                >
                  {t(`journey.${step.key}` as "journey.step1")}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 mx-2 mb-5 rounded transition-colors duration-300",
                    i < activeIndex ? "bg-[var(--gain)]" : "bg-[var(--sand)]"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile: single line showing current step */}
      <div className="md:hidden flex items-center gap-2">
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ring-2 ring-[var(--gold)] bg-[var(--gold)] text-[var(--navy)]">
          {Math.min(activeIndex + 1, steps.length)}
        </div>
        <p className="font-ui text-xs text-[var(--navy)]">
          {t("journey.mobileCurrent", {
            current: Math.min(activeIndex + 1, steps.length),
            total: steps.length,
            label: t(`journey.${steps[Math.min(activeIndex, steps.length - 1)].key}` as "journey.step1"),
          })}
        </p>
        <div className="ml-auto flex gap-0.5">
          {steps.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1 w-4 rounded-full",
                i < activeIndex ? "bg-[var(--gain)]" : i === activeIndex ? "bg-[var(--gold)]" : "bg-[var(--sand)]"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
