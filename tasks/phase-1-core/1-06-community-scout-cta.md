# Task 1-06: Community Scout CTA

**Phase:** 1 — Core
**Priority:** P0
**Dependencies:** 1-04 (event detail), 1-02 (map and listing pages), 1-01 (layout)
**Reference:** `documentation/ROADMAP-web-b2c.md` (Section 1.4.3)

---

## Objective

Surface the Community Scout program within the Web B2C read-only experience: show a "Know about an event?" CTA on map and listing pages that directs users to the mobile app for tip submission, and display the "Tipped by @username" attribution on event detail pages for community-sourced events. Because Web B2C has no authentication, all interactive tip actions redirect to the mobile app.

## Deliverables

### 1. Community Scout CTA and Attribution

- [ ] P0 **"Know about an event?" CTA** in page footer or sidebar on map/listing pages:
  - Smart banner: "Submit an event tip in the app" → app store link / deep link to tip form in mobile app
  - Matches existing pattern of directing interactive actions to mobile app
- [ ] P0 **"Tipped by @username"** attribution on event detail pages for community-sourced events (read-only display, SSR)

## Design Reference

> Prototype: `documentation/designs/web-b2c/EventB2CWeb/`

- **SearchDiscoveryScreen** (`src/screens.jsx`) — "Wiesz o ciekawym wydarzeniu?" CTA at bottom of results list
- **EventCard** (`src/components.jsx`) — community tip attribution: "Polecone przez @username" on list cards
- **EventDetailScreen** (`src/screens.jsx`) — community scout attribution badge on detail page

> Note: Attribution should appear on BOTH event list cards (EventCard) and event detail pages, using i18n keys (EN: "Tipped by @username", PL: "Polecone przez @username").

## Acceptance Criteria

- A "Know about an event?" CTA is present in the footer or sidebar on the main map/discovery page and all city/category listing pages
- The CTA contains a "Submit an event tip in the app" smart banner that links to the mobile app store (or a deep link to the tip form)
- The CTA visual treatment is consistent with other smart banners on the site (no auth UI, no inline forms)
- Event detail pages for community-sourced events display a "Tipped by @username" attribution badge rendered server-side
- The attribution is not shown for events that are not community-sourced (conditional on API data)
- `pnpm type-check` and `pnpm lint` pass with no errors
