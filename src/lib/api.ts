import { MOCK_EVENTS } from "./mock-events";
import { MOCK_VENUES } from "./mock-venues";
import type { MockEvent } from "./types";
import type { MockVenue } from "./mock-venues";
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

export async function fetchEventById(id: string): Promise<MockEvent | null> {
  return MOCK_EVENTS.find((e) => e.id === id) ?? null;
}

export async function fetchVenueById(id: string): Promise<MockVenue | null> {
  return MOCK_VENUES.find((v) => v.id === id) ?? null;
}

export async function fetchEventsByVenueId(venueId: string): Promise<MockEvent[]> {
  return MOCK_EVENTS.filter((e) => e.venue.id === venueId);
}
