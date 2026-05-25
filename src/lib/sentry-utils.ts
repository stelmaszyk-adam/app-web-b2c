import * as Sentry from "@sentry/nextjs";

export function attachCorrelationId(correlationId: string): void {
  Sentry.setTag("correlationId", correlationId);
  Sentry.setContext("api", { correlationId });
}

export function extractCorrelationId(headers: Headers): string | null {
  return headers.get("x-correlation-id");
}
