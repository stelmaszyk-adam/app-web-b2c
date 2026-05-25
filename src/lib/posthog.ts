import posthog from "posthog-js";

let initialized = false;

export function initPostHog(): void {
  if (initialized) return;
  if (typeof window === "undefined") return;

  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;
  if (!apiKey) return;

  posthog.init(apiKey, {
    api_host: apiHost ?? "https://eu.i.posthog.com",
    capture_pageview: false,
    capture_pageleave: true,
    persistence: "localStorage+cookie",
    loaded: () => {
      initialized = true;
    },
  });
}

export function shutdownPostHog(): void {
  if (!initialized) return;
  posthog.opt_out_capturing();
  posthog.reset();
  initialized = false;
}

export function isPostHogInitialized(): boolean {
  return initialized;
}

export { posthog };
