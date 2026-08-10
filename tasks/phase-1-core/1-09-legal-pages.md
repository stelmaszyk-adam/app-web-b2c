# Task 1-09: Legal Pages

**Phase:** 1 — Core
**Priority:** P0
**Dependencies:** 1-01 (layout / shared shell), 1-07 (SEO foundations)
**Reference:** `documentation/ROADMAP-web-b2c.md` (Section 1.10), `documentation/designs/DESIGN.md`

---

## Objective

Host the Terms of Service and Privacy Policy pages on the Web B2C application. Although Web B2C is read-only and requires no user registration, these pages must be present here because they are linked from the mobile app, the B2B organizer dashboard, and app store listings. Pages must be SSR-rendered for SEO and include a version indicator that stays in sync with the backend's `CURRENT_TOS_VERSION`.

> Note: Footer legal section should coordinate with task 1-08 (Cookie Consent) which adds a 'Manage cookie preferences' link in the same footer block.

> Typography: Use `body_lg` for page content, `headline_md` for section headings, `label_md` (ALL CAPS, +0.05em letter-spacing) for version indicator — per DESIGN.md §7.3.

## Deliverables

### 1. Terms of Service page (§1.10)

- [ ] P0 **Terms of Service page** (`/terms`) — static page with full ToS text, SSR for SEO — NOT DONE: no `/terms` route exists

### 2. Privacy Policy page (§1.10)

- [ ] P0 **Privacy Policy page** (`/privacy`) — static page with full Privacy Policy text, SSR for SEO — NOT DONE: no `/privacy` route exists

### 3. Footer links (§1.10)

- [ ] P0 **Footer links** to Terms of Service and Privacy Policy on all pages — PARTIAL: footer has "Terms"/"Privacy" labels in the Legal section, but both currently link to `href="#"` since the pages don't exist yet

### 4. Version indicator (§1.10)

- [ ] P0 **Version indicator** on ToS/Privacy Policy pages (e.g. "Last updated: April 1, 2026") — matches `CURRENT_TOS_VERSION` from backend — NOT DONE: no such pages exist yet, so no version indicator either

## Acceptance Criteria

- `/terms` is publicly accessible, SSR-rendered, and contains the full Terms of Service text
- `/privacy` is publicly accessible, SSR-rendered, and contains the full Privacy Policy text
- Both pages are crawlable (not disallowed in `robots.txt`) and appear in the sitemap
- Footer on every page contains links to both `/terms` and `/privacy`
- Both pages display a "Last updated" version indicator that matches the `CURRENT_TOS_VERSION` value exposed by the backend
- Pages render correctly when linked from external sources (mobile app, B2B dashboard, app store listings)
