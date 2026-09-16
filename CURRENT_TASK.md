# Task Sequence — web-b2c

> **Do not edit ticks or the Next line by hand.** Progress is derived from the
> `[ ]`/`[x]` checkboxes inside each task file. Regenerate this file with
> `python3 scripts/task-utils.py sync web-b2c` (run from the workspace root).

**Next:** `tasks/phase-0-preparation/0-02-mock-environment-msw.md`

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
- [ ] `tasks/phase-0-preparation/0-02-mock-environment-msw.md` *(7 open)*
- [ ] `tasks/phase-0-preparation/0-03-github-actions-ci-cd.md` *(1 open)*

### Phase 1 — Core
- [x] `tasks/phase-1-core/1-00-i18n.md`
- [x] `tasks/phase-1-core/1-01-layout-and-navigation.md`
- [x] `tasks/phase-1-core/1-02-map-and-discovery.md`
- [x] `tasks/phase-1-core/1-03-onboarding-geolocation.md`
- [x] `tasks/phase-1-core/1-04-event-detail-page.md`
- [ ] `tasks/phase-1-core/1-05-venue-profile-page.md` *(1 open)*
- [ ] `tasks/phase-1-core/1-06-community-scout-cta.md` *(2 open)*
- [ ] `tasks/phase-1-core/1-07-seo-foundations.md` *(4 open)*
- [x] `tasks/phase-1-core/1-08-cookie-consent.md`
- [ ] `tasks/phase-1-core/1-09-legal-pages.md` *(4 open)*
- [ ] `tasks/phase-1-core/1-10-error-and-empty-states.md` *(4 open)*
- [ ] `tasks/phase-1-core/1-11-image-strategy.md` *(1 open)*
- [ ] `tasks/phase-1-core/1-12-monitoring-and-analytics.md` *(4 open)*
- [ ] `tasks/phase-1-core/1-13-accessibility.md` *(2 open)*
- [x] `tasks/phase-1-core/1-14-pwa-foundations.md`
- [x] `tasks/phase-1-core/1-15-auth-and-user-management.md`
- [x] `tasks/phase-1-core/1-16-add-event-submission.md`
- [ ] `tasks/phase-1-core/1-17-saved-events.md` *(16 open)*

### Phase 2.5 — Blog Pages
- [ ] `tasks/phase-2-5-blog/2-5-00-blog-api-client-and-mocks.md` *(16 open)*
- [ ] `tasks/phase-2-5-blog/2-5-01-blog-list-page.md` *(20 open)*
- [ ] `tasks/phase-2-5-blog/2-5-02-blog-detail-page.md` *(28 open)*
- [ ] `tasks/phase-2-5-blog/2-5-03-city-scoped-blog-page.md` *(14 open)*
- [ ] `tasks/phase-2-5-blog/2-5-04-blog-sitemap-and-og.md` *(12 open)*

### Phase 2 — Design Alignment
- [ ] `tasks/phase-2-design-alignment/2-00-category-system-alignment.md` *(14 open)*
- [ ] `tasks/phase-2-design-alignment/2-01-tablet-breakpoint-audit.md` *(25 open)*

### Phase 4 — Testing
- [ ] `tasks/phase-4-testing/4-00-testing-and-launch.md` *(7 open)*
