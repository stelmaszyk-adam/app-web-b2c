# Task 2-5-03: City-Scoped Blog List Page (`/[city]/blog`)

**Phase:** 2.5 — Blog Pages
**Priority:** P1
**Dependencies:** 2-5-00 (Blog API client and mocks), 2-5-01 (Blog list page — reuses hero, chips, cards, "Load more"), 1-02 (city listing pages)
**Reference:** `documentation/ROADMAP-web-b2c.md` (Sections 2.5.1, 2.5.2)

---

## Objective

Add a city-scoped variant of the blog list page at `/[city]/blog` (e.g. `/poznan/blog`, `/krakow/blog`). It shares the same layout, hero pattern, category chips, and card grid as `/blog`, but filters to posts tagged with the current city. This gives each city its own editorial index, which is critical for local SEO and matches the city-scoped patterns already used for events and venues.

## Deliverables

### 1. Route

- [ ] P1 Create `app/[city]/blog/page.tsx` as a Server Component
- [ ] P1 Validate the `city` param against the existing supported-city list (reuse the same guard/util used by other `[city]/*` routes); return `notFound()` for unknown cities
- [ ] P1 Server-side fetch the initial page: `GET /blog?locale=<current>&limit=12&city={citySlug}`
- [ ] P1 **Backend dependency:** this task requires `city` as a query param on `GET /blog`. `ROADMAP-backend.md` §2.5.5 line 857 currently lists only `category`, `author_type`, `venue_id`, `locale`, `cursor`, `limit` — the `city` param must be added to the backend contract (coordinated in task 2-5-00). If backend refuses and only supports city filtering via `venue_id` fan-out, replace the single call above with: (1) fetch venues for the city via the existing city endpoint, (2) call `GET /blog?venue_id={id}` per venue in parallel, (3) merge + sort by `published_at` server-side — and update the "Load more" island in the shared view to page through the merged stream

### 2. Layout reuse

- [ ] P1 Extract the shared layout from task 2-5-01 (`/blog`) into a reusable Server Component, e.g. `src/components/blog/BlogListView.tsx`, that both `/blog` and `/[city]/blog` render
- [ ] P1 The shared view accepts props: `initialPosts`, `nextCursor`, `heroPost`, `activeCategory`, `citySlug?`
- [ ] P1 When `citySlug` is provided, the "Load more" island appends the city filter to its cursor requests so pagination stays scoped

### 3. Editorial hero (city context)

- [ ] P1 Prefer a pinned admin `city_guide` post whose tags include the current city; fall back to the newest published post for that city
- [ ] P1 Hero copy / breadcrumb reflects the city name (e.g. "Poznań — Blog") via `next-intl` interpolation, not hardcoded strings

### 4. Discoverability

- [ ] P1 Link to `/[city]/blog` from the corresponding city listing page (`/[city]`) — add a section or CTA linking into the city's blog (coordinate placement with task 1-02)
- [ ] P1 Breadcrumb on `/[city]/blog`: Home → {City} → Blog, each level linked

### 5. SEO

- [ ] P1 `generateMetadata()` returns:
  - `title`: e.g. `"Blog o wydarzeniach w Poznaniu — Wydarzka"`
  - `description`: short city-scoped summary
  - Canonical URL: `https://wydarzka.dev/{city}/blog` (query params stripped)
  - `hreflang` alternates for `pl` and `en`
- [ ] P1 City-scoped blog URLs are included in the blog sitemap (see task 2-5-04)

### 6. Empty state

- [ ] P1 If there are no published posts for the city, render a branded empty state ("Jeszcze nic tu nie ma — zajrzyj wkrótce") with a link back to `/blog`

## Acceptance Criteria

- `/poznan/blog` (and other supported cities) renders the same layout as `/blog`, filtered to posts tagged with the current city
- Unknown cities return a 404 via `notFound()`
- The layout is shared with `/blog` via a single Server Component — no duplicated markup
- The editorial hero prefers a city-scoped `city_guide` post and falls back gracefully
- Category chips update the URL and re-render the filtered list; the city filter is preserved across chip changes
- "Load more" appends the next page and preserves both the city and category filters
- City listing pages (`/[city]`) link to the corresponding `/[city]/blog`
- Canonical URL on `/[city]/blog` strips any query params
- Empty state renders when the city has no published posts
- All copy is loaded via `next-intl`
- `pnpm type-check` and `pnpm lint` pass with no errors
