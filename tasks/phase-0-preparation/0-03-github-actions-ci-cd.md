# Task 03: GitHub Actions CI/CD

**Phase:** 0 — Preparation
**Priority:** P0
**Dependencies:** 0-00 (Project Scaffold)
**Reference:** `documentation/ROADMAP-web-b2c.md §0.5.3`, `documentation/ROADMAP.md §0.5.3`, `documentation/ROADMAP.md (Sections 0.5.3, 0.5.5)`

---

## Objective

Configure GitHub Actions workflows for continuous integration and continuous deployment of the Web B2C application, covering lint, type-check, and build verification on every push and pull request, plus automated deployment to preview and production environments.

## Deliverables

### 1. CI/CD workflows

- [x] P0 **CI workflow** (triggered on: push to `develop`, push to `main`, PR to either): — DONE in parent monorepo `.github/workflows/web-b2c-ci.yml` (lint + type-check + build with pnpm cache). `web-b2c/.github/workflows/lighthouse.yml` additionally runs Lighthouse CI.
  - `pnpm install` (with dependency caching)
  - `pnpm lint` — ESLint
  - `pnpm type-check` — `tsc --noEmit`
  - `pnpm build` — verify build succeeds
- [ ] P0 **CD workflow** — deploy to Cloudflare Pages / Vercel: — NOT DONE: parent monorepo `.github/workflows/web-b2c-deploy.yml` builds but deploy steps are still `TODO` placeholders
  - `develop` branch -> preview environment
  - `main` branch -> production environment

### 2. Branch protection rules

- [ ] P0 Require pull request with at least 1 approval before merging to `main` (per `documentation/ROADMAP.md §0.5.5`) — NOT DONE / unverified: README only documents this as a manual setup step, no confirmed GitHub branch-protection config
- [ ] P0 Require CI workflow to pass before merging to `main` (per `documentation/ROADMAP.md §0.5.5`) — NOT DONE / unverified: same as above
- [ ] P0 No direct push to `main` — all changes must go through a PR (per `documentation/ROADMAP.md §0.5.5`) — NOT DONE / unverified: same as above

## Acceptance Criteria

- CI workflow triggers on push to `develop`, push to `main`, and PRs targeting either branch
- CI workflow fails the run if `pnpm lint`, `pnpm type-check`, or `pnpm build` exits with a non-zero code
- `develop` branch pushes automatically deploy to the preview environment
- `main` branch pushes automatically deploy to the production environment
- `pnpm install` step uses dependency caching to reduce workflow run time
- Branch protection on `main` enforces: 1 approval required, CI must pass, direct push blocked
