# Task 1-16: Add Event — Community Event Submission

**Phase:** 1 — Core
**Priority:** P1
**Dependencies:** 1-15 (auth and user management), Phase 0 API client
**Reference:** `documentation/ROADMAP-web-b2c.md` (authenticated user actions — event submission)

---

## Objective

Implement the community event submission screen (`/add-event`), which allows authenticated users to submit event tips directly from the web interface. The form is auth-gated: unauthenticated users are redirected to `/login?next=/add-event` and returned to the form after sign-in. An organizer callout banner at the top of the form redirects venue owners to the Organizer Dashboard (`dashboard.wydarzka.dev`) — the web form is for community tips, not official venue-managed events.

> This screen is fully designed in the prototype. Implementation must follow the design closely.

---

## Deliverables

### 1. Auth Gate

- [x] P1 `/add-event` is a protected route — unauthenticated requests redirect to `/login?next=/add-event`
- [x] P1 After successful login or registration, user is returned to `/add-event` with their form state preserved where possible
- [x] P1 "Adding as [Name] · [email]" identity line shown at top of form when authenticated (mirrors the `ae-asuser` element in the prototype)

### 2. Organizer Callout Banner

- [x] P1 Full-width callout at the top of the form: "Jesteś organizatorem? Zarządzaj wydarzeniami, miejscami i statystykami z jednego miejsca." with "Panel Organizatora" CTA linking to `dashboard.wydarzka.dev` (external, new tab)
- [x] P1 Styled as a distinct callout card — not a primary CTA and not competing visually with the form submit button

### 3. Multi-Section Form

The form is divided into numbered card sections, each with a heading and subtitle:

**Section 1 — Basic Info**
- [x] P1 Event name (required, text input)
- [x] P1 Venue selector — searchable select from known venues in the selected city; fallback to free-text if venue not found (required)
- [x] P1 Event description (required, textarea)

**Section 2 — Date & Time**
- [x] P1 Start date + time (required, datetime-local input)
- [x] P1 End date + time (optional, datetime-local input)

**Section 3 — Category**
- [x] P1 Category selector — one of the 12 canonical categories (required); uses category chip/radio group, not a plain select

**Section 4 — Tickets & Price**
- [x] P1 Ticket URL (required, URL input) — external link to ticketing system
- [x] P1 Price from (required, numeric input in zł; `0` = free)

**Section 5 — Address**
- [x] P1 City (required, select from supported cities)
- [x] P1 Post code, street, building number, apartment/unit (required fields except unit)

### 4. Validation & Error Handling

- [x] P1 All required fields validated on submit — inline error per field, summary error banner if any fields empty
- [x] P1 Ticket URL must be a valid URL
- [x] P1 Start time must be in the future

### 5. Submission

- [x] P1 On submit: `POST /events/submissions` (or equivalent backend endpoint) with form payload
- [x] P1 On success: redirect to the submitted event's detail page (if immediately visible) or to a confirmation page ("Twoje zgłoszenie zostało przyjęte — kuratorzy dodadzą je do bazy w 24 h")
- [x] P1 On API error: show inline error with retry option

---

## Design Reference

> Prototype: `documentation/designs/web-b2c/EventB2CWeb/`
> Design system: `documentation/designs/DESIGN.md`

- **AddEventScreen** (`src/add-event.jsx`) — full multi-section form with numbered card sections (`ae-card`, `ae-step`). Hero header with eyebrow "Zgłoszenie", title "Dodaj nowe wydarzenie", subtitle, and "adding as [user]" identity line. Organizer callout (`organizer-callout`) as a distinct banner above the form sections. Form uses `form-grid` layout consistent with auth forms.
- **Auth flow** (`src/app.jsx` `onNavigate`) — when unauthenticated user triggers `add-event`, `authIntent` is set to `'add-event'` and view switches to `login`. After `onAuth()` resolves, view switches back to `add-event`.
- **Category chips** (`src/components.jsx` `FilterBar`) — reuse the category chip style for the category selector.

---

## Acceptance Criteria

- Navigating to `/add-event` while unauthenticated redirects to `/login?next=/add-event`; after login the user lands back on `/add-event`
- The "adding as [Name] · [email]" identity line is visible at the top of the form for authenticated users
- The organizer callout banner is rendered above the form sections and links to `dashboard.wydarzka.dev` in a new tab
- Submitting the form with any required field empty shows an inline validation error; the form does not submit
- A valid submission reaches `POST /events/submissions` with the correct payload; the response navigates to the event detail or confirmation page
- A server error on submission shows an inline error message with a retry action
- `pnpm type-check` and `pnpm lint` pass with no errors
