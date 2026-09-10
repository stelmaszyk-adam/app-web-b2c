# Task 2-5-04: Blog Sitemap and OG Image

**Phase:** 2.5 — Blog Pages
**Priority:** P1
**Dependencies:** 2-5-00 (Blog API client and mocks), 2-5-02 (Blog detail page), 1-07 (SEO Foundations — root sitemap)
**Reference:** `documentation/ROADMAP-web-b2c.md` (Sections 2.5.3, 2.5.4)

---

## Objective

Make published blog posts discoverable by search engines and social crawlers. Extend the existing sitemap with a dedicated blog sub-sitemap listing every published post URL with correct `<lastmod>` values, and ensure the OG image referenced from `generateMetadata()` on the detail page is served correctly.

## Deliverables

### 1. Blog sub-sitemap

- [ ] P1 Create `app/blog/sitemap.ts` — Next.js dynamic sitemap segment
- [ ] P1 On request, fetch every published blog post (all pages) via the typed `openapi-fetch` client — walk cursor pagination server-side; do not attempt to fit the entire list into a single API call
- [ ] P1 For each post, emit a sitemap entry:
  - `url`: `https://wydarzka.dev/blog/{slug}` (per section 2.5.4)
  - `lastModified`: `post.updated_at` (must be the entity timestamp, not `new Date()`)
  - `changeFrequency`: `'weekly'`
  - `priority`: `0.7`
- [ ] P1 ISR: `export const revalidate = 3600` — matches the existing sitemap cadence
- [ ] P1 Guard against >50k URLs — split into further sub-sitemaps if the list grows past the Google limit (same pattern earmarked in section 1.3.1)

### 2. Root sitemap integration

- [ ] P1 Extend `app/sitemap.ts` with an entry referencing `app/blog/sitemap.ts` as a sub-sitemap index entry (per section 2.5.4)
- [ ] P1 Do **not** duplicate individual post URLs in the root sitemap — the sub-sitemap owns them
- [ ] P1 Include `/blog` (the list index) and `/{city}/blog` (each supported city) as URLs in the root sitemap with `changeFrequency: 'daily'`, `priority: 0.8`
- [ ] P1 Coordinate with task 1-07 SEO Foundations — the root sitemap file is shared

### 3. OG image (MVP)

- [ ] P1 MVP: `generateMetadata()` on `/blog/[slug]` uses `post.featured_image_url` directly for `og:image` (already covered by task 2-5-02, verified here)
- [ ] P1 Verify all seeded posts have a `featured_image_url` sized ≥ 1200×630 so social crawlers accept it
- [ ] P1 Phase 2 upgrade (out of scope for this task, but leave a TODO comment referencing it): Cloudflare Worker / satori at `/og/blog/:slug` (1200×630) matching the existing event OG pattern from section 1.6

## Acceptance Criteria

- `/blog/sitemap.xml` is reachable and contains an entry for every published blog post with the correct URL, `<lastmod>` from `post.updated_at`, `changeFrequency: weekly`, and `priority: 0.7`
- `/sitemap.xml` includes a reference to `/blog/sitemap.xml` as a sub-sitemap and does not duplicate individual post URLs
- `/sitemap.xml` includes `/blog` and each `/{city}/blog` URL
- Sitemap responses use ISR with `revalidate = 3600`
- `og:image` on every blog detail page points to a valid image ≥ 1200×630 (`featured_image_url` for MVP)
- Blog list, detail, and city-scoped URLs are indexable by Google Search Console after submission (post-launch verification)
- `pnpm type-check` and `pnpm lint` pass with no errors
