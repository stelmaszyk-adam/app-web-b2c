import { afterAll, beforeAll, afterEach, describe, expect, it } from "vitest";
import { server } from "./server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("MSW handlers", () => {
  it("GET /events returns the paginated envelope and filters by radius", async () => {
    // Poznań city center: only Poznań venues (v1-v3) fall within the default 5km radius.
    const res = await fetch(
      `${BASE_URL}/api/v1/events?lat=52.4064&lng=16.9252`,
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.meta).toMatchObject({ hasMore: false, nextCursor: null });
    for (const event of body.data) {
      expect(["v1", "v2", "v3"]).toContain(event.venue.id);
    }
  });

  it("GET /events paginates by cursor until exhausted", async () => {
    const seen = new Set<string>();
    let cursor: string | null = null;
    let hasMore = true;
    let iterations = 0;

    while (hasMore) {
      iterations += 1;
      expect(iterations).toBeLessThan(10);
      const url = new URL(`${BASE_URL}/api/v1/events`);
      url.searchParams.set("lat", "52.4064");
      url.searchParams.set("lng", "16.9252");
      url.searchParams.set("limit", "1");
      if (cursor) url.searchParams.set("cursor", cursor);

      const res = await fetch(url);
      const body = await res.json();
      expect(body.data.length).toBeLessThanOrEqual(1);
      for (const event of body.data) seen.add(event.id);

      hasMore = body.meta.hasMore;
      cursor = body.meta.nextCursor;
    }

    expect(seen.size).toBeGreaterThan(1);
  });

  it("GET /events/search filters by query text", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/events/search?q=techno`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toHaveLength(1);
    expect(body.data[0].id).toBe("e3");
  });

  it("GET /events filters by category", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/events?category=nightlife`);
    const body = await res.json();
    expect(body.data.map((e: { id: string }) => e.id)).toEqual(["e3"]);
  });

  it("GET /events keeps events on both ends of a date-only range", async () => {
    // Same-day range, as sent by the "today"/"tomorrow" presets.
    const sameDay = await fetch(
      `${BASE_URL}/api/v1/events?date_from=2026-11-24&date_to=2026-11-24`,
    );
    const sameDayIds = (await sameDay.json()).data.map(
      (e: { id: string }) => e.id,
    );
    expect(sameDayIds.sort()).toEqual(["e1", "e2", "e5"]);

    const range = await fetch(
      `${BASE_URL}/api/v1/events?date_from=2026-11-25&date_to=2026-11-27`,
    );
    const rangeIds = (await range.json()).data.map((e: { id: string }) => e.id);
    expect(rangeIds.sort()).toEqual(["e3", "e4"]);
  });

  it("GET /events/search applies category and date filters", async () => {
    const res = await fetch(
      `${BASE_URL}/api/v1/events/search?q=&category=music&date_from=2026-11-24&date_to=2026-11-24`,
    );
    const ids = (await res.json()).data.map((e: { id: string }) => e.id);
    expect(ids.sort()).toEqual(["e1", "e2", "e5"]);
  });

  it("registers browser-relative /api paths alongside the backend URL", async () => {
    const res = await fetch("http://localhost:3001/api/api/v1/events/e3");
    expect(res.status).toBe(200);
    expect((await res.json()).data.id).toBe("e3");
  });

  it("GET /events/:id returns a single event with snake_case fields", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/events/e3`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.id).toBe("e3");
    expect(body.data.start_time).toBeDefined();
    expect(body.data.venue.id).toBe("v3");
  });

  it("GET /events/:id returns 404 for an unknown id", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/events/does-not-exist`);
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toBe("NOT_FOUND");
  });

  it("GET /venues/:id returns a single venue with snake_case fields", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/venues/v1`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.id).toBe("v1");
    expect(body.data.venue_type).toBeDefined();
    expect(body.data.opening_hours.length).toBeGreaterThan(0);
  });

  it("GET /venues/:id/events returns the paginated envelope for that venue", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/venues/v1/events`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.data)).toBe(true);
    for (const event of body.data) {
      expect(event.venue.id).toBe("v1");
    }
    expect(body.meta).toMatchObject({ hasMore: false, nextCursor: null });
  });
  it.each([
    ["POST", "/api/api/v1/auth/password-reset/request", 200],
    ["POST", "/api/api/v1/auth/password-reset/confirm", 200],
    ["PATCH", "/api/api/v1/auth/password", 200],
    ["POST", "/api/api/v1/auth/tos/accept", 200],
    ["DELETE", "/api/api/v1/users/me", 204],
  ])(
    "%s %s (browser-relative, versioned) is mocked",
    async (method, path, status) => {
      const res = await fetch(`http://localhost:3001${path}`, { method });
      expect(res.status).toBe(status);
    },
  );
});
