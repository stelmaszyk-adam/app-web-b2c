# Task 2-5-02: Blog Detail Page (`/blog/[slug]`)

**Phase:** 2.5 — Blog Pages
**Priority:** P1
**Dependencies:** 2-5-00 (Blog API client and mocks), 2-5-01 (Blog list page — for shared `BlogPostCard`), 1-04 (Event Detail — for `EventCard` reuse), 1-00 (i18n)
**Reference:** `documentation/ROADMAP-web-b2c.md` (Sections 2.5.3, 2.5.5), `documentation/ROADMAP-backend.md` (Section 2.5.8 — Tiptap content format), `documentation/designs/DESIGN.md`

---

## Objective

Build the SSR blog detail page at `/blog/[slug]`. This is the primary SEO and social-sharing surface for editorial content. It must render the full article server-side (including the Tiptap ProseMirror body and any inline `EventCard` embeds), plus full OG / Twitter Card metadata and JSON-LD `Article` structured data — all with zero client JS required for reading the article.

## Deliverables

### 1. Route + data fetching

- [ ] P1 Create `app/blog/[slug]/page.tsx` as a Server Component
- [ ] P1 Fetch the post via `GET /blog/:slug` through the typed `openapi-fetch` client
- [ ] P1 On 404 from the API, call `notFound()` from `next/navigation` so Next.js renders the 404 boundary
- [ ] P1 If `content_json` contains one or more `event-card` nodes, fetch each referenced event via `GET /events/:id` in parallel (`Promise.all`) on the server before rendering — no client fetches for embeds

### 2. `generateMetadata()`

- [ ] P1 Full OpenGraph + Twitter Card block:
  ```typescript
  openGraph: {
    title: post.title,
    description: post.excerpt,
    images: [{ url: post.featured_image_url, width: 1200, height: 630 }],
    type: 'article',
    publishedTime: post.published_at,
    authors: [post.author.display_name],
  }
  ```
- [ ] P1 Twitter Card: `summary_large_image` with same title / description / image
- [ ] P1 Canonical URL: `https://wydarzka.dev/blog/{slug}` (per section 1.3.1 canonical pattern)
- [ ] P1 `hreflang` alternates for `pl` and `en` variants of the post (coordinate with 1-07 SEO Foundations)

### 3. JSON-LD `Article` structured data

- [ ] P1 Server-rendered `<script type="application/ld+json">` block with the following fields:
  - `@context: 'https://schema.org'`
  - `@type: 'Article'`
  - `headline`, `description`, `image` (featured image URL)
  - `author`: `{ @type: 'Person', name: post.author.display_name }`
  - `publisher`: `{ @type: 'Organization', name: 'Wydarzka', logo: { @type: 'ImageObject', url: '<brand-logo>' } }`
  - `datePublished`: `post.published_at`
  - `dateModified`: `post.updated_at`
  - `mainEntityOfPage`: canonical URL
- [ ] P1 Validate the generated JSON-LD passes [Google Rich Results Test](https://search.google.com/test/rich-results) before marking done

### 4. Two-column layout

Mirrors the Event Detail page structure (see task 1-04).

**Left column:**

- [ ] P1 Hero image (R2 `large` variant)
- [ ] P1 Category badge + `label_md` reading time label (e.g. "8 MIN CZYTANIA")
- [ ] P1 `display_md` (2.75rem, letter-spacing -0.02em) headline
- [ ] P1 Author byline row: avatar + display name + `label_md` ALL CAPS publication date
- [ ] P1 **Tiptap-rendered article body** — server-side rendering via `@tiptap/html` `generateHTML()`; zero client JS for the article body
- [ ] P1 Related events grid: 3 `EventCard` components (reuse the same component the map/listing page uses — do not fork)
- [ ] P1 Related posts section: 3 `BlogPostCard` components (reuse from task 2-5-01)

**Right sidebar:**

- [ ] P1 Author card: avatar, display name, `label_md` role or venue badge (for `author_type='organizer'`, show the venue name; for `admin`, show "Redakcja Wydarzka")
- [ ] P1 Table of contents auto-generated from H2 / H3 nodes in `content_json`; anchor links scroll to matching headings; sticky within the sidebar column at `lg` breakpoint
- [ ] P1 "Share" button (Client Component island): tries `navigator.share()` first, falls back to copy-to-clipboard; toast confirmation on copy

### 5. Tiptap rendering

- [ ] P1 Install `@tiptap/html` + the Tiptap extensions the backend allowlist permits (per `ROADMAP-backend.md` §2.5.8 lines 931–935): **StarterKit** (Bold, Italic, H2, H3, lists, blockquote, undo/redo), **Image**, **Link** (sanitized, `rel="noopener noreferrer"` enforced), **YouTube** (sandboxed iframe), and the custom **`EventCard`** node. Do not add extensions beyond this allowlist — the backend `blog-content-sanitize.pipe.ts` will strip any node the renderer emits that isn't on the list, silently breaking round-trips
- [ ] P1 Define a shared extension list in `src/lib/tiptap/extensions.ts` mirroring the backend `blog-content-sanitize.pipe.ts` allowlist exactly (same nodes, same order); re-verify parity when the backend allowlist changes. The same list will be reused if a preview surface is ever added
- [ ] P1 Link node output: force `rel="noopener noreferrer"` and `target="_blank"` for external links
- [ ] P1 YouTube embed: sandboxed `<iframe>` per the backend contract
- [ ] P1 **`event-card` custom node:** rendered inline in the article body using the pre-fetched event data (see step 1); mini `EventCard` component with thumbnail, name, date, venue
- [ ] P1 Article body styled via `@tailwindcss/typography` `prose` class, with Radiant Curator overrides:
  - `primary` color for links
  - `radius_md` on code blocks
  - `radius_lg` on inline images
  - `body_lg` for base text, `on_surface_variant` color

### 6. i18n

- [ ] P1 All static copy ("Powiązane wydarzenia", "Podobne artykuły", "Udostępnij", "Spis treści", reading-time unit) sourced via `next-intl` from `messages/pl.json` and `messages/en.json`

### 7. `notFound` handling

- [ ] P1 Optional `app/blog/[slug]/not-found.tsx` — branded 404 for missing/unpublished posts, with a link back to `/blog`

## Design Reference

> Design system: `documentation/designs/DESIGN.md` — "Radiant Curator"

- **Headline:** `display_md` — 2.75rem, letter-spacing -0.02em
- **Byline / metadata / TOC entries:** `label_md` — 0.75rem, ALL CAPS, letter-spacing +0.05em
- **Body text:** `body_lg` — 1rem, `on_surface_variant`
- **Card border radius:** `radius_xl` (24px)
- **Images inside article body:** `radius_lg`
- **No 1px borders** — use tonal shifts (`surface_container_low` → `surface_container_lowest`) between sections

## Acceptance Criteria

- `/blog/{slug}` renders the full article — headline, byline, hero, and body text — in the raw HTML with JS disabled
- Article body is generated from `content_json` via `@tiptap/html` server-side; no client-side Tiptap runtime is shipped to the browser
- Every `event-card` node in `content_json` is replaced with a mini `EventCard` rendered inline, with data pre-fetched on the server
- Unknown slugs return a 404 via `notFound()`
- Full `og:*` and `twitter:*` meta tags appear in the raw HTML with correct values from the post
- JSON-LD `Article` block is present and passes Google Rich Results Test validation
- Table of contents lists every H2 / H3 in the article and anchor-scrolls to the matching heading
- Share button copies the canonical URL to the clipboard (or invokes `navigator.share()` where supported)
- Related events and related posts sections reuse `EventCard` and `BlogPostCard` from the existing codebase — no forked variants
- All copy is loaded via `next-intl`; both locales render without missing keys
- `pnpm type-check` and `pnpm lint` pass with no errors
