# Admin App — Roadmap & Foundation Design

## Goal

Build an internal admin application covering six modules — Dashboard/Analytics (KPIs), Accounts, Transactions, Products, Configuration, and Systems — so the team can manage users, payments, products, and platform configuration. This doc locks the priority order and the shared foundation; each module then gets its own detailed brainstorm → plan → build cycle, starting with Foundation + Dashboard/Analytics.

Front-end/mock-data only, consistent with the rest of this codebase (per `AGENTS.md` §1/§10) — no real API calls, no real auth, no real destructive actions. Every screen is a "pure view" driven by typed mock fixtures, same as every existing module (`account-view.tsx`, `dashboard-view.tsx`, etc.), meant to be ported into a real backend later by a separate engineering team.

## Non-goals

- No real backend, no real authentication/authorization enforcement, no real payment processing, no real email/notification delivery.
- No real "log in as user" session takeover — the Accounts module's debug affordance is a mocked view state (an impersonation banner + the candidate UI rendered read-only), not an actual auth handoff.
- No second Vite entry point / standalone `apps/admin` build target yet. `AGENTS.md` reserves `apps/admin` as the eventual production target, but this phase builds the screens inside the existing `apps/web` dev server for easy review, matching how `/v3` works today for the candidate app. Promoting to a real second app later is a file-move, not a rewrite, because the views live in `features/admin/` regardless of which `apps/*` entry renders them.
- Not designing all six modules' screens in this document — only the shared foundation and each module's high-level scope. Per-module screen inventories, states, and contracts are decided in that module's own design doc.

## Foundation

### Routing & placement

- New routes added to `src/apps/web/routes.tsx` under path prefix `/admin/...` (parallel to the existing `/v3/...` candidate routes), e.g. `/admin`, `/admin/accounts`, `/admin/accounts/:id`, `/admin/transactions`, etc. — exact per-route paths are decided per module.
- New page components in `src/apps/web/pages/admin-*.tsx`, thin wiring layers only (mock fixtures + route-derived state), same convention as every existing page.
- New views in `src/features/admin/` (folder already reserved by `AGENTS.md` §2) — pure, props-typed, no data fetching.
- New mock fixtures in `src/mocks/admin-*.ts`, typed against contracts.
- New contracts in `src/contracts/admin-*.draft.ts`, added incrementally per module (not all upfront) and flagged in `CONTRACT-REQUESTS.md` per `AGENTS.md` §5. Reuses `src/contracts/identity.ts` as-is for the signed-in admin's own `Role`/`Permission`/`Session` — that contract already has `role: 'admin'` and `admin:view` / `admin:users:manage` / `admin:credits:manage` / `admin:services:manage`.
- New `src/apps/web` route-index entries (or an `/admin` sub-index) so every admin screen and state variant is reachable for review, and an `AdminManifest` section — either a new `src/apps/admin-web/MANIFEST.md`-style table appended to the existing `MANIFEST.md`, or its own file — decided when Foundation is built.

### Shell (Approach C)

`AdminShell` component in `features/admin/`, composed from existing `ui/` primitives only — no new chrome components:

- **Left nav** — `SideMenu` (existing component, same expand/collapse toggle pattern as `DashboardSidebar` in `dashboard-view.tsx`), six entries, one per module: Dashboard, Accounts, Transactions, Products, Configuration, Systems.
- **Header** — `ShellBar` (existing component), same breadcrumb/close pattern used across every other module.
- **New: persistent top strip** — thin bar rendered above/alongside `ShellBar` on every admin page, holding:
  - Global search (admin-scoped: users, transactions, invoices — exact index decided when built)
  - Signed-in admin identity (name/avatar, using `UserIdentity` from `identity.ts`)
  - Notification bell (badge count, opens a panel — backed by the Systems module's notification contract once that module is built; until then, static/empty state)

This keeps every visual primitive identical to the candidate app (same tokens, same `SideMenu`/`ShellBar`) while giving search and notifications — needs that cut across all six modules — a permanent home instead of duplicating them per-module.

### Reused primitives (no new components needed)

- `DataTable` — every module's list views (users, transactions, disputes, coupons, audit log, team members) use this as-is; it already supports search, sort, pagination, and row actions (`DataTableAction`), which covers bulk/destructive-action affordances like suspend, refund, resolve.
- `StatCard` — KPI tiles for the Dashboard module and per-module summary rows (e.g. "142 open disputes").
- `Dialog` — confirmation dialogs for destructive actions (suspend user, approve refund), per `AGENTS.md` §8's "destructive-action confirmations" requirement for this app.

## Module roadmap (priority order)

### 1. Dashboard & Analytics (KPIs) — built first, with Foundation

Company-wide KPI tiles (MRR/revenue, active subscribers, new signups, churn, credits consumed, live sessions right now), a date-range filter, revenue/usage trend charts, a product-mix breakdown (which product drives usage/revenue), and surfaced anomalies that deep-link into other modules (e.g. "3 disputes need review" → Transactions). This is the admin landing page (`/admin`).

### 2. Accounts

Searchable/filterable user table (signups, plan, status); user detail page (profile, plan/subscription, credit balance + history, activity timeline, per-product usage); suspend/reinstate with confirmation dialog; mocked "log in as user" debug view; per-user audit log (admin actions taken on that account); signups list.

### 3. Transactions

Incoming/outgoing ledger (subscriptions, top-ups, refunds, payouts) — searchable/filterable; invoice detail view; disputes queue (evidence, resolve/deny actions); refunds queue (request → approve/deny → resulting state).

### 4. Products

Per-product pages: Resume Builder, Auto Apply, Interview Prep, Interview Copilot (interview/coding/meeting modes), Done-For-You. Each gets usage/session logs and product-level adoption analytics (usage volume, credit consumption, completion rates).

### 5. Configuration

Pricing/plan configuration (edit plan tiers and pricing — mocked); coupons & promotions (create/manage codes, expiry, usage caps); trial length & onboarding survey settings.

### 6. Systems

Admin/team management (invite admins, assign roles using the existing `Role`/`Permission` contract); platform-wide audit log (every admin action across the platform — distinct from the Accounts module's per-user audit log, which scopes to actions taken on one account); notifications center (the source of truth for the top-strip notification bell added in Foundation).

## Sequencing

Each module is its own brainstorm → plan → build cycle, in the order above:

1. **Foundation + Dashboard/Analytics** (this doc sets up Foundation; Dashboard gets its own follow-up design pass for KPI selection, chart types, and states)
2. Accounts
3. Transactions
4. Products
5. Configuration
6. Systems

A bare shell with no module content isn't independently reviewable, so Foundation ships together with Dashboard/Analytics as the first cycle.

## Phase 2 — Analytics, content operations, support (added 2026-09-04)

An audit of the six shipped modules found real gaps: no customer support surface, no way to manage the marketplace/download/tutorial/FAQ catalogs (Configuration only holds marketplace *price bounds*, not the items), no deep analytics beyond the Dashboard's company-wide KPIs, no dedicated Done-For-You applicant pipeline, and no referral program visibility. Rather than eight new top-level nav entries, this phase consolidates them into three new modules plus two extensions to existing ones, following the same "each module is its own contract → mock → view → page" convention as Phase 1.

### 7. Analytics (new top-level module)

Deeper, more analytical than the Dashboard's KPI tiles — this is where the team goes to understand *who* users are and *how* they move through the funnel, not just today's revenue number.

- **Survey distribution** — response breakdowns for the onboarding survey questions already configured in `AdminConfigurationView` (`AdminOnboardingSurveyConfig`/`AdminSurveyQuestion`) — e.g. for a single-select question, a bar of option → response count/percent.
- **Demographics** — desired-role distribution (reuses the same role taxonomy as `AutoApplySetup.desiredRole`/`AdminProductSessionRow.targetRole`), experience-level distribution, geography if available. Age only if the signup flow actually collects it — do not invent a field; check `AutoApplySetup`/`SettingsProfile` first and note in the module's own design doc if it's out of scope.
- **Interview scores** — score distribution across Interview Prep/Copilot sessions (histogram-style: score bucket → session count), trend over time.
- **Acquisition & conversion funnels** — top-of-funnel entry sources (reuses `AdminProductRow`-style channel data where it exists) through signup → first session → subscribe, each stage's drop-off, and time-to-convert (signup timestamp → subscribe timestamp, as a distribution not just an average).
- **Referral stats** — invites sent, signups attributed, conversion-to-paid rate, credits paid out. (Reward *rules* live in Configuration, per below — this is performance, not configuration.)

This module's own brainstorm → plan cycle happens inside its build (per the Sequencing note above), but the shape of what it covers is fixed by this list — an implementing agent should not need to ask the user what "analytics" means.

### 8. Content (new top-level module)

Catalog management for everything currently hardcoded or admin-invisible on the candidate side: Marketplace items, Download Apps entries, Tutorials, and FAQ. One module, four tabs (mirrors the Systems module's `team`/`audit`/`notifications` tab pattern) rather than four separate nav entries, since all four are the same shape of problem: a list of content items with title/description/metadata and basic CRUD.

- **Marketplace tab** — the catalog behind `MarketplaceView`/`MarketplaceItem` (`src/features/account/account-view.tsx`, `src/mocks/account.ts`): list, add, edit (title, description, price, PDF asset), remove. Respects the price-bound guardrail already in `AdminMarketplacePricingConfig` (Configuration) rather than duplicating it.
- **Downloads tab** — the catalog behind `DownloadsView`/`DownloadItem` (same files): platform, version, file/URL, support text.
- **Tutorials tab** — the catalog behind `TutorialsView`/`TutorialItem`: title, video/link, tone/category.
- **FAQ tab** — question/answer pairs shown in the candidate-side FAQ panel (`FormPanel`'s FAQ usage / `account-view.tsx`'s "Frequently Asked Questions" panel) — currently hardcoded copy, not sourced from any contract; this tab makes it data-driven for the first time.

### 9. Support (new top-level module)

A real customer ticket queue — today "Support" only exists as an internal admin-team *role* (Systems → Team), not an inbox. Ticket list (search/filter by status, priority, assignee), ticket detail (message thread, status changes, assignee, linked account), reply/resolve actions, matching the `DataTable` + detail-page pattern used by every other module.

### Extension: Done-For-You applicant queue (Products module)

The Products module's Done-For-You detail page currently reuses the generic `AdminProductSessionRow` shape (user, target role/company, started, duration) — the same shape used for every product's session log. This extension adds the operational fields a real applicant pipeline needs: assigned success manager, pipeline status (queued → in progress → completed), package purchased (`AdminDoneForYouPackageId`), and jobs-submitted count. Touches `admin-products-view.tsx` and `admin-products.draft.ts` only — additive to the existing Done-For-You detail page, not a new route.

### Extension: Referral program configuration (Configuration module)

A new section alongside the existing plans/coupons/trial/survey config: reward amount per successful referral, referral cap per account, reward expiry window. Configuration *rules* only — referral *performance* (conversion rate, credits paid out) lives in the new Analytics module above, not duplicated here. Touches `admin-configuration-view.tsx` and `admin-configuration.draft.ts` only.

### Sequencing (Phase 2)

Each of the five pieces above (Analytics, Content, Support, DFY applicant queue, Referral configuration) is independently buildable — none shares a route or a contract file with another — so they're built in parallel rather than the strict sequence Phase 1 used. Shared integration points (the `AdminModuleId` union, the `AdminShell` nav array, and `routes.tsx`) are wired up centrally after each piece is verified, not by the piece's own implementer, to avoid five parallel edits to the same three files.
