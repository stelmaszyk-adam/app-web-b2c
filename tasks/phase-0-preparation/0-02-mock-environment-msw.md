# Task 02: Mock Environment (MSW)

**Phase:** 0 — Preparation
**Priority:** P0
**Dependencies:** 0-00 (Project Scaffold), 0-01 (API Client Setup)
**Reference:** `documentation/ROADMAP-web-b2c.md §0.4.7`, `documentation/ROADMAP.md §0.4.6`, `documentation/ARCHITECTURE.md §5.2.1`

---

## Objective

Set up Mock Service Worker (MSW) to intercept API requests during local development and testing, allowing frontend work to proceed independently of the backend. Handlers must match the backend OpenAPI spec so that switching to the real API requires no client-side changes.

## Deliverables

### 1. MSW setup

- [x] P0 Install `msw` (dev dependency)
- [x] P0 Create `src/mocks/` directory with MSW handlers matching backend OpenAPI spec — rewrote `src/mocks/handlers.ts` against seed fixtures in `src/mocks/data.ts` matching the exact snake_case fields `mapEvent`/`mapVenue` read
- [x] P0 Browser service worker setup (`src/mocks/browser.ts`) + server setup for tests (`src/mocks/server.ts`) — `worker.start()` now called from `src/mocks/init.browser.ts` (invoked by `src/components/mocks/mocking-provider.tsx`), `server.listen()` called from `src/instrumentation.ts`; `public/mockServiceWorker.js` generated via `pnpm msw init`. Verified by running `pnpm dev:mock` with no backend and fetching `/pl/poznan`, `/pl/poznan/event/e1` and `/pl/poznan/venue/v1` — all render seed data server-side via the `instrumentation.ts` `server.listen()` call. `src/mocks/server.ts` is also imported directly by `src/mocks/handlers.test.ts` (added `vitest` as the test runner; `pnpm test`) and exercised against `/events`, `/events/search`, `/events/:id`, `/venues/:id`, `/venues/:id/events`
- [x] P0 Environment variable toggle: `NEXT_PUBLIC_API_MOCKING=true` — gates both the browser bootstrap and the Node-side `server.listen()` in `src/instrumentation.ts`
- [x] P0 `.env.mock` file + `pnpm dev:mock` script in `package.json` — added both; `dev:mock` uses `dotenv-cli` to load `.env.mock`
- [x] P0 Mock handlers return realistic seed data matching the API response envelope (`{ "data": ... }`) (per `documentation/ROADMAP.md §0.4.6`) — seed data in `src/mocks/data.ts` uses the real backend field names
- [x] P0 Mock handlers must cover all API endpoints used by the app — add new handlers as new features are built (per `documentation/ARCHITECTURE.md §5.2.1`) — added `/events/search`; every endpoint reachable from `src/api/client.ts` (browser or server) is registered under both the absolute backend URL and the browser-relative `/api` path. `src/mocks/handlers.test.ts` (vitest) covers cursor pagination, radius/query/category/date filtering, and 404s for the endpoints with real filter logic

### 2. `.env.mock` contents

```
NEXT_PUBLIC_API_URL=http://localhost:3000   # ignored when mocking
NEXT_PUBLIC_API_MOCKING=true
```

### 3. P1 — Storybook integration

- [~] P1 MSW handlers can be reused in Storybook stories (per `documentation/ROADMAP.md §0.4.6`) — deferred: no Storybook dependency, config, or stories exist anywhere in web-b2c; adding Storybook is a separate scaffolding task

## Acceptance Criteria

- `pnpm dev:mock` starts the app with MSW active; all API requests are intercepted and return mock data — verified by running `pnpm dev:mock` against `/pl/poznan`, `/pl/poznan/event/e1` and `/pl/poznan/venue/v1` with no backend running
- `pnpm dev` (without mock flag) does not load MSW and makes real API requests
- MSW server setup (`src/mocks/server.ts`) is importable in Jest/test environments — no Jest in this repo; `vitest` was added instead (`pnpm test`) and imports `src/mocks/server.ts` directly in `src/mocks/handlers.test.ts`
- `pnpm type-check` and `pnpm lint` pass with MSW files in place
