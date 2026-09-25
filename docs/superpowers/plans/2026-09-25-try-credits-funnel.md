# Try-It Funnel 3 (Credits) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

> **Revised 2026-09-25 after build:** the offer changed to a free week of Pro (see the spec). The route is `/v3/try/pro` and the view is `FunnelTrialView` in `funnel-trial-view.tsx`; credit fields left `FunnelTrialOffer` in favour of `includes`.

**Goal:** Build `/v3/try/credits`: the landing-page quiz as a full-screen funnel that reveals 500 credits and claims them with a card-backed Pro trial, plus the shared funnel kit that Funnels 1 and 2 will reuse.

**Architecture:** A shared `features/funnel/` kit (`FunnelShell`, `FunnelQuestion`) and a pure `FunnelCreditsView` driven entirely by props. `try-credits-page.tsx` owns the URL step (`?step=&q=`), answers, mock session and timers. The landing card keeps the posting and resume inputs, and its button hands off to the new route. The in-page quiz sheet is deleted so only one version of the quiz exists.

**Tech Stack:** React 18, TypeScript strict, Tailwind 3 with token colours, react-router-dom 7, lucide-react, Vitest + Testing Library.

Spec: `docs/superpowers/specs/2026-09-25-try-funnels-design.md`

## Global Constraints

- There are no raw colours or palette utilities outside `src/tokens/`. Use token classes only (`bg-surface`, `text-ink-muted`, `ring-focus`, and so on).
- Headings use `font-gowun`. Body text inherits Rethink Sans.
- Views are pure. They take no mocks, no router and no timers. Pages own wiring.
- Targets are at least 44 px (`min-h-11` / `size-11`), with a visible `focus-visible:ring-2 ring-focus`. `Esc` closes the shell.
- Use logical properties (`ms-`, `ps-`, `text-start`). Add `motion-reduce:` on any transition.
- Copy has no em dashes. Terms are stated before the card is asked for: "$0 today", the trial length, the first-month and ongoing price, and the reminder email.
- Commit messages follow the repo style (plain sentence, no prefix) and end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Baseline: 2 existing tests (`job-directory-view` preview, `landing-page` "renders the Figma…") time out under full parallel runs. Verify new work with targeted runs.

---

### Task 1: Funnel draft contract and mock content

**Files:**
- Create: `src/contracts/funnel.draft.ts`
- Create: `src/mocks/funnel.ts`
- Modify: `CONTRACT-REQUESTS.md` (append section)

**Interfaces:**
- Produces: `FunnelChoice`, `FunnelQuestion` (union on `kind: 'options' | 'pills' | 'text'`), `FunnelAnswers`, `FunnelTrialOffer`, `FunnelCardStatus`; mocks `creditsFunnelQuestions: readonly FunnelQuestion[]`, `creditsFunnelOffer: FunnelTrialOffer`.

- [ ] Write `funnel.draft.ts` with the types above. `FunnelTrialOffer` = { credits, creditsWorth, trialDays, planName, firstMonthUsd, monthlyUsd, reminderDaysBefore, firstChargeOn (ISO `YYYY-MM-DD`) }.
- [ ] Move the seven `QUIZ` entries from `landing-page.tsx` into `creditsFunnelQuestions`. Map `options` to `kind: 'options'` with `{ label, hint }`, `choices` to `kind: 'pills'`, and `field` to `kind: 'text'`. Offer: 500 credits, "About 500 minutes of Interview Copilot or practice", 7 days, Pro, $40, $99, 2 days, `2026-10-02`.
- [ ] Append a `funnel.draft.ts` entry to `CONTRACT-REQUESTS.md` explaining that each type is needed for anonymous funnels before a session exists.
- [ ] `npx tsc --noEmit -p tsconfig.app.json` passes, then commit.

### Task 2: Shared funnel kit

**Files:**
- Create: `src/features/funnel/funnel-shell.tsx`, `src/features/funnel/funnel-question.tsx`
- Test: `src/features/funnel/funnel-kit.test.tsx`

**Interfaces:**
- Produces: `FunnelShell({ label, progress /* 0..1 */, onClose, closeLabel?, notice?, footer?, children })`; `FunnelQuestion({ question, value, onChange })`.

- [ ] Write the failing tests:
  - The shell renders the label and a progressbar with the right `aria-valuenow`.
  - `Esc` and the close button call `onClose`.
  - Options render as radios named by the question. Choosing one calls `onChange(label)`.
  - Pills show a check on the selected choice.
  - The text kind is labelled by the question.
- [ ] Run `npx vitest run src/features/funnel/funnel-kit.test.tsx` and confirm it FAILS (module not found).
- [ ] Implement the shell as an `h-dvh` flex column:
  - pinned header (mark, label, close button, and a 1-unit progress bar)
  - optional notice
  - scrolling `main` that resets `scrollTop` when the label changes
  - pinned footer
- [ ] Implement the question as `fieldset` + native radios:
  - `has-[:checked]` for the selected style and `has-[:focus-visible]` for the ring
  - a check icon on selected pills, so selection isn't shown by colour alone
  - an autofocused text input
- [ ] Run the tests again and confirm they PASS, then commit.

### Task 3: FunnelCreditsView

**Files:**
- Create: `src/features/funnel/funnel-credits-view.tsx`
- Test: `src/features/funnel/funnel-credits-view.test.tsx`

**Interfaces:**
- Consumes: Task 1 types, Task 2 kit, `Session` from `@/contracts/identity`, `Button`, `FormField`, `GoogleAuthButton`, `FormDividerLabel` from `@/ui`.
- Produces: `type FunnelCreditsStep = 'quiz' | 'working' | 'reward' | 'account' | 'card' | 'done'`, and `FunnelCreditsViewProps`:
  - data: { step, questions, questionIndex, answers, offer, session, online, cardStatus, cardError?, resumeName? }
  - callbacks: { onAnswer(id, value), onBack, onContinue, onClose, onClaim, onCreateAccount(email), onGoogleSignUp, onSubmitCard, onStart }

- [ ] Write the failing tests:
  - quiz: Continue is disabled until the question is answered, and the "1 of 7" count shows
  - offline: a status notice appears and Continue is disabled
  - reward: shows "500 credits", the answer recap and "$0 today", and Claim calls `onClaim`
  - account: an invalid email shows an error tied to the field; a valid one calls `onCreateAccount`
  - card: terms show "$0 today", "7 days", "$40", "$99/month" and the "2 October 2026" date, and submit stays disabled until the fields are complete
  - declined: shows an alert with the reason
  - done: shows the credits and the trial end date, and Start calls `onStart`
- [ ] Run and confirm FAIL.
- [ ] Implement:
  - progress = quiz `(i+1)/(n+3)`, working/reward `(n+1)/(n+3)`, account/card `(n+2)/(n+3)`, done `1`
  - labels: question tab, "Setting up", "Your reward", "Your account", "Claim credits", "All set"
  - quiz footer: Back, count, Continue/Finish
  - card inputs use `autoComplete` `cc-name`, `cc-number`, `cc-exp` and `cc-csc`, and `inputMode="numeric"`
  - dates are formatted `en-GB` in UTC
- [ ] Run and confirm PASS, then commit.

### Task 4: Page, route, landing handoff, docs

**Files:**
- Create: `src/apps/web/pages/try-credits-page.tsx`
- Modify: `src/apps/web/routes.tsx` (import and `routePath === '/try/credits'`), `src/apps/web/pages/route-index-page.tsx` (new "Try-it funnels" section listing state variants), `src/apps/web/pages/landing-page.tsx` (TryItNow keeps inputs; button navigates with `state: { resumeName }`; delete `QUIZ`, sheet state and markup), `src/apps/web/pages/landing-page.css` (delete sheet-only `.landing-try-*` rules), `src/apps/web/MANIFEST.md`, `FLOWS.md`
- Test: `src/apps/web/try-credits-flow.test.tsx`

**Interfaces:**
- Consumes: Task 1 mocks, Task 3 view, `anonymousSession` / `candidateSession` from `@/mocks/sessions`.
- URL: `step`, `q`. Review variants: `session=signed-in`, `offline=1`, `card=declined`.

- [ ] Write the failing flow test. Render `WebRoutes` at `/v3/try/credits`, answer all seven questions, and use fake timers to pass the working step. Expect the reward, then the account step, then the card step. Also check that `?session=signed-in&step=reward` goes straight from Claim to the card step.
- [ ] Run and confirm FAIL.
- [ ] Implement the page:
  - `working` → `reward` after 1400 ms, with `replace`
  - card submit → `processing`, then after 1200 ms `declined` (if `card=declined`) or `done`
  - online state comes from `navigator.onLine` plus `online`/`offline` listeners, and is forced offline by `offline=1`
  - Close goes to `/`, and Start goes to `/v3/app`
- [ ] Update the landing page and CSS, the route index, MANIFEST and FLOWS.
- [ ] Run the targeted tests (`funnel`, `try-credits-flow`, `landing-page`), `npx tsc --noEmit -p tsconfig.app.json` and `npm run build`, then commit.
- [ ] Visually check it in the browser pane at 360 px and desktop, in light and dark.
