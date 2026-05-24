# Task 1-03: Onboarding and Geolocation

**Phase:** 1 — Core
**Priority:** P0
**Dependencies:** 1-02 (map and discovery)
**Reference:** `documentation/ROADMAP-web-b2c.md` (Section 1.3.0)

---

## Objective

Implement the first-visit onboarding experience: a compliant browser geolocation flow that never auto-prompts on page load, falls back gracefully through IP-based detection to a city picker overlay, and persists the user's city selection across sessions. This task ensures new visitors land on a contextually relevant city view without creating friction or triggering browser penalties.

## Deliverables

### 1. Browser Geolocation Flow

- [ ] P0 **Browser geolocation flow:**
  - Do NOT prompt for geolocation on first page load (browsers penalise unprompted requests)
  - Show "Use my location" button on map — triggers browser geolocation prompt on click
  - On denial / dismiss: fall back to IP-based geolocation (coarse city-level, e.g. via Cloudflare `cf-ipcountry` + GeoIP)
  - If IP geolocation also fails: show city picker (same city list as mobile)
  - After denial: hide "Use my location" button, show "Location unavailable — select your city" with city picker
  - No re-prompt possible in browsers — link to browser site settings instructions if user wants to re-enable

### 2. First-Visit Default State

- [ ] P0 **First-visit default state:**
  - Map centers on detected city (from IP geolocation) with events loaded
  - If no city can be detected: show city picker overlay before loading map
  - Cookie consent banner fires immediately (per section 1.11)

> Note: The roadmap text says "per section 1.10" for cookie consent, but cookie consent is actually §1.11 (§1.10 is Terms of Service). See task 1-08 for cookie consent implementation.

### 3. City Selection Persistence

- [ ] P1 **City selection persistence:**
  - Store selected city in localStorage
  - On return visit: load last selected city (skip geolocation prompt)
  - "Change city" option always visible in header/nav

## Design Reference

> Prototype: `documentation/designs/web-b2c/EventB2CWeb/`

- **CityPickerOverlay** (`src/overlays.jsx`) — "Wybierz miasto" modal with search input, "Popularne miasta" grid (9 cities: Poznań, Kraków, Warszawa, Wrocław, Gdańsk, Łódź, Katowice, Lublin, Szczecin), diacritics-insensitive search filtering
- **CityPickerOverlay no-match state** — "[City] nie jest jeszcze dostępne" with "Zgłoś [City]" CTA button
- **CookieBanner** (`src/overlays.jsx`) — fires on first visit (implemented in task 1-08)

## Acceptance Criteria

- The browser's geolocation permission prompt is never triggered automatically on page load
- A "Use my location" button is visible on the map and triggers the browser prompt only on user click
- When the user denies geolocation, the map falls back to IP-based city detection (Cloudflare header or equivalent)
- When IP geolocation is unavailable, a city picker overlay is shown before the map loads
- After a geolocation denial the "Use my location" button is replaced with "Location unavailable — select your city" and a link to browser settings instructions
- On first visit with successful IP detection, the map centers on the detected city with events loaded
- The cookie consent banner is shown on first visit (before any tracking fires)
- Selected city is written to localStorage and read back on subsequent visits, skipping the geolocation prompt
- "Change city" is always accessible in the header/nav regardless of how the city was originally set
- `pnpm type-check` and `pnpm lint` pass with no errors
