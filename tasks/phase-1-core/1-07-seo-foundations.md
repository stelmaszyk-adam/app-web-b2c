# Task 1-07: SEO Foundations

**Phase:** 1 — Core
**Priority:** P0
**Dependencies:** 1-04 (event detail page), 1-05 (venue profile page), 1-00 (i18n)
**Reference:** `documentation/ROADMAP-web-b2c.md` (Sections 1.3.1, 1.6), `documentation/designs/DESIGN.md`

---

## Objective

Establish the full technical SEO foundation for the Web B2C application, covering sitemap generation, robots.txt, structured data / JSON-LD, canonical URLs, and Open Graph meta tags for social sharing. These foundations are critical for search engine discoverability from day one — SSR pages must be crawlable and richly annotated before launch.

## Design Reference

Design system: `documentation/designs/DESIGN.md` — OG image cards should follow brand palette (primary `#4900cc`, Inter font)

> Note: OG image card should use brand primary color (`#4900cc`) and Inter typography per `documentation/designs/DESIGN.md`.

## Deliverables

### 1. Sitemap generation (§1.3.1)

- [ ] P0 **`sitemap.xml` generation** — dynamic, auto-updated sitemap covering:
  - City listing pages (`/poznan`, `/krakow`, etc.)
  - Category listing pages (`/poznan/music`, `/krakow/this-weekend`, etc.)
  - Event detail pages (with `lastmod` from `updated_at`)
  - Venue profile pages
  - Use Next.js `app/sitemap.ts` for automatic generation; split into sub-sitemaps if >50k URLs
- [ ] P0 **Sitemap freshness:**
  - Use Next.js ISR (Incremental Static Regeneration) for sitemap — revalidate every 1 hour
  - Set `<lastmod>` on event pages from `updated_at` timestamp
- [ ] P1 **Submit sitemap to Google Search Console** after launch

### 2. Robots.txt (§1.3.1)

- [ ] P0 **`robots.txt`** — allow all public pages, disallow internal/preview routes, reference sitemap URL

### 3. Structured data / JSON-LD (§1.3.1)

- [ ] P0 **Structured data / JSON-LD for events** — [Google Event rich results](https://developers.google.com/search/docs/appearance/structured-data/event):
  - `Event` schema on every event detail page (`name`, `startDate`, `endDate`, `location`, `image`, `description`, `offers` if ticket URL exists)
  - `Place` schema on venue profile pages (`name`, `address`, `geo`)
  - Validate with Google Rich Results Test before launch

### 4. Canonical URLs (§1.3.1)

- [ ] P0 **Canonical URLs** — `<link rel="canonical">` on every page:
  - Locale variants: canonical points to default locale (`/poznan/music`), `hreflang` handles alternates (coordinates with section 1.9; depends on 1-00 i18n for locale setup)
  - Query parameter pages (filters, pagination): canonical points to base URL without query params
  - Prevent duplicate content between `/poznan` and `/poznan?category=all`

### 5. Open Graph / social sharing meta tags (§1.6)

- [ ] P0 Open Graph meta tags on every event page (SSR):
  - `og:title` — event name
  - `og:description` — date + venue + short description
  - `og:image` — dynamically generated graphic (Cloudflare Worker / satori)
  - `og:url` — canonical event URL
- [ ] P0 Dedicated URL for each event (deep link that opens app or website)

## Acceptance Criteria

- `sitemap.xml` is reachable at `/sitemap.xml` and contains entries for city, category, event, and venue pages with correct `<lastmod>` values
- `robots.txt` is reachable at `/robots.txt`, allows all public pages, disallows internal/preview routes, and references the sitemap URL
- Every event detail page includes a valid `Event` JSON-LD block; every venue profile page includes a valid `Place` JSON-LD block; both pass Google Rich Results Test validation
- `<link rel="canonical">` is present on every page; filter/pagination query params are stripped from canonical URLs
- Every event detail page includes all four required `og:*` meta tags populated with SSR data
- OG image generation endpoint responds with a valid image for any event URL
- Each event has a stable, dedicated URL that resolves correctly in both browser and app contexts
