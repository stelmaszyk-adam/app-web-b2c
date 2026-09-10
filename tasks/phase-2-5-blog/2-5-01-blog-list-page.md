# Task 2-5-01: Blog List Page (`/blog`)

**Phase:** 2.5 — Blog Pages
**Priority:** P1
**Dependencies:** 2-5-00 (Blog API client and mocks), 1-00 (i18n), 1-01 (layout and navigation)
**Reference:** `documentation/ROADMAP-web-b2c.md` (Sections 2.5.1, 2.5.2, 2.5.5), `documentation/designs/DESIGN.md`

---

## Objective

Build the public blog list page at `/blog` — an editorial, SSR-first index of all published blog posts. This is the primary discovery surface for editorial content and must render fully server-side for SEO. Interactive elements (category filter, "Load more") are isolated as small Client Component islands so the initial payload stays HTML-only.

## Deliverables

### 1. Route + Server Component shell

- [ ] P1 Create `app/blog/page.tsx` as a Server Component
- [ ] P1 On the server, call `GET /blog?locale=<current>&limit=12` via the typed `openapi-fetch` client and pass the initial page of posts + `nextCursor` down to the components below
- [ ] P1 No client JS required for the initial render — verifiable by disabling JavaScript in the browser and confirming all 12 cards + hero + category chips are present in the raw HTML
- [ ] P1 `generateMetadata()` returns `title`, `description`, and canonical URL for `/blog` (per section 1.3.1 canonical pattern — query params stripped)

### 2. Editorial hero

- [ ] P1 Pinned admin `city_guide` post at the top of the page
  - Hero image (R2 `large` variant) with gradient overlay
  - `display_lg` (3.5rem, letter-spacing -0.02em) headline per DESIGN.md tokens
  - Category badge + `label_md` (0.75rem, ALL CAPS, letter-spacing +0.05em) date byline
  - Whole hero is a link to `/blog/{slug}`
- [ ] P1 If no pinned city-guide post exists, hero falls back to the most recent published post

### 3. Category filter chips

- [ ] P1 Row of `SelectionChip` components — one per `blog_category_enum` value plus an "All" chip
  - Unselected chips: `surface_container_high` background
  - Selected chip: `primary` background
  - Reuse the same `SelectionChip` component the event filter bar uses (from Phase 1) — do not fork
- [ ] P1 Chip selection updates the URL with a `?category=` search param (Client Component island)
- [ ] P1 Server re-renders the grid on navigation using the new `category` param; no client-side data-fetching for filtering

### 4. Two-column `BlogPostCard` grid

- [ ] P1 New reusable component `BlogPostCard` (Server Component) rendered in a two-column CSS grid (single column on mobile, two columns from `md` breakpoint)
- [ ] P1 Card visual spec (Radiant Curator):
  - `radius_xl` (24px) border radius, image-dominant
  - Gradient overlay on the bottom 30% of the image
  - **No 1px borders** — separation via tonal shift (`surface_container_low` → `surface_container_lowest`)
- [ ] P1 Card content:
  - Author avatar + `label_md` uppercase date + category
  - `title_lg` headline
  - 2-line excerpt clamp (`line-clamp-2`)
- [ ] P1 Whole card is a link to `/blog/{slug}` — no nested interactive elements

### 5. "Load more" island

- [ ] P1 Small Client Component (`'use client'`) below the grid
- [ ] P1 On click, calls `GET /blog?cursor={nextCursor}&limit=12` via `openapi-fetch`; appends returned posts to the grid; updates its internal `nextCursor` state
- [ ] P1 Hides itself when `meta.hasMore === false`
- [ ] P1 Loading state (spinner or "Ładowanie…" label using `label_md`)
- [ ] P1 Error state falls back to a retry button and does not crash the page
- [ ] P1 Preserves the currently selected category chip when paginating

### 6. i18n

- [ ] P1 All static copy on the page (hero pill, chip labels, "Załaduj więcej", empty state) sourced from `messages/pl.json` and `messages/en.json` via `next-intl` — no hardcoded Polish/English strings in components

## Design Reference

> Design system: `documentation/designs/DESIGN.md` — "Radiant Curator"

- **Hero headline:** `display_lg` — 3.5rem, letter-spacing -0.02em
- **Byline / metadata:** `label_md` — 0.75rem, ALL CAPS, letter-spacing +0.05em
- **Body text:** `body_lg` — 1rem, `on_surface_variant` color
- **Card border radius:** `radius_xl` (24px)
- **Chip states:** `surface_container_high` (unselected) / `primary` (selected)
- **No 1px borders anywhere** — tonal shifts between sections and cards

## Acceptance Criteria

- `/blog` renders 12 seeded posts in a two-column grid (single column on mobile) plus an editorial hero at the top — all present in the raw HTML with JS disabled
- Editorial hero prefers a pinned admin `city_guide` post, falling back to the newest published post when none is pinned
- Category chips update the URL and cause the server to re-render with a filtered list; the currently selected chip is visually highlighted with `primary` background
- "Load more" appends the next 12 posts without a full page reload and disappears when there are no further pages
- Cards use `radius_xl`, image-dominant layout, gradient overlay, and no 1px borders
- All copy is loaded via `next-intl`; both `pl` and `en` locales render without missing keys
- Canonical URL on `/blog` strips any query params
- `pnpm type-check` and `pnpm lint` pass with no errors
