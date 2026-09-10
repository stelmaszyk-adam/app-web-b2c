# Task 2-5-00: Blog API Client and MSW Mocks

**Phase:** 2.5 — Blog Pages
**Priority:** P1
**Dependencies:** Phase 0 API client, Phase 0 MSW mock environment
**Reference:** `documentation/ROADMAP-web-b2c.md` (Sections 2.5.6, 2.5.7), `documentation/ROADMAP-backend.md` (Sections 2.5.0–2.5.2, 2.5.8)

---

## Objective

Wire up the typed API client and mock backend for blog endpoints so the rest of Phase 2.5 (list page, detail page, city-scoped list, sitemap) can be built and tested in isolation, without waiting on the backend implementation. All blog data fetching must go through the existing `openapi-fetch` client (`src/api/client.ts`) — consistent with the rest of Web B2C.

> Note: This task must land first. All subsequent blog tasks depend on the generated types and the mock handlers established here.

## Deliverables

### 1. OpenAPI client codegen

- [ ] P1 Once backend blog endpoints (`GET /blog`, `GET /blog/:slug`, `GET /venues/:id/blog` — see `ROADMAP-backend.md` §2.5.5 lines 857–860) are implemented and `docs/openapi.json` is re-exported by backend CI: run `pnpm api:generate` to regenerate `src/api/generated/schema.d.ts` with blog types
- [ ] P1 Confirm the following operation IDs / paths appear in the regenerated schema:
  - `GET /blog` (query params: `category`, `author_type`, `venue_id`, `city`, `locale`, `cursor`, `limit`)
  - `GET /blog/{slug}`
  - `GET /venues/{id}/blog` (per `ROADMAP-backend.md` §2.5.5 line 860 — venue-scoped posts for the venue detail page)
- [ ] P1 **Backend coordination — `city` query param:** the web-b2c city-scoped variant (`/[city]/blog`, task 2-5-03) requires filtering by city slug, but `ROADMAP-backend.md` §2.5.5 line 857 currently lists only `category`, `author_type`, `venue_id`, `locale`, `cursor`, `limit`. Coordinate with backend to add `city` as a query param on `GET /blog` before this task completes; if backend can only support city filtering via `venue_id` fan-out (city → venues → posts), update task 2-5-03 accordingly and drop the `city` param requirement here
- [ ] P1 All blog data fetching in the web-b2c app uses the existing typed `openapi-fetch` client (`src/api/client.ts`) — no bespoke `fetch()` calls, no untyped Axios

### 2. Domain mapper

- [ ] P1 Add a `BlogPost` domain type + `mapBlogPost()` mapper alongside the existing `Event` / `Venue` mappers (`src/lib/` — mirror the existing `mapEvent` pattern)
- [ ] P1 Domain type exposes the fields the UI needs:
  - `id`, `slug`, `title`, `excerpt`, `contentJson` (Tiptap ProseMirror doc), `featuredImageUrl`, `category` (`blog_category_enum`), `tags`, `authorType` (`'organizer' | 'admin'`), `author` (`{ id, displayName, avatarUrl, role?, venueName? }`), `venueId?`, `publishedAt`, `updatedAt`, `readingTimeMinutes`, `locale`, `relatedEventIds?: string[]`

### 3. MSW mock handlers

Located under `src/mocks/handlers/` following the existing convention:

- [ ] P1 `GET /blog` → 12 seeded blog posts (paginated response with cursor envelope `{ data: [], meta: { nextCursor, hasMore, total } }`)
- [ ] P1 `GET /blog?cursor=xxx&limit=n` → returns the next page; final page returns `hasMore: false` and `nextCursor: null`
- [ ] P1 `GET /blog?category=city_guide` → filters seeded posts by `blog_category_enum` value
- [ ] P1 `GET /blog?locale=pl` and `locale=en` → filter by locale
- [ ] P1 `GET /blog?city={slug}` → 6 seeded posts for the given city (satisfies roadmap §2.5.6 "`GET /[city]/blog` → 6 seeded posts for the given city" — the Next.js `/[city]/blog` route calls the API with `?city={slug}`); unknown city slugs return an empty `data` array with `hasMore: false`
- [ ] P1 `GET /blog?city={slug}&category=…&cursor=…` → filters compose; city filter is preserved across pagination and category changes
- [ ] P1 `GET /blog/:slug` → single post with full `content_json` (Tiptap doc containing at least one H2, one H3, one image node, and one `event-card` custom node so the detail page's rendering paths are exercised)
- [ ] P1 `GET /blog/:slug` → returns 404 shape `{ statusCode: 404, error: 'NOT_FOUND', message, correlationId }` for unknown slugs
- [ ] P1 `GET /venues/:id/blog` → 3–6 seeded posts tagged to the given venue (real backend endpoint per `ROADMAP-backend.md` §2.5.5 line 860; used by the venue detail page's "Latest from this venue" section — not a substitute for the city-scoped filter above)

### 4. Seed data

- [ ] P1 Seeded fixtures in `src/mocks/data/blog.ts` — 12 posts covering:
  - Mix of `author_type`: 8 organizer, 4 admin
  - Mix of `category`: at least one of each `city_guide`, `event_roundup`, `venue_spotlight`, `organizer_story`, `tips_and_tricks`, `news`, `other`
  - Mix of `locale`: 10 `pl`, 2 `en`
  - At least one post pinned as a "city-guide hero" for the editorial hero slot on the list page
  - Realistic Tiptap `content_json` documents so `@tiptap/html` `generateHTML()` output is meaningful in visual testing
  - Related events IDs populated on 4 posts, pointing at existing event fixtures

## Acceptance Criteria

- Running `pnpm api:generate` regenerates `src/api/generated/schema.d.ts` and blog paths appear in the file
- `pnpm type-check` passes with all blog handlers, fixtures, and the domain mapper compiled against the generated schema
- With MSW enabled, hitting `GET /blog` from a browser dev tool or Server Component returns the seeded 12 posts wrapped in the standard `{ data, meta }` envelope
- Cursor pagination through `GET /blog` reaches a terminal page with `hasMore: false`
- `GET /blog?city={slug}` returns 6 city-scoped posts for a supported city and an empty page for an unknown slug
- `GET /blog?city={slug}&category=…` composes filters and preserves them across cursor pagination
- `GET /blog/:slug` returns a post whose `content_json` contains H2, H3, image, and `event-card` nodes (so downstream rendering can be exercised)
- `GET /blog/:slug` for an unknown slug returns the standardized 404 error shape
- `GET /venues/:id/blog` returns venue-scoped posts for at least one seeded venue
- Backend contract coordination note above is resolved (either `city` param added to `GET /blog` or task 2-5-03 updated to use venue fan-out) before this task is marked done
- No blog data fetching bypasses the typed `openapi-fetch` client
- `pnpm lint` passes with no errors
