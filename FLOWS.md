# Lightforth V3 Flows

## Auth: Sign In -> Plan Selection

1. Entry condition: user opens `/v3/auth/sign-in` without an authenticated session.
   Exit condition: user submits credentials or chooses Google sign-in.
   Failure branch: validation and provider failures stay on the same view with field or banner errors in a later state slice.

2. Entry condition: sign-in succeeds or reviewer opens `/v3/auth/choose-plan` directly.
   Exit condition: user selects a subscription plan or chooses to do it later.
   Failure branch: payment and entitlement errors route to future billing states.

3. Entry condition: user chooses "I'll do this later."
   Exit condition: user returns to the v3 review index at `/v3`.
   Failure branch: none for this static review route.

## Web App: Dashboard Entry

1. Entry condition: authenticated user opens `/v3/app`.
   Exit condition: user chooses a dashboard action card or sidebar destination.
   Failure branch: unavailable feature destinations remain linked as review placeholders until their flows are implemented.

2. Entry condition: user needs desktop or mobile companion app.
   Exit condition: user chooses Install Desktop or Install Mobile.
   Failure branch: install routes remain review placeholders until download flows are implemented.

## Resume Builder: Upload -> Configure -> Edit -> History

1. Entry condition: authenticated user chooses Tailor my Resume from `/v3/app` or opens `/v3/resume`.
   Exit condition: user uploads a resume or chooses Use Lightforth Resume.
   Failure branch: unsupported file or upload failure stays on the upload surface with a recoverable message in a later state slice.

2. Entry condition: resume source is selected and `/v3/resume/configure` opens.
   Exit condition: user confirms resume name, company, and job description.
   Failure branch: missing required fields stay on the configure form with field-level errors in a later state slice.

3. Entry condition: user continues into `/v3/resume/editor?tab=chat&state=empty`.
   Exit condition: user sends a prompt or chooses a prompt chip.
   Failure branch: empty prompt keeps focus in the composer; offline mode can preserve local edits in a later state slice.

4. Entry condition: AI returns suggested resume changes at `/v3/resume/editor?tab=chat&state=suggestions`.
   Exit condition: user accepts, declines, downloads, or continues editing.
   Failure branch: failed AI generation shows retry in the chat panel in a later state slice.

5. Entry condition: user opens `/v3/resume/editor?tab=create`.
   Exit condition: user edits sections manually or inserts a Light AI draft.
   Failure branch: validation errors stay scoped to the edited section.

6. Entry condition: user opens `/v3/resume/editor?tab=template`.
   Exit condition: user selects a template and preview updates.
   Failure branch: unavailable templates remain disabled when billing or permissions require it in a later state slice.

7. Entry condition: user opens `/v3/resume/history`.
   Exit condition: user searches, creates a new resume, or opens an existing history row in a later state slice.
   Failure branch: history loading and empty states will be rendered when real data loading is introduced.

## Interview Prep: Upload -> Configure -> Practice -> Report

1. Entry condition: authenticated user chooses Practice For Interview from `/v3/app` or opens `/v3/interview-prep`.
   Exit condition: user uploads a resume or chooses Use Lightforth Resume.
   Failure branch: unsupported file or upload failure stays on the upload surface with a recoverable message in a later state slice.

2. Entry condition: resume source is selected and `/v3/interview-prep/configure` opens.
   Exit condition: user confirms interview type, difficulty, target role, company, optional documents, and context.
   Failure branch: missing required fields stay on the configure form with field-level errors in a later state slice.

3. Entry condition: interview setup is complete and `/v3/interview-prep/voice` opens.
   Exit condition: user selects an interviewer voice and starts the interview.
   Failure branch: permission, entitlement, or insufficient-credit blocks route to a future access state before the live simulator starts.

4. Entry condition: live simulator opens at `/v3/interview-prep/session`.
   Exit condition: user ends the session.
   Failure branch: microphone, network, or recording failure keeps the user in the simulator with retry/reconnect controls in a later state slice.

5. Entry condition: session ends and `/v3/interview-prep/complete` opens.
   Exit condition: user chooses See Report.
   Failure branch: if report generation cannot begin, the completion card should show a retry action in a later state slice.

6. Entry condition: report generation starts at `/v3/interview-prep/preparing-report`.
   Exit condition: processing, transcript fetch, analysis, and coaching feedback complete, then user continues.
   Failure branch: failed transcript or scoring job keeps the progress card visible with a retry action in a later state slice.

7. Entry condition: coaching report opens at `/v3/interview-prep/report`.
   Exit condition: user practices again, returns to scenarios/history, or reviews the transcript and recording.
   Failure branch: unavailable recording or transcript sections degrade independently while preserving the summary score.

8. Entry condition: user opens `/v3/interview-prep/history`.
   Exit condition: user searches, creates a new interview prep session, or opens an existing report in a later state slice.
   Failure branch: history loading and empty states will be rendered when real data loading is introduced.

## Interview Copilot: Upload -> Configure -> Permissions -> Live -> History

1. Entry condition: authenticated user chooses Start Interview Copilot from `/v3/app` or opens `/v3/interview-copilot`.
   Exit condition: user uploads a resume or chooses Use Lightforth Resume.
   Failure branch: unsupported file or upload failure stays on the upload surface with a recoverable message in a later state slice.

2. Entry condition: resume source is selected and `/v3/interview-copilot/configure` opens.
   Exit condition: user confirms interview type, difficulty, target role, company, optional documents, and context.
   Failure branch: missing required fields stay on the configure form with field-level errors in a later state slice.

3. Entry condition: setup is complete and `/v3/interview-copilot/preferences` opens.
   Exit condition: user selects response mode and response length.
   Failure branch: unavailable preference options remain disabled when plan or permissions require it in a later state slice.

4. Entry condition: preferences are complete and `/v3/interview-copilot/share-screen` opens.
   Exit condition: user grants screen sharing.
   Failure branch: blocked screen permission stays on the checklist with browser-specific retry guidance in a later state slice.

5. Entry condition: screen sharing is granted and `/v3/interview-copilot/ready` opens.
   Exit condition: user grants microphone and starts the interview.
   Failure branch: blocked microphone permission keeps the user on the checklist with retry guidance in a later state slice.

6. Entry condition: live Copilot starts at `/v3/interview-copilot/session`.
   Exit condition: user ends the session.
   Failure branch: network, screen-share, or audio interruption keeps the live shell visible with reconnect controls in a later state slice.

7. Entry condition: Copilot session ends and `/v3/interview-copilot/complete` opens.
   Exit condition: user chooses See Report and lands on Copilot history for this slice.
   Failure branch: failed report handoff keeps the completion card visible with a retry action in a later state slice.

8. Entry condition: user opens `/v3/interview-copilot/history`.
   Exit condition: user searches, creates a new Copilot session, or opens an existing session in a later state slice.
   Failure branch: history loading and empty states will be rendered when real data loading is introduced.

## Auto Apply: Upload -> Preferences -> Agent -> Jobs -> Applied

1. Entry condition: authenticated user chooses Apply for Jobs from `/v3/app` or opens `/v3/auto-apply`.
   Exit condition: user uploads a resume or chooses Use Lightforth Resume.
   Failure branch: unsupported file or upload failure stays on the upload surface with a recoverable message in a later state slice.

2. Entry condition: resume source is selected and `/v3/auto-apply/contact` opens.
   Exit condition: user confirms contact information and LinkedIn profile.
   Failure branch: missing or invalid contact fields stay on the form with field-level errors in a later state slice.

3. Entry condition: contact information is complete and `/v3/auto-apply/preferences` opens.
   Exit condition: user confirms target roles, seniority, salary range, job types, and work modes.
   Failure branch: unavailable job sources or incompatible preferences are shown inline before continuing in a later state slice.

4. Entry condition: preferences are complete and `/v3/auto-apply/additional` opens.
   Exit condition: user confirms work authorization, start timeline, and additional notes.
   Failure branch: authorization conflicts block agent start with a clear explanation and edit path in a later state slice.

5. Entry condition: additional information is complete and `/v3/auto-apply/review` opens.
   Exit condition: user saves preferences and continues to `/v3/auto-apply/agent`.
   Failure branch: stale resume, insufficient credits, or missing required fields keep the review visible with corrective links.

6. Entry condition: saved preferences exist and `/v3/auto-apply/agent` opens.
   Exit condition: the agent scans sources, ranks matches, tailors resumes, or moves to Jobs/Applied tabs.
   Failure branch: source outage, permission denial, or offline mode keeps completed activity visible and marks affected agents paused in a later state slice.

7. Entry condition: matched jobs are available and `/v3/auto-apply/jobs` opens.
   Exit condition: user searches, filters, opens a selected job, or applies.
   Failure branch: insufficient credits or entitlement failure keeps the job detail open with a top-up or upgrade path in a later state slice.

8. Entry condition: user opens `/v3/auto-apply/jobs/coinbase` from the jobs list.
   Exit condition: user reviews listing, tailored resume, match score, credit balance, and chooses Apply.
   Failure branch: external listing unavailable or form automation blocked shows a retry/manual-apply branch in a later state slice.

9. Entry condition: application submission completes and `/v3/auto-apply/applied` opens.
   Exit condition: user reviews timeline, activity log, replay, or returns to Jobs.
   Failure branch: partial submission shows the last successful event, pending fields, and retry/replay actions in a later state slice.
