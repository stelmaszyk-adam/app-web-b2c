import createClient from "openapi-fetch";
import type { paths } from "./generated/schema";
import {
  attachCorrelationId,
  extractCorrelationId,
} from "@/lib/sentry-utils";

const baseUrl = typeof window === "undefined"
  ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000")
  : "/api";

export const api = createClient<paths>({ baseUrl });

api.use({
  async onResponse({ response }) {
    const correlationId = extractCorrelationId(response.headers);
    if (correlationId) {
      attachCorrelationId(correlationId);
    }
    return undefined;
  },
});
