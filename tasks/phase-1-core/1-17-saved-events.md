# Task 1-17: Saved / Favourite Events

**Phase:** 1 — Core
**Priority:** P1
**Dependencies:** 1-15 (auth and user management), 1-04 (event detail page), 1-02 (map and discovery)
**Reference:** `documentation/ROADMAP-web-b2c.md` (authenticated user actions)

---

## Objective

Implement the save/favourite events feature across all surfaces where events appear. Authenticated users can save events to a personal list; the saved state persists to the backend. Unauthenticated users see the heart button but clicking it prompts login with a `next` redirect back to the same page. A "Saved events" page (`/saved`) is accessible from the user menu dropdown.

> The save button and heart icon are fully designed in the prototype across event cards and the event detail aside. The saved events page and user menu entry are also designed.

---

## Deliverables

### 1. Save Button — Event Card

- [ ] P1 Heart icon button on every `EventCard` (search results, related events grid, city/category listing pages)
- [ ] P1 Two states: unsaved (outline heart) and saved (filled heart, `color: var(--color-tertiary)`)
- [ ] P1 Click when unauthenticated → redirect to `/login?next=<current-page>`; after auth, saved state applied
- [ ] P1 Click when authenticated → optimistic UI toggle; `POST /events/{id}/save` or `DELETE /events/{id}/save`
- [ ] P1 On API error: revert optimistic toggle, show toast error

### 2. Save Button — Event Detail Page

- [ ] P1 "Zapisz" button in the price aside card (alongside "Nawiguj")
- [ ] P1 Same auth gate and toggle behaviour as the card heart button
- [ ] P1 Saved state matches the card heart (if user saved via card, detail page shows filled heart)

### 3. Saved Events Page (`/saved`)

- [ ] P1 Protected route — unauthenticated users redirected to `/login?next=/saved`
- [ ] P1 Grid/list of all events saved by the current user — same `EventCard` component as search results
- [ ] P1 Empty state: "Nie masz jeszcze zapisanych wydarzeń — serce pod wydarzeniem, żeby dodać je do listy"
- [ ] P1 Removing a saved event (clicking the heart again) removes it from the list with a smooth transition
- [ ] P1 Data fetched from `GET /events/saved` (cursor-based pagination)

### 4. User Menu Entry

- [ ] P1 "Zapisane wydarzenia" entry in the authenticated user dropdown, linking to `/saved`
- [ ] P1 Item is positioned after "Dodaj wydarzenie" and before "Ustawienia konta" in the dropdown list (matches prototype order)

### 5. Saved Count Badge (optional, P2)

- [ ] P2 Numeric badge on the user avatar chip when the user has saved events — shows count (e.g. "3"), max display "9+"

---

## Design Reference

> Prototype: `documentation/designs/web-b2c/EventB2CWeb/`
> Design system: `documentation/designs/DESIGN.md`

- **EventCard** (`src/components.jsx`) — `event-card-fav` button with `is-saved` class toggles between `<Icon.Heart />` and `<Icon.HeartFill />`. Button uses `e.stopPropagation()` to prevent card click.
- **EventDetailScreen** (`src/screens.jsx`) — "Zapisz" secondary button in the price aside card; `saved` state drives `Icon.Heart` vs `Icon.HeartFill` and `color: var(--color-tertiary)`.
- **UserMenu** (`src/auth.jsx`) — "Zapisane wydarzenia" `<Icon.Heart />` menu item after "Dodaj wydarzenie".

---

## Acceptance Criteria

- Event cards and the event detail page display a heart button in both saved and unsaved states
- Clicking the heart when unauthenticated redirects to login and returns the user to the originating page after auth
- Clicking the heart when authenticated toggles the saved state optimistically; the backend call confirms or reverts on error
- The saved state is consistent across cards and the detail page for the same event (no desync)
- `/saved` requires authentication; shows the user's saved events using the `EventCard` component; shows an empty state when the list is empty
- Removing a saved event on `/saved` removes it from the list without a page reload
- "Zapisane wydarzenia" appears in the user dropdown and links to `/saved`
- `pnpm type-check` and `pnpm lint` pass with no errors
