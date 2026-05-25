import { onCLS, onINP, onLCP, onFCP, onTTFB, type Metric } from "web-vitals";
import { posthog, isPostHogInitialized } from "./posthog";

function sendToPostHog(metric: Metric): void {
  if (!isPostHogInitialized()) return;

  posthog.capture("web_vital", {
    metric_name: metric.name,
    metric_value: metric.value,
    metric_rating: metric.rating,
    metric_id: metric.id,
    metric_delta: metric.delta,
    navigation_type: metric.navigationType,
  });
}

export function reportWebVitals(): void {
  onCLS(sendToPostHog);
  onINP(sendToPostHog);
  onLCP(sendToPostHog);
  onFCP(sendToPostHog);
  onTTFB(sendToPostHog);
}
