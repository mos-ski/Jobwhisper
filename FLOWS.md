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

## Job Directory: Browse -> Preview -> Apply on Source

1. Entry condition: authenticated user selects Job Directory in the app navigation or opens `/v3/job-directory`.
   Exit condition: the directory displays saved job boards and the user searches or filters by focus.
   Failure branch: loading uses layout-matched skeletons; a load failure presents Try again; offline mode keeps cached boards browsable.

2. Entry condition: at least one board matches the current search and filter.
   Exit condition: user selects Explore and the 80% browser-like preview opens with representative jobs from that board.
   Failure branch: a board without representative jobs keeps the preview open and explains that no jobs are available yet.

3. Entry condition: the board preview contains one or more jobs.
   Exit condition: user selects a role and reviews its company, location, salary, responsibilities, and skills without leaving Jobwhisper.
   Failure branch: long details scroll inside the preview while the close action and job list remain keyboard reachable.

4. Entry condition: the user is online and chooses Apply on the selected source.
   Exit condition: the canonical external application destination opens in a new browser tab.
   Failure branch: offline mode disables the external handoff and tells the user that applications return with connectivity.

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

## Try-It Funnel: Pro Week (Landing -> Quiz -> Free Week -> Account -> Card -> Started)

1. Entry condition: a visitor pastes a job description and attaches a resume in the landing page's "Try it" card.
   Exit condition: they choose Set me up and `/v3/try/pro` opens with the resume name carried over.
   Failure branch: the button stays disabled with a live hint naming whichever half is missing.

2. Entry condition: `/v3/try/pro?step=quiz&q=<n>` opens.
   Exit condition: all seven questions are answered, one per screen, and the visitor chooses Finish.
   Failure branch: Continue stays disabled until the question is answered; offline, the answers are kept and Continue waits for the connection. Back on the first question returns to the landing page.

3. Entry condition: the quiz finishes and the working step shows.
   Exit condition: the setup completes and the reward replaces it in history.
   Failure branch: none in this slice; production shows a retry if setup fails.

4. Entry condition: the reward step shows a free week of Pro, what Pro includes, the answer recap, and "$0 today, then $99 a month after 7 days unless you cancel".
   Exit condition: Claim my free week, which opens the account step for anonymous visitors and the card step for signed-in ones. Not now leaves the funnel.
   Failure branch: none.

5. Entry condition: an anonymous visitor reaches the account step.
   Exit condition: they continue with Google or a valid email.
   Failure branch: an invalid email shows a field error describing the fix.

6. Entry condition: the card step opens with the full terms above the form: $0 today, free for 7 days until the first charge date, then Pro at $99 a month until cancelled, and a reminder email 2 days before.
   Exit condition: a complete card starts the week and the started step shows.
   Failure branch: a declined card shows the bank's reason with the form ready for another card; offline disables submit.

7. Entry condition: the free week has started.
   Exit condition: Start with your setup opens `/v3/app`.
   Failure branch: none.

## Try-It Funnel: Resume (Upload -> Score -> Before and After -> Download Gate)

1. Entry condition: a visitor opens `/v3/try/resume`. The first screen says "Free to score. Create an account to download."
   Exit condition: they upload a resume, optionally paste a job description, and choose Score my resume.
   Failure branch: an unsupported, oversized or empty file is refused with the fix stated, and scoring stays disabled; offline, scoring waits for the connection.

2. Entry condition: the working step checks sections, keywords and layout.
   Exit condition: the score replaces it in history.
   Failure branch: none in this slice; production shows a retry if scoring fails.

3. Entry condition: the score step shows the score out of 100, a verdict in words, and each issue with its impact and fix.
   Exit condition: See it fixed opens the before and after.
   Failure branch: none.

4. Entry condition: the before and after shows one page with a slider, by drag or arrow keys, and the score climbing from before to after.
   Exit condition: Download my resume. Anonymous visitors reach the gate; signed-in visitors download straight away.
   Failure branch: none.

5. Entry condition: the gate says the tailored resume is saved and needs a free account to download.
   Exit condition: Google or a valid email downloads the resume and offers Resume Builder.
   Failure branch: an invalid email shows a field error describing the fix.

## Try-It Funnel: Auto Apply (Resume -> Nine Questions -> Matches -> Apply Gate)

1. Entry condition: a visitor opens `/v3/try/auto-apply`. The first screen says "Free to match. Sign up to apply."
   Exit condition: they upload a resume, which counts as question one of ten.
   Failure branch: a refused file states the fix and holds Continue.

2. Entry condition: `/v3/try/auto-apply?step=quiz&q=<n>` asks role, experience, salary, location, job type, work mode, start date, work authorization and sponsorship, one per page.
   Exit condition: the last answer and Finish start matching.
   Failure branch: Continue stays disabled until answered; offline, answers are kept and Continue waits. Personal details are not asked here; the real flow asks them after sign-up.

3. Entry condition: the working step names Scout, Filter and Tailor.
   Exit condition: the matches replace it in history.
   Failure branch: none in this slice.

4. Entry condition: the matches list shows each job's title, company, location, salary and match score.
   Exit condition: View job opens its reasons; Apply to this job or Apply to all opens the gate for anonymous visitors, and `/v3/auto-apply/review` for signed-in ones.
   Failure branch: with no matches, the screen offers to widen the location, work mode or salary and returns to that question.

5. Entry condition: the gate names the jobs waiting and says each application is approved before it goes.
   Exit condition: Google or a valid email opens `/v3/auto-apply/review` with the answers carried over.
   Failure branch: an invalid email shows a field error describing the fix.
