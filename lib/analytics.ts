import posthog from "posthog-js";

let initialized = false;

export function initAnalytics() {
  if (typeof window === "undefined" || initialized) return;
  const consent = localStorage.getItem("sl_cookie_consent");
  if (consent !== "accepted") return;

  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host:
      process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://app.posthog.com",
    persistence: "localStorage",
    autocapture: false,
    capture_pageview: true,
  });
  initialized = true;
}

export function track(
  event: string,
  props?: Record<string, string | number | boolean | null>
) {
  if (typeof window === "undefined") return;
  try {
    posthog.capture(event, props);
  } catch {
    // Analytics errors must never break the main flow
  }
}

export function identify(
  userId: string,
  props?: Record<string, string | number | boolean | null>
) {
  if (typeof window === "undefined") return;
  try {
    posthog.identify(userId, props);
  } catch {
    // Analytics errors must never break the main flow
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
