# Jobwhisper Browser Extension — Popup UI Prototype Design

## Goal

Build a real, loadable Manifest V3 browser extension popup for Jobwhisper — sign-in screen plus a three-tab popup (Run / Jobs / Applications) — as a new "production target" alongside the existing web app, following the same pattern already stated on the review surface: *"Portable React screens grouped by production target. Each flow is built as app wiring plus pure feature views."* Front-end-only, mock data throughout, no real job-board automation — matches how the rest of this codebase works today.

## Non-goals

- No real content scripts that detect, read, or fill forms on Indeed/Glassdoor/Workable/LinkedIn — "Start AutoApply" / "Connect to Jobwhisper" only flip local mock state.
- No real authentication — the sign-in screen accepts any input and transitions to the signed-in shell after a simulated delay, same convention as the rest of the app's mocked auth flows.
- No background service worker doing real work (badge counts, alarms, cross-tab messaging) — a minimal MV3 background script only if the manifest requires one to be valid; no real logic in it.
- Not published to a store or code-signed — this is a locally loadable unpacked extension for demo/review purposes.

## Architecture

- **New app target**: `src/apps/extension/`, mirroring the existing `src/apps/web/` structure (wiring + pages that consume the same shared `src/features/*` and `src/ui/*` as the web app).
- **New Vite build**: `vite.extension.config.ts`, separate from the main `vite.config.ts`, with its own entry (`src/apps/extension/popup.html` → `src/apps/extension/main.tsx`) and output directory (`dist-extension/`). Reuses the same `@` alias, React plugin, and Tailwind setup as the main config — no new bundler, just a second entry point.
- **`public/extension/manifest.json`** (Manifest V3): `action.default_popup` pointing at the built popup HTML, `action.default_icon` using the real Jobwhisper icon assets from `public/Jobwhisper/Icon.svg` (rasterized to the required PNG sizes — 16/48/128 — since MV3 icons can't be raw SVG), and a minimal `background.service_worker` stub only if MV3 requires the key to be present for the popup to load standalone.
- **Popup dimensions**: fixed-width container (~360–375px, matching the reference screenshots and typical extension-popup conventions), full design-system dark theme (reusing `text-brand-mark`, `bg-surface`, etc. — no new tokens).
- Loadable for real via `chrome://extensions` → Developer mode → Load unpacked → `dist-extension/`.

## Data

Reuses existing Auto-Apply contracts and mocks — no parallel dataset:

- **Jobs tab** → `autoApplyJobs` (`src/mocks/auto-apply.ts`), same `AutoApplyJob[]` shown on `/v3/auto-apply/jobs` in the main app.
- **Applications tab** → derived as `autoApplyJobs.filter(job => job.status === 'applied')` — the same underlying list, not a separate array, since `AutoApplyJob` already carries `status` and `outcome`.
- **Run tab** needs one new, extension-only type (nothing in the current contracts covers "which job boards is this account connected to"):

```ts
// src/contracts/extension.draft.ts
export type ExtensionBoardState = 'start' | 'connect' | 'in-progress'

export type ExtensionJobBoard = {
  readonly id: string
  readonly name: string
  readonly state: ExtensionBoardState
}
```

Mock data (`src/mocks/extension.ts`) seeds four boards — Indeed, Glassdoor, Workable, LinkedIn — reproducing the three states shown in the reference screenshots (two `start`, one `connect`, one `in-progress`). Board icons come from `react-icons/si` (Simple Icons — already a dependency, already used for `SiGoogleplay` elsewhere) for Indeed/Glassdoor/LinkedIn; Workable falls back to a generic monogram chip if no matching icon exists in that set.

## Screen inventory

1. **Sign in** — Jobwhisper icon mark, "Sign in to Jobwhisper" heading, "This signs in the extension only. Your other devices stay as they are." helper line, email + password fields (password with show/hide toggle, matching `src/ui/text-field.tsx` conventions), Sign In button. On submit, a simulated delay (matching the existing `add-funds-dialog.tsx` `window.setTimeout` pattern for mocked async) transitions to the popup shell.
2. **Popup shell (header, shared across all three tabs)** — Jobwhisper wordmark/icon (real asset, not the placeholder from the reference mockup), credit balance pill, an expand-to-tab icon button, tab strip (Run / Jobs / Applications) with underline active-state matching `src/ui/tabs.tsx`.
3. **Run tab** — one row per `ExtensionJobBoard`: board icon + name on the left, a state-driven action on the right — solid "Start AutoApply" button (`state: 'start'`), outline "Connect to Jobwhisper" button (`state: 'connect'`), or a disabled "Application in progress" pill with a spinning icon (`state: 'in-progress'`). Clicking Start/Connect flips that row's local state (no real board integration).
4. **Jobs tab** — list of `autoApplyJobs`; **empty state** (no jobs matched yet — briefcase icon, "No matched jobs yet" / "Start a run and the scout will fill this in.") when the array is empty, **populated state** otherwise showing title/company/match rows, reusing the row treatment already built for `/v3/auto-apply/jobs`.
5. **Applications tab** — list of applied jobs (the filtered subset above); **empty state** (inbox icon, "Nothing applied for yet" / "Every attempt shows up here, including the ones that did not work.") and **populated state** with status/outcome per row.
6. **Footer** — "Extension" label (left) + "Sign out" action (right), matching the reference screenshots, returns to the sign-in screen.

## Interaction model

- Local state only: `signedIn: boolean`, `activeTab: 'run' | 'jobs' | 'applications'`, and a mutable copy of the board list (`useState(extensionJobBoards)`) so clicking Start/Connect updates that row without touching the shared mocks module.
- No routing library needed inside the popup — it's a single small view with tab-switch state, not a multi-page flow; keeps the extension bundle minimal.
- Populated vs. empty states are driven by whether the underlying mock arrays are non-empty, same convention as the web app's own loading/empty query-param states on `/v3/app`.

## Testing / verification

Front-end-only prototype — verification means:
1. `npm run build` against `vite.extension.config.ts` succeeds and produces a valid `dist-extension/` with `manifest.json` + popup assets.
2. Loading `dist-extension/` as an unpacked extension in Chrome actually shows the Jobwhisper icon in the toolbar and opens the popup on click.
3. Click through sign-in → Run (toggle a Start/Connect button) → Jobs → Applications → Sign out, confirming no dead ends and that the real Jobwhisper mark (not the old placeholder) renders throughout.
