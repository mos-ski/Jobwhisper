# Contract Requests

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
