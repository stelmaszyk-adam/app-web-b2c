# Task 1-02: Map and Discovery

**Phase:** 1 — Core
**Priority:** P0
**Dependencies:** 1-00 (i18n), 1-01 (layout), Phase 0 API client
**Reference:** `documentation/ROADMAP-web-b2c.md` (Section 1.3)

---

## Objective

Implement the primary discovery surface of the Web B2C application: an interactive MapLibre GL JS-powered map (with Stadia Maps tiles) with event pins, clustering, and filters, alongside SSR city and category listing pages that are SEO-ready from day one. This is the main landing experience for all users arriving at the site.

## Deliverables

### 1. Map and Discovery Page

- [x] P0 Main page: map with event pins (MapLibre GL JS + Stadia Maps — see [ARCHITECTURE.md ADR #17](../../documentation/ARCHITECTURE.md#11-key-architectural-decisions-log))
- [x] P0 Pin clustering at high zoom-out
- [x] P0 Custom pin icons per unified category (same 12 categories as mobile — see [central roadmap](../../documentation/ROADMAP.md#unified-category-system))
- [x] P0 Category filter (multiselect)
- [x] P0 Date filter: calendar date-range picker (select start and end date) with quick-select presets (Today, Tomorrow, This weekend)
- [x] P0 Distance filter: 0.5 / 1 / 3 / 5 km presets (same values as mobile), applied client-side against the already-fetched (5 km default) event set using Haversine distance from the city center
- [x] P0 City selection (same list as mobile)
- [x] P0 Map <-> List toggle
- [x] P0 Event mini-card on pin click (photo + name + time + venue)
- [x] P0 City listing pages with SSR (`/poznan`, `/krakow`, `/wroclaw`, etc.) — SEO from day one
- [x] P0 Category listing pages (`/poznan/music`, `/krakow/this-weekend`) — SEO
- [ ] P1 Text search bar (event name / venue name) — PARTIAL: search inputs exist in `app-header.tsx` but are unbound (no state, no API `search` param usage)
- [ ] P1 "Happening Now" filter — PARTIAL: toggle UI exists in `FilterBar`/`discovery-view.tsx` but doesn't actually filter `filteredEvents`

## Design Reference

> Prototype: `documentation/designs/web-b2c/EventB2CWeb/`

- **SearchDiscoveryScreen** (`src/screens.jsx`) — split-view: scrollable event list (left) + map with pins (right). "Search this area" pill on map pan. Sort control (Trafność/Data/Odległość)
- **FilterBar** (`src/components.jsx`) — horizontal chip row: "Dzieje się teraz" toggle, 12 category chips, date filter, sort chip
- **EventCard** (`src/components.jsx`) — search result card with thumbnail, badges, category, date, venue, price, save button
- **MapCanvas** (`src/components.jsx`) — stylized map with street grid and landmarks
- **MapPin** (`src/components.jsx`) — category-colored pin with icon and price label
- **MapPopup** (`src/components.jsx`) — mini-card on pin click: image, category, date, title, venue
- **DatePickerOverlay** (`src/overlays.jsx`) — date range picker with presets (Dzisiaj, Jutro, W ten weekend)
- **CityPickerOverlay** (`src/overlays.jsx`) — city selection modal with search

> Note: The design prototype includes a sort control (Trafność/Data/Odległość) and "Search this area" pill not explicitly listed in §1.3 — consider adding during implementation.

> Note: The design prototype `data.jsx` lists 13 categories vs. the central roadmap's 12 unified categories. Follow the central roadmap's 12-category system.

## Acceptance Criteria

- The main page (`/`) loads MapLibre GL JS with Stadia Maps tiles and renders event pins on the map
- Pins are clustered when multiple events overlap at the current zoom level
- Each of the 12 unified categories has a distinct custom pin icon with matching category color
- Category multiselect filter updates visible pins and event list without a full page reload
- Date filter supports free range selection (start + end date) and quick-select presets: Today, Tomorrow, This weekend
- City selector shows the same city list used in the mobile app
- Map/List toggle switches between the split-view and a full-width list view
- Clicking a map pin shows a mini-card with event photo, name, time, and venue name
- `/poznan`, `/krakow`, and all supported city routes render via SSR with event data in HTML (verifiable without JS)
- `/poznan/music`, `/krakow/this-weekend`, and equivalent category routes render via SSR
- `pnpm type-check` and `pnpm lint` pass with no errors
