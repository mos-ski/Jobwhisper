# Lightforth UI Studio - Agent Brief

You are building the complete UI, design system and screen flows for Lightforth as a standalone web app. A separate engineering team will port every screen you produce into a production Nx monorepo.

**Your design decisions win.** Colors, type, spacing, motion, component look and feel, layout - all yours. The production repo currently has placeholder values that will be deleted and replaced with yours.

**Their structure wins.** Everything below about folders, naming, layering, data shapes and state coverage is non-negotiable, because porting has to be a file move, not a rewrite.

Read this entire brief before writing code. When a rule below conflicts with a habit or a scaffold default, the rule wins.

Before adjusting Lightforth copy, screens, flows, product education, help-center content, marketing pages, emails, onboarding, tests, or user-facing product behavior, read `docs/LIGHTFORTH_END_TO_END_SMARTER_SCRIPT.md`. Treat it as the living end-to-end product script and update it when the product story or flow changes.

---

## 1. Stack

- React 19 + TypeScript (strict) + Vite + Tailwind CSS v4.
- Headless primitives only for behavior (Base UI, RadixArk). No opinionated component kits that ship their own theme.
- Icons: one library, one import style.
- **No `any`.** No `@ts-ignore`. No `as unknown as`.

If you use Next.js, App Router or any meta-framework, then `src/ui/**` and `src/features/**` must remain framework-free: no `next/link`, `next/image`, `next/navigation`, `next/font`, no `"use server"`, no server components, no `process.env`, no data fetching. Framework code lives only in `src/apps/*/`.

**Dependencies:** every runtime dependency you add must be listed in `DEPENDENCIES.md` with one line of justification. Do not add a library for something ~30 lines of code or a native platform feature can do (`<dialog>`, `<details>`, `<input type="date">`, `popover`, CSS `@starting-style`, view transitions, container queries, `:has()`).

---

## 2. Folder Layout - Mirror This Exactly

```text
src/
  tokens/
    theme.css              # the ONLY file allowed to contain raw color values
    tokens.ts              # same values as TS constants (numbers/strings, no CSS)
  ui/                      # design system primitives - app-agnostic, domain-free
    button.tsx
    card.tsx
    ...
    index.ts               # barrel: every public component re-exported
  contracts/               # copied verbatim from Section 5. DO NOT EDIT.
    identity.ts
    billing.ts
    copilot.ts
  mocks/                   # fixture data, typed against contracts/
    sessions.ts
    billing.ts
    resume.ts
    ...
  features/                # domain views - composed from ui/, typed by contracts/
    identity/
    resume/
    interview/
    auto-apply/
    copilot/
    billing/
    admin/
  apps/                    # one folder per production target
    web/
      routes.tsx
      shell.tsx
      pages/
      MANIFEST.md
    admin/
    marketing/
    status/
    docs/
    desktop/
    mobile/
    extension/
```

### Import Rules

These are enforced by review. Violating these is what makes porting expensive.

| Layer | May import | Must never import |
| --- | --- | --- |
| `tokens/` | nothing | anything |
| `ui/` | `tokens/`, `ui/` | `features/`, `apps/`, `contracts/`, `mocks/` |
| `contracts/` | `contracts/` | everything else |
| `mocks/` | `contracts/` | `ui/`, `features/`, `apps/` |
| `features/` | `ui/`, `contracts/`, `tokens/` | `apps/`, `mocks/` |
| `apps/<a>/` | `ui/`, `features/`, `contracts/`, `mocks/` | any other `apps/<b>/` |

`ui/` component files must not contain a domain word: resume, interview, credit, apply, copilot, plan, candidate. If a component needs one, it belongs in `features/`.

`apps/*` never imports another `apps/*`. If two apps need the same screen part, it moves to `features/` or `ui/`.

---

## 3. Tokens - Your Values, Their Names

Define your entire palette once in `src/tokens/theme.css`. **These semantic names are fixed. The values are yours.**

Required color roles, light and dark both complete:

```text
canvas  surface  surface-raised  surface-subtle
ink  ink-muted
border  input  muted
accent  accent-hover  accent-subtle  accent-text  on-accent
focus
positive  positive-surface
warning  warning-surface
danger  danger-hover  danger-surface  on-danger
overlay
```

Plus scales for `radius-*`, `shadow-*`, `z-index-*`, and a font stack.

You may **add** roles, for example `info`, `surface-inverse`, `accent-muted`. Every added role must be defined in light **and** dark, and documented in `TOKENS.md` with what it means semantically, not what it looks like. You may not rename or drop the roles above.

Shape it like this so the file transplants whole:

```css
@theme {
  --color-canvas: var(--lf-canvas);
  --color-ink: var(--lf-ink);
  /* ...one mapping per role... */
}

@layer base {
  :root,
  [data-theme='light'] {
    color-scheme: light;
    --lf-canvas: <yours>;
    /* ... */
  }

  [data-theme='dark'] {
    color-scheme: dark;
    --lf-canvas: <yours>;
    /* ... */
  }

  @media (prefers-color-scheme: dark) {
    :root:not([data-theme]) {
      color-scheme: dark;
      --lf-canvas: <yours>;
      /* ... */
    }
  }
}
```

Theme switching is `data-theme` on `<html>`, three states: `light`, `dark`, absent = follow system. Ship a no-flash inline theme bootstrap script.

### The Hard Rule

Outside `src/tokens/theme.css` and `src/tokens/tokens.ts`, **no file may contain**:

- a hex color (`#0494fc`), or `rgb(`, `rgba(`, `hsl(`, `oklch(`, `lab(`, `color(`
- a CSS named color in a color property (`color: white`, `background: black`)
- a Tailwind palette utility (`bg-blue-500`, `text-slate-600`, `border-gray-200`, `ring-emerald-400`, `from-sky-300`, and similar)

Use `bg-surface`, `text-ink-muted`, `border-border`, `ring-focus` instead. This is checked by an automated script in the production repo. Every violation is manual rework at port time. Assume it is a build failure.

Same rule for spacing and radius: use Tailwind scale utilities or your tokens, never arbitrary one-off values like `p-[13px]` unless there is a real reason.

---

## 4. Component Rules

### `src/ui/*` Primitives

- Pure. No data fetching, no router, no global state, no `localStorage`, no timers outside `useEffect` cleanup, no side effects on mount other than measurement.
- Props in, JSX out. Everything configurable is a prop with a documented default.
- Accept and merge `className` **last**. Use `clsx` + `tailwind-merge`, exported as `cn`.
- Spread remaining props onto the root element so consumers can pass `id`, `aria-*`, `data-*`, event handlers.
- Add `data-slot="<name>"` and `data-variant` / `data-size` attributes to root elements. Cheap to write, invaluable for E2E tests.
- Named exports only. No default exports in `ui/`.
- One component family per file, kebab-case filename. Example: `alert-dialog.tsx` exports `AlertDialog`, `AlertDialogTitle`, and related components.
- Export the prop types too: `export type ButtonProps = ...`.
- Variants as a typed record, not conditional string soup:

```tsx
const variants: Record<ButtonVariant, string> = { primary: '...', ghost: '...' };
```

### `src/features/*` Views

- Every view is a **pure presentational component**: it receives all data and all callbacks as props. No fetching, no mock imports, no global stores, no router hooks inside the view.
- Each view file exports the component **and** its props type: `export type ResumeListViewProps = { ... }`.
- Wiring, including mock data to props, navigation, and local page state, happens only in `src/apps/<app>/pages/*`.

This split is the single most important thing you can do for portability. A view that reaches for its own data has to be rewritten. A view that takes props gets moved.

**State:** local `useState` / `useReducer` only. No Redux, Zustand, Jotai, MobX, no global event bus, no context except theme and a shell-level layout context. Shareable state such as filters, tabs, steps, and ids belongs in the URL. Model it as props named like URL params so the real router can wire it.

---

## 5. Data Contracts

Copy these verbatim. Do not edit. These types already exist in production. Type every mock and every view prop against them. Do not invent parallel shapes such as `user.isPro`, `credits: number` on the user, or `isLoggedIn: boolean`. If you believe a field is missing, **add a note in `CONTRACT-REQUESTS.md`**. Do not change the type.

Create `src/contracts/identity.ts`:

```ts
export type Role = 'candidate' | 'support' | 'admin';

export type Permission =
  | 'app:view'
  | 'resume:read'
  | 'resume:write'
  | 'interview:use'
  | 'auto-apply:use'
  | 'copilot:use'
  | 'billing:view'
  | 'admin:view'
  | 'admin:users:manage'
  | 'admin:credits:manage'
  | 'admin:services:manage';

export interface UserIdentity {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly role: Role;
  readonly permissions: readonly Permission[];
}

export type Session =
  | { readonly status: 'checking' }
  | { readonly status: 'anonymous' }
  | { readonly status: 'authenticated'; readonly user: UserIdentity };
```

Create `src/contracts/billing.ts`:

```ts
export type Plan = 'free' | 'pro' | 'business';

export type BillableFeature =
  | 'resume'
  | 'interview-prep'
  | 'auto-apply'
  | 'copilot';

export type CreditWallet = {
  readonly balance: number;
  readonly currency: 'credits';
  readonly reserved: number;
};

export type FeatureAccess = {
  readonly feature: BillableFeature;
  readonly entitled: boolean;
  readonly creditCost: number;
};

export type BillingSnapshot =
  | { readonly status: 'unavailable' }
  | { readonly status: 'loading' }
  | {
      readonly status: 'ready';
      readonly plan: Plan;
      readonly wallet: CreditWallet;
      readonly access: Readonly<Record<BillableFeature, FeatureAccess>>;
    };
```

Create `src/contracts/copilot.ts`:

```ts
export type CopilotAccessBlockReason =
  | 'unauthenticated'
  | 'missing-permission'
  | 'billing-unavailable'
  | 'not-entitled'
  | 'insufficient-credits';

export type CopilotAccess =
  | { readonly allowed: true; readonly creditCost: number }
  | { readonly allowed: false; readonly reason: CopilotAccessBlockReason };
```

These are **discriminated unions with a `status` field**. Design screens around that: a screen renders off `session.status` and `billing.status`, so it must have a real design for `checking`, `anonymous`, `loading` and `unavailable`, not just the happy path.

For domains without contracts yet, such as resume documents, interview sessions, job applications, and admin records, define your own types in `src/contracts/<domain>.draft.ts`. Keep them flat and serializable: no `Date` objects, no class instances, no functions. Flag them in `CONTRACT-REQUESTS.md`. These become the input to the real backend contract, so be deliberate about field names.

---

## 6. Every State, Every Screen

For each screen, design and export a variant for every state that applies:

1. **Loading** - skeletons that match the real layout, not a centered spinner.
2. **Empty** - first-run, with the action that fills it.
3. **Partial / few items** - one item, three items.
4. **Full / dense** - long names, long lists, overflow, truncation, 100+ rows.
5. **Error** - recoverable, with a retry affordance.
6. **Offline** - what degrades, what still works.
7. **Permission denied** - `missing-permission`.
8. **Not entitled** - plan does not include the feature.
9. **Insufficient credits** - entitled but wallet too low; show the cost and the top-up path.
10. **Unauthenticated / session expired mid-flow.**

Missing state designs are the number-one cause of ported screens getting rewritten. A screen delivered happy-path-only is not delivered.

Also cover: mobile 360px, tablet, desktop, ultrawide; light and dark; RTL-safe layout with logical properties such as `ps-4` instead of `pl-4` where it matters; `prefers-reduced-motion`; 200% browser zoom without loss of content.

---

## 7. Accessibility - Not Optional

- WCAG 2.2 AA contrast for every token pair you invent, in both themes. Verify it; do not eyeball it.
- Semantic HTML: `<button>` for actions, `<a>` for navigation, real `<form>`, real `<table>` for tabular data, one `<h1>` per page, ordered headings.
- Keyboard-complete: every interaction reachable and operable, logical tab order, visible focus ring on every focusable element using `ring-focus`, focus trap + restore in dialogs, `Esc` closes.
- Never encode meaning in color alone. Pair with text, icon or shape.
- Interactive targets >= 44 x 44 CSS px.
- Label every input. Errors announced with `aria-live`, tied to the field, and describing the fix.
- Icon-only buttons require `aria-label`. Make it a required prop in the type system.

---

## 8. Per-App Portability Notes

These apps have different runtimes in production. Design accordingly.

| Your folder | Production runtime | What this means for you |
| --- | --- | --- |
| `apps/web` | React + Vite | Direct port. Build this one first and most completely. |
| `apps/admin` | React + Vite | Direct port. Dense data tables, bulk actions, audit trails, destructive-action confirmations. |
| `apps/desktop` | React + Vite + Electron | Direct port. Assume a small always-on-top window, approximately 380-520px wide, plus a normal window. No browser-chrome assumptions. |
| `apps/marketing` | Astro | Static-first. Zero client JS by default. Any interactive part goes in its own file named `*.island.tsx` and stays small and leaf-level. |
| `apps/status` | Astro | Same island rule. Must read correctly with no JS at all. |
| `apps/docs` | Astro | Same island rule. Content-first typography, long-form reading, code blocks, deep nav. |
| `apps/mobile` | Expo / React Native | **No CSS grid, no `position: sticky`, no hover-only affordances, no `:has()`, no pseudo-elements carrying meaning.** Flex layouts, explicit spacing, touch-first, thumb-reachable primary actions. Use `tokens.ts` values, not CSS classes, in anything mobile-specific. |
| `apps/extension` | Manifest V3 browser ext | Tiny surfaces: popup <= 400 x 600, side panel, injected overlay. No external fonts or network assets. Must survive arbitrary host-page CSS. |

Hover states must always have a non-hover equivalent: focus, or a persistent affordance. Anything that only exists on hover does not exist on touch.

---

## 9. Required Deliverables

1. **The running app** - a route index at `/` linking to every screen and every state variant, grouped by target app. This is the review surface; make it complete.
2. **`src/ui/index.ts`** - barrel exporting every public component and prop type.
3. **`TOKENS.md`** - every token, its semantic meaning, and the light/dark values.
4. **`apps/<app>/MANIFEST.md`** - one row per screen:

| Route | View file | Props type | States covered | Notes |
| --- | --- | --- | --- | --- |

5. **`DEPENDENCIES.md`** - every runtime dependency with a one-line justification.
6. **`CONTRACT-REQUESTS.md`** - every field you needed that the contracts do not have, and every draft type you invented, with why.
7. **`FLOWS.md`** - the multi-screen journeys as ordered step lists: onboarding, auth, resume build -> tailor -> export, interview prep -> session -> review, auto-apply setup -> review -> track, copilot pre-flight -> live -> summary, upgrade / top-up, admin credit adjustment. For each step: entry condition, exit condition, failure branch.
8. **Storybook, strongly preferred** - one story file per `ui/` component and per feature view, with a story per state from Section 6. If you build this, the port is close to mechanical.

---

## 10. Hard Do Not List

- Do not fetch data, hit an API, or read `process.env` anywhere.
- Do not put anything in `localStorage`/`sessionStorage` except the theme preference.
- Do not add analytics, telemetry, session replay, or any third-party script.
- Do not use CSS-in-JS, styled-components, emotion, or inline `style` objects containing colors. Tailwind utilities + tokens only.
- Do not use a global state library.
- Do not create `common/`, `utils/`, `helpers/`, `shared/` grab-bag folders. Name things for what they are.
- Do not build abstraction layers, wrappers, factories, or config systems for things with exactly one use. Write the component.
- Do not leave commented-out code, unused exports, unused files, or two versions of the same component. Delete what you replaced.
- Do not write explanatory prose comments in code. Comment only non-obvious *why*.
- Do not use lorem ipsum. Use realistic job-search content - real-sounding resume bullets and interview questions - so layouts are tested against real text lengths.

---

## 11. Definition Of Done, Per Screen

- [ ] View is pure: all data and callbacks arrive as props, props type exported.
- [ ] Lives in the correct layer, imports obey Section 2.
- [ ] Zero raw colors and zero palette utilities outside `tokens/`.
- [ ] Typed against `contracts/` where a contract exists.
- [ ] All applicable states from Section 6 designed and rendered.
- [ ] Keyboard-complete, visible focus, labeled inputs, AA contrast in both themes.
- [ ] Works at 360px and at 200% zoom.
- [ ] Reduced-motion variant present if it animates.
- [ ] Listed in the app's `MANIFEST.md`.

---

## Why This Shape

The production repo enforces a strict layer flow (`app -> feature -> ui -> domain`), a token-only color policy, one folder per app with no cross-app imports, and fixed session and billing contracts. If this codebase has those same boundaries, porting is copying files and rewiring imports. If it does not, every screen is a rewrite and the design intent gets lost in translation.

Structure is the contract. Everything visual is yours.
