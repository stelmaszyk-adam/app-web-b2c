# Task 1-01: Layout and Navigation

**Phase:** 1 — Core
**Priority:** P0
**Dependencies:** 1-00 (i18n)
**Reference:** `documentation/ROADMAP-web-b2c.md` (Sections 1.15, 1.4.25)

---

## Objective

Build the responsive layout shell that wraps every page in the Web B2C application, including the AppHeader (logo, city selector, search, "Dla Organizatorów" link, language toggle), AppFooter, and all responsive breakpoint behavior from 320px to 2560px. This task covers both the structural layout primitives and the cross-app navigation elements required by §1.4.25 and §1.15.

> Note: Component library setup (Tailwind config, shadcn/ui primitives) from ROADMAP §0.4.3 is a prerequisite.

## Deliverables

### 1. Responsive Layout Shell

- [ ] P0 **Mobile-first responsive layout** — all pages usable on viewports from 320px to 2560px: — PARTIAL: mobile single-column and desktop 3-column grid work, but the tablet breakpoint (768–1023px) has no side-by-side map+list, and the desktop map view uses a horizontal `FilterBar`, not a persistent sidebar
  - Mobile (320-767px): single-column layout, full-width map, stacked cards
  - Tablet (768-1023px): two-column card grid, side-by-side map+list
  - Desktop (1024px+): three-column card grid, persistent sidebar filters on map view
- [ ] P0 **Touch-friendly on mobile web** — tap targets >= 44x44px, adequate spacing between interactive elements — PARTIAL: some controls are ≥44px, but several interactive elements (city selector, language pills, filter chips) use `h-8`/`h-9`/`h-10`
- [x] P0 **Map responsiveness** — map fills available viewport height; controls (zoom, filters) positioned for thumb reach on mobile

### 2. AppHeader — "For Organizers" Cross-App Link

- [x] P0 **Header link — "For Organizers":**
  - Visible in the top navbar on all pages (desktop: text link; tablet/mobile: inside hamburger menu)
  - Links to `dashboard.wydarzka.dev` (opens in new tab, `target="_blank"` with `rel="noopener noreferrer"`)
  - Label: "For Organizers" (PL: "Dla Organizatorów") — uses i18n translation key
  - Positioned after main nav items but before language toggle
  - Visual treatment: tertiary/text style — should not compete with primary CTAs (e.g. no gradient, no button shape)
- [x] P0 **Footer link — "Organizer Dashboard":**
  - In a "For Business" or "Organizers" section of the footer (alongside Terms, Privacy, Cookie Policy links)
  - Label: "Organizer Dashboard" (PL: "Panel Organizatora")
  - Same external link behavior (`dashboard.wydarzka.dev`, new tab)
  - Optionally include a short description: "Manage your venue, create events, and track analytics"
- [x] P1 **Contextual CTA on venue profile page:**
  - Below the venue info section, show a subtle CTA: "Is this your venue? Claim it on the Organizer Dashboard"
  - Links to `dashboard.wydarzka.dev` (or a deep link to the venue claim flow if available)
  - Only shown as a static link (Web B2C has no auth, so no conditional logic based on ownership)

## Design Reference

> Prototype: `documentation/designs/web-b2c/EventB2CWeb/`
> Design system: `documentation/designs/DESIGN.md` (layout tokens: spacing, radius, elevation)

- **AppHeader** (`src/components.jsx`) — Logo, city selector with MapPin icon, search input, "Dla Organizatorów" external link with ArrowUpRight icon, PL/EN language toggle
- **AppFooter** (`src/components.jsx`) — 5-column footer: brand block, Odkryj (city links), Kategorie, Dla biznesu, Prawne. Bottom bar: copyright + social icons
- **SearchDiscoveryScreen** (`src/screens.jsx`) — full page layout showing header and footer in context

## Acceptance Criteria

- A root layout component wraps all pages and renders AppHeader + AppFooter
- At 320px the layout is single-column with no horizontal overflow
- At 768px a two-column grid is active for event cards; map and list sit side by side
- At 1024px a three-column card grid is active; filter sidebar is persistent on map view
- All interactive elements have a minimum 44x44px tap target
- "Dla Organizatorów" link is visible in the desktop header and inside the hamburger menu on mobile/tablet
- "Dla Organizatorów" header link opens `dashboard.wydarzka.dev` in a new tab with `rel="noopener noreferrer"`
- "Panel Organizatora" footer link is present in the footer's business/organizers section
- Both organizer links use i18n translation keys (not hardcoded strings)
- `pnpm type-check` and `pnpm lint` pass with no errors
