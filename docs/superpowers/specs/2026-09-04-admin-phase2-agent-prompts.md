# Admin Phase 2 — Agent Prompts

These are the exact prompts dispatched to 5 parallel agents to build Admin Phase 2 (see `2026-09-03-admin-app-roadmap-design.md`, "## Phase 2" section, for the roadmap these reference). Each agent worked in an isolated git worktree, touched only its own assigned files, and left changes uncommitted for review/integration.

---

## Agent 1 — Analytics module

```
Repo: Jobwhisper (React 19 + TypeScript + Vite + Tailwind v4, `@` path alias for `src/`). This is a mock-data-only frontend for a job-search product — no real backend, no real API calls, no real auth. Every screen is a "pure view" driven by typed mock fixtures (see AGENTS.md §1/§10 if present, and follow the pattern of existing files, described below).

## Your task

Build the new **Analytics** module for this app's internal Admin app (`/admin/*` routes, `src/features/admin/`). This is module #7 in the admin roadmap — read `docs/superpowers/specs/2026-09-03-admin-app-roadmap-design.md`, specifically the "### 7. Analytics" section under "## Phase 2", for the authoritative scope. Quoting it here so you don't have to hunt:

> Deeper, more analytical than the Dashboard's KPI tiles — this is where the team goes to understand *who* users are and *how* they move through the funnel, not just today's revenue number.
> - **Survey distribution** — response breakdowns for the onboarding survey questions already configured in `AdminConfigurationView` (`AdminOnboardingSurveyConfig`/`AdminSurveyQuestion`) — e.g. for a single-select question, a bar of option → response count/percent.
> - **Demographics** — desired-role distribution (reuses the same role taxonomy as `AutoApplySetup.desiredRole`/`AdminProductSessionRow.targetRole`), experience-level distribution, geography if available. Age only if the signup flow actually collects it — do not invent a field; check `AutoApplySetup`/`SettingsProfile` first and note in the module's own design doc if it's out of scope.
> - **Interview scores** — score distribution across Interview Prep/Copilot sessions (histogram-style: score bucket → session count), trend over time.
> - **Acquisition & conversion funnels** — top-of-funnel entry sources (reuses `AdminProductRow`-style channel data where it exists) through signup → first session → subscribe, each stage's drop-off, and time-to-convert (signup timestamp → subscribe timestamp, as a distribution not just an average).
> - **Referral stats** — invites sent, signups attributed, conversion-to-paid rate, credits paid out. (Reward *rules* live in a separate Configuration extension another agent is building in parallel — this module is performance/stats only, not configuration.)

This module's own brainstorm → plan cycle happens inside its build (per the Sequencing note above), but the shape of what it covers is fixed by this list — an implementing agent should not need to ask the user what "analytics" means.

## Conventions to follow (study these existing files before writing code)

- `src/contracts/admin-dashboard.draft.ts` or `src/contracts/admin.draft.ts` and any `src/contracts/admin-*.draft.ts` — the typed-contract pattern. Create `src/contracts/admin-analytics.draft.ts` with new types (e.g. `AdminAnalyticsSurveyDistribution`, `AdminAnalyticsDemographics`, `AdminScoreDistribution`, `AdminFunnelStage`, `AdminReferralStats`, etc. — name them sensibly, this is your call).
- `src/mocks/admin-dashboard.ts` and other `src/mocks/admin-*.ts` — realistic, internally-consistent mock fixtures typed against your new contract. Look at `src/mocks/admin-configuration.ts` for the actual onboarding survey question mock data you should aggregate/summarize into distributions, and `src/mocks/account.ts` / `src/contracts/auto-apply.draft.ts` for `AutoApplySetup`/`desiredRole`/`experienceLevel` fields you should check exist before using them (do not invent fields that don't exist elsewhere in the codebase — if "age" genuinely isn't collected anywhere, skip it and say so in your final report, don't fabricate it).
- `src/features/admin/admin-dashboard-view.tsx` — the closest existing analog (KPI tiles, charts, date-range filter). Study its chart implementation (it's hand-rolled SVG/CSS bars, not a charting library — check `package.json` to confirm no chart lib is installed before reaching for one; if none is installed, follow the existing hand-rolled bar-chart pattern rather than adding a new dependency).
- `src/features/admin/admin-systems-view.tsx` — the tabbed-module pattern (`AdminSystemsTab` type, tab bar UI) if you want tabs for Survey/Demographics/Scores/Funnels/Referrals within one page — reasonable given five distinct sub-sections, but your call based on total content volume.
- `src/apps/web/pages/admin-dashboard-page.tsx` — the thin page-wiring pattern (imports mock fixtures, passes as props, no logic).
- Design tokens: `--lf-*` CSS variables via Tailwind classes already used everywhere (`text-ink`, `bg-surface`, `border-border`, etc.) — never hardcode colors. Big stat/figure numbers use `font-gowun` (the brand serif) per this session's established convention — check any `text-3xl`/`text-4xl`/`text-5xl` number in `admin-dashboard-view.tsx` for the exact pattern (`font-gowun font-bold text-ink`) and match it.

## Explicit boundaries — do NOT touch these files

Someone else is integrating five parallel modules and will wire navigation/routing centrally afterward to avoid merge conflicts. Do NOT edit:
- `src/contracts/admin.draft.ts` (the `AdminModuleId` union)
- `src/features/admin/admin-shell.tsx` (the nav array)
- `src/apps/web/routes.tsx`

Just build your new, self-contained files:
- `src/contracts/admin-analytics.draft.ts`
- `src/mocks/admin-analytics.ts`
- `src/features/admin/admin-analytics-view.tsx` (export a top-level `AdminAnalyticsView` component, props-typed, no data fetching — same shape as `AdminDashboardView`)
- `src/apps/web/pages/admin-analytics-page.tsx` (thin wiring page — but do NOT add it to `routes.tsx` yourself; just create the file so the integrator can wire it)

## Verification (required before you finish)

1. `npx tsc --noEmit -p tsconfig.app.json 2>&1 | wc -l` — this repo has a known pre-existing baseline of exactly 137 lines of unrelated TypeScript errors (confirm this baseline yourself by checking it BEFORE your changes if possible, or trust this number). After your changes, the count must still be 137 — your new files must introduce zero new TS errors, and since you're not editing routes.tsx, your new page file will be "unused" (not imported anywhere yet) which is fine and expected, it won't cause new errors.
2. `npx vitest run 2>&1 | tail -6` — baseline is "2 failed | 20 passed" files / "20 failed | 60 passed" tests (pre-existing, unrelated). Your changes must not regress this.
3. Do NOT run `git add`/`git commit`/`git push` — leave your changes uncommitted in your worktree. The orchestrating session will review, integrate, and commit.

## Report back

List every file you created, a one-paragraph summary of what each section of the Analytics module shows and why (grounded in what mock data actually supports it — flag anything you had to approximate or skip because the underlying field doesn't exist elsewhere in the codebase), your suggested nav label and route path (e.g. "Analytics" / `/admin/analytics`), and confirmation that tsc/vitest both match baseline.
```

---

## Agent 2 — Content module

```
Repo: Jobwhisper (React 19 + TypeScript + Vite + Tailwind v4, `@` path alias for `src/`). This is a mock-data-only frontend for a job-search product — no real backend, no real API calls, no real auth. Every screen is a "pure view" driven by typed mock fixtures.

## Your task

Build the new **Content** module for this app's internal Admin app (`/admin/*` routes, `src/features/admin/`). This is module #8 in the admin roadmap — read `docs/superpowers/specs/2026-09-03-admin-app-roadmap-design.md`, specifically the "### 8. Content" section under "## Phase 2", for the authoritative scope. Quoting it here:

> Catalog management for everything currently hardcoded or admin-invisible on the candidate side: Marketplace items, Download Apps entries, Tutorials, and FAQ. One module, four tabs (mirrors the Systems module's `team`/`audit`/`notifications` tab pattern) rather than four separate nav entries, since all four are the same shape of problem: a list of content items with title/description/metadata and basic CRUD.
> - **Marketplace tab** — the catalog behind `MarketplaceView`/`MarketplaceItem` (`src/features/account/account-view.tsx`, `src/mocks/account.ts`): list, add, edit (title, description, price, PDF asset), remove. Respects the price-bound guardrail already in `AdminMarketplacePricingConfig` (Configuration) rather than duplicating it.
> - **Downloads tab** — the catalog behind `DownloadsView`/`DownloadItem` (same files): platform, version, file/URL, support text.
> - **Tutorials tab** — the catalog behind `TutorialsView`/`TutorialItem`: title, video/link, tone/category.
> - **FAQ tab** — question/answer pairs shown in the candidate-side FAQ panel (`FormPanel`'s FAQ usage / `account-view.tsx`'s "Frequently Asked Questions" panel) — currently hardcoded copy, not sourced from any contract; this tab makes it data-driven for the first time.

Start by reading the actual `MarketplaceItem`, `DownloadItem`, `TutorialItem` types (in `src/contracts/account.draft.ts` or wherever they're actually defined — grep for them) and their current mock data in `src/mocks/account.ts`, plus find the hardcoded FAQ content in `src/features/account/account-view.tsx` (search for "Frequently Asked Questions"). Your new admin contract/mocks should reuse or extend those existing shapes where sensible rather than inventing incompatible parallel types — the goal is that this admin module could plausibly be "the same data" a real backend would serve to both the candidate app and the admin app.

## Conventions to follow (study these existing files before writing code)

- `src/features/admin/admin-systems-view.tsx` — the tab-bar pattern (`AdminSystemsTab` type: `'team' | 'audit' | 'notifications'`) — build yours the same way, e.g. `AdminContentTab = 'marketplace' | 'downloads' | 'tutorials' | 'faq'`.
- `src/features/admin/admin-products-view.tsx` or `admin-accounts-view.tsx` — the list + add/edit pattern using `DataTable` (`src/ui/data-table.tsx`) with row actions, and a `Dialog`-based add/edit form (see `src/ui` barrel for `Dialog`, `DialogPopup`, `DialogTitle`, `FormField`, `FormTextArea`, etc. — this is a UI kit already used everywhere, don't build custom form primitives).
- `src/apps/web/pages/admin-products-page.tsx` — the thin page-wiring pattern.
- Design tokens: `--lf-*` CSS variables via Tailwind classes already used everywhere (`text-ink`, `bg-surface`, `border-border`, etc.) — never hardcode colors. Panel/page titles use `font-gowun font-bold` per this session's established convention (check `admin-products-view.tsx`'s `<h1>` for the exact class string and match it).
- Since this is mock-data-only, "CRUD" means local React state (`useState`) that edits/adds/removes from the initial mock array in memory, with a confirmation `Dialog` for delete — same as how other admin destructive actions (suspend, refund) work elsewhere in this app. No persistence needed; a page refresh resetting to the mock is expected and fine, matching every other mocked admin action in this codebase.

## Explicit boundaries — do NOT touch these files

Someone else is integrating five parallel modules and will wire navigation/routing centrally afterward to avoid merge conflicts. Do NOT edit:
- `src/contracts/admin.draft.ts` (the `AdminModuleId` union)
- `src/features/admin/admin-shell.tsx` (the nav array)
- `src/apps/web/routes.tsx`

Just build your new, self-contained files:
- `src/contracts/admin-content.draft.ts`
- `src/mocks/admin-content.ts`
- `src/features/admin/admin-content-view.tsx` (export a top-level `AdminContentView` component, props-typed, no data fetching)
- `src/apps/web/pages/admin-content-page.tsx` (thin wiring page — do NOT add it to `routes.tsx` yourself)

## Verification (required before you finish)

1. `npx tsc --noEmit -p tsconfig.app.json 2>&1 | wc -l` — this repo has a known pre-existing baseline of exactly 137 lines of unrelated TypeScript errors. After your changes, the count must still be 137 — your new files must introduce zero new TS errors (your new page file being unused/not-yet-routed is fine, that's expected).
2. `npx vitest run 2>&1 | tail -6` — baseline is "2 failed | 20 passed" files / "20 failed | 60 passed" tests (pre-existing, unrelated). Your changes must not regress this.
3. Do NOT run `git add`/`git commit`/`git push` — leave your changes uncommitted in your worktree. The orchestrating session will review, integrate, and commit.

## Report back

List every file you created, a one-paragraph summary of each tab's CRUD scope, confirmation you reused the real `MarketplaceItem`/`DownloadItem`/`TutorialItem` shapes (or explain why you didn't), your suggested nav label and route path (e.g. "Content" / `/admin/content`), and confirmation that tsc/vitest both match baseline.
```

---

## Agent 3 — Support Tickets module

```
Repo: Jobwhisper (React 19 + TypeScript + Vite + Tailwind v4, `@` path alias for `src/`). This is a mock-data-only frontend for a job-search product — no real backend, no real API calls, no real auth. Every screen is a "pure view" driven by typed mock fixtures.

## Your task

Build the new **Support** module for this app's internal Admin app (`/admin/*` routes, `src/features/admin/`). This is module #9 in the admin roadmap — read `docs/superpowers/specs/2026-09-03-admin-app-roadmap-design.md`, specifically the "### 9. Support" section under "## Phase 2", for the authoritative scope. Quoting it here:

> A real customer ticket queue — today "Support" only exists as an internal admin-team *role* (Systems → Team), not an inbox. Ticket list (search/filter by status, priority, assignee), ticket detail (message thread, status changes, assignee, linked account), reply/resolve actions, matching the `DataTable` + detail-page pattern used by every other module.

## Conventions to follow (study these existing files before writing code)

- `src/features/admin/admin-transactions-view.tsx` — the closest existing analog: a list view with search/filter tabs/status chips backed by `DataTable`, PLUS a detail page reachable via a dynamic route param (look at how `admin-transaction-detail-page.tsx` and `AdminTransactionDetailPage` work, and how `routes.tsx` currently does `routePath.startsWith('/admin/transactions/')` → extracts the id). Model your ticket list/detail split the same way.
- `src/features/admin/admin-accounts-view.tsx` — for how a detail page shows a threaded activity/timeline (the "Activity" tab with dated log entries) — your ticket detail's message thread should look similar (avatar/name, message body, timestamp, chronological).
- Link a ticket to an existing mock account where sensible — check `src/mocks/admin-accounts.ts` for real account records (names/emails/ids) and reference a few of those in your ticket mocks rather than inventing disconnected users, so a real admin could plausibly click through from a ticket to the linked account (even though you won't wire that link yourself — see boundaries below, just make the *data* linkable via a shared account id field).
- `src/apps/web/pages/admin-transactions-page.tsx` and `admin-transaction-detail-page.tsx` — the thin page-wiring pattern for list + detail.
- Design tokens: `--lf-*` CSS variables via Tailwind classes already used everywhere (`text-ink`, `bg-surface`, `border-border`, etc.) — never hardcode colors. Page titles use `font-gowun font-bold` (check `admin-transactions-view.tsx`'s `<h1>` for the exact class string).
- Status/priority chips: look at `OutcomeBadge`-style small colored pill components already used elsewhere in this admin app (e.g. transaction status, dispute status) and follow the same pattern (semantic color tokens: `bg-positive-surface text-positive`, `bg-warning-surface text-warning`, `bg-danger-surface text-danger`, etc. — never hardcoded hex).
- Reply/resolve/reassign are mocked local-state actions (no persistence needed on refresh), same as every other mocked admin action in this codebase (suspend, refund, dispute resolution).

## Explicit boundaries — do NOT touch these files

Someone else is integrating five parallel modules and will wire navigation/routing centrally afterward to avoid merge conflicts. Do NOT edit:
- `src/contracts/admin.draft.ts` (the `AdminModuleId` union)
- `src/features/admin/admin-shell.tsx` (the nav array)
- `src/apps/web/routes.tsx`

Just build your new, self-contained files:
- `src/contracts/admin-support.draft.ts`
- `src/mocks/admin-support.ts`
- `src/features/admin/admin-support-view.tsx` (export `AdminSupportView` for the list and `AdminSupportTicketView` for the detail — or one file with two exports, your call, matching how `admin-transactions-view.tsx` exports both `AdminTransactionsView` and `AdminTransactionDetailView`)
- `src/apps/web/pages/admin-support-page.tsx` and `src/apps/web/pages/admin-support-ticket-page.tsx` (thin wiring pages — do NOT add them to `routes.tsx` yourself)

## Verification (required before you finish)

1. `npx tsc --noEmit -p tsconfig.app.json 2>&1 | wc -l` — this repo has a known pre-existing baseline of exactly 137 lines of unrelated TypeScript errors. After your changes, the count must still be 137 — your new files must introduce zero new TS errors (unused/not-yet-routed new page files are fine, expected).
2. `npx vitest run 2>&1 | tail -6` — baseline is "2 failed | 20 passed" files / "20 failed | 60 passed" tests (pre-existing, unrelated). Your changes must not regress this.
3. Do NOT run `git add`/`git commit`/`git push` — leave your changes uncommitted in your worktree. The orchestrating session will review, integrate, and commit.

## Report back

List every file you created, a one-paragraph summary of the ticket list and detail page scope, confirmation your ticket mocks reference real account ids from `src/mocks/admin-accounts.ts`, your suggested nav label and route paths (e.g. "Support" / `/admin/support` and `/admin/support/:id`), and confirmation that tsc/vitest both match baseline.
```

---

## Agent 4 — DFY applicant queue (extends Products module)

```
Repo: Jobwhisper (React 19 + TypeScript + Vite + Tailwind v4, `@` path alias for `src/`). This is a mock-data-only frontend for a job-search product — no real backend, no real API calls, no real auth. Every screen is a "pure view" driven by typed mock fixtures.

## Your task

Extend the existing **Products** admin module's Done-For-You detail page with a real applicant pipeline. Read `docs/superpowers/specs/2026-09-03-admin-app-roadmap-design.md`, specifically "### Extension: Done-For-You applicant queue (Products module)" under "## Phase 2", for the authoritative scope. Quoting it here:

> The Products module's Done-For-You detail page currently reuses the generic `AdminProductSessionRow` shape (user, target role/company, started, duration) — the same shape used for every product's session log. This extension adds the operational fields a real applicant pipeline needs: assigned success manager, pipeline status (queued → in progress → completed), package purchased (`AdminDoneForYouPackageId`), and jobs-submitted count. Touches `admin-products-view.tsx` and `admin-products.draft.ts` only — additive to the existing Done-For-You detail page, not a new route.

## What to actually do

1. Read `src/contracts/admin-products.draft.ts` in full to understand `AdminProductSku`, `AdminProductSessionRow`, `AdminProductDetail`, and how the Done-For-You (`'done-for-you'`) product's detail page is currently rendered — it's the SAME generic session-log component every other product SKU uses.
2. Read `src/features/admin/admin-products-view.tsx` in full, specifically the product-detail rendering and wherever the generic session list is rendered, to understand the existing pattern (likely `AdminProductSessionRow[]` rendered via `DataTable` or a custom list).
3. Add a new type, e.g. `AdminDoneForYouApplicant`, extending or alongside `AdminProductSessionRow` with: `assignedSuccessManager: string` (or a small `{name, avatarInitials}` shape matching how other admin views show an assignee — check `admin-support`/`admin-transactions` sibling work if visible, otherwise just a name string is fine), `pipelineStatus: 'queued' | 'in-progress' | 'completed'`, `packageId: AdminDoneForYouPackageId` (this type should already exist in `src/contracts/admin-configuration.draft.ts` — import it, don't redefine it), `jobsSubmittedCount: number`.
4. Conditionally render this richer applicant view ONLY when the product detail is for `'done-for-you'` — every other SKU keeps using the existing generic session log unchanged. Add a status pill (queued/in-progress/completed) matching the color-token pattern used elsewhere in this admin app (`bg-accent-subtle text-accent-text` for in-progress, `bg-positive-surface text-positive` for completed, etc. — look at existing status pills in `admin-products-view.tsx` or `admin-transactions-view.tsx` for the exact convention, never hardcode colors).
5. Add realistic mock applicant data to `src/mocks/admin-products.ts` for the done-for-you product specifically (a handful of applicants across the three pipeline statuses, referencing real account names/emails from `src/mocks/admin-accounts.ts` where sensible for consistency).
6. Reassigning success manager / changing pipeline status can be a mocked local-state action (dropdown or menu), same pattern as every other mocked admin action in this codebase — no persistence needed.

## Design tokens

`--lf-*` CSS variables via Tailwind classes already used everywhere (`text-ink`, `bg-surface`, `border-border`, etc.) — never hardcode colors. Big numbers use `font-gowun font-bold`.

## Explicit boundaries

This is the ONE piece of this parallel batch that's explicitly allowed to touch `admin-products-view.tsx` and `admin-products.draft.ts` (they're your assigned files, per the roadmap doc). Do NOT touch:
- `src/contracts/admin.draft.ts` (the `AdminModuleId` union)
- `src/features/admin/admin-shell.tsx` (the nav array)
- `src/apps/web/routes.tsx`
- Any other admin module's files (accounts, transactions, configuration, systems, dashboard) — four other agents are working in parallel on unrelated new modules; touching shared files outside your two assigned ones risks merge conflicts.

## Verification (required before you finish)

1. `npx tsc --noEmit -p tsconfig.app.json 2>&1 | wc -l` — this repo has a known pre-existing baseline of exactly 137 lines of unrelated TypeScript errors. After your changes, the count must still be exactly 137 — zero new errors.
2. `npx vitest run 2>&1 | tail -6` — baseline is "2 failed | 20 passed" files / "20 failed | 60 passed" tests (pre-existing, unrelated). Your changes must not regress this.
3. Do NOT run `git add`/`git commit`/`git push` — leave your changes uncommitted in your worktree. The orchestrating session will review, integrate, and commit.

## Report back

Confirm exactly which two files you changed, a summary of the new applicant-pipeline UI and mock data, and confirmation that tsc/vitest both match baseline. Since this doesn't need new nav/routing (it's additive to an existing page), there's nothing for the integrator to wire — just say so.
```

---

## Agent 5 — Referral program configuration (extends Configuration module)

```
Repo: Jobwhisper (React 19 + TypeScript + Vite + Tailwind v4, `@` path alias for `src/`). This is a mock-data-only frontend for a job-search product — no real backend, no real API calls, no real auth. Every screen is a "pure view" driven by typed mock fixtures.

## Your task

Extend the existing **Configuration** admin module with a Referral Program section. Read `docs/superpowers/specs/2026-09-03-admin-app-roadmap-design.md`, specifically "### Extension: Referral program configuration (Configuration module)" under "## Phase 2", for the authoritative scope. Quoting it here:

> A new section alongside the existing plans/coupons/trial/survey config: reward amount per successful referral, referral cap per account, reward expiry window. Configuration *rules* only — referral *performance* (conversion rate, credits paid out) lives in a separate new Analytics module another agent is building in parallel, not duplicated here. Touches `admin-configuration-view.tsx` and `admin-configuration.draft.ts` only.

## What to actually do

1. Read `src/contracts/admin-configuration.draft.ts` in full to understand the existing config-section types (`AdminPlanConfig`, `AdminCreditEconomicsConfig`, `AdminCouponType`/`AdminCoupon`, `AdminTrialConfig`, `AdminOnboardingSurveyConfig`) and pick the type-shape convention that best matches a simple rules config (closest analog is probably `AdminCreditEconomicsConfig` or `AdminTrialConfig` — small, flat, editable-in-place).
2. Read `src/features/admin/admin-configuration-view.tsx` in full, specifically how an existing simple config section (e.g. Credit Economics or Trial config) renders as an editable form with Save, to copy that exact pattern — form fields, edit/save state handling, any confirmation dialog if the existing pattern uses one for changes.
3. Also check the actual referral copy on the candidate side — search `src/features/account/account-view.tsx` for `REFERRAL_BONUS_CREDITS` (referenced in "Earn {REFERRAL_BONUS_CREDITS} credits in free balance") to find the real current hardcoded value, so your new config's default/current value in the admin mock is consistent with what the candidate app already shows, not an arbitrary made-up number.
4. Add `AdminReferralProgramConfig` (or similar name) to `src/contracts/admin-configuration.draft.ts`: `rewardCreditsPerReferral: number` (default matching `REFERRAL_BONUS_CREDITS`), `maxReferralsPerAccount: number` (a cap — pick something reasonable like 10 or 20), `rewardExpiryDays: number` (how long a pending referral reward stays valid before expiring, e.g. 90).
5. Add the mock config value to `src/mocks/admin-configuration.ts` and render an editable "Referral Program" section in `admin-configuration-view.tsx`, following the exact same edit/save UI pattern as the nearest existing simple config section you found in step 2. Saving is a mocked local-state update, no persistence needed, same as every other config section in this file.

## Design tokens

`--lf-*` CSS variables via Tailwind classes already used everywhere (`text-ink`, `bg-surface`, `border-border`, etc.) — never hardcode colors. Section headers use `font-gowun font-bold` per the existing pattern in this file.

## Explicit boundaries

This is the ONE piece of this parallel batch explicitly allowed to touch `admin-configuration-view.tsx` and `admin-configuration.draft.ts` (your assigned files, per the roadmap doc), plus `src/mocks/admin-configuration.ts`. Do NOT touch:
- `src/contracts/admin.draft.ts` (the `AdminModuleId` union)
- `src/features/admin/admin-shell.tsx` (the nav array)
- `src/apps/web/routes.tsx`
- Any other admin module's files (accounts, transactions, products, systems, dashboard) — four other agents are working in parallel on unrelated new modules; touching shared files outside your assigned ones risks merge conflicts.
- Do NOT change the actual `REFERRAL_BONUS_CREDITS` constant or any candidate-side (`src/features/account/`) file — read it for reference only, this task is admin-side config only.

## Verification (required before you finish)

1. `npx tsc --noEmit -p tsconfig.app.json 2>&1 | wc -l` — this repo has a known pre-existing baseline of exactly 137 lines of unrelated TypeScript errors. After your changes, the count must still be exactly 137 — zero new errors.
2. `npx vitest run 2>&1 | tail -6` — baseline is "2 failed | 20 passed" files / "20 failed | 60 passed" tests (pre-existing, unrelated). Your changes must not regress this.
3. Do NOT run `git add`/`git commit`/`git push` — leave your changes uncommitted in your worktree. The orchestrating session will review, integrate, and commit.

## Report back

Confirm exactly which files you changed, the three config fields you added and their default values (and confirm the reward-credits default matches the real `REFERRAL_BONUS_CREDITS` constant you found), and confirmation that tsc/vitest both match baseline. Since this doesn't need new nav/routing (it's additive to an existing page), there's nothing for the integrator to wire — just say so.
```

---

## Integration notes (for whoever merges these back)

- Each agent worked in its own git worktree with uncommitted changes — pull the actual diffs from each worktree before applying.
- After each module lands and is verified independently, the shared files (`src/contracts/admin.draft.ts` `AdminModuleId` union, `src/features/admin/admin-shell.tsx` nav array, `src/apps/web/routes.tsx`) need to be wired centrally, one module at a time, re-running `tsc`/`vitest` after each addition.
- Agents 4 and 5 (DFY applicant queue, Referral config) don't need new nav/routing — they're additive to existing pages.
- Agents 1–3 (Analytics, Content, Support) each need one new `AdminModuleId` value, one new `SideMenu` nav entry, and one (or two, for Support's list+detail) new route(s).
