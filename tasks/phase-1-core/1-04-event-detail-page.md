# Task 1-04: Event Detail Page

**Phase:** 1 — Core
**Priority:** P0
**Dependencies:** 1-01 (layout), Phase 0 API client
**Reference:** `documentation/ROADMAP-web-b2c.md` (Sections 1.4.1, 1.4.4)

---

## Objective

Build the SSR event detail page, which is the primary SEO and social-sharing surface for individual events. The page must render full event information including photo gallery, metadata, CTAs, smart app banners, and recurring event indicators — all server-side rendered so the content is indexable and shareable without JavaScript.

> Note: Open Graph meta tags and OG image generation for event pages are owned by task 1-07 (SEO Foundations). This task focuses on the page content and layout.

## Deliverables

### 1. Event Details Page

- [ ] P0 Event details page (SSR for SEO + OG tags):
  - Photo gallery (clickable thumbnails or carousel; sourced from `event_photos`, fallback to single `photo_url`)
  - Name, date, time, address
  - Description
  - Venue name with link to venue profile page
  - CTA "Buy tickets" (deep link to external system)
  - CTA "Navigate" (link to Google Maps)
  - Source attribution for aggregated events
- [ ] P0 "Share" button (copy link)
- [ ] P0 **Dedicated URL for each event** (deep link that opens app or website)
- [ ] P1 "Add to calendar" button (dropdown with options):
  - Google Calendar (pre-filled link with event parameters)
  - Apple Calendar (.ics file download)
  - Outlook (.ics file download)
- [ ] P0 Smart banner: "Follow this venue in the app" -> app store link
- [ ] P0 Smart banner: "Save this event in the app" -> app store link

### 2. Recurring Event Display

- [ ] P0 **Recurring event indicator** on event detail page:
  - "Part of a weekly series" badge (or daily/monthly, based on recurrence type)
  - "View all dates" link -> list/accordion of all upcoming instances in the series
  - Each instance links to its own event detail page

## Design Reference

> Prototype: `documentation/designs/web-b2c/EventB2CWeb/`
> Design system: `documentation/designs/DESIGN.md`

- **EventDetailScreen** (`src/screens.jsx`) — two-column layout. Left: hero image with category badge + "Szybko znika" tag, breadcrumb nav, title, scout attribution, date/time, venue + address, recurring indicator, "O wydarzeniu" description with hashtags, "Dodaj do kalendarza", "Może Cię też zainteresować" related events. Right sidebar: price card with urgency ("Ostatnie 12% biletów"), "Kup bilety" CTA in violet, "Nawiguj" + "Zapisz" buttons, venue mini-card. Smart banner: "Zapisz w aplikacji — Otrzymuj przypomnienia 24 h przed wydarzeniem"

> Note: Design prototype shows additional elements not in §1.4.1 (breadcrumbs, related events grid, urgency indicators, hashtags). Implement roadmap items first; design extras can be added as enhancements.

> Note: `og:image` uses a dynamically generated graphic (Cloudflare Worker / satori) — see task 1-07 for full OG/SEO implementation.

## Acceptance Criteria

- Event detail pages render fully via SSR — event name, date, description, and venue are present in raw HTML (verifiable without JS)
- Photo gallery renders `event_photos` when available; falls back to `photo_url`; falls back to a branded category placeholder
- "Kup bilety" CTA links to the external ticketing URL and is not rendered when no ticket URL exists
- "Nawiguj" CTA opens Google Maps directions to the event venue address
- Source attribution is displayed for events sourced from external aggregators
- "Share" button copies the canonical event URL to the clipboard
- Each event has a dedicated canonical URL
- "Follow this venue in the app" smart banner links to the appropriate app store
- "Save this event in the app" smart banner links to the appropriate app store
- Events with recurrence data show a "Part of a weekly series" (or daily/monthly) badge
- "View all dates" expands or navigates to a list of all upcoming instances, each linking to its own detail page
- `pnpm type-check` and `pnpm lint` pass with no errors
