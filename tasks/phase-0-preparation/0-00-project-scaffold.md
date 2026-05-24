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

- [ ] Create Next.js project with App Router and TypeScript strict mode (`create-next-app --typescript`)
- [ ] Configure `tsconfig.json` with `strict: true`
- [ ] Set up `pnpm` as package manager
- [ ] Pin all dependency versions (no `^` or `~` prefixes)
- [ ] Add `next.config.ts` (minimal config)

### 2. Styling and component library

- [ ] Install and configure Tailwind CSS
- [ ] Install and configure shadcn/ui (using the Tailwind config as base)
- [ ] Apply "Radiant Curator" design tokens (violet primary palette, Inter font) from `documentation/designs/DESIGN.md`

### 3. Dev tooling

- [ ] Configure ESLint (Next.js recommended config)
- [ ] Configure Prettier
- [ ] Set up Husky + lint-staged (ESLint + Prettier on staged files)
- [ ] Add `.env.example` as environment template (include `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_API_MOCKING=false`)
- [ ] Add `.gitignore` (node_modules, .next, .env.local, coverage)

### 4. Folder structure

- [ ] Create `src/lib/` directory for OG image generation, metadata helpers, and other shared utilities (per `documentation/ARCHITECTURE.md §4`)

### 5. Scripts in `package.json`

- [ ] `pnpm dev` — start dev server (http://localhost:3001)
- [ ] `pnpm build` — production build
- [ ] `pnpm lint` — ESLint
- [ ] `pnpm type-check` — `tsc --noEmit`
- [ ] `pnpm api:generate` — regenerate typed API client from OpenAPI spec
- [ ] Note: `pnpm dev:mock` script will be added in task 0-02 (Mock Environment)

## Acceptance Criteria

- `pnpm dev` starts the Next.js app on port 3001 with no errors
- `pnpm build` produces a successful production build
- `pnpm lint` and `pnpm type-check` pass with zero errors
- shadcn/ui components render correctly with Tailwind CSS applied
- Husky pre-commit hook runs ESLint and Prettier on staged files
