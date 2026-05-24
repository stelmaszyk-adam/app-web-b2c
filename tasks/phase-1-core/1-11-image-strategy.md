# Task 1-11: Image Strategy

**Phase:** 1 — Core
**Priority:** P1
**Dependencies:** 1-04 (event detail page), 1-05 (venue profile page)
**Reference:** `documentation/ROADMAP-web-b2c.md` (Section 1.5), `documentation/ARCHITECTURE.md (Section 20)`, `documentation/designs/DESIGN.md`

---

## Objective

Define and implement a consistent image loading strategy across the Web B2C application. All image surfaces — event cards, event detail galleries, and venue profiles — must handle the three key scenarios gracefully: no image supplied (branded placeholder), image still loading (progressive blur/LQIP), and image that fails to load at runtime (fallback to placeholder). All items in this task are P1.

> Note: Alt text requirements overlap with task 1-13 (Accessibility). Task 1-13 owns alt text standards; this task should follow them.

> Note: ARCHITECTURE.md §20 defines the Cloudflare R2 + Images pipeline with three variants (200x200 small, 600px medium, 1200px large) and WebP compression. Use these variant URLs for the Next.js `<Image>` component's `sizes` prop.

> Note: Placeholder images should use category colors from DESIGN.md §7.1 map pin palette (`map_pin_1` through `map_pin_12`).

## Deliverables

### 1. Placeholder images (§1.5)

- [ ] P1 Placeholder images when venues/events have no photos (branded fallback per category)

### 2. Progressive image loading (§1.5)

- [ ] P1 Progressive image loading (blur hash / LQIP from Cloudflare Images, Next.js `<Image>` blur placeholder)

### 3. Broken image fallbacks (§1.5)

- [ ] P1 Broken image fallbacks (graceful fallback to placeholder on load error)

## Acceptance Criteria

- When an event or venue has no photo URL, the correct branded placeholder image for its category is displayed in all image surfaces (event cards, event detail hero, venue profile hero)
- Images render with a blurred low-quality placeholder (blur hash or LQIP) that transitions smoothly to the full-resolution image once loaded; the transition uses Next.js `<Image>` blur placeholder backed by Cloudflare Images
- When a remote image URL returns a non-200 response or fails to load, the component falls back to the category placeholder without rendering a broken image icon or blank space
- All placeholder images carry `alt=""` (decorative); content images carry descriptive alt text matching the event or venue name
- No Cumulative Layout Shift (CLS) is introduced by image loading — dimensions are reserved before the image loads
