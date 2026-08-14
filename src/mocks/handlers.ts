import { http, HttpResponse } from "msw";
import { MOCK_EVENTS } from "@/lib/mock-events";
import { MOCK_VENUES } from "@/lib/mock-venues";
import type { CategorySlug } from "@/lib/categories";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

function makeMockJwt(payload: Record<string, unknown>, expiresInSeconds = 900): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const pay = btoa(JSON.stringify({ ...payload, exp, iat: Math.floor(Date.now() / 1000) }));
  return `${header}.${pay}.mock-sig`;
}

export const handlers = [
  http.get(`${BASE_URL}/api/health`, () => {
    return HttpResponse.json({ data: { status: "ok" } });
  }),

  // Auth endpoints
  http.post(`${BASE_URL}/auth/login`, async ({ request }) => {
    const body = await request.json() as { email?: string; password?: string };
    if (!body.email || body.password !== "password") {
      return HttpResponse.json(
        { statusCode: 401, error: "INVALID_CREDENTIALS", message: "Invalid email or password" },
        { status: 401 },
      );
    }
    const accessToken = makeMockJwt({ sub: "mock-user-1", email: body.email, displayName: "Mock User" });
    const refreshToken = makeMockJwt({ sub: "mock-user-1", type: "refresh" }, 30 * 24 * 3600);
    return HttpResponse.json({ data: { accessToken, refreshToken } });
  }),

  http.post(`${BASE_URL}/auth/register`, async ({ request }) => {
    const body = await request.json() as { email?: string; password?: string };
    if (!body.email) {
      return HttpResponse.json({ statusCode: 422, error: "VALIDATION_ERROR" }, { status: 422 });
    }
    const accessToken = makeMockJwt({ sub: "mock-user-2", email: body.email });
    const refreshToken = makeMockJwt({ sub: "mock-user-2", type: "refresh" }, 30 * 24 * 3600);
    return HttpResponse.json({ data: { accessToken, refreshToken } }, { status: 201 });
  }),

  http.post(`${BASE_URL}/auth/refresh`, async ({ request }) => {
    const body = await request.json() as { refreshToken?: string };
    if (!body.refreshToken) {
      return HttpResponse.json({ statusCode: 401, error: "INVALID_TOKEN" }, { status: 401 });
    }
    const accessToken = makeMockJwt({ sub: "mock-user-1", email: "user@example.com", displayName: "Mock User" });
    const refreshToken = makeMockJwt({ sub: "mock-user-1", type: "refresh" }, 30 * 24 * 3600);
    return HttpResponse.json({ data: { accessToken, refreshToken } });
  }),

  http.post(`${BASE_URL}/auth/logout`, () => {
    return HttpResponse.json({ data: null });
  }),

  http.post(`${BASE_URL}/auth/oauth/google`, async ({ request }) => {
    const body = await request.json() as { code?: string };
    if (!body.code) {
      return HttpResponse.json({ statusCode: 400, error: "INVALID_CODE" }, { status: 400 });
    }
    const accessToken = makeMockJwt({ sub: "mock-google-user", email: "google@example.com", displayName: "Google User" });
    const refreshToken = makeMockJwt({ sub: "mock-google-user", type: "refresh" }, 30 * 24 * 3600);
    return HttpResponse.json({ data: { accessToken, refreshToken, isNewAccount: false } });
  }),

  http.post(`${BASE_URL}/auth/verify-email`, () => {
    return HttpResponse.json({ data: null });
  }),

  http.post(`${BASE_URL}/auth/password-reset/request`, () => {
    return HttpResponse.json({ data: null });
  }),

  http.post(`${BASE_URL}/auth/password-reset/confirm`, () => {
    return HttpResponse.json({ data: null });
  }),

  http.patch(`${BASE_URL}/auth/password`, () => {
    return HttpResponse.json({ data: null });
  }),

  http.post(`${BASE_URL}/auth/tos/accept`, () => {
    return HttpResponse.json({ data: null });
  }),

  http.get(`${BASE_URL}/users/me`, () => {
    return HttpResponse.json({
      data: { id: "mock-user-1", email: "user@example.com", displayName: "Mock User" },
    });
  }),

  http.delete(`${BASE_URL}/users/me`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.patch(`${BASE_URL}/users/me`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({ data: body });
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
