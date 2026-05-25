"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { hasAnalyticsConsent } from "@/lib/cookie-consent";

export function Track404() {
  const pathname = usePathname();

  useEffect(() => {
    if (!hasAnalyticsConsent()) return;

    // PostHog is initialized by the analytics provider (task 1-12).
    // Capture the event when available.
    const w = window as Window & { posthog?: { capture: (event: string, properties: Record<string, string>) => void } };
    if (w.posthog?.capture) {
      w.posthog.capture("page_not_found", { path: pathname });
    }
  }, [pathname]);

  return null;
}
