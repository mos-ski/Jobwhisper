# Copilot role step becomes a multi-title picker

Date: 2026-10-01
Status: implemented

## Problem

The copilot funnel's role step (`/v3/try/copilot?step=role`) is a single text input
with six static suggestion pills: one title only, and picking a suggestion replaces
whatever was typed. The approved Figma for the auto-apply quiz's job-titles question
shows the better pattern — a multi-value picker, up to five titles, selected titles as
chips, suggestions that add rather than replace — but that pattern has never been
built; the quiz's live `TextAnswer` is single-value too despite its
"Add up to 5 job titles" placeholder.

## Decisions (from user review)

- **Scope:** the copilot role step only. The auto-apply quiz keeps its current
  single-value behavior; extracting a shared primitive waits until it has a second
  consumer.
- **Heading:** take the Figma heading exactly — "Tell us what job title(s) you have
  in mind." — replacing "What role are you looking to ace?".
- **Approach A:** self-contained rewrite of `RoleStep`, honest array data shape at the
  page boundary (not a comma-joined string parsed inside the view, not a new `ui/`
  primitive).

## Interaction

Render order follows the Figma image, using the funnel's existing visual system:

1. **h1** — "Tell us what job title(s) you have in mind." (keeps the `font-gowun`
   display styling and `copilot-role-title` id).
2. **Input** — placeholder "Add up to 5 job titles", left-aligned text. Accessible
   name from an `sr-only` `<label>`: "Job titles".
3. **Selected chips** — one chip per accepted title, wrapping row below the input.
   Each has an × remove button with `aria-label="Remove <title>"`.
4. **Note** — "Select more job titles to get more results." (muted, centered),
   between the chips and the suggestions.
5. **Suggestion chips** — the existing six `ROLE_SUGGESTIONS`, now toggle buttons:
   - unselected: shows an `aria-hidden` `+` icon, so the accessible name stays the
     bare title (tests and screen readers see "Product Manager", not "Product
     Manager +");
   - selected: pressed accent styling (`aria-pressed=true`); clicking again removes
     it — the same action as the chip's ×.
6. **Continue** — `type="button"`, enabled at ≥1 selected title, disabled styling
   unchanged. It is no longer the form submitter.
7. **PrivacyNote** — unchanged.

Add rules:

- Enter or comma in the input commits the draft as a title; the draft is trimmed,
  deduplicated case-insensitively against existing titles, and rejected silently when
  empty.
- The form's submit handler only `preventDefault`s — Enter in the input can add a
  title but can never advance the step; advancing happens only through Continue.
- Cap is 5: at five titles the input and the unselected suggestion chips disable
  (selected chips stay clickable so a title can be swapped out; the cap is never
  reachable as an error state — the input is already disabled).

## Data and wiring

- `FunnelCopilotViewProps`: `role: string` + `onRoleChange: (role: string) => void`
  become `titles: readonly string[]` + `onTitlesChange: (titles: readonly string[]) =>
  void`. `onRoleContinue`, steps, and every other prop stay as they are (role has no
  other consumer anywhere in the funnel).
- `try-copilot-page.tsx` holds `titles` state, initialized with
  `params.getAll('role')` (each entry kept as-is, sliced to 5).
- URL: repeated params — `?role=Product%20Manager&role=Data%20Analyst`
  (`search.append('role', title)` per title inside `go()`, omitted when the array is
  empty). Today's single `?role=…` deep links keep working unchanged; no delimiter
  ambiguity for titles that contain commas; back/forward restores the full set.

## States covered

| State | Behavior |
| --- | --- |
| Empty | no chips, Continue disabled |
| Few items (1–4) | chips wrap, Continue enabled, suggestions toggle |
| Full (5) | input disabled, unselected suggestions disabled, selected chips removable, Continue enabled |
| Deep-link prefill | `?role=` values render as chips on load |
| Duplicate entry | silently ignored (case-insensitive) |
| Over cap | unreachable — input disables at five |
| Keyboard only | Enter adds, chip × and suggestion toggles are focusable buttons, visible focus rings throughout |
| Reduced motion | only `transition-colors`/`duration-fast` already used by chips apply |

No loading, error, permission, or credit states apply: this step does no I/O.

## Tests

- `funnel-copilot-view.test.tsx` — new props shape; empty state (Continue disabled);
  add via suggestion and via typed Enter; remove via ×; dedupe; typed comma add;
  cap-5 disables the input and fresh suggestions while selected chips stay enabled.
- `try-copilot-flow.test.tsx` — heading assertion updates to "Tell us what job
  title(s) you have in mind."; the walk-through adds a title (suggestion chip) and
  presses Continue; accessible names of suggestion buttons remain bare titles.

## Docs

- `FLOWS.md` — new "Try-It Funnel: Copilot" section (none existed); step 2 covers
  the multi-title entry/exit and the no-error cap behavior.
- `src/apps/web/MANIFEST.md` — role-step row states column updated if it mentions
  single-role.
- This spec is the design record (Revision history: none — written post-approval).

## Out of scope

- Making the auto-apply quiz's `TextAnswer` truly multi-value (its own Figma promise).
- A shared `ui/` chip-input primitive.
- Combobox/filter-as-you-type suggestions (the Figma shows static suggestion chips;
  typing any custom title already works).
- Surfacing selected titles anywhere downstream (the funnel has no consumer yet).
