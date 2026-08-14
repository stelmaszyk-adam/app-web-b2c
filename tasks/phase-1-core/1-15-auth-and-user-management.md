# Task 1-15: Auth and User Management

**Phase:** 1 — Core
**Priority:** P0/P1 (see individual items)
**Dependencies:** 1-00 (i18n), 1-01 (layout and navigation)
**Reference:** `documentation/ROADMAP-web-b2c.md` (Section 1.1)
**Backend counterpart:** `documentation/ROADMAP-backend.md` (Section 1.1)
**Mobile counterpart:** `documentation/ROADMAP-mobile-b2c.md` (Section 1.1)

---

## Objective

Implement the full authentication surface for Web B2C. Browsing the map and reading event/venue pages requires no login. Auth gates only interactive write actions: event submission and event tip submission. This task covers entry points, login/register pages, Google OAuth, JWT cookie storage, transparent token refresh, password reset, email verification, sign-out, the user profile page, and ToS re-consent.

---

## Deliverables

### 1. "Sign In" Entry Point in Header

- [x] P0 **Header — unauthenticated state:**
  - Desktop: "Sign In" text link in the top-right of the navbar
  - Mobile (hamburger menu): "Sign In" item at the top of the menu
- [x] P0 **Header — authenticated state:**
  - Replace "Sign In" link with user avatar dropdown
  - Avatar dropdown contains links to `/profile`, `/my-submissions`, `/my-tips`, and "Sign Out"

### 2. Login Page (`/login`)

- [x] P0 Email + password form
- [x] P0 Google Sign In button (OAuth redirect flow)
- [x] P0 "Don't have an account? Sign up" link → `/register`
- [x] P0 "Forgot password?" link → `/forgot-password`
- [x] P0 `next` query param support — after successful login redirect to the originating page (e.g. `/login?next=/submit-event`)

### 3. Registration Page (`/register`)

- [x] P0 Email + password form
- [x] P0 Google Sign In button (OAuth redirect flow — creates account if none exists)
- [x] P0 ToS acceptance checkbox with links to `/terms` and `/privacy` (required before form submit)
- [x] P0 "Already have an account? Sign in" link → `/login`

### 4. Google OAuth Web Flow

- [x] P0 Client redirects to Google authorization endpoint
- [x] P0 Google redirects back to `/api/auth/callback/google` with authorization code
- [x] P0 Next.js API route exchanges code via `POST /auth/oauth/google` → receives access + refresh tokens → sets `httpOnly` cookies

### 5. JWT Storage — `httpOnly` Cookies

- [x] P0 Access token and refresh token stored in `httpOnly`, `Secure`, `SameSite=Lax` cookies set by Next.js API route proxy (`/api/auth/*`)
- [x] P0 Cookies are forwarded with every SSR request (XSS-safe, SSR-compatible)
- [x] P0 Next.js middleware reads the access token cookie and attaches it as `Authorization: Bearer` header when proxying to the backend

### 6. Token Refresh — Transparent Middleware

- [x] P0 `src/middleware.ts` intercepts requests to protected routes
- [x] P0 If access token is expired: call `POST /auth/refresh` with refresh token cookie → store new token pair → forward request transparently
- [x] P0 User never sees a session expiry on short page loads

### 7. Password Reset Flow

- [x] P0 `/forgot-password` page — email input; calls `POST /auth/password-reset/request`; always shows "If an account exists, you'll receive an email" (no email enumeration)
- [x] P0 `/reset-password` page — loaded via link from email (`?token=xxx`); accepts new password; calls `POST /auth/password-reset/confirm`

### 8. Email Verification

- [x] P0 After registration redirect to `/verify-email` page — "Check your email" message with resend button
- [x] P0 Deep link from verification email hits `/api/auth/verify-email?token=xxx` → calls `POST /auth/verify-email` → confirms account and redirects to homepage

### 9. Sign Out

- [x] P0 Calls `POST /auth/logout` (revokes refresh token on backend) then clears `httpOnly` cookies via Next.js API route
- [x] P0 Redirects to homepage

### 10. User Profile Page (`/profile`) — P1

- [x] P1 Account info: email, display name
- [x] P1 Change password form
- [x] P1 Language preference toggle (PL / EN)
- [x] P1 Links to "My Submissions" and "My Tips"
- [x] P1 Account deletion (GDPR) — "Delete my account" confirmation dialog → calls account deletion endpoint → signs out and shows confirmation

### 11. ToS Re-consent — P1

- [x] P1 If backend returns `TOS_ACCEPTANCE_REQUIRED` on any authenticated request, show a re-consent modal (summary of changes, "I accept" button, blocks interaction until accepted) — matching the mobile-b2c flow

---

## Design Reference

> Screenshots: `documentation/designs/web-b2c/screenshot/`
> Design system: `documentation/designs/DESIGN.md`

- **AppHeader** (`src/components.jsx`) — logo, city selector, language toggle; auth state changes the right-side control from "Sign In" link to avatar dropdown
- **Color palette:** Violet/purple primary (#7C3AED range) for primary CTAs ("Sign In", "Register", "Submit")
- **CTAs:** Primary actions in solid violet; secondary in outline style
- No 1px borders — use tonal elevation per "Radiant Curator" design system

## Acceptance Criteria

- Unauthenticated users see "Sign In" in the header (desktop) and hamburger menu (mobile)
- Authenticated users see their avatar with a dropdown linking to `/profile`, `/my-submissions`, `/my-tips`, and "Sign Out"
- `/login` renders email + password form and Google Sign In button; `next` param redirects correctly after login
- `/register` requires ToS checkbox before submission; Google Sign In creates account if none exists
- Google OAuth callback at `/api/auth/callback/google` exchanges code for tokens and sets `httpOnly` cookies
- Access and refresh tokens live only in `httpOnly` cookies — not accessible from client JS
- Middleware at `src/middleware.ts` silently refreshes expired access tokens without user interruption
- `/forgot-password` never reveals whether an email is registered
- `/reset-password?token=xxx` accepts a new password and confirms account
- Email verification deep link at `/api/auth/verify-email?token=xxx` confirms account and redirects to homepage
- Sign Out revokes the refresh token server-side and clears cookies
- `/profile` (P1) shows account info, change password, language toggle, GDPR deletion — accessible only when authenticated
- `TOS_ACCEPTANCE_REQUIRED` backend error triggers a blocking re-consent modal (P1)
- `pnpm type-check` and `pnpm lint` pass with no errors
