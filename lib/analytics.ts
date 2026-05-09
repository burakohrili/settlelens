// Thin wrapper — PostHogProvider handles init and consent-gating.
// Use these helpers anywhere in the app for consistent event names.
import posthog from "posthog-js";

type Props = Record<string, string | number | boolean | null | undefined>;

export function track(event: string, props?: Props) {
  if (typeof window === "undefined") return;
  try {
    posthog.capture(event, props);
  } catch {
    // Analytics errors must never break the main flow
  }
}

export function identify(userId: string, props?: Props) {
  if (typeof window === "undefined") return;
  try {
    posthog.identify(userId, props);
  } catch {
    // ignore
  }
}

export function resetAnalytics() {
  if (typeof window === "undefined") return;
  try {
    posthog.reset();
  } catch {
    // ignore
  }
}

// Typed event catalogue — keeps event names consistent across the codebase
export const Events = {
  SIGNUP_COMPLETED: "signup_completed",
  ONBOARDING_STEP: "onboarding_step_completed",
  ANALYSIS_REQUESTED: "analysis_requested",
  ANALYSIS_COMPLETED: "analysis_completed",
  REPORT_DOWNLOADED: "report_downloaded",
  UPGRADE_CLICKED: "upgrade_clicked",
  PAYMENT_COMPLETED: "payment_completed",
  OFFER_COMPARISON_STARTED: "offer_comparison_started",
  HOUSE_SIMULATOR_USED: "house_simulator_used",
} as const;
