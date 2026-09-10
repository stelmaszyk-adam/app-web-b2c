# Task 2-01: Tablet Breakpoint Audit (768–1023px)

**Phase:** 2 — Design Alignment
**Priority:** P1
**Dependencies:** 1-01 (layout and navigation), 1-02 (map and discovery), 1-04 (event detail), 1-05 (venue profile), 1-08 (cookie consent), 1-09 (legal pages), 1-15 (auth), 1-16 (add event), 1-17 (saved events), 2-5-01 (blog list), 2-5-02 (blog detail)
**Reference:** `documentation/designs/ROADMAP-design-web-b2c.md` (Phase 6.1 Responsive Completeness Check), `documentation/designs/DESIGN.md` (breakpoints)

---

## Objective

The design prototype and current implementation cover mobile (320–767px) and desktop (1024px+) breakpoints but the tablet range (768–1023px) has not been explicitly designed or audited. All screens must have a verified, intentional layout at tablet width — not just "somewhere between mobile and desktop." This task covers design decisions for tablet-specific layouts and their implementation.

> **Breakpoints:**
> - Mobile: 320–767px
> - Tablet: 768–1023px (`@media (min-width: 768px) and (max-width: 1023px)`)
> - Desktop: 1024px+ (`@media (min-width: 1024px)`)

---

## Deliverables

### 1. Design Decisions (must be made before implementation)

For each screen below, confirm the intended tablet layout (update `documentation/designs/ROADMAP-design-web-b2c.md` Phase 6.1 checkboxes as each is resolved):

- [ ] P1 **Search & Discovery** — roadmap spec says same split-screen as desktop (~50%/50%). Confirm proportions and whether the filter bar scrolls or opens a sheet for overflow.
- [ ] P1 **Event Detail** — two-column or single-column? Aside card behaviour (sticky vs inline)?
- [ ] P1 **Venue Profile** — same as event detail decision.
- [ ] P1 **Header** — does "Więcej" dropdown appear or do items remain visible? City selector truncation?
- [ ] P1 **Cookie banner** — full-width or card-centred?
- [ ] P1 **Overlays (City picker, Date picker, Cookie prefs)** — dialog width and padding.
- [ ] P1 **Auth pages (Login, Register, Reset)** — two-column auth card or single column?
- [ ] P1 **Add Event** — form card width, grid column count.
- [ ] P1 **Blog list** — 2-column or 3-column card grid?
- [ ] P1 **Blog detail** — article max-width, aside visibility.
- [ ] P1 **Legal pages** — single column (likely same as desktop).

### 2. Implementation — CSS Audit

For each breakpoint mismatch found, add or update CSS in `assets/app.css` (prototype) and the corresponding Next.js component/module CSS:

- [ ] P1 **Header** — verify `app-header-inner` layout at 768px; ensure city selector, nav items, and auth actions don't overlap or wrap unintentionally
- [ ] P1 **Filter bar** — at 768px the chip row may overflow; confirm scroll behaviour vs "Filters" sheet trigger
- [ ] P1 **Split-screen layout** — `split` grid at 768px; left/right panel proportions, map height
- [ ] P1 **Event cards** — card width, thumbnail size at 768px
- [ ] P1 **Detail page two-column grid** — `detail-grid` breakpoint: when does the aside stack below main content?
- [ ] P1 **Footer** — column count at 768px (5-col → 2–3 col)
- [ ] P1 **Overlays** — dialog `max-width` and margin at 768px
- [ ] P1 **Auth pages** — `auth-card` two-column layout: at what width does the `auth-aside` hide?
- [ ] P1 **Blog screens** — card grid column count at 768px

### 3. Implementation — Verification

- [ ] P1 Manually test all screens at 768px, 900px, and 1023px using browser DevTools device emulation
- [ ] P1 No horizontal overflow (`overflow-x: hidden` should not be required as a band-aid — fix root causes)
- [ ] P1 Touch targets remain ≥ 44×44px at tablet width
- [ ] P1 The map panel is reachable and usable at tablet width without triggering the mobile "Pokaż na mapie" FAB
- [ ] P1 Update the responsive completeness table in `documentation/designs/ROADMAP-design-web-b2c.md` §6.1 with `[x]` for each tablet column entry as screens are verified

---

## Design Reference

> Prototype: `documentation/designs/web-b2c/EventB2CWeb/`
> Design system: `documentation/designs/DESIGN.md`
> Responsive design roadmap: `documentation/designs/ROADMAP-design-web-b2c.md` §6.1

- Tablet breakpoints are defined in `assets/app.css` but no explicit `768px–1023px` media query block currently exists for most components — the transition from mobile to desktop is abrupt at `1024px`
- The `split` layout switches from single-column (mobile) to side-by-side (desktop) at `1024px`; consider whether `768px` is a better breakpoint for the side-by-side switch

---

## Acceptance Criteria

- Every screen listed in `documentation/designs/ROADMAP-design-web-b2c.md` §6.1 has a `[x]` in the Tablet (768-1023) column
- Manual verification at 768px, 900px, and 1023px shows no horizontal scroll, no overlapping elements, and no unreadable text
- The split-screen discovery layout is usable on a tablet — both the list panel and map are accessible without switching to mobile mode
- Touch targets remain ≥ 44×44px on all interactive elements
- `pnpm type-check` and `pnpm lint` pass with no errors
