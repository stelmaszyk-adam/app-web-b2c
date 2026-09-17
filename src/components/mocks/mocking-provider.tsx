"use client";

import { useEffect } from "react";

/**
 * Dynamically imports the MSW browser worker only when mocking is enabled,
 * so `msw/browser` never ships in a normal production bundle.
 */
export function MockingProvider() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_API_MOCKING === "true") {
      import("@/mocks/init.browser").then(({ startMockWorker }) => startMockWorker());
    }
  }, []);

  return null;
}
