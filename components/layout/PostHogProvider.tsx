"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "";

// Init — sadece bir kez çalışır, sayfanın en üstünde (module scope)
if (
  typeof window !== "undefined" &&
  POSTHOG_KEY &&
  !POSTHOG_KEY.startsWith("placeholder") &&
  !posthog.__loaded
) {
  posthog.init(POSTHOG_KEY, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    capture_pageview: false,   // PageviewTracker halleder
    capture_pageleave: true,
    persistence: "localStorage+cookie",
    opt_out_capturing_by_default: true, // GDPR: varsayılan kapalı
    loaded: (ph) => {
      // Önceki oturumda consent verilmişse hemen aç
      if (localStorage.getItem("sl_cookie_consent") === "accepted") {
        ph.opt_in_capturing();
      }
    },
  });
}

function PageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ph = usePostHog();

  useEffect(() => {
    if (!pathname || !ph) return;
    ph.capture("$pageview", {
      $current_url:
        window.location.origin +
        pathname +
        (searchParams.toString() ? `?${searchParams.toString()}` : ""),
    });
  }, [pathname, searchParams, ph]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Cookie banner "Accept" tıklanınca opt-in yap
    const handleAccept = () => posthog.opt_in_capturing();
    window.addEventListener("sl:cookie-accepted", handleAccept);
    return () => window.removeEventListener("sl:cookie-accepted", handleAccept);
  }, []);

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PageviewTracker />
      </Suspense>
      {children}
    </PHProvider>
  );
}
