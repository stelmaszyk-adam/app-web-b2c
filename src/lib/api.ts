import { MOCK_EVENTS } from "./mock-events";
import type { MockEvent } from "./types";
import type { CategorySlug } from "./categories";

interface FetchEventsParams {
  city?: string;
  categories?: CategorySlug[];
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export async function fetchEvents(
  params: FetchEventsParams,
): Promise<MockEvent[]> {
  // For MVP/mock mode, use mock data directly (SSR-compatible)
  let filtered = [...MOCK_EVENTS];

  if (params.city) {
    filtered = filtered.filter((e) => e.city === params.city);
  }

  if (params.categories && params.categories.length > 0) {
    filtered = filtered.filter((e) => params.categories!.includes(e.category));
  }

  if (params.dateFrom) {
    filtered = filtered.filter((e) => e.startDate >= params.dateFrom!);
  }

  if (params.dateTo) {
    filtered = filtered.filter((e) => e.startDate <= params.dateTo!);
  }

  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.venue.name.toLowerCase().includes(q),
    );
  }

  return filtered;
}
