# Task 1-05: Venue Profile Page

**Phase:** 1 — Core
**Priority:** P0
**Dependencies:** 1-01 (layout), Phase 0 API client
**Reference:** `documentation/ROADMAP-web-b2c.md` (Section 1.4.2)

---

## Objective

Build the SSR venue profile page, which gives users a dedicated, indexable page for each venue showing photos, details, opening hours, upcoming events, and an embedded map. Like the event detail page, it must be fully server-side rendered for SEO and must prompt non-app users to follow the venue in the mobile app via a smart banner.

> Note: Task 1-01 (§1.4.25 P1) includes a contextual CTA on this page: "Is this your venue? Claim it on the Organizer Dashboard." Leave space for this element.

## Deliverables

### 1. Venue Profile Page

- [ ] P0 Venue profile page (SSR for SEO): — PARTIAL: SSR page has gallery/hero, name, category, description, follower count, upcoming events (with empty state), and an opening-hours table with "until late" and today highlighted. Missing: holiday/temporary-closure UI, and the "map" is a decorative SVG rather than a real map bound to the venue's coordinates
  - Photo gallery (grid or carousel; sourced from `venue_photos`, fallback to single `photo_url`)
  - Name, category, description, opening hours (including temporary closures, holiday hours, and "open until late" indicators when applicable)
  - Follower count
  - List of upcoming events
  - Address with map
- [x] P0 Smart banner: "Follow this venue in the app" -> app store link

## Design Reference

> Prototype: `documentation/designs/web-b2c/EventB2CWeb/`
> Design system: `documentation/designs/DESIGN.md`

- **VenueProfileScreen** (`src/screens.jsx`) — hero image with category badge + share button, breadcrumb nav, venue name, address, stats row (followers, upcoming events count, open/closed status), "O miejscu" description with "To Twoje miejsce?" CTA, opening hours table (today highlighted), "Nadchodzące wydarzenia" list, empty state. Right sidebar: embedded map with pin + "Nawiguj" button. Smart banner: "Obserwuj w aplikacji — Powiadomienia o nowych wydarzeniach"

> Note: Design prototype shows a share button on the venue hero image not listed in §1.4.2 — consider adding during implementation.

## Acceptance Criteria

- Venue profile pages render fully via SSR — venue name, description, and address are present in raw HTML (verifiable without JS)
- Photo gallery renders `venue_photos` when available; falls back to `photo_url`; falls back to a branded category placeholder
- Opening hours table displays the daily schedule with today's row visually highlighted
- Temporary closures, holiday hours, and "open until late" states are represented when the API returns them
- Follower count is displayed on the venue profile
- Upcoming events are listed with thumbnail, date/time, and title; each links to its own event detail page
- An empty-state message is shown when the venue has no upcoming events
- An embedded map is rendered showing the venue location with the venue's address
- "Follow this venue in the app" smart banner links to the appropriate app store
- `pnpm type-check` and `pnpm lint` pass with no errors
