# EventApp Web B2C

Public-facing event discovery website for Polish cities. Read-only, SEO-optimized Next.js application with server-side rendering.

**Domain:** `eventapp.dev`
**Port:** `3001`

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** shadcn/ui + Tailwind CSS 4
- **API client:** openapi-typescript + openapi-fetch (auto-generated from backend OpenAPI spec)
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

| Command             | Description                                   |
| ------------------- | --------------------------------------------- |
| `pnpm dev`          | Start dev server on port 3001                 |
| `pnpm build`        | Production build                              |
| `pnpm start`        | Start production server on port 3001          |
| `pnpm lint`         | Run ESLint                                    |
| `pnpm type-check`   | Run TypeScript type checking                  |
| `pnpm api:generate` | Regenerate typed API client from OpenAPI spec |

## Project Structure

```
src/
├── api/
│   ├── client.ts                # openapi-fetch client instance
│   ├── openapi-placeholder.json # OpenAPI spec (replaced by backend export)
│   └── generated/
│       └── schema.d.ts          # Auto-generated types (do not edit)
├── app/
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   ├── globals.css              # Global styles & design tokens
│   └── favicon.ico
├── components/
│   └── ui/
│       └── button.tsx           # shadcn/ui button component
└── lib/
    └── utils.ts                 # Utility functions (cn)
```

## Environment Variables

| Variable                  | Description          | Default                 |
| ------------------------- | -------------------- | ----------------------- |
| `NEXT_PUBLIC_API_URL`     | Backend API base URL | `http://localhost:3000` |
| `NEXT_PUBLIC_API_MOCKING` | Enable API mocking   | `false`                 |

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
