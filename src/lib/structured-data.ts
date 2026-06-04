import type { Event, Venue } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://eventapp.dev";

export function buildEventJsonLd(event: Event, citySlug: string) {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    startDate: event.startTime,
    description: event.description,
    image: event.photoUrl && event.photoUrl.startsWith("http")
      ? event.photoUrl
      : event.photoUrl ? `${BASE_URL}${event.photoUrl}` : undefined,
    url: `${BASE_URL}/${citySlug}/event/${event.id}`,
    location: {
      "@type": "Place",
      name: event.venue.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: event.venue.address,
      },
    },
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
  };

  if (event.endTime) {
    jsonLd.endDate = event.endTime;
  }

  if (event.ticketUrl) {
    jsonLd.offers = {
      "@type": "Offer",
      url: event.ticketUrl,
      price: event.price ?? 0,
      priceCurrency: "PLN",
      availability: "https://schema.org/InStock",
    };
  } else if (event.price == null || event.price === 0) {
    jsonLd.isAccessibleForFree = true;
  }

  return jsonLd;
}

export function buildPlaceJsonLd(venue: Venue, citySlug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    name: venue.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: venue.address,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: venue.lat,
      longitude: venue.lng,
    },
    url: `${BASE_URL}/${citySlug}/venue/${venue.id}`,
    ...(venue.photoUrl
      ? {
          image: venue.photoUrl.startsWith("http")
            ? venue.photoUrl
            : `${BASE_URL}${venue.photoUrl}`,
        }
      : {}),
  };
}
