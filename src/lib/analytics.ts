import { posthog, isPostHogInitialized } from "./posthog";

function capture(event: string, properties?: Record<string, unknown>): void {
  if (!isPostHogInitialized()) return;
  posthog.capture(event, properties);
}

export function trackPageView(url: string): void {
  capture("page_view", { url });
}

export function trackMapView(city: string): void {
  capture("map_view", { city });
}

export function trackEventDetailView(eventId: string, eventTitle: string): void {
  capture("event_detail_view", { event_id: eventId, event_title: eventTitle });
}

export function trackVenueProfileView(venueId: string, venueName: string): void {
  capture("venue_profile_view", { venue_id: venueId, venue_name: venueName });
}

export function trackNavigateTap(destination: string): void {
  capture("navigate_tap", { destination });
}

export function trackTicketLinkTap(eventId: string, url: string): void {
  capture("ticket_link_tap", { event_id: eventId, url });
}

export function trackEventShare(eventId: string): void {
  capture("event_share", { event_id: eventId });
}

export function trackSearchPerformed(query: string, resultCount: number): void {
  capture("search_performed", { query, result_count: resultCount });
}

export function trackSearchZeroResults(query: string): void {
  capture("search_zero_results", { query });
}

export function trackSmartBannerClick(context: string): void {
  capture("smart_banner_click", { context });
}
