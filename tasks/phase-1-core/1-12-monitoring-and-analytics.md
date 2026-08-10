# Task 1-12: Monitoring and Analytics

**Phase:** 1 — Core
**Priority:** P0/P1
**Dependencies:** 1-08 (cookie consent — PostHog must not initialise before analytics consent is granted)
**Reference:** `documentation/ROADMAP-web-b2c.md` (Sections 1.13, 1.14), `documentation/ARCHITECTURE.md (Sections 12.1, 12.2)`

---

## Objective

Integrate error monitoring (Sentry) and product analytics (PostHog) into the Web B2C application, and enforce performance budgets via Core Web Vitals targets, Lighthouse CI, and bundle analysis. Sentry operates unconditionally for error tracking; PostHog is gated behind the cookie consent system implemented in task 1-08. Performance budgets are critical because Google uses Core Web Vitals as a ranking signal for SSR discovery pages.

> Note: ARCHITECTURE.md §12 defines: single Sentry org with per-repo projects, `correlationId` from API response headers attached to Sentry context, single PostHog project shared across platforms with platform-prefixed events where ambiguous.

> Note: Task 1-10 (Error & Empty States) fires an additional `page_not_found` PostHog event beyond the 10 listed here.

## Deliverables

### 1. Sentry integration (§1.13)

- [x] P0 **Sentry integration** — configure `@sentry/nextjs` for error tracking
  - Capture client-side and server-side errors
  - Source maps upload during build for readable stack traces
  - Attach `correlationId` (from API response headers) to error reports

### 2. PostHog integration (§1.13)

- [ ] P0 **PostHog integration** — configure `posthog-js` for product analytics — PARTIAL: consent-gated init/shutdown works, and `page_view`, `event_detail_view`, `venue_profile_view`, `navigate_tap`, `ticket_link_tap`, `event_share`, `smart_banner_click`, and `map_view` (mobile FAB only) fire; `trackSearchPerformed`/`trackSearchZeroResults` exist in `analytics.ts` but are never called since search isn't wired to the UI (see task 1-02)
  - Initialize PostHog only after user grants analytics consent via cookie consent banner (see section 1.11)
  - Track key events: `page_view`, `map_view`, `event_detail_view`, `venue_profile_view`, `navigate_tap`, `ticket_link_tap`, `event_share`, `search_performed`, `search_zero_results`, `smart_banner_click`

### 3. Core Web Vitals targets (§1.14)

- [ ] P0 **Core Web Vitals targets** (critical for SEO — Google uses CWV as a ranking signal): — PARTIAL: metrics are captured and reported to PostHog, but there's no documented/verified budget against the specific LCP/INP/CLS thresholds
  - LCP (Largest Contentful Paint): < 2.5s
  - INP (Interaction to Next Paint): < 200ms
  - CLS (Cumulative Layout Shift): < 0.1
- [ ] P0 **Page load targets:** — PARTIAL: TTFB is reported to PostHog via `onTTFB`, but there's no CI check or assertion for TTFB < 800ms or first-load JS < 150KB
  - SSR pages (event detail, venue profile, city listing): Time to First Byte (TTFB) < 800ms
  - JavaScript bundle size: < 150KB gzipped (first load)

### 4. Lighthouse CI (§1.14)

- [x] P1 **Lighthouse CI** — add Lighthouse audit to CI pipeline, fail build if performance score < 80

### 5. Web Vitals monitoring (§1.14)

- [x] P1 **Web Vitals monitoring** — report CWV metrics to PostHog or a dedicated RUM (Real User Monitoring) endpoint

### 6. Bundle analysis (§1.14)

- [ ] P1 **Bundle analysis** — add `@next/bundle-analyzer` to CI: — PARTIAL: `@next/bundle-analyzer` is wired via `pnpm analyze`, but it isn't run in CI and there's no automated alert on the 150KB threshold
  - Generate bundle report on each build
  - Track bundle size trend — alert if first-load JS exceeds 150KB gzipped

## Acceptance Criteria

- `@sentry/nextjs` is configured; client-side and server-side errors are captured and appear in the Sentry dashboard with readable stack traces (source maps uploaded at build time)
- API `correlationId` response headers are attached to Sentry error reports
- PostHog is not initialised and no tracking events fire until the user grants analytics consent via the cookie banner
- After consent is granted, PostHog captures all 10 specified key events at the correct interaction points
- If the user later revokes analytics consent, PostHog stops tracking in that session
- Core Web Vitals and TTFB targets are documented and verified against real/synthetic measurements before launch (LCP < 2.5s, INP < 200ms, CLS < 0.1, TTFB < 800ms, first-load JS < 150KB gzipped)
- Lighthouse CI step is added to the CI pipeline and fails the build if performance score drops below 80 (P1)
- Bundle analyzer generates a report on each build and alerts when first-load JS exceeds 150KB gzipped (P1)
