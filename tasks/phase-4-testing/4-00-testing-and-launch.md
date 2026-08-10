# Task 4-00: Testing and Launch

**Phase:** 4 — Testing and Launch
**Priority:** P0
**Dependencies:** All Phase 1 tasks
**Reference:** `documentation/ROADMAP-web-b2c.md` (Section 4.1), `documentation/ARCHITECTURE.md (Section 17.4)`

---

## Objective

Verify that the Web B2C application is production-ready by running end-to-end tests, SEO validation, cross-browser compatibility checks, and accessibility audits across all public pages before launch.

> Note: Test glassmorphism (`backdrop-filter`) rendering in Safari (iOS + macOS) — partial support may require fallbacks.

## Deliverables

### 1. End-to-End Tests

- [ ] P0 E2E test: city listing page renders events correctly (SSR verification) — NOT DONE: no test framework (Jest/Vitest/Playwright/Cypress) or test files exist in the repo
- [ ] P0 E2E test: event detail page has correct OG meta tags (verify with HTML parser) — NOT DONE: no such test exists (the OG metadata itself is implemented, see task 1-07)
- [ ] P0 E2E test: PostHog does NOT fire before cookie consent is granted (GDPR compliance) — NOT DONE: no such test exists (the consent gating itself is implemented, see task 1-08)

### 2. SEO Verification

- [ ] P0 SEO verification: validate `sitemap.xml`, `robots.txt`, and structured data (JSON-LD) with Google Rich Results Test — NOT DONE: generators exist, but no documented/automated Rich Results Test validation run

### 3. Cross-Browser Testing

- [ ] P0 Cross-browser testing: Chrome, Safari, Firefox (desktop + mobile viewports) — NOT DONE: no test artifacts, checklist, or CI browser matrix found

### 4. Performance Audits

- [ ] P1 Lighthouse audit: Performance >= 80, SEO >= 80, Accessibility >= 80 on all public pages (note: task 1-13 sets a stricter >= 90 target for key pages — event detail, venue profile, city listing) — PARTIAL: Lighthouse CI enforces performance >= 80, but accessibility/SEO are `warn`-only (not enforced), and only a single URL (`/pl`) is audited, not all public pages

### 5. Accessibility Audit

- [ ] P1 Accessibility audit: keyboard navigation, screen reader testing on key pages (event detail, venue profile, city listing) — NOT DONE: no audit reports, axe CI gate, or documented screen-reader/keyboard test results (though some underlying a11y features exist, see task 1-13)

## Acceptance Criteria

- City listing pages render event data correctly under SSR with no client-side hydration errors
- Event detail pages include correct and complete OG meta tags as verified by HTML parser
- PostHog does not fire any events before cookie consent is explicitly granted by the user
- `sitemap.xml` is valid and all URLs are reachable; `robots.txt` allows all public pages
- Structured data (JSON-LD) on event and venue pages passes Google Rich Results Test validation
- Application functions correctly with no visual or functional regressions in Chrome, Safari, and Firefox on both desktop and mobile viewports
- All public pages achieve a Lighthouse score of >= 80 on Performance, Accessibility, and SEO (key pages — event detail, venue profile, city listing — meet the stricter >= 90 accessibility target from task 1-13)
- Key pages (event detail, venue profile, city listing) are fully navigable via keyboard and usable with a screen reader
