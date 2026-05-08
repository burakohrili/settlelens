"use client";

import { useEffect } from "react";
import { initAnalytics } from "@/lib/analytics";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only initialise after consent is stored — CookieBanner sets this
    const handleConsent = () => initAnalytics();
    window.addEventListener("sl:cookie-accepted", handleConsent);
    // Also check on mount in case consent was given in a prior session
    initAnalytics();
    return () => window.removeEventListener("sl:cookie-accepted", handleConsent);
  }, []);

  return <>{children}</>;
}
