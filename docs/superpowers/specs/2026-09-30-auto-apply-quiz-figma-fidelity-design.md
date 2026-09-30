# Auto Apply Quiz — Figma Fidelity Pass

Date: 2026-09-30
Source designs: Figma file `AQXk4ivy9vA7scCI9DgmQ3` (Jobwhisper 1.0), the 14 scraped questionnaire frames specced in `docs/superpowers/specs/2026-09-30-figma-quiz-questionnaire-specs.md`.
Scope: finish the `/v3/try/auto-apply` funnel so all 14 designs are covered, in Jobwhisper's own visual language (Approach A, approved).

## Decisions already made

- **Upload stays landing-only.** Design 7 (in-quiz "Upload your resume" card) is already covered by the landing dropzone; no mid-quiz upload step.
- **New loading screen is a staged run log (~10s)**, mirroring the resume analyzing screen, not a bare spinner.
- **Question screens keep our style**: pills/tiles, centered column, Jobwhisper tokens. Only missing *content* is added — no FlexJobs segment bar or orange CTAs.
- Screen 14 (FlexJobs results page) stays our branded matches step; no change.

## 1. Contract additions (`src/contracts/funnel.draft.ts`, draft)

- `FunnelQuestionBase` gains:
  - `note?: string` — lede under the heading, above the controls.
  - `banner?: string` — helper banner under the controls (icon + text; never color-only).
  - `cta?: string` — label for the footer's continue/finish button on this question.
- `multi` gains `collapsedCount?: number` — show the first N choices, then a "See More" / "Show less" toggle button.
- `text` gains:
  - `checks?: readonly string[]` — checkbox rows under the input.
  - `checksDefault?: boolean` — whether each check starts checked when the answer is empty.
  - Selection is stored in `FunnelAnswers` under `"<id>.checks"` as pipe-joined labels.
- `range` gains:
  - `unitToggle?: readonly [string, string]` — segmented toggle (e.g. Annually / Hourly); selection stored under `"<id>.unit"` (defaults to entry 0).
  - `skipLabel?: string` — link under the slider that clears the answer and advances.
- New draft type is filed in `CONTRACT-REQUESTS.md`.

## 2. Mock copy (`src/mocks/funnel.ts`)

| Question | Addition |
| --- | --- |
| workMode | `banner: 'Work-life balance! We get it.'` |
| salary | `unitToggle: ['Annually', 'Hourly']`, `skipLabel: 'Skip, I'm not sure yet'` |
| location | `checks: ['Include jobs where I can work from anywhere in the US', 'Include jobs where I can work from anywhere in the world']`, `checksDefault: true` |
| resumeStatus | `banner: 'Don't worry if your resume isn't ready yet. Even an incomplete resume can improve your job matches.'` |
| role | `note: 'Select more job titles to get more results.'` |
| categories | `note: 'No worries! We've got you covered.'`, `collapsedCount: 10`, full list (~36 categories; today's 8 plus the rest of the FlexJobs set, design order kept first) |
| education | `note: 'Select the best option and we'll find the best jobs for your education level.'` |
| benefits | `banner: 'Great benefits for a productive work life!'`, + `Family/Dependent Insurance`, `Paid Community Service Time`, `Health & Wellness Programs` (17 total), `cta: 'Find Your Next Remote Job!'` |

## 3. `FunnelQuestion` rendering

- `note` renders under `FunnelTitle`, muted, centered.
- `banner` renders under the controls as a `surface-subtle` row with a leading icon (CircleCheck) + text, `data-slot="funnel-question-banner"`.
- `multi`: slice to `collapsedCount` until the toggle is pressed; toggle is a real `<button>` with `aria-expanded`.
- `text`: checkbox rows below the form — `<label>` + `<input type="checkbox">`, min-h 44px, reading `value` from `"<id>.checks"` with `checksDefault` fill.
- `range`: segmented unit toggle (two buttons, `aria-pressed`) above the slider. Internally the answer stays whole annual dollars; when Hourly is selected the headline, slider value text and helper line show the annual ÷ 2080 equivalent as `$NNN/hr`. `skipLabel` renders as a centered link button: clears the answer and calls `onAutoAdvance`.
- Footer: the last button's label is `question.cta ?? (last ? 'Finish' : 'Continue')`.

## 4. New `searching` step

- `FunnelAutoApplyStep` gains `'searching'`; route `?step=searching`; `STEPS` array updated (fallback `upload`).
- Flow: last question → Continue → `go('searching')` (push) → run log → `onSearchComplete` → `go('matches', true)` (replace, so Back from matches returns to the last question).
- Copy: logo pill, `<h1>Finding the best remote & flexible jobs for you…</h1>`, then an `aria-live="polite"` mono `<ol>` of 8 conditional lines (each line appended only once its index is reached):
  1. `reading your answers…`
  2. `reading <file name>…` (or `reading your profile…` when no file — file always exists in this flow, so use the file name)
  3. `searching 12,480 open remote roles…`
  4. `scoring salary against your range…`
  5. `checking work style and location…`
  6. `ranking your experience and education…`
  7. `weighing your must-have benefits…`
  8. `shortlisting your best matches…`
- Timings (ms): `900, 1100, 1500, 1000, 900, 1000, 1200, 1600` = 9200 + `SEARCH_HOLD_MS = 800` → **10s total**.
- Below the log: 3-up stat row — `12,480` open roles · `1,930` companies hiring today · `3,478` job seekers matched.
- `prefers-reduced-motion`: all lines render immediately; same 10s timer.
- A `FunnelSearchingStep` component inside `funnel-auto-apply-view.tsx` owns the timer (`useEffect` + `setTimeout`, cleaned up), receiving `fileName`, `onSearchComplete`, and `online` (offline pauses the run and shows the existing offline notice — no auto-advance while offline).
- Shell: full-page like the resume analyzing screen (`flex w-full max-w-[560px] flex-1 flex-col items-center justify-center gap-6 py-14 text-center`), `data-slot="funnel-auto-apply-searching"`, not wrapped in the question footer.

## 5. Docs and tests

- `FLOWS.md` Try-It Auto Apply: insert step for `?step=searching` (entry: last question finished; exit: matches; failure: offline pauses), mention new ledes/banners and the final CTA.
- `src/apps/web/MANIFEST.md`: `/v3/try/auto-apply` row gains the searching state.
- `docs/LIGHTFORTH_END_TO_END_SMARTER_SCRIPT.md`: one-line update if it describes the quiz→matches transition.
- `CONTRACT-REQUESTS.md`: record the new draft fields.
- Tests:
  - `funnel-auto-apply-view.test.tsx` — banner/note render, See More expands (10 → all), location checkboxes default on and toggle, salary unit toggle switches display + skip clears and advances, benefits button reads `Find Your Next Remote Job!`, searching log: 0 lines at 0ms, 2 at 900ms, all 8 before hold, completes at 10000ms; reduced-motion shows all lines immediately.
  - `try-auto-apply-flow.test.tsx` — continue from last question lands on `step=searching`, advancing 10000ms lands on `step=matches` with history replace; direct link `?step=searching` renders the log.
- Verification: targeted vitest runs (funnel + auto-apply flow), `tsc -p tsconfig.app.json --noEmit` (no *new* errors), headless DOM/screenshot spot-check, then commit + push.
