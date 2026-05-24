import type { CategorySlug } from "./categories";

export interface EventVenue {
  id: string;
  name: string;
  address: string;
}

export interface MockEvent {
  id: string;
  title: string;
  category: CategorySlug;
  venue: EventVenue;
  imageUrl: string;
  date: string;
  time: string;
  startDate: string;
  endDate?: string;
  priceFrom: number;
  lat: number;
  lng: number;
  description: string;
  badges: string[];
  city: string;
  eventPhotos?: string[];
  ticketUrl?: string;
  source?: string;
  scoutUsername?: string;
  recurrence?: {
    type: "daily" | "weekly" | "monthly";
    instances: RecurrenceInstance[];
  };
}

export interface RecurrenceInstance {
  id: string;
  date: string;
  time: string;
  startDate: string;
}
