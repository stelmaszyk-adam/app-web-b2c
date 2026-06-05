# Wydarzka Web B2C

Public-facing event discovery website for Polish cities. Read-only, SEO-optimized Next.js application with server-side rendering.

**Domain:** `wydarzka.dev`
**Port:** `3001`

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** shadcn/ui + Tailwind CSS 4
- **API client:** openapi-typescript + openapi-fetch (auto-generated from backend OpenAPI spec)
- **Maps:** MapLibre GL JS + react-map-gl (Stadia Maps tiles)
- **i18n:** next-intl (Polish default, English secondary)
- **Monitoring:** Sentry (error tracking), PostHog (analytics), Web Vitals
- **Language:** TypeScript (strict mode)
- **Package manager:** pnpm

## Getting Started

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Start development server (http://localhost:3001)
pnpm dev
```

## Scripts

| Command             | Description                                      |
| ------------------- | ------------------------------------------------ |
| `pnpm dev`          | Start dev server on port 3001                    |
| `pnpm build`        | Production build                                 |
| `pnpm start`        | Start production server on port 3001             |
| `pnpm lint`         | Run ESLint                                       |
| `pnpm type-check`   | Run TypeScript type checking                     |
| `pnpm api:pull`     | Pull OpenAPI spec from running backend           |
| `pnpm api:generate` | Regenerate typed API client from OpenAPI spec    |
| `pnpm api:sync`     | Pull spec + regenerate client in one step        |
| `pnpm analyze`      | Production build with bundle analyzer            |

## Project Structure

```
src/
├── api/
│   ├── client.ts                  # openapi-fetch client instance
│   ├── openapi-placeholder.json   # OpenAPI spec (replaced by backend export)
│   └── generated/
│       └── schema.d.ts            # Auto-generated types (do not edit)
├── app/
│   ├── layout.tsx                 # Root layout
│   ├── globals.css                # Global styles & design tokens
│   ├── robots.ts                  # Dynamic robots.txt
│   ├── sitemap.ts                 # Dynamic sitemap
│   ├── manifest.ts                # PWA web app manifest
│   ├── icon.tsx                   # Generated favicon
│   ├── apple-icon.tsx             # Generated Apple touch icon
│   ├── global-error.tsx           # Root error boundary
│   ├── api/og/route.tsx           # Open Graph image generation
│   └── [locale]/
│       ├── layout.tsx             # Locale layout (i18n provider)
│       ├── page.tsx               # Home / city redirect
│       ├── error.tsx              # Locale error boundary
│       ├── not-found.tsx          # 404 page
│       ├── cookie-policy/         # Cookie policy page
│       └── [city]/
│           ├── page.tsx           # City discovery feed
│           ├── [filter]/page.tsx  # Filtered discovery (category/date)
│           ├── event/[id]/        # Event detail page (SSR)
│           └── venue/[id]/        # Venue profile page (SSR)
├── components/
│   ├── analytics/                 # PostHog provider, Web Vitals, tracking
│   ├── cookie/                    # GDPR banner, preferences overlay, provider
│   ├── discovery/                 # Event card, filter bar, city/date pickers
│   ├── event/                     # Event detail content
│   ├── layout/                    # AppHeader, AppFooter
│   ├── map/                       # EventMap, MapPopup (MapLibre)
│   ├── seo/                       # JSON-LD structured data
│   ├── ui/                        # Button, skeletons, empty state, error toast, image, offline banner
│   └── venue/                     # Venue hero image, profile content
├── hooks/
│   ├── use-city.tsx               # City selection hook
│   └── use-cookie-consent.ts      # Cookie consent hook
├── i18n/
│   ├── routing.ts                 # Locale routing config
│   ├── request.ts                 # Server-side locale resolution
│   └── navigation.ts              # Localized navigation helpers
├── lib/
│   ├── api.ts                     # API helper utilities
│   ├── utils.ts                   # General utilities (cn)
│   ├── types.ts                   # Shared type definitions
│   ├── categories.ts              # 12 unified event categories
│   ├── cities.ts                  # Supported Polish cities
│   ├── city-store.ts              # City selection persistence
│   ├── geo-utils.ts               # Geolocation utilities
│   ├── image-utils.ts             # Image placeholders & blur hashes
│   ├── structured-data.ts         # JSON-LD schema builders
│   ├── cookie-consent.ts          # Cookie consent logic
│   ├── analytics.ts               # Analytics event helpers
│   ├── posthog.ts                 # PostHog client setup
│   ├── web-vitals.ts              # Web Vitals reporting
│   ├── sentry-utils.ts            # Sentry helper utilities
│   ├── mock-events.ts             # Mock event data (dev)
│   └── mock-venues.ts             # Mock venue data (dev)
├── mocks/
│   ├── handlers.ts                # MSW request handlers
│   ├── browser.ts                 # MSW browser worker
│   └── server.ts                  # MSW server (SSR)
├── sentry.client.config.ts        # Sentry browser config
├── sentry.server.config.ts        # Sentry server config
├── sentry.edge.config.ts          # Sentry edge config
├── instrumentation.ts             # Next.js server instrumentation
├── instrumentation-client.ts      # Next.js client instrumentation
└── proxy.ts                       # API proxy utilities
```

```
messages/
├── pl.json                        # Polish translations
└── en.json                        # English translations
```

## Environment Variables

| Variable                         | Description              | Default                       |
| -------------------------------- | ------------------------ | ----------------------------- |
| `NEXT_PUBLIC_API_URL`            | Backend API base URL     | `http://localhost:3000`       |
| `NEXT_PUBLIC_API_MOCKING`        | Enable MSW API mocking   | `false`                       |
| `NEXT_PUBLIC_STADIA_MAPS_API_KEY`| Stadia Maps API key      | —                             |
| `SENTRY_ORG`                     | Sentry organization      | `wydarzka`                    |
| `SENTRY_PROJECT`                 | Sentry project name      | `wydarzka-web-b2c`           |
| `SENTRY_AUTH_TOKEN`              | Sentry auth token        | —                             |
| `NEXT_PUBLIC_POSTHOG_KEY`        | PostHog project API key  | —                             |
| `NEXT_PUBLIC_POSTHOG_HOST`       | PostHog ingest endpoint  | `https://eu.i.posthog.com`   |

## Key Features

- **City-based discovery** — browse events by city with geolocation-based onboarding
- **Map + list view** — interactive MapLibre map with event markers and popups alongside a card-based feed
- **Filtering** — filter by category (12 unified categories) and date
- **Event detail pages** — SSR pages with structured data, OG images, and rich content
- **Venue profiles** — SSR venue pages with hero images and event listings
- **SEO** — dynamic sitemap, robots.txt, JSON-LD structured data, Open Graph images
- **i18n** — Polish (primary) and English with next-intl, locale-prefixed routes
- **GDPR compliance** — cookie consent banner, preferences overlay, cookie policy page
- **PWA** — web app manifest, Apple touch icon, offline banner
- **Monitoring** — Sentry error tracking, PostHog analytics, Web Vitals reporting
- **Accessibility** — semantic HTML, ARIA attributes, keyboard navigation
- **Image optimization** — blur placeholders, progressive loading, fallback handling
- **API mocking** — MSW handlers for offline development without backend

## Design System

This app follows the "Radiant Curator" design system — violet-tinted palette, tonal shifts instead of 1px borders, glassmorphism for floating elements, Inter font. See [`documentation/designs/DESIGN.md`](../documentation/designs/DESIGN.md) for full spec.

## CI/CD

GitHub Actions workflows are defined in `.github/workflows/`:

- **`web-b2c-ci.yml`** — Runs on push to `develop`/`main` and PRs targeting either branch. Steps: `pnpm install` (cached), `pnpm lint`, `pnpm type-check`, `pnpm build`.
- **`web-b2c-deploy.yml`** — Runs on push to `develop` (preview deploy) and `main` (production deploy) via Vercel.

### Branch Protection Rules (GitHub Settings)

Configure these rules on the `main` branch in GitHub repository settings:

1. **Require pull request before merging** — at least 1 approval required
2. **Require status checks to pass** — select the `ci` job from `Web B2C CI` workflow
3. **Do not allow bypassing the above settings** — no direct pushes to `main`

## Documentation

- [Architecture](../documentation/ARCHITECTURE.md)
- [Web B2C Roadmap](../documentation/ROADMAP-web-b2c.md)
- [Central Roadmap](../documentation/ROADMAP.md)
- [Design System](../documentation/designs/DESIGN.md)
