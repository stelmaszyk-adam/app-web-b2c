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

export async function fetchEvents(
  params: FetchEventsParams,
): Promise<Event[]> {
  const city = params.city ? getCityBySlug(params.city) : undefined;

  const { data, error } = await api.GET("/events", {
    params: {
      query: {
        lat: city?.lat,
        lng: city?.lng,
        category: params.categories,
        dateFrom: params.dateFrom,
        dateTo: params.dateTo,
        search: params.search,
      },
    },
  });

  if (error) {
    console.error("Failed to fetch events:", error);
    return [];
  }

  const response = data as { data: unknown[] };
  return response.data.map(mapEvent);
}

export async function fetchEventById(id: string): Promise<Event | null> {
  const { data, error } = await api.GET("/events/{id}", {
    params: { path: { id } },
  });

  if (error) {
    return null;
  }

  const response = data as { data: unknown };
  return mapEvent(response.data);
}

export async function fetchVenueById(id: string): Promise<Venue | null> {
  const { data, error } = await api.GET("/venues/{id}", {
    params: { path: { id } },
  });

  if (error) {
    return null;
  }

  const response = data as { data: unknown };
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

  const response = (data as { data: unknown[] }) ?? { data: [] };
  return response.data.map(mapEvent);
}
