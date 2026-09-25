# Try-It Funnels Design

## Goal

Three public, pre-sign-up funnels that let a visitor feel the product before paying: a resume score and rewrite, an Auto Apply job match, and a credit reward that starts a Pro trial. Each ends at a clearly signposted gate. This is UI Studio work: every result comes from mocks, and production wires the real services at port time.

## Decisions

- Each funnel is its own full-screen route: `/v3/try/resume`, `/v3/try/auto-apply`, `/v3/try/credits`.
- Results (ATS score, rewrite, job matches) are mock fixtures in `src/mocks/`.
- Gates are stated before the user reaches them. The entry screen of each funnel says what is free and what needs an account.
- Build order: Funnel 3 (credits), then Funnel 1 (resume), then Funnel 2 (auto apply).

## Structure

- `src/features/funnel/`
  - `funnel-shell.tsx`: full-screen frame with a pinned header (logo, close, step count), a progress bar, a scrolling body and a pinned footer (Back, Continue).
  - `funnel-question.tsx`: one question per page, as single choice cards, choice pills, a text field or a file drop.
  - `funnel-working.tsx`: the analysing screen, showing the named checks as they complete.
  - `funnel-gate.tsx`: the sign-up gate that explains what is waiting behind it.
- Three pure views, each exporting its props type:
  - `funnel-credits-view.tsx`
  - `funnel-resume-view.tsx`
  - `funnel-auto-apply-view.tsx`
- Pages `src/apps/web/pages/try-{credits,resume,auto-apply}-page.tsx` own the mock data, navigation and local state.
- The current step lives in the URL (`?step=<id>`), so Back works, a refresh resumes at the same step, and each step is trackable.
- Draft types go in `src/contracts/funnel.draft.ts` and are flagged in `CONTRACT-REQUESTS.md`:
  - `AtsReport` { score, issues[] { id, label, detail, severity } }
  - `ResumeRewrite` { before, after, scoreAfter }
  - `FunnelJobMatch` { id, title, company, location, salaryRange, matchScore, reasons[] }
  - `FunnelAnswers`

## Funnel 3: Credits (`/v3/try/credits`)

1. The landing-page quiz (`TryItNow`) moves here. Its "Set me up" button on the landing card carries the posting and resume into step 1, so only one version of the quiz exists.
2. Six quiz questions, as today.
3. Reward reveal: "You've unlocked 500 credits", shown as a balance card. This is not a game of chance.
4. Card screen:
   - "$0 today" leads the screen.
   - Terms line: "7-day free trial, then Pro at $40 for your first month and $99/month after. Cancel anytime."
   - "We'll email you 2 days before your first charge."
   - The card fields are layout only; production replaces them with Stripe Elements.
   - If the user is anonymous, account creation (email or Google) comes before the card.
5. Confirmation: 500 credits added, the trial end date, and "Start with your setup" into the app.

## Funnel 1: Resume (`/v3/try/resume`)

1. Entry: upload a resume (PDF, DOC, DOCX or TXT, up to 5 MB), and optionally paste a job description. Copy: "Free to score. Create an account to download."
2. Working screen: parsing sections, checking keywords against the job, checking formatting.
3. ATS score card:
   - score out of 100, shown as a number with a label, not by colour alone
   - 3 to 5 named issues, for example "No results in 4 of 6 bullets" or "Missing 'stakeholder management' from the job description"
4. Before/after:
   - one resume page with a drag handle that reveals the Jobwhisper version
   - the score climbs from before to after as you drag
   - the handle is a slider with arrow-key support and `aria-valuetext`
5. "Download my resume" opens the gate: "Your tailored resume is saved. Create a free account to download it." After sign-up, the user lands in the Resume Builder editor with this resume.

## Funnel 2: Auto Apply (`/v3/try/auto-apply`)

1. Entry copy: "See the jobs we'd apply to for you. Free to match, sign up to apply."
2. Ten one-per-page questions:
   1. resume
   2. target role
   3. experience level
   4. salary range
   5. location
   6. job type
   7. work mode
   8. start date
   9. work authorization
   10. sponsorship needed
   Personal details (address, phone, demographics, references, clearance, background) are not asked here. The real flow asks them after sign-up.
3. Working screen: Scout finds jobs, Filter ranks them, Tailor prepares resumes.
4. Results: 8 to 12 matched jobs with match score and reasons. Each opens a detail view.
5. "Apply" on a job, or "Apply to all 12", opens the gate: "Sign up and your agent applies to these for you." After sign-up, the answers pre-fill the real Auto Apply flow.

## States (every funnel)

- Working/loading: layout-matched skeletons, then the working screen.
- Upload error: wrong type, too large, or unreadable, with a retry and the fix stated.
- Offline: answers are kept, Continue is disabled, and a banner says what returns with connection.
- Already signed in: the gate is skipped and the action runs directly.
- Session expired at the gate: the user signs in again and returns to the same step.
- Funnel 3 only: card declined, with the reason and a way to try another card.
- Funnel 2 only: no matches, suggesting which answers to widen.
- Dense content: long job titles, 12 matches, and long resume sections all truncate or scroll inside the shell.

## Tracking hooks

Pages expose callbacks named for the tracking plan events. The production team attaches `track()` to them:

- `funnel_started`, `funnel_step_viewed`, `funnel_step_completed`
- `ats_score_viewed`, `before_after_dragged`
- `jobs_matched`
- `gate_viewed`, `gate_converted`
- `credits_reward_viewed`, `trial_started`

## Boundaries

- Tokens only. Brand fonts: Gowun Batang and Rethink Sans. Follow `DESIGN-CLICHES.md`.
- Header and footer stay pinned and only the body scrolls. Long input is split into steps.
- All targets are at least 44 px, keyboard-complete, with a visible focus ring, and `Esc` closes the shell.
- Layout works at 360 px, at 200% zoom, and in RTL (logical properties). Motion respects reduced-motion.

## Verification

- Component tests for each view cover every state and the gate destinations.
- Add rows to `MANIFEST.md` and a section to `FLOWS.md` for each funnel. Add the `/` review index entries.
- Visually check each funnel at 360 px and desktop, in light and dark themes.
- The full test suite and production build pass.
