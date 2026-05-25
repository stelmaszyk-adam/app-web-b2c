import type { MockEvent } from "./types";
import type { MockVenue } from "./mock-venues";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://eventapp.dev";

export function buildEventJsonLd(event: MockEvent) {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.startDate,
    description: event.description,
    image: event.imageUrl.startsWith("http")
      ? event.imageUrl
      : `${BASE_URL}${event.imageUrl}`,
    url: `${BASE_URL}/${event.city}/event/${event.id}`,
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

  if (event.endDate) {
    jsonLd.endDate = event.endDate;
  }

  if (event.ticketUrl) {
    jsonLd.offers = {
      "@type": "Offer",
      url: event.ticketUrl,
      price: event.priceFrom,
      priceCurrency: "PLN",
      availability: "https://schema.org/InStock",
    };
  } else if (event.priceFrom === 0) {
    jsonLd.isAccessibleForFree = true;
  }

  return jsonLd;
}

export function buildPlaceJsonLd(venue: MockVenue) {
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
    url: `${BASE_URL}/${venue.city}/venue/${venue.id}`,
    ...(venue.photoUrl
      ? {
          image: venue.photoUrl.startsWith("http")
            ? venue.photoUrl
            : `${BASE_URL}${venue.photoUrl}`,
        }
      : {}),
  };
}
