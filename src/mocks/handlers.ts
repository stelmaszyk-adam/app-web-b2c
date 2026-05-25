import { http, HttpResponse } from "msw";
import { MOCK_EVENTS } from "@/lib/mock-events";
import { MOCK_VENUES } from "@/lib/mock-venues";
import type { CategorySlug } from "@/lib/categories";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export const handlers = [
  http.get(`${BASE_URL}/api/health`, () => {
    return HttpResponse.json({ data: { status: "ok" } });
  }),

  http.get(`${BASE_URL}/api/events`, ({ request }) => {
    const url = new URL(request.url);
    const city = url.searchParams.get("city");
    const categories = url.searchParams.getAll("category");
    const dateFrom = url.searchParams.get("dateFrom");
    const dateTo = url.searchParams.get("dateTo");
    const search = url.searchParams.get("search");

    let filtered = [...MOCK_EVENTS];

    if (city) {
      filtered = filtered.filter((e) => e.city === city);
    }

    if (categories.length > 0) {
      filtered = filtered.filter((e) =>
        categories.includes(e.category as CategorySlug),
      );
    }

    if (dateFrom) {
      filtered = filtered.filter((e) => e.startDate >= dateFrom);
    }

    if (dateTo) {
      filtered = filtered.filter((e) => e.startDate <= dateTo);
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.venue.name.toLowerCase().includes(q),
      );
    }

    return HttpResponse.json({
      data: filtered,
      meta: {
        nextCursor: null,
        hasMore: false,
        total: filtered.length,
      },
    });
  }),

  http.get(`${BASE_URL}/api/events/:id`, ({ params }) => {
    const event = MOCK_EVENTS.find((e) => e.id === params.id);
    if (!event) {
      return HttpResponse.json(
        {
          statusCode: 404,
          error: "NOT_FOUND",
          message: "Event not found",
        },
        { status: 404 },
      );
    }
    return HttpResponse.json({ data: event });
  }),

  http.get(`${BASE_URL}/api/venues/:id`, ({ params }) => {
    const venue = MOCK_VENUES.find((v) => v.id === params.id);
    if (!venue) {
      return HttpResponse.json(
        {
          statusCode: 404,
          error: "NOT_FOUND",
          message: "Venue not found",
        },
        { status: 404 },
      );
    }
    return HttpResponse.json({ data: venue });
  }),

  http.get(`${BASE_URL}/api/venues/:id/events`, ({ params }) => {
    const events = MOCK_EVENTS.filter((e) => e.venue.id === params.id);
    return HttpResponse.json({
      data: events,
      meta: {
        nextCursor: null,
        hasMore: false,
        total: events.length,
      },
    });
  }),
];
