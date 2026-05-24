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
  priceFrom: number;
  lat: number;
  lng: number;
  description: string;
  badges: string[];
  city: string;
}
