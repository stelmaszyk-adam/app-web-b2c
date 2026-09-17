import { http, HttpResponse, type HttpResponseResolver } from "msw";
import { MOCK_EVENTS, MOCK_VENUES } from "./data";
import type { CategorySlug } from "@/lib/categories";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

/**
 * Server components and Node-side route handlers call the backend at an
 * absolute URL; browser code calls the relative `/api/...` path rewritten by
 * next.config.ts. MSW's service worker never sees that rewrite (it intercepts
 * before the request leaves the browser), so every endpoint reachable from
 * `src/api/client.ts` needs both forms registered.
 */
function dual(
  method: "get" | "post" | "patch" | "delete",
  path: string,
  resolver: HttpResponseResolver,
) {
  return [
    http[method](`${BASE_URL}${path}`, resolver),
    http[method](`*/api${path}`, resolver),
  ];
}

function makeMockJwt(
  payload: Record<string, unknown>,
  expiresInSeconds = 900,
): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const pay = btoa(
    JSON.stringify({ ...payload, exp, iat: Math.floor(Date.now() / 1000) }),
  );
  return `${header}.${pay}.mock-sig`;
}

/** Haversine distance in km, used to emulate the backend's geospatial radius filter. */
function distanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function paginate<T>(items: T[], cursor: string | null, limit: number) {
  const start = cursor ? Number(cursor) : 0;
  const data = items.slice(start, start + limit);
  const nextIndex = start + limit;
  const hasMore = nextIndex < items.length;
  return {
    data,
    meta: {
      nextCursor: hasMore ? String(nextIndex) : null,
      hasMore,
      total: items.length,
    },
  };
}

/**
 * The app sends date-only bounds (YYYY-MM-DD, inclusive — see
 * src/lib/date-filters.ts), so compare against the event's date part; a plain
 * string compare would drop every event on the `to` day.
 */
function inDateRange(
  startTime: string,
  from: string | null,
  to: string | null,
): boolean {
  const day = startTime.slice(0, 10);
  if (from && day < from.slice(0, 10)) return false;
  if (to && day > to.slice(0, 10)) return false;
  return true;
}

function eventById(id: string) {
  return MOCK_EVENTS.find((e) => e.id === id);
}

function venueById(id: string) {
  return MOCK_VENUES.find((v) => v.id === id);
}

export const handlers = [
  ...dual("get", "/health", () => {
    return HttpResponse.json({ data: { status: "ok" } });
  }),

  // Auth endpoints — called only from src/app/api/auth/*/route.ts (Node-side
  // fetch to the absolute backend URL). No browser code calls these backend
  // paths directly (the browser hits our own `/api/auth/...` route handlers),
  // so only the absolute form is registered.
  http.post(`${BASE_URL}/api/v1/auth/login`, async ({ request }) => {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };
    if (!body.email || body.password !== "password") {
      return HttpResponse.json(
        {
          statusCode: 401,
          error: "INVALID_CREDENTIALS",
          message: "Invalid email or password",
        },
        { status: 401 },
      );
    }
    const accessToken = makeMockJwt({
      sub: "mock-user-1",
      email: body.email,
      displayName: "Mock User",
    });
    const refreshToken = makeMockJwt(
      { sub: "mock-user-1", type: "refresh" },
      30 * 24 * 3600,
    );
    return HttpResponse.json({ data: { accessToken, refreshToken } });
  }),

  http.post(`${BASE_URL}/api/v1/auth/register`, async ({ request }) => {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };
    if (!body.email) {
      return HttpResponse.json(
        { statusCode: 422, error: "VALIDATION_ERROR" },
        { status: 422 },
      );
    }
    const accessToken = makeMockJwt({ sub: "mock-user-2", email: body.email });
    const refreshToken = makeMockJwt(
      { sub: "mock-user-2", type: "refresh" },
      30 * 24 * 3600,
    );
    return HttpResponse.json(
      { data: { accessToken, refreshToken } },
      { status: 201 },
    );
  }),

  http.post(`${BASE_URL}/api/v1/auth/refresh`, async ({ request }) => {
    const body = (await request.json()) as { refreshToken?: string };
    if (!body.refreshToken) {
      return HttpResponse.json(
        { statusCode: 401, error: "INVALID_TOKEN" },
        { status: 401 },
      );
    }
    const accessToken = makeMockJwt({
      sub: "mock-user-1",
      email: "user@example.com",
      displayName: "Mock User",
    });
    const refreshToken = makeMockJwt(
      { sub: "mock-user-1", type: "refresh" },
      30 * 24 * 3600,
    );
    return HttpResponse.json({ data: { accessToken, refreshToken } });
  }),

  http.post(`${BASE_URL}/api/v1/auth/logout`, () => {
    return HttpResponse.json({ data: null });
  }),

  http.post(`${BASE_URL}/api/v1/auth/oauth/google`, async ({ request }) => {
    const body = (await request.json()) as { code?: string };
    if (!body.code) {
      return HttpResponse.json(
        { statusCode: 400, error: "INVALID_CODE" },
        { status: 400 },
      );
    }
    const accessToken = makeMockJwt({
      sub: "mock-google-user",
      email: "google@example.com",
      displayName: "Google User",
    });
    const refreshToken = makeMockJwt(
      { sub: "mock-google-user", type: "refresh" },
      30 * 24 * 3600,
    );
    return HttpResponse.json({
      data: { accessToken, refreshToken, isNewAccount: false },
    });
  }),

  http.post(`${BASE_URL}/api/v1/auth/verify-email`, () => {
    return HttpResponse.json({ data: null });
  }),

  // Endpoints below are fetched directly by client components at the literal
  // `/api/...` path (no Next.js route handler owns that exact path, so the
  // real backend is reached only via next.config.ts's rewrite) — dual-register
  // them like the events/venues endpoints.
  ...dual("post", "/api/v1/auth/password-reset/request", () => {
    return HttpResponse.json({ data: null });
  }),

  ...dual("post", "/api/v1/auth/password-reset/confirm", () => {
    return HttpResponse.json({ data: null });
  }),

  ...dual("patch", "/api/v1/auth/password", () => {
    return HttpResponse.json({ data: null });
  }),

  ...dual("post", "/api/v1/auth/tos/accept", () => {
    return HttpResponse.json({ data: null });
  }),

  ...dual("delete", "/api/v1/users/me", () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // Not currently called by any page — kept for parity with the backend
  // contract in case a future feature needs them.
  http.get(`${BASE_URL}/api/v1/users/me`, () => {
    return HttpResponse.json({
      data: {
        id: "mock-user-1",
        email: "user@example.com",
        displayName: "Mock User",
      },
    });
  }),

  http.patch(`${BASE_URL}/api/v1/users/me`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({ data: body });
  }),

  http.get(`${BASE_URL}/api/v1/venues`, ({ request }) => {
    const url = new URL(request.url);
    const lat = parseFloat(url.searchParams.get("lat") ?? "0");
    const lng = parseFloat(url.searchParams.get("lng") ?? "0");
    const filtered =
      lat || lng
        ? MOCK_VENUES.filter((v) => distanceKm(v.lat, v.lng, lat, lng) <= 5)
        : MOCK_VENUES;
    return HttpResponse.json({
      data: filtered.map((v) => ({
        id: v.id,
        name: v.name,
        address: v.address,
        lat: v.lat,
        lng: v.lng,
        category: v.category,
      })),
      meta: { nextCursor: null, hasMore: false, total: filtered.length },
    });
  }),

  // Endpoints used by src/lib/api.ts / src/api/client.ts — reachable from
  // both server components (absolute URL) and client components (relative
  // `/api` URL), so both forms must be registered.
  ...dual("post", "/api/v1/events/user-submit", async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    if (!body.name || !body.venue_id || !body.start_time || !body.category) {
      return HttpResponse.json(
        {
          statusCode: 422,
          error: "VALIDATION_ERROR",
          message: "Missing required fields",
        },
        { status: 422 },
      );
    }
    return new HttpResponse(null, { status: 201 });
  }),

  ...dual("get", "/api/v1/events/search", ({ request }) => {
    const url = new URL(request.url);
    const q = (url.searchParams.get("q") ?? "").toLowerCase();
    const lat = url.searchParams.get("lat");
    const lng = url.searchParams.get("lng");
    const radius = Number(url.searchParams.get("radius") ?? 5);
    const category = url.searchParams.get("category") as CategorySlug | null;
    const dateFrom = url.searchParams.get("date_from");
    const dateTo = url.searchParams.get("date_to");
    const cursor = url.searchParams.get("cursor");
    const limit = Number(url.searchParams.get("limit") ?? 20);

    let filtered = MOCK_EVENTS.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q),
    );

    if (lat && lng) {
      filtered = filtered.filter(
        (e) =>
          distanceKm(e.venue.lat, e.venue.lng, Number(lat), Number(lng)) <=
          radius,
      );
    }
    if (category) {
      filtered = filtered.filter((e) => e.category === category);
    }
    filtered = filtered.filter((e) =>
      inDateRange(e.start_time, dateFrom, dateTo),
    );

    return HttpResponse.json(paginate(filtered, cursor, limit));
  }),

  ...dual("get", "/api/v1/events", ({ request }) => {
    const url = new URL(request.url);
    const lat = url.searchParams.get("lat");
    const lng = url.searchParams.get("lng");
    const radius = Number(url.searchParams.get("radius") ?? 5);
    const category = url.searchParams.get("category") as CategorySlug | null;
    const dateFrom = url.searchParams.get("date_from");
    const dateTo = url.searchParams.get("date_to");
    const cursor = url.searchParams.get("cursor");
    const limit = Number(url.searchParams.get("limit") ?? 20);

    let filtered =
      lat && lng
        ? MOCK_EVENTS.filter(
            (e) =>
              distanceKm(e.venue.lat, e.venue.lng, Number(lat), Number(lng)) <=
              radius,
          )
        : MOCK_EVENTS;

    if (category) {
      filtered = filtered.filter((e) => e.category === category);
    }
    filtered = filtered.filter((e) =>
      inDateRange(e.start_time, dateFrom, dateTo),
    );

    return HttpResponse.json(paginate(filtered, cursor, limit));
  }),

  ...dual("get", "/api/v1/events/:id", ({ params }) => {
    const event = eventById(params.id as string);
    if (!event) {
      return HttpResponse.json(
        { statusCode: 404, error: "NOT_FOUND", message: "Event not found" },
        { status: 404 },
      );
    }
    return HttpResponse.json({ data: event });
  }),

  ...dual("get", "/api/v1/venues/:id", ({ params }) => {
    const venue = venueById(params.id as string);
    if (!venue) {
      return HttpResponse.json(
        { statusCode: 404, error: "NOT_FOUND", message: "Venue not found" },
        { status: 404 },
      );
    }
    return HttpResponse.json({ data: venue });
  }),

  ...dual("get", "/api/v1/venues/:id/events", ({ request, params }) => {
    const url = new URL(request.url);
    const cursor = url.searchParams.get("cursor");
    const limit = Number(url.searchParams.get("limit") ?? 20);
    const events = MOCK_EVENTS.filter((e) => e.venue.id === params.id);
    return HttpResponse.json(paginate(events, cursor, limit));
  }),
];
