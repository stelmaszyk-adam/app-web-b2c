# Task 01: API Client Setup

**Phase:** 0 — Preparation
**Priority:** P0
**Dependencies:** 0-00 (Project Scaffold)
**Reference:** `documentation/ROADMAP-web-b2c.md §0.4.6`, `documentation/ARCHITECTURE.md §3.3`, `documentation/ARCHITECTURE.md §4`

---

## Objective

Set up a lightweight, SSR-friendly typed API client for Web B2C using `openapi-typescript` and `openapi-fetch`, generated from the backend's OpenAPI spec. This client is the sole interface between Web B2C and the backend REST API.

## Deliverables

### 1. API client setup

- [x] P0 Install `openapi-typescript` (dev dependency) and `openapi-fetch` (runtime dependency)
- [x] P0 Configure codegen script in `package.json`: `"api:generate": "openapi-typescript <spec-path> --output src/api/generated/schema.d.ts"`
- [x] P0 Create `src/api/client.ts` — configured `openapi-fetch` client typed against the generated schema, with `NEXT_PUBLIC_API_URL` base URL (per `documentation/ARCHITECTURE.md §4`)
- [x] P0 First codegen run: generate types from backend `docs/openapi.json` (URL or file mode)
- [x] P0 Add `src/api/generated/` to `.gitignore` (regenerated on demand, not committed)

### 2. Directory structure

- [x] P0 `src/api/` directory layout:
  - `src/api/client.ts` — configured `openapi-fetch` client
  - `src/api/generated/schema.d.ts` — auto-generated types from OpenAPI spec (not committed)

## Acceptance Criteria

- `pnpm api:generate` runs without errors and produces `src/api/generated/schema.d.ts`
- `src/api/client.ts` exports a configured `openapi-fetch` client typed against the generated schema
- `src/api/generated/` is listed in `.gitignore` and not tracked by git
- `pnpm type-check` passes with the generated types in place
