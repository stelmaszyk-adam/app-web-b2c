import type { CategorySlug } from "./categories";

export interface EventVenue {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export interface EventPhoto {
  id: string;
  url: string;
  position: number;
}

export interface Event {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  category: CategorySlug;
  description: string;
  photoUrl: string | null;
  price: number | null;
  ticketUrl: string | null;
  source: string;
  venue: EventVenue;
  createdAt: string;
  // Detail-only fields
  status?: string;
  isCancelled?: boolean;
  photos?: EventPhoto[];
}

export interface VenuePhoto {
  id: string;
  url: string;
  position: number;
}

export interface VenueOpeningHour {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isFlexibleClose: boolean;
}

export interface VenueUpcomingEvent {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  category: CategorySlug;
  photoUrl: string | null;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  category: CategorySlug;
  venueType?: string;
  description: string;
  photoUrl: string | null;
  followerCount: number;
  isClaimed: boolean;
  photos: VenuePhoto[];
  openingHours: VenueOpeningHour[];
  upcomingEvents: VenueUpcomingEvent[];
  createdAt: string;
}

// Date/time formatting helpers
export function formatEventDate(isoString: string, locale: string = "pl"): string {
  const date = new Date(isoString);
  return date.toLocaleDateString(locale === "pl" ? "pl-PL" : "en-US", {
    weekday: "short",
    day: "numeric",
    month: "long",
  });
}

export function formatEventTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
