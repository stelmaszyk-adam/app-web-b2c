# Task 1-10: Error and Empty States

**Phase:** 1 — Core
**Priority:** P0/P1
**Dependencies:** 1-01 (layout / shared shell), 1-08 (cookie consent), 1-12 (monitoring & analytics)
**Reference:** `documentation/ROADMAP-web-b2c.md` (Section 1.16), `documentation/designs/DESIGN.md`

---

## Objective

Implement a complete set of error and empty states across the Web B2C application so that every failure mode — whether a missing page, a server fault, an empty data set, or a network interruption — presents a clear, on-brand experience rather than a blank screen or raw error. Loading skeleton loaders must be in place for all async data surfaces, and 404 hits must be tracked for broken-link detection.

> Design: Use semantic color tokens from DESIGN.md §7.1 — `error` (`#d32f2f`) and `error_container` (`#fce4ec`) for error states, `warning` for degraded states. Empty state illustrations should use the violet-tinted brand palette.

## Deliverables

### 1. Error pages (§1.16)

- [ ] P0 **404 page** — custom "Page not found" with link to homepage and search
- [ ] P0 **500 / error page** — custom error page with "Try again" option and link to homepage

### 2. Empty states (§1.16)

- [ ] P0 **Empty state: no events found** — friendly message with illustration, suggest changing filters or city
- [ ] P0 **Empty state: venue has no upcoming events** — message on venue profile page

### 3. Loading states (§1.16)

- [ ] P0 **Loading states** — skeleton loaders for event cards, venue profile, and map pins during data fetching

### 4. API error handling (§1.16)

- [ ] P1 **API error handling** — toast or inline error message when API calls fail (with retry option)

### 5. Offline / network error (§1.16)

- [ ] P1 **Offline/network error** — banner when network is unavailable ("Check your connection")

### 6. 404 tracking (§1.16)

- [ ] P1 **404 tracking** — track 404 pages in PostHog (`page_not_found` event with path) to detect broken links from external sources

## Acceptance Criteria

- Navigating to a non-existent URL renders the custom 404 page with a link to the homepage and a search input
- A simulated server error renders the custom 500 page with a "Try again" button and a link to the homepage
- When an event search returns zero results, the empty-state illustration and filter-change suggestion are displayed rather than an empty list
- The venue profile page displays the "no upcoming events" empty state when the API returns an empty events list for that venue
- Skeleton loaders are shown for event cards, the venue profile block, and map pins while the corresponding API requests are in flight
- When an API call fails, a toast or inline message with a retry action is shown (P1)
- When the device is offline, a network error banner is displayed (P1)
- Each 404 page visit fires a `page_not_found` PostHog event containing the requested path (P1, only when analytics consent is granted)
