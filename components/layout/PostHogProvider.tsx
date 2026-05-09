"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

function PageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ph = usePostHog();

  useEffect(() => {
    if (!pathname || !ph) return;
    const url =
      window.location.origin +
      pathname +
      (searchParams.toString() ? `?${searchParams.toString()}` : "");
    ph.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams, ph]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return;

    const consent = localStorage.getItem("sl_cookie_consent");
    if (consent !== "accepted") {
      // Listen for explicit acceptance from CookieBanner
      const handler = () => {
        posthog.init(key, {
          api_host:
            process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "/ingest",
          ui_host: "https://us.posthog.com",
          capture_pageview: false, // manual via PageviewTracker
          capture_pageleave: true,
          persistence: "localStorage+cookie",
        });
      };
      window.addEventListener("sl:cookie-accepted", handler, { once: true });
      return () => window.removeEventListener("sl:cookie-accepted", handler);
    }

    posthog.init(key, {
      api_host:
        process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "/ingest",
      ui_host: "https://us.posthog.com",
      capture_pageview: false,
      capture_pageleave: true,
      persistence: "localStorage+cookie",
    });
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
