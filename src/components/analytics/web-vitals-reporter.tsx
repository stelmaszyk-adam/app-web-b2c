"use client";

import { useEffect, useRef } from "react";
import { useCookieConsentContext } from "@/components/cookie/cookie-consent-provider";

export function WebVitalsReporter() {
  const { consent } = useCookieConsentContext();
  const started = useRef(false);

  useEffect(() => {
    if (!consent?.analytics || started.current) return;
    started.current = true;

    import("@/lib/web-vitals").then(({ reportWebVitals }) => {
      reportWebVitals();
    });
  }, [consent?.analytics]);

  return null;
}
