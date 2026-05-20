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
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key || key.startsWith("placeholder")) return;

    // Henüz init olmadıysa başlat
    if (!posthog.__loaded) {
      posthog.init(key, {
        api_host: "https://us.i.posthog.com", // proxy yerine doğrudan
        capture_pageview: false,
        capture_pageleave: true,
        persistence: "localStorage+cookie",
        opt_out_capturing_by_default: true,
        loaded: (ph) => {
          if (localStorage.getItem("sl_cookie_consent") === "all") {
            ph.opt_in_capturing();
          }
        },
      });
    }

    // Cookie kabul edilince opt-in
    const handleAccept = () => {
      posthog.opt_in_capturing();
      // Hemen bir event gönder ki bağlantı doğrulansın
      posthog.capture("cookie_consent_accepted");
    };
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
