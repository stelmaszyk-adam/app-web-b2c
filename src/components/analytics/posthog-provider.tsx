"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useCookieConsentContext } from "@/components/cookie/cookie-consent-provider";
import { initPostHog, shutdownPostHog } from "@/lib/posthog";
import { trackPageView } from "@/lib/analytics";

export function PostHogProvider() {
  const { consent } = useCookieConsentContext();
  const pathname = usePathname();
  const prevConsent = useRef<boolean | null>(null);

  useEffect(() => {
    const analyticsAllowed = consent?.analytics ?? false;

    if (analyticsAllowed && !prevConsent.current) {
      initPostHog();
      trackPageView(pathname);
    }

    if (!analyticsAllowed && prevConsent.current) {
      shutdownPostHog();
    }

    prevConsent.current = analyticsAllowed;
  }, [consent?.analytics, pathname]);

  useEffect(() => {
    if (consent?.analytics) {
      trackPageView(pathname);
    }
  }, [pathname, consent?.analytics]);

  return null;
}
