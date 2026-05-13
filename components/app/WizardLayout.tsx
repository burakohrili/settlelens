"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft } from "lucide-react";

type Props = {
  currentStep: number;
  totalSteps?: number;
  onBack?: () => void;
  onNext?: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  children: React.ReactNode;
};

export function WizardLayout({
  currentStep,
  totalSteps = 6,
  onBack,
  onNext,
  nextDisabled = false,
  nextLabel,
  children,
}: Props) {
  const t = useTranslations("onboarding");
  const pct = Math.round((currentStep / totalSteps) * 100);
  const steps = t.raw("steps") as Array<{ title: string }>;
  const title = steps[currentStep - 1]?.title ?? "";

  return (
    <div className="flex min-h-0 flex-col gap-4">
      {/* Progress header */}
      <div>
        <div className="flex items-center justify-between font-ui text-xs text-[var(--brown)]">
          <span>{t("stepOf", { current: currentStep, total: totalSteps })}</span>
          <span className="font-semibold text-[var(--navy)]">{title}</span>
        </div>
        <Progress
          value={pct}
          className="mt-2 h-1.5 bg-[var(--sand)] [&>div]:bg-[var(--gold)] [&>div]:transition-all"
        />
      </div>

      {/* Content */}
      <div className="flex-1">{children}</div>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-[var(--sand)] pt-4">
        {onBack ? (
          <button
            onClick={onBack}
            className={cn(buttonVariants({ variant: "ghost" }), "flex items-center gap-1 text-[var(--brown)]")}
          >
            <ChevronLeft size={16} />
            {t("back")}
          </button>
        ) : (
          <span />
        )}

        {onNext && (
          <button
            onClick={onNext}
            disabled={nextDisabled}
            className={cn(
              buttonVariants(),
              "bg-[var(--gold)] text-[var(--navy)] font-semibold hover:bg-[var(--gold)]/90",
              nextDisabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {nextLabel ?? t("next")}
          </button>
        )}
      </div>
    </div>
  );
}
