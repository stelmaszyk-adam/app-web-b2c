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
- [ ] P0 Create `src/mocks/` directory with MSW handlers matching backend OpenAPI spec — PARTIAL: `src/mocks/handlers.ts` exists but its seed shape (`title`, `startDate`, …) doesn't match the live client mapping in `src/lib/api.ts`, and its URL prefixes don't line up with the SSR/browser fetch paths
- [ ] P0 Browser service worker setup (`src/mocks/browser.ts`) + server setup for tests (`src/mocks/server.ts`) — PARTIAL: files exist and export `worker`/`server`, but `worker.start()` is never called anywhere and there's no `public/mockServiceWorker.js`
- [ ] P0 Environment variable toggle: `NEXT_PUBLIC_API_MOCKING=true` — PARTIAL: var is documented in `.env.example`, but no code path actually starts MSW when it's `true`
- [ ] P0 `.env.mock` file + `pnpm dev:mock` script in `package.json` — NOT DONE: neither exists
- [ ] P0 Mock handlers return realistic seed data matching the API response envelope (`{ "data": ... }`) (per `documentation/ROADMAP.md §0.4.6`) — NOT DONE: handlers return an envelope, but field names (`title`/`startDate`/`imageUrl`) don't match the live API client mapping
- [ ] P0 Mock handlers must cover all API endpoints used by the app — add new handlers as new features are built (per `documentation/ARCHITECTURE.md §5.2.1`) — NOT DONE: no `/events/search` handler; shapes/paths don't match live client usage

### 2. `.env.mock` contents

```
NEXT_PUBLIC_API_URL=http://localhost:3000   # ignored when mocking
NEXT_PUBLIC_API_MOCKING=true
```

### 3. P1 — Storybook integration

- [ ] P1 MSW handlers can be reused in Storybook stories (per `documentation/ROADMAP.md §0.4.6`) — NOT DONE: no Storybook deps/config/stories in the repo

## Acceptance Criteria

- `pnpm dev:mock` starts the app with MSW active; all API requests are intercepted and return mock data
- `pnpm dev` (without mock flag) does not load MSW and makes real API requests
- MSW server setup (`src/mocks/server.ts`) is importable in Jest/test environments
- `pnpm type-check` and `pnpm lint` pass with MSW files in place
