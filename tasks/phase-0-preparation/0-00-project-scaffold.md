# Task 00: Project Scaffold

**Phase:** 0 — Preparation
**Priority:** P0
**Dependencies:** None
**Reference:** `documentation/ARCHITECTURE.md`, `documentation/ROADMAP-web-b2c.md`, `documentation/ARCHITECTURE.md (Section 4, 5.1)`

---

## Objective

Initialize the Next.js Web B2C project with all foundational tooling, configuration, and dev infrastructure required before any feature work begins.

## Deliverables

### 1. Initialize Next.js project

- [x] Create Next.js project with App Router and TypeScript strict mode (`create-next-app --typescript`)
- [x] Configure `tsconfig.json` with `strict: true`
- [x] Set up `pnpm` as package manager
- [x] Pin all dependency versions (no `^` or `~` prefixes)
- [x] Add `next.config.ts` (minimal config)

### 2. Styling and component library

- [x] Install and configure Tailwind CSS
- [x] Install and configure shadcn/ui (using the Tailwind config as base)
- [x] Apply "Radiant Curator" design tokens (violet primary palette, Inter font) from `documentation/designs/DESIGN.md`

### 3. Dev tooling

- [x] Configure ESLint (Next.js recommended config)
- [x] Configure Prettier
- [x] Set up Husky + lint-staged (ESLint + Prettier on staged files)
- [x] Add `.env.example` as environment template (include `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_API_MOCKING=false`)
- [x] Add `.gitignore` (node_modules, .next, .env.local, coverage)

### 4. Folder structure

- [x] Create `src/lib/` directory for OG image generation, metadata helpers, and other shared utilities (per `documentation/ARCHITECTURE.md §4`)

### 5. Scripts in `package.json`

- [x] `pnpm dev` — start dev server (http://localhost:3001)
- [x] `pnpm build` — production build
- [x] `pnpm lint` — ESLint
- [x] `pnpm type-check` — `tsc --noEmit`
- [x] `pnpm api:generate` — regenerate typed API client from OpenAPI spec
- [x] Note: `pnpm dev:mock` script will be added in task 0-02 (Mock Environment)

## Acceptance Criteria

- `pnpm dev` starts the Next.js app on port 3001 with no errors
- `pnpm build` produces a successful production build
- `pnpm lint` and `pnpm type-check` pass with zero errors
- shadcn/ui components render correctly with Tailwind CSS applied
- Husky pre-commit hook runs ESLint and Prettier on staged files
