# Task 1-08: Cookie Consent

**Phase:** 1 — Core
**Priority:** P0
**Dependencies:** 1-01 (layout / shared shell)
**Reference:** `documentation/ROADMAP-web-b2c.md` (Section 1.11), `documentation/designs/DESIGN.md`

---

## Objective

Implement a GDPR-compliant cookie consent system for the Web B2C application. No non-essential tracking (PostHog analytics, any future marketing pixels) may fire until the user explicitly grants consent. The system includes a first-visit banner, a granular preferences modal, a dedicated cookie policy page, and a persistent footer link to re-open the consent modal at any time.

> Note: Task 1-12 (Monitoring & Analytics) depends on this consent system for PostHog initialization. Task 1-10 (Error & Empty States) fires a `page_not_found` PostHog event gated by analytics consent.

> Note: The footer legal section (task 1-09) should include a 'Manage cookie preferences' link alongside Terms and Privacy links.

## Design Reference

> Prototype: `documentation/designs/web-b2c/EventB2CWeb/`
> Design system: `documentation/designs/DESIGN.md`

- **CookieBanner** (`src/overlays.jsx`) — bottom banner with cookie icon, three actions: "Akceptuj wszystkie" (primary violet), "Odrzuć wszystkie" (secondary), "Zarządzaj" (tertiary)
- **CookiePrefsOverlay** (`src/overlays.jsx`) — "Preferencje cookies" modal with toggles: Niezbędne (always on), Analityczne (PostHog), Marketingowe
- Banner must use glassmorphism for floating elements (DESIGN.md §4), `radius_xl` corners, primary gradient button (`#4900cc` → `#6134e3`)

## Deliverables

### 1. Cookie consent banner (§1.11)

- [ ] P0 **Cookie consent banner** on all Web B2C pages:
  - Show on first visit (before any tracking fires)
  - Options: Accept all / Reject all / Manage preferences
  - Categories: Essential (always on), Analytics (PostHog), Marketing (if any future pixels)
  - Persist consent choice (cookie or localStorage)
  - Re-show banner if consent expires or user clears preferences

### 2. PostHog consent management (§1.11)

- [ ] P0 **PostHog consent management:**
  - Do NOT initialize PostHog until user grants analytics consent
  - If user rejects analytics: no PostHog scripts loaded, no events tracked
  - If user later changes preference (via settings/footer link): update PostHog state accordingly

### 3. Cookie policy page (§1.11)

- [ ] P0 **Cookie policy page** (`/cookie-policy`) — lists all cookies/trackers used, their purpose, and retention period

### 4. Footer link (§1.11)

- [ ] P0 "Manage cookie preferences" link in footer (re-opens consent modal)

## Acceptance Criteria

- On first visit with no stored consent, the cookie banner is visible before any PostHog scripts are initialised or any tracking events fire
- Banner offers three distinct actions: Accept all, Reject all, and Manage preferences
- Accepting all consent initialises PostHog and begins tracking; rejecting all prevents any PostHog initialisation
- Granular preferences modal allows toggling Analytics and Marketing categories independently; Essential cookies cannot be toggled off
- Consent choice is persisted (cookie or localStorage) and survives page reload; banner does not reappear on subsequent visits while consent is valid
- Banner re-appears if stored consent is expired or cleared
- Changing preferences via the footer link updates PostHog state in the current session without requiring a page reload
- `/cookie-policy` page lists every cookie and tracker in use, its purpose, and its retention period; page is SSR and indexable
- "Manage cookie preferences" link is present in the footer on all pages and successfully re-opens the consent modal
