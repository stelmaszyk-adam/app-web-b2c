# Task 1-13: Accessibility

**Phase:** 1 — Core
**Priority:** P0/P1
**Dependencies:** 1-01 (layout / shared shell), 1-02 (map)
**Reference:** `documentation/ROADMAP-web-b2c.md` (Section 1.12), `documentation/designs/DESIGN.md (Section 7.10)`

---

## Objective

Implement the Web B2C-specific accessibility requirements on top of the shared a11y foundations defined in the design system. The primary concerns are correct semantic HTML for SSR pages (which directly benefits both screen readers and SEO), descriptive alt text on all content images, keyboard accessibility for the map/list toggle, live-region announcements for dynamic search results, and a skip-to-content link for keyboard and assistive-technology users.

> Note: Alt text for images is also referenced in task 1-11 (Image Strategy). This task owns the alt text standard; task 1-11 should follow it.

## Deliverables

### 1. Semantic HTML (§1.12)

- [ ] P0 **Semantic HTML** — use correct heading hierarchy (`h1` > `h2` > `h3`) on SSR pages for screen readers and SEO

### 2. Image alt text (§1.12)

- [ ] P0 **Event/venue images** — `alt={event.name}` or `alt={venue.name}` on all content images; placeholder images use `alt=""`

### 3. Map / list toggle keyboard accessibility (§1.12)

- [ ] P1 **Map ↔ List toggle** — List view serves as the accessible alternative to the map; ensure list items are fully keyboard-navigable

### 4. Search results announcements (§1.12)

- [ ] P1 **Search results announcements** — `aria-live="polite"` region to announce result count changes (e.g., "12 events found")

### 5. Skip-to-content link (§1.12)

- [ ] P1 **Skip-to-content link** — hidden until focused, jumps past navigation to main content

### 6. Design system a11y requirements (DESIGN.md §7.10)

- [ ] P0 **Text contrast** — minimum 4.5:1 for normal text, 3:1 for large text (WCAG AA)
- [ ] P0 **Focus indicators** — `2px solid outline` with `2px offset`, visible in both light and dark mode (DESIGN.md §7.10)
- [ ] P1 **Reduced motion** — respect `prefers-reduced-motion`: collapse durations to `0ms`, disable transforms (DESIGN.md §7.7)
- [ ] P1 **Color independence** — never use color alone to convey information; pair with icons, text, or patterns

## Acceptance Criteria

- Every SSR page has a single `h1`, with `h2`/`h3` used for subsections in correct hierarchical order; no heading levels are skipped
- All event and venue content images have `alt` text equal to `event.name` or `venue.name` respectively; decorative placeholder images have `alt=""`
- The map/list toggle is operable via keyboard (Tab + Enter/Space); all event list items are reachable and activatable without a mouse (P1)
- When search results update (filter change, city change), an `aria-live="polite"` region announces the new result count to screen readers (P1)
- A skip-to-content link is present in the DOM before the navigation; it is visually hidden until it receives keyboard focus, at which point it becomes visible; activating it moves focus to the main content region (P1)
- Key pages (event detail, venue profile, city listing) pass an automated accessibility audit (axe or Lighthouse a11y score >= 90) with no critical violations (note: task 4-00 uses >= 80 for all pages as a launch gate)
