@AGENTS.md

# web-b2c — Next.js public discovery site for Wydarzka

Port 3001. The workspace-level `../CLAUDE.md` describes the multi-repo setup and the task pipeline.

## Commands (from the workspace root: `pnpm -C web-b2c <script>`)

```bash
pnpm dev            # next dev --port 3001
pnpm lint           # eslint
pnpm type-check     # tsc --noEmit
pnpm build          # must pass before a task is done
pnpm api:generate   # openapi-typescript from ../backend/docs/openapi.json → src/api/generated/schema.d.ts
pnpm api:sync       # pull spec from a running backend (localhost:3000) and regenerate
```

## Layout

- `src/app/[locale]/…` App Router pages, locale-prefixed (`pl` default, `en`). City-scoped routes under `[locale]/[city]/…` (event, venue, filter). Auth pages (login, register, verify-email, forgot/reset-password), profile, add-event, legal pages.
- `src/app/api/…` route handlers used only for auth cookie exchange, geo lookup and OG images. Never proxy business endpoints here.
- `src/api/client.ts` typed `openapi-fetch` client; `src/api/generated/schema.d.ts` is generated — never edit.
- `src/components/<domain>/` (discovery, event, venue, map, auth, layout, seo, cookie, analytics) and `src/components/ui/` shadcn primitives.
- `src/lib/` helpers: auth cookies/context, categories, cities, date filters, geo utils, structured data, PostHog, Sentry, web vitals.
- `src/i18n/` next-intl routing/request config; messages in `messages/pl.json` and `messages/en.json`.
- `src/mocks/` MSW handlers for local development without a backend.

## Conventions

- Server components by default; add `'use client'` only for interactivity. Data fetching happens in server components through `src/api/client.ts`; never hand-write fetch URLs to the backend.
- Every user-facing string goes through next-intl with keys in both `pl.json` and `en.json`.
- Design system "Radiant Curator" (`documentation/designs/DESIGN.md`): violet-tinted palette tokens in Tailwind config, no 1px borders (tonal shifts), glass surfaces for floating elements, Inter with editorial contrast. Use the existing tokens; do not invent colors.
- SEO matters: metadata per page, structured data via `src/lib/structured-data.ts`, sitemap/OG kept in sync when adding routes.
- Accessibility: semantic elements, focus states, `aria-*` on interactive components; keep Lighthouse a11y green.
- Images through `next/image` with the strategy in `src/lib/image-utils.ts`.
- 12 shared categories from `src/lib/categories.ts`; never add ad-hoc categories.
- Strict TypeScript, exact dependency versions, no `any`, no `@ts-ignore`, no `eslint-disable` to hide real errors.

## Task files

Work is defined in `tasks/<phase>/*.md`. Progress is the checkboxes inside those files; `CURRENT_TASK.md` is generated (`python3 scripts/task-utils.py sync web-b2c` from the root). Tick an item only when the code exists and `pnpm build` passes; use `- [~] … — deferred: reason` for items that need staging or credentials.
