import { api } from "@/api/client";
import type { Event, Venue } from "./types";
import type { CategorySlug } from "./categories";
import { getCityBySlug } from "./cities";

interface FetchEventsParams {
  city?: string;
  categories?: CategorySlug[];
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  /** Search radius in km around the city center (backend default: 5, max: 150). */
  radius?: number;
}

/** Backend page size caps: /events allows up to 100/page, /events/search up to 50/page. */
const LIST_PAGE_LIMIT = 100;
const SEARCH_PAGE_LIMIT = 50;
/** Safety cap on total events fetched per request (map/list should show the full city, not just page 1). */
const MAX_EVENTS = 500;

interface PagedResponse {
  data: unknown[];
  meta?: { nextCursor: string | null; hasMore: boolean };
}

/* eslint-disable @typescript-eslint/no-explicit-any */

function mapEvent(raw: any): Event {
  return {
    id: raw.id,
    name: raw.name,
    startTime: raw.start_time,
    endTime: raw.end_time,
    category: raw.category,
    description: raw.description ?? "",
    photoUrl: raw.photo_url ?? null,
    price: raw.price ?? null,
    ticketUrl: raw.ticket_url ?? null,
    source: raw.source ?? "",
    venue: {
      id: raw.venue.id,
      name: raw.venue.name,
      address: raw.venue.address,
      lat: raw.venue.lat,
      lng: raw.venue.lng,
    },
    createdAt: raw.created_at,
    status: raw.status,
    isCancelled: raw.is_cancelled,
    photos: raw.photos?.map((p: any) => ({
      id: p.id,
      url: p.url,
      position: p.position,
    })),
  };
}

function mapVenue(raw: any): Venue {
  return {
    id: raw.id,
    name: raw.name,
    address: raw.address,
    lat: raw.lat,
    lng: raw.lng,
    category: raw.category,
    venueType: raw.venue_type,
    description: raw.description ?? "",
    photoUrl: raw.photo_url ?? null,
    followerCount: raw.follower_count ?? 0,
    isClaimed: raw.is_claimed ?? false,
    photos: (raw.photos ?? []).map((p: any) => ({
      id: p.id,
      url: p.url,
      position: p.position,
    })),
    openingHours: (raw.opening_hours ?? []).map((h: any) => ({
      dayOfWeek: h.day_of_week,
      openTime: h.open_time,
      closeTime: h.close_time,
      isFlexibleClose: h.is_flexible_close ?? false,
    })),
    upcomingEvents: (raw.upcoming_events ?? []).map((e: any) => ({
      id: e.id,
      name: e.name,
      startTime: e.start_time,
      endTime: e.end_time,
      category: e.category,
      photoUrl: e.photo_url ?? null,
    })),
    createdAt: raw.created_at,
  };
}

/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Fetches every page from a cursor-paginated endpoint (up to MAX_EVENTS), since
 * the backend only returns one page (max 100 items for /events, 50 for
 * /events/search) per request — without this loop, city views with more
 * events than the page size silently only showed the first page.
 */
async function fetchAllPages(
  path: "/events" | "/events/search",
  baseQuery: Record<string, unknown>,
  pageLimit: number,
): Promise<unknown[]> {
  const results: unknown[] = [];
  let cursor: string | undefined;

  do {
    const { data, error } = await api.GET(path, {
      // Query shape genuinely differs per path (e.g. only /events/search has `q`);
      // baseQuery is built per-call-site to match, so this cast is safe.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      params: { query: { ...baseQuery, limit: pageLimit, cursor } as any },
    });

    if (error) {
      console.error(`Failed to fetch ${path}:`, error);
      break;
    }

    const response = data as unknown as PagedResponse;
    results.push(...response.data);
    cursor = response.meta?.hasMore ? response.meta.nextCursor ?? undefined : undefined;
  } while (cursor && results.length < MAX_EVENTS);

  return results;
}

export async function fetchEvents(
  params: FetchEventsParams,
): Promise<Event[]> {
  const city = params.city ? getCityBySlug(params.city) : undefined;
  const category = params.categories?.[0];

  if (params.search) {
    const raw = await fetchAllPages(
      "/events/search",
      {
        q: params.search,
        lat: city?.lat,
        lng: city?.lng,
        radius: params.radius,
        category,
        date_from: params.dateFrom,
        date_to: params.dateTo,
      },
      SEARCH_PAGE_LIMIT,
    );
    return raw.map(mapEvent);
  }

  if (!city) {
    return [];
  }

  const raw = await fetchAllPages(
    "/events",
    {
      lat: city.lat,
      lng: city.lng,
      radius: params.radius,
      category,
      date_from: params.dateFrom,
      date_to: params.dateTo,
    },
    LIST_PAGE_LIMIT,
  );
  return raw.map(mapEvent);
}

export async function fetchEventById(id: string): Promise<Event | null> {
  const { data, error } = await api.GET("/events/{id}", {
    params: { path: { id } },
  });

  if (error) {
    return null;
  }

  const response = data as unknown as { data: unknown };
  return mapEvent(response.data);
}

export async function fetchVenueById(id: string): Promise<Venue | null> {
  const { data, error } = await api.GET("/venues/{id}", {
    params: { path: { id } },
  });

  if (error) {
    return null;
  }

  const response = data as unknown as { data: unknown };
  return mapVenue(response.data);
}

export async function fetchEventsByVenueId(venueId: string): Promise<Event[]> {
  const { data, error } = await api.GET("/venues/{id}/events", {
    params: { path: { id: venueId } },
  });

  if (error) {
    console.error("Failed to fetch venue events:", error);
    return [];
  }

  const response = (data as unknown as { data: unknown[] }) ?? { data: [] };
  return response.data.map(mapEvent);
}
