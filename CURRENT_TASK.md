# Task Sequence — web-b2c

> **Do not edit ticks or the Next line by hand.** Progress is derived from the
> `[ ]`/`[x]` checkboxes inside each task file. Regenerate this file with
> `python3 scripts/task-utils.py sync web-b2c` (run from the workspace root).

**Next:** `tasks/phase-0-preparation/0-03-github-actions-ci-cd.md`

---

## How to run the task loop

From the workspace root (one task file per fresh Claude session, with plan →
implement → verify → review → commit):

```
./scripts/run-tasks.sh web-b2c              # run until done or blocked
./scripts/run-tasks.sh web-b2c --max-tasks 1
./scripts/run-tasks.sh web-b2c --dry-run
```

Interactive alternative inside this repo: open the file named in **Next**,
implement its open items, tick each `[x]` only once the code and tests exist,
run `pnpm lint && pnpm type-check` (backend/mobile: also `pnpm test`), then run
`sync` again.

---

## Task Sequence

### Phase 0 — Preparation (check individual files for completion)
- [x] `tasks/phase-0-preparation/0-00-project-scaffold.md`
- [x] `tasks/phase-0-preparation/0-01-api-client-setup.md`
- [x] `tasks/phase-0-preparation/0-02-mock-environment-msw.md`
- [ ] `tasks/phase-0-preparation/0-03-github-actions-ci-cd.md` _(1 open)_

### Phase 1 — Core
- [x] `tasks/phase-1-core/1-00-i18n.md`
- [x] `tasks/phase-1-core/1-01-layout-and-navigation.md`
- [x] `tasks/phase-1-core/1-02-map-and-discovery.md`
- [x] `tasks/phase-1-core/1-03-onboarding-geolocation.md`
- [x] `tasks/phase-1-core/1-04-event-detail-page.md`
- [ ] `tasks/phase-1-core/1-05-venue-profile-page.md` _(1 open)_
- [ ] `tasks/phase-1-core/1-06-community-scout-cta.md` _(2 open)_
- [ ] `tasks/phase-1-core/1-07-seo-foundations.md` _(4 open)_
- [x] `tasks/phase-1-core/1-08-cookie-consent.md`
- [ ] `tasks/phase-1-core/1-09-legal-pages.md` _(4 open)_
- [ ] `tasks/phase-1-core/1-10-error-and-empty-states.md` _(4 open)_
- [ ] `tasks/phase-1-core/1-11-image-strategy.md` _(1 open)_
- [ ] `tasks/phase-1-core/1-12-monitoring-and-analytics.md` _(4 open)_
- [ ] `tasks/phase-1-core/1-13-accessibility.md` _(2 open)_
- [x] `tasks/phase-1-core/1-14-pwa-foundations.md`
- [x] `tasks/phase-1-core/1-15-auth-and-user-management.md`
- [x] `tasks/phase-1-core/1-16-add-event-submission.md`
- [ ] `tasks/phase-1-core/1-17-saved-events.md` _(16 open)_

### Phase 2.5 — Blog Pages
- [ ] `tasks/phase-2-5-blog/2-5-00-blog-api-client-and-mocks.md` _(16 open)_
- [ ] `tasks/phase-2-5-blog/2-5-01-blog-list-page.md` _(20 open)_
- [ ] `tasks/phase-2-5-blog/2-5-02-blog-detail-page.md` _(28 open)_
- [ ] `tasks/phase-2-5-blog/2-5-03-city-scoped-blog-page.md` _(14 open)_
- [ ] `tasks/phase-2-5-blog/2-5-04-blog-sitemap-and-og.md` _(12 open)_

### Phase 2 — Design Alignment
- [ ] `tasks/phase-2-design-alignment/2-00-category-system-alignment.md` _(14 open)_
- [ ] `tasks/phase-2-design-alignment/2-01-tablet-breakpoint-audit.md` _(25 open)_

### Phase 4 — Testing
- [ ] `tasks/phase-4-testing/4-00-testing-and-launch.md` _(7 open)_
