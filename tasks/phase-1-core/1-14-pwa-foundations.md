# Task 1-14: PWA Foundations

**Phase:** 1 — Core
**Priority:** P1
**Dependencies:** Phase 0 scaffold
**Reference:** `documentation/ROADMAP-web-b2c.md` (Section 1.17), `documentation/designs/DESIGN.md`

---

## Objective

Lay the minimal Progressive Web App foundations for the Web B2C application: a web app manifest, a complete favicon and touch icon set, and a theme-color meta tag. A service worker and offline caching are explicitly out of scope for MVP (SSR pages do not benefit from SW caching). All items in this task are P1.

> Note: Manifest and favicon icons should use brand primary (`#4900cc`) background with white icon mark per DESIGN.md.

## Deliverables

### 1. Web app manifest (§1.17)

- [ ] P1 **Web app manifest** (`manifest.json`) — app name, icons, theme color `#4900cc` (DESIGN.md `primary` token), display mode (`standalone`)

### 2. Favicons and touch icons (§1.17)

- [ ] P1 **Favicon and touch icons** — standard favicon set (16x16, 32x32, 192x192, 512x512) + Apple touch icon

### 3. Theme color (§1.17)

- [ ] P1 **Theme color** — `<meta name="theme-color">` set to `#4900cc` (DESIGN.md `primary` token), matching brand primary color (adapts to light/dark mode if supported)

### Out of scope (§1.17)

- [ ] CUT Service worker / offline caching — not needed for MVP (SSR pages don't benefit from SW caching)

## Acceptance Criteria

- `manifest.json` is served at `/manifest.json` and is referenced in the document `<head>`; it includes `name`, `short_name`, `icons` (all four sizes), `theme_color`, and `display: "standalone"`
- Favicon files are present and linked for 16x16, 32x32, 192x192, and 512x512 sizes; an Apple touch icon (`apple-touch-icon`) is also present
- `<meta name="theme-color">` is present in the document `<head>` and matches the brand primary violet (`#4900cc`); where the browser supports the `media` attribute the tag adapts to light/dark mode
- No service worker is registered (explicitly omitted per MVP scope)
- The site passes Chrome's "Installable" PWA checklist (manifest + icons present; HTTPS enforced in production)
