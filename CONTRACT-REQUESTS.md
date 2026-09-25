# Contract Requests

## Marketing Product Draft Contract

`src/contracts/marketing-product.draft.ts` defines the flat, readonly content model used by the four public product education pages:

- `MarketingProductSlug` identifies AI Resume Builder, Interview Copilot, Interview Prep, and Auto Apply pages.
- `MarketingProduct` contains the outcome headline, summary, CTA destination, and ordered narrative sections.
- `MarketingProductSection` contains the section copy, short step list, and local media references.

These values are static marketing content in this UI studio. Production should decide whether they remain versioned with the frontend or move to a managed content contract; the current shape is serializable and does not contain callbacks or runtime objects.

## Billing Plan Catalog

The existing `Plan` contract only identifies plan ids: `free`, `pro`, and `business`. The Auth plan chooser also needs display and purchase fields:

- `name`
- `priceMonthly`
- `credits`
- `description`
- `features`
- `note`
- `popular`

For this UI slice, these fields are modeled as app fixture data in `src/mocks/billing.ts` and view props in `src/features/billing/plan-selection-view.tsx`; the production backend should decide whether they belong in a billing catalog contract.

## Dashboard Draft Contract

`src/contracts/dashboard.draft.ts` defines temporary flat UI contracts for the web dashboard:

- `DashboardAction` for action cards such as resume tailoring, interview practice, copilot, and auto-apply.
- `DashboardNavItem` for shell sidebar links.
- `DashboardInstallPrompt` for desktop/mobile install promotion.

These are currently UI review fixtures. Production should decide whether dashboard navigation stays static in app code or comes from an entitlement-aware backend contract.

## Job Directory Draft Contract

`src/contracts/job-directory.draft.ts` defines temporary flat UI contracts for the curated job-source experience:

- `JobBoard` for source identity, description, focus, supported regions, work styles, website URL, and representative listings.
- `DirectoryJob` for previewable job details, including employment metadata, salary display, responsibilities, skills, and the canonical external application URL.
- `JobDirectoryStatus` for ready, loading, error, and offline rendering.

Production should replace these fixtures with backend-owned job-source and listing contracts. A production listing should include an ISO publication timestamp, expiry status, source attribution, canonical listing URL, canonical application URL, and a last-verified timestamp so Jobwhisper can avoid sending candidates to stale roles. The UI currently uses display strings because this is a static review surface.

## Documents Draft Contract

`src/contracts/documents.draft.ts` defines temporary flat UI contracts for uploaded or linked context documents:

- `ContextDocumentRow` for document/context table rows, including name, type, size or URL, and added date.

Production should replace this with a backend-owned document library contract. Dates are display strings in this UI slice; backend contracts should expose ISO timestamps plus formatted presentation values if needed.

## Account Utility Draft Contract

`src/contracts/account.draft.ts` defines temporary flat UI contracts for account utility pages:

- `DownloadItem` for desktop app download options, including platform metadata, CTA copy, support notes, and artwork.
- `BillingPlanCard` and `CreditUsageRow` for subscription cards and credit history tables.
- `SettingsProfile` and `ReferralRow` for account settings and referral history.

Production should replace these with backend-owned account, download, billing, settings, and referral contracts. Dates are display strings in this UI slice; backend contracts should expose ISO timestamps plus formatted presentation values if needed.

## Resume Builder Draft Contract

`src/contracts/resume.draft.ts` defines temporary flat UI contracts for the resume builder:

- `ResumeDocument` for parsed and generated resume content.
- `ResumeBuilderSession` for uploaded file, job-description prompt, AI response, selected template, and zoom state.
- `ResumeTemplate` for template gallery options.
- `ResumeHistoryRow` for past-resume table rows.

Production should replace these with backend-owned resume document, revision, template, and history contracts. Dates are intentionally serialized as display strings for this UI slice; backend contracts should expose ISO timestamps plus formatted presentation values if needed.

## Interview Prep Draft Contract

`src/contracts/interview.draft.ts` defines temporary flat UI contracts for the interview prep flow:

- `InterviewPrepSession` for uploaded resume, interview type, difficulty, target role, company, optional documents, and extra context.
- `InterviewerVoice` for selectable interviewer personas and portrait assets.
- `InterviewLiveSession`, `InterviewParticipant`, and `InterviewChatMessage` for the live simulator surface.
- `InterviewReportStep` for report-generation progress states.
- `InterviewHistoryRow` for past-interview table rows.
- `InterviewReport`, `InterviewScoreMetric`, and `InterviewTranscriptEntry` for coaching report content.

Production should replace these with backend-owned interview scenario, session, recording, transcript, scorecard, and history contracts. Dates are display strings in this UI slice; backend contracts should expose ISO timestamps plus formatted presentation values if needed.

## Interview Copilot Draft Contract

`src/contracts/copilot.draft.ts` defines temporary flat UI contracts for the Interview Copilot flow:

- `CopilotSetup` for uploaded resume, interview metadata, context, response mode, and response length.
- `CopilotPermissionStep` for screen-share and microphone setup state.
- `CopilotLiveSession` for timer, signal status, shared-screen preview, and AI assistant prompts.
- `CopilotHistoryRow` for past Copilot session table rows.

Production should replace these with backend-owned Copilot session, preference, permission-state, transcript/recording, and history contracts. Dates are display strings in this UI slice; backend contracts should expose ISO timestamps plus formatted presentation values if needed.

## Auto Apply Draft Contract

`src/contracts/auto-apply.draft.ts` defines temporary flat UI contracts for the Auto Apply flow:

- `AutoApplySetup` for uploaded resume, contact information, job preferences, authorization, timeline, and notes.
- `AutoApplyMetric`, `AutoApplyAgentStatus`, and `AutoApplyActivity` for the running agent workspace.
- `AutoApplyJob` for discovered and curated job rows, selected job details, match score, listing URL, tailored resume, and credit counts.
- `AutoApplyApplication` and `AutoApplyApplicationEvent` for submitted applications, event timelines, activity logs, and replay entry.

Production should replace these with backend-owned auto-apply profile, job discovery, job match, application submission, credit deduction, and replay/audit contracts. Dates are display strings in this UI slice; backend contracts should expose ISO timestamps plus formatted presentation values if needed.

## Admin Draft Contract

`src/contracts/admin.draft.ts` defines temporary flat UI contracts for the admin app:

- `AdminNavItem` / `AdminModuleId` for the six admin modules and their per-module "awaiting action" badge counts.
- `AdminDateRange` and `AdminKpi` for the dashboard's range switcher and KPI tiles. `AdminKpi.higherIsBetter` exists so an inverse metric (churn) can render a rise as negative without encoding that meaning in color alone.
- `AdminTrendPoint` for the revenue/credits time series, `AdminProductMixRow` and `AdminPlanMixRow` for the revenue and subscriber breakdowns.
- `AdminAlert` for surfaced anomalies that deep-link into the module which can resolve them.
- `AdminNotification` and `AdminSearchResult` for the shell's notification popover and global search.

Production should replace these with backend-owned analytics/aggregation, notification, and search contracts. All money is integer cents and all dates are display strings in this UI slice; backend contracts should expose ISO timestamps plus formatted presentation values if needed. `AdminKpi.value` is polymorphic by `format` (cents, count, or percent) — a backend contract may prefer separate typed fields per metric instead.

The signed-in admin reuses `src/contracts/identity.ts` unchanged: `role: 'admin'` plus the existing `admin:view` / `admin:users:manage` / `admin:credits:manage` / `admin:services:manage` permissions. No new identity fields were needed.

## Admin Module Draft Contracts

Five further draft contracts back the admin modules. All money is integer cents and all dates are pre-formatted display strings, so views never parse or localize a date.

- `src/contracts/admin-accounts.draft.ts` — `AdminAccountRow`/`AdminAccountDetail`, credit-history entries, activity events, per-product usage, and a per-account audit entry.
- `src/contracts/admin-transactions.draft.ts` — ledger rows, disputes (with `daysUntilEvidenceDue` precomputed so the view can escalate without date math), refund requests, and invoice detail with line items and an event timeline.
- `src/contracts/admin-products.draft.ts` — per-SKU rows with tier gating and a `blastRadiusLabel` spelled out for the disable confirmation, plus detail stats, trend points, session-log rows, and grouped errors.
- `src/contracts/admin-configuration.draft.ts` — plan/pricing config, credit economics, coupons, trial settings, and the onboarding survey.
- `src/contracts/admin-systems.draft.ts` — team members, a permission catalog giving each `Permission` a human label, audit entries with before/after field changes and `daysAgo` precomputed for range filtering, and notification settings.

Production should replace these with backend-owned account, billing/ledger, product-analytics, configuration, and audit contracts. Two conventions worth keeping: precomputed relative-time integers (`daysAgo`, `daysUntilEvidenceDue`) alongside display strings, so no view parses dates; and presentation metadata for permission ids, so raw strings like `admin:credits:manage` are never shown to a person.

Roles and permissions throughout reuse `src/contracts/identity.ts` unchanged — no new identity fields were needed.

## Admin Activity Feed Draft Contract

`src/contracts/admin-activity.draft.ts` defines `AdminActivityEvent` and `AdminActivityFeed` for a platform-wide live feed (new signups, logins, and payments/refunds/payouts), reachable at `/admin/activity` and linked from the shell's notification popover ("View all"). This is distinct from `admin-systems.draft.ts`'s audit entries, which log *admin* actions, not end-user activity.

Two fields are invented with no existing precedent: `kind: 'login'` events have no backing data anywhere else in the app (no session/login timestamp exists on `AdminAccountRow` or elsewhere), and `timeAgo` is a plain display string like every other admin date field, not a raw timestamp — so a real implementation sorting/filtering by actual recency would need a backend-owned timestamp field this draft doesn't have. `amountCents` is optional and only set for `payment`/`refund`/`payout` events, mirroring `AdminTransactionRow`'s integer-cents convention.

## Unlimited Plans — `BillingSnapshot` Needs An Entitlement, Not A Balance

Requested 2026-09-23, when the three pricing shapes merged into three unlimited plans (`PRICING.md` §1). `src/contracts/billing.ts` models a subscriber as a wallet plus a per-feature cost:

```ts
readonly wallet: CreditWallet;                                    // balance, reserved
readonly access: Readonly<Record<BillableFeature, FeatureAccess>>; // entitled + creditCost
```

Neither half describes a subscriber any more. A plan now grants unlimited use of the features it covers, so `wallet.balance` has no meaning for one, `creditCost` has no number to hold, and `CopilotAccessBlockReason`'s `'insufficient-credits'` can never fire for a covered feature. The contract is not editable here, so nothing above was changed — the UI is carrying the gap instead, and `src/features/billing/plan-selection-view.tsx` now takes an `included: string` from its own props type rather than reading a cents figure.

What the model actually needs:

- **`FeatureAccess` without a cost for covered features** — `entitled` plus something like `metering: 'unlimited' | { creditCost: number }`, so an unlimited feature is a state rather than a cost of zero (which reads as "free", a different thing).
- **A wallet that is optional, or scoped to pay-as-you-go.** Credits survive only for people with no plan, who buy Resume Builder and Auto Apply standalone (`PRICING.md` §2). Those are two independent balances with their own expiry, not the single subscription wallet modeled today. A subscriber's snapshot should be able to carry no wallet at all rather than a meaningless zero.
- **`'insufficient-credits'` scoped to the pay-as-you-go path.** `'not-entitled'` is the real block reason for a subscriber on a plan that does not cover a feature, and it already exists. Keeping `'insufficient-credits'` in the union is right for non-subscribers; a covered feature should not be able to produce it.
- **Cadence on the plan.** `Plan` is `'starter' | 'pro' | 'premium'`, and Starter now bills **weekly** while the other two bill monthly with an annual option. Nothing in the contract expresses a billing period, so the renewal cadence lives in fixtures and view props today. Whatever replaces this should carry it, since "cancel before it renews" means something different at a week than at a year.

Until then, `Plan` stays as-is and the drafts carry the shape: `src/contracts/account.draft.ts`'s `BillingPlanCard` has optional annual fields (a weekly plan has no annual rate) and its allowance field was renamed `included`, because it holds "Unlimited use" rather than a credit count.

## Admin Invites Draft Contract

`src/contracts/admin-invites.draft.ts` backs admin-issued invites: bringing someone into Jobwhisper by email or by a shareable link, with a plan or a credit balance already attached to the account they land in.

Three shapes are worth carrying into the real contract rather than re-inventing:

- **`AdminInviteGrant` is a discriminated union**, not a nullable plan id beside a nullable credit amount. An invite grants a plan for a number of cycles, or credits of one product, or nothing — never two at once, and the type says so.
- **`AdminInviteUses` reuses the limited-or-unlimited shape** that `AdminPlanAllowance` uses in `admin-configuration.draft.ts`. A campaign link with no cap is a state, not a very large number, and the same is true of a plan's allowance — one shape for both keeps a sentinel like `-1` or `999999` out of the model.
- **Every invite carries a `url`, including email ones.** An email invite is that URL, sent; treating the link as the primitive means "resend" and "copy link" are the same object rather than two flows.

What a real implementation needs that this draft does not model: what happens when a grant is claimed (the ledger entry that credits the account, and whether it is reversible if the invite is revoked after acceptance), and whether an accepted invite ties the account to the admin or campaign that issued it for attribution. `grantLabel` is a pre-formatted display string like every other admin date and money field here, so the view never prices a grant itself.

## Try-It Funnel Draft Contract

`src/contracts/funnel.draft.ts` backs the public `/v3/try/*` funnels, which run before any `Session` exists, so none of their data can hang off `UserIdentity` or `BillingSnapshot`.

- `FunnelQuestion` is a union on `kind` (`options`, `pills`, `text`) so marketing can reorder or reword questions without touching views. Answers are a flat `FunnelAnswers` record keyed by question id; production should persist them against the account created at the funnel's gate and use them to pre-fill onboarding.
- `FunnelTrialOffer` carries everything the card screen must state before asking for a card: plan name, trial length, what the plan includes, the monthly price, reminder lead time, and the first charge date as an ISO date. The backend should compute `firstChargeOn` so the page never does date math.
- `FunnelCardStatus` is presentation state only; production maps Stripe SetupIntent outcomes onto it.
- `AtsReport` gives the score with a `verdict` in words, so the screen never leans on colour, and each `AtsIssue` pairs the problem with the fix and a three-level severity. Production scoring should return the fix text too, not just a code.
- `ResumeRewrite` carries both documents as structured `FunnelResumeDocument`s plus the two scores, so the before and after can render as a page rather than an image. The real resume contract (`resume.draft.ts`) should be able to produce this shape.
- `FunnelJobMatch` is a flat match with pre-formatted `salaryRange` and `postedLabel` and a list of human `reasons`. Production matching should return the reasons it used, since they are what sells the sign-up.
