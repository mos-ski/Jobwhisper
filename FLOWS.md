# Lightforth V3 Flows

## Auth: Sign Up -> Profile Setup -> Dashboard

1. Entry condition: a new visitor opens `/v3/auth/create-account`.
   Exit condition: they submit the form or choose Google, and `/v3/onboarding/profile` opens. Sign-up no longer routes to the plan picker.
   Failure branch: validation and provider failures stay on the same view with field or banner errors in a later state slice.

2. Entry condition: `/v3/onboarding/profile`, then `/v3/onboarding/interests`.
   Exit condition: Complete opens `/v3/app?welcome=1`; Go Home skips straight to the dashboard without the offer.
   Failure branch: Complete stays disabled until the required answers are in.

3. Entry condition: the dashboard opens with `welcome=1`.
   Exit condition: the "Special One-time Trial" Pro offer ($4.57 for 7 days, then $99/month) shows as a centred modal (a bottom sheet on phones). Try 1 week for $4.57 opens `/v3/billing?plan=pro&offer=welcome-60`; closing or Esc swaps it for a top banner carrying the same deal and the same countdown (`?offer=banner`, which keeps the banner through a refresh); its Upgrade now goes to the same billing link.
   Failure branch: none in this slice.

4. Entry condition: a returning user signs in at `/v3/auth/sign-in`.
   Exit condition: the dashboard at `/v3/app`, with no offer.
   Failure branch: validation and provider failures stay on the sign-in view.

`/v3/auth/choose-plan` remains reachable from billing and the review index; it is no longer a step after sign-up or sign-in.

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

5. Entry condition: user opens the Edit tab at `/v3/resume/editor?tab=edit` (old `tab=create` and `tab=template` links land here too). The left panel lists the sections; each links to its place on the canvas; the canvas on the right is the resume itself, edited in place. The Chat tab keeps its resume preview.
   Exit condition: the resume is edited in place on the canvas; each flagged section shows its issue counts, and its Fix lists its issues and, where a rewrite exists (summary, top role bullets, skills), Accept applies it and the count drops. The header's Compare icon opens a before/after slider of the original against the resume as it stands. Sections reorder by drag handle or arrow keys, collapse from their heading, and can be removed and restored or added through Add Section; the left list highlights the section being edited.
   Failure branch: sections without a rewrite offer "Fix for me" with the advice on what to change; the header's ATS Score opens the full report.

6. Entry condition: user opens `/v3/resume/history`.
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

## Done For You: Billing -> Choose Manager -> Sign Up

1. Entry condition: user opens Billing's Done for you tab (`/v3/billing?plan=done-for-you`) from Billing, a pricing card's Sign up, or the Auto Apply promo.
   Exit condition: they see one success manager per price (Marcus, $497 for 5 interviews; Daniel, $1,997 for 20), and Start with opens the signup dialog naming that manager.
   Failure branch: managers fail to load (retry); a booked manager shows the next opening; if all are booked the page points to Auto Apply.
2. Entry condition: signup dialog open with that manager's package.
   Exit condition: preferences and payment confirmed; the package becomes active.
   Failure branch: payment declined keeps the dialog open with the card error.

## Try-It Funnel: Resume Week Landing (Hero Field -> Pro Week Quiz)

1. Entry condition: a visitor lands on `/resume-week` from paid traffic. The hero carries the job description field and resume attach; the demo video sits right under it. There is no footer, sign-in, menu, Lightforth banner or cookie prompt to leave by.
   Exit condition: with a posting pasted and a resume attached, Set me up (grey and disabled until then) opens `/v3/try/pro` with the resume name, and the Pro Week funnel below takes over.
   Failure branch: missing either input keeps Set me up disabled and the hint under the field names what is missing.

## Try-It Funnel: Pro Week (Landing -> Quiz -> Week of Pro Offer -> Account -> Card -> Started)

1. Entry condition: a visitor pastes a job description and attaches a resume in the landing page's "Try it" card.
   Exit condition: they choose Set me up and `/v3/try/pro` opens with the resume name carried over.
   Failure branch: the button stays disabled with a live hint naming whichever half is missing.

2. Entry condition: `/v3/try/pro?step=quiz&q=<n>` opens.
   Exit condition: all seven questions are answered, one per screen; picking an answer moves on at once, typed answers move on with Enter or Continue, and the last one opens the reward.
   Failure branch: Continue stays disabled until the question is answered; offline, the answers are kept and Continue waits for the connection. Back on the first question returns to the landing page.


3. Entry condition: the reward step shows the answer recap and the Pro offer widget: "Try Pro for 7 days, 80% off, just $4.57", then Pro at $99 a month.
   Exit condition: Try 1 week for $4.57, which opens the account step for anonymous visitors and the card step for signed-in ones. Not now leaves the funnel.
   Failure branch: none.

4. Entry condition: an anonymous visitor reaches the account step.
   Exit condition: they continue with Google or a valid email.
   Failure branch: an invalid email shows a field error describing the fix.

5. Entry condition: the card step opens with the full terms above the form: $4.57 today for 7 days of Pro until the first charge date, then Pro at $99 a month until cancelled, and a reminder email 2 days before.
   Exit condition: a complete card starts the week and the started step shows.
   Failure branch: a declined card shows the bank's reason with the form ready for another card; offline disables submit.

6. Entry condition: the week of Pro has started.
   Exit condition: Start with your setup opens `/v3/app`.
   Failure branch: none.

## Try-It Funnel: Resume (Upload -> Analyzing -> Score -> Before and After -> Download Gate)

1. Entry condition: a visitor opens `/v3/try/resume`. The first screen says "Free to score. Create an account to download."
   Exit condition: they optionally paste a job description in the composer, attach a resume with its paperclip, and press the circular Analyze for free send button, which opens the analyzing page.
   Failure branch: an unsupported, oversized or empty file is refused with the fix stated; offline, the file is kept and the Analyze button waits for the connection.

2. Entry condition: `/v3/try/resume?step=analyzing` is its own page, reachable directly and by pressing Analyze for free. It is a full-page run log under the landing frame — no card — headed "Analyzing your resume…" with eleven mono lines that tick off in order over about 13 seconds: opening the file, reading pages and word count, extracting sections, normalizing titles and dates, checking ATS keyword coverage (against the pasted job description when there is one), scanning section order, fonts and tables, looking for quantified results, checking date gaps, scoring the criteria, writing the report. Completed lines take a check, the live line is prefixed with ">".
   Exit condition: after about 13 seconds the score opens at `?step=score`, replacing the analyzing entry so browser back returns to the upload rather than replaying the run.
   Failure branch: browser back at any time returns to the upload; if the connection drops mid-run the offline notice appears above the card and the run still resolves.

3. Entry condition: the score step shows the score out of 100, a verdict in words, and each issue with its impact and fix.
   Exit condition: See it fixed opens the before and after.
   Failure branch: none.

4. Entry condition: the before and after shows one page with a slider, by drag or arrow keys, and the score climbing from before to after.
   Exit condition: Download my resume. Anonymous visitors reach the gate; signed-in visitors download straight away.
   Failure branch: none.

5. Entry condition: the gate says the tailored resume is saved and needs a free account to download.
   Exit condition: Google or a valid email downloads the resume and offers Resume Builder.
   Failure branch: an invalid email shows a field error describing the fix.

## Try-It Funnel: Auto Apply (Resume -> Preference Questionnaire -> Search -> Matches -> Apply Gate)

1. Entry condition: a visitor opens `/v3/try/auto-apply`. The first screen says "Find your next role. Land the Job. Or Don’t Pay!"
   Exit condition: they upload a resume and explicitly start the remote-job search.
   Failure branch: a refused file states the fix and holds Continue.

2. Entry condition: `/v3/try/auto-apply?step=quiz&q=<n>` asks one focused question per page: work style, search goal, minimum salary, location, resume status, target titles, categories, experience, education, and benefits.
   Exit condition: the last answer opens the search run.
   Failure branch: Continue stays disabled until answered; capped multi-select questions prevent choosing beyond five and expand from ten with See More, location carries two "work from anywhere" checks that start on, salary offers Annually/Hourly plus "Skip, I’m not sure yet" (skipping does not block matching), helper banners and ledes reassure where the design calls for it, and the benefits question finishes with "Find Your Next Remote Job!". Offline, answers are kept and Continue waits. Personal details are not asked here; the real flow asks them after sign-up.

3. Entry condition: `/v3/try/auto-apply?step=searching` runs a staged log ("reading your answers…" through "shortlisting your best matches…") over 10 seconds with the open-role and company stats underneath.
   Exit condition: the run completes and replaces into the matches, so Back from the matches returns to the last question.
   Failure branch: offline freezes the run at its first line with the offline notice and nothing auto-advances; reduced motion shows every line at once on the same timer.

4. Entry condition: the matches step opens with the title and a light stat row (roles found / average match / best match — ink numbers, muted labels, hairline dividers, no container) spanning the full width, above the job area; below them the open roles show the Jobs-tab row layout — company initials, title with `{n}% MATCH` and New badges, company/location/type and found lines, a per-row Apply (or Queued/Applying badge).
   Exit condition: selecting a job slides its detail in as a right-hand panel beside the list (bottom sheet under the mobile breakpoint, `?job=<id>` in the URL) with the full preview: status chips, posted/found, job listing link, resume we'll submit, match breakdown card, tags and about; X, backdrop click and Escape slide it back out (instant under `prefers-reduced-motion`), browser Back dismisses it directly, and either way focus returns to the row. Apply to this job (shell footer on desktop, sheet footer on mobile), a per-row Apply, or Apply to all opens the gate for anonymous visitors, and `/v3/auto-apply/review` for signed-in ones.
   Failure branch: with no matches, the screen offers to widen the location, work mode or salary and returns to that question.

5. Entry condition: the gate names the jobs waiting and says each application is approved before it goes.
   Exit condition: Google or a valid email opens `/v3/auto-apply/review` with the answers carried over.
   Failure branch: an invalid email shows a field error describing the fix.
