# Task 2-00: Category System Alignment

**Phase:** 2 — Design Alignment
**Priority:** P0 (blocks all category-related implementation)
**Dependencies:** must be resolved before 1-02 (map and discovery) category work is finalised
**Reference:** `documentation/ARCHITECTURE.md` (unified category system), `documentation/ROADMAP.md` (canonical 12 categories), `documentation/designs/web-b2c/EventB2CWeb/src/data.jsx`

---

## Objective

Resolve the discrepancy between the **13 categories** used in the Web B2C design prototype and the **12 canonical categories** defined in ARCHITECTURE.md. The category system is shared across all platforms (Web B2C, Mobile B2C, Web B2B, Admin, Backend) — a divergence in the web design creates naming and icon mismatches that must be fixed before implementation begins. This task produces a decision, updates all affected design/config files, and documents the outcome for all platform teams.

---

## The Problem

**Canonical 12 categories (ARCHITECTURE.md / central roadmap):**
`music`, `nightlife`, `performing_arts`, `arts_culture`, `sport_fitness`, `food_drink`, `education`, `business`, `family`, `festival`, `wellness`, `other`

**Design prototype categories (`src/data.jsx` — 13 categories):**
`music`, `club`, `art`, `food`, `sport`, `theatre`, `comedy`, `tech`, `film`, `festival`, `wellness`, `kids`

**Mapping gaps:**

| Canonical | Prototype | Issue |
|---|---|---|
| `music` | `music` | ✅ Match |
| `nightlife` | `club` | Label differs — same concept |
| `performing_arts` | `theatre` | Too narrow — excludes comedy and film |
| `arts_culture` | `art` | Label differs — same concept |
| `sport_fitness` | `sport` | Label differs — same concept |
| `food_drink` | `food` | Label differs — same concept |
| `education` | `tech` | Conceptual mismatch — tech ≠ education |
| `business` | *(missing)* | Not in prototype at all |
| `family` | `kids` | Label differs — same concept |
| `festival` | `festival` | ✅ Match |
| `wellness` | `wellness` | ✅ Match |
| `other` | *(missing)* | Not in prototype at all |
| *(not in spec)* | `comedy` | Extra category |
| *(not in spec)* | `film` | Extra category |

---

## Deliverables

### 1. Decision

- [ ] P0 **Hold a cross-team category review** (Web, Mobile, Backend, Product) to decide:
  - Should `comedy` and `film` be added to the canonical list (extending to 14)?
  - Should `performing_arts` cover comedy + film, with sub-tags distinguishing them?
  - What maps to `education`? Is `tech` acceptable as an alias or does it need a separate icon?
  - Do `business` and `other` have enough event volume to warrant dedicated categories?
  - Confirm final Polish-language labels for all categories (prototype uses: Muzyka, Klub, Sztuka, Jedzenie, Sport, Teatr, Komedia, Tech, Film, Festiwal, Wellness, Dzieci)
- [ ] P0 Document the outcome in `documentation/ROADMAP.md` (Unified Category System section) — this becomes the new canonical reference

### 2. Backend

- [ ] P0 Update `category_enum` in the database schema to match the agreed canonical list
- [ ] P0 Ensure any existing data migration handles renamed or merged categories
- [ ] P0 Update OpenAPI spec to reflect the final enum — triggers regeneration for all frontends

### 3. Design Prototype

- [ ] P0 Update `src/data.jsx` `CATEGORIES` array to use final canonical IDs and Polish labels
- [ ] P0 Update `assets/colors_and_type.css` category colour variables to match final category IDs
- [ ] P0 Audit and rename/replace category SVG icons in `assets/` — currently 14 icons, need one per final canonical category:
  - Existing: `icon-category-art-palette.svg`, `icon-category-club-disc.svg`, `icon-category-comedy-laugh.svg`, `icon-category-festival-sparkles.svg`, `icon-category-film-film.svg`, `icon-category-food-utensils.svg`, `icon-category-kids-baby.svg`, `icon-category-live-flame.svg`, `icon-category-music-music.svg`, `icon-category-sport-trophy.svg`, `icon-category-tech-cpu.svg`, `icon-category-theatre-drama.svg`, `icon-category-wellness-leaf.svg`
  - Add missing icons for `business` and `other` (and `education` if distinct from `tech`)

### 4. Web B2C Implementation

- [ ] P0 Update `FilterBar` category chips to use final canonical IDs and labels
- [ ] P0 Update map pin colours — one CSS variable per final canonical category
- [ ] P0 Update city/category listing page routes if any canonical IDs changed (e.g. `performing_arts` vs `theatre`)
- [ ] P0 Ensure the `task note` in 1-02 ("design prototype lists 13 categories — follow central roadmap's 12") is resolved with the outcome of this task

### 5. Mobile B2C and Web B2B

- [ ] P0 Coordinate with Mobile B2C and Web B2B teams to apply the same category enum update after the backend schema change
- [ ] P0 Regenerate API clients on all frontends after OpenAPI spec is updated

---

## Design Reference

> Prototype: `documentation/designs/web-b2c/EventB2CWeb/src/data.jsx`
> Category icons: `documentation/designs/web-b2c/EventB2CWeb/assets/icon-category-*.svg`
> Canonical reference: `documentation/ARCHITECTURE.md`, `documentation/ROADMAP.md`

---

## Acceptance Criteria

- A single canonical category list is documented in `documentation/ROADMAP.md` and agreed by all platform teams
- `category_enum` in the backend schema and OpenAPI spec matches the canonical list exactly
- The design prototype `CATEGORIES` array in `src/data.jsx` uses the canonical IDs and agreed Polish labels
- Each canonical category has exactly one SVG icon asset in `assets/`
- Web B2C filter chips, map pins, and listing routes all use the canonical IDs
- `pnpm api:generate` after backend spec update completes with no type errors on the canonical category enum
