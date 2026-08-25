# Lightforth Mobile App — Click-Through Prototype Design

## Goal

Build a standalone, front-end-only prototype of the Lightforth mobile app so the user can click through the full end-to-end flow described in [docs/lightforth-mobile-app.md](../../lightforth-mobile-app.md) — Interview Copilot, Auto Apply, and Notifications — inside a phone-shaped frame in the browser. No backend, no auth, no real data. Purely a "see and click through the prototype" experience, mirroring the existing [DesktopCopilotPreview.tsx](../../../src/pages/DesktopCopilotPreview.tsx) pattern (mock data, simulated async states, self-contained page).

## Non-goals

- No real API calls, persistence, or auth — everything is mocked in local component state
- No notification delivery (push/email) — only the in-app UI for notification centre and preferences
- Not wired into the existing protected app shell (Sidebar/TopNav/AppLayout) — this is a separate, directly-navigable preview route, same as `/desktop-copilot-preview`

## Architecture

- **One new route**, e.g. `/mobile-app-preview`, added in [src/App.tsx](../../../src/App.tsx) outside `ProtectedRoute` (same treatment as `DesktopCopilotPreview`)
- **One new page file**, `src/pages/MobileAppPreview.tsx`, self-contained: mock data constants, a `PhoneFrame` wrapper component, and a top-level state machine driving which screen renders
- Reuses existing infra: Tailwind tokens, shadcn/ui primitives, `lucide-react` icons, Framer Motion for screen transitions, `cn` utility — same toolbox as the rest of the app and the desktop preview
- All async behaviour (e.g. "Processing…", "Applying…") simulated with `setTimeout`/`setInterval`, following the `MOCK_QA` cycling pattern already used in `DesktopCopilotPreview`

## Phone frame

A `PhoneFrame` component renders a centred device mockup (rounded rectangle, notch/dynamic-island cutout, side buttons, home indicator bar) at a fixed mobile viewport size (e.g. 390×844, iPhone-class). All app content renders inside this frame's screen area with its own internal scrolling — the surrounding page background is a neutral gradient, similar to how `MacWindow` centres the desktop preview.

## Navigation shell

A bottom tab bar inside the phone frame ties the three modules together:

| Tab | Icon | Destination |
|---|---|---|
| Home | house | Dashboard summary: credit balance, quick actions into Copilot/Auto Apply, recent activity |
| Jobs | briefcase | Auto Apply: feed → detail → apply → history |
| Copilot | sparkles/mic | Entry card → Copilot setup→live flow |
| Notifications | bell (with unread badge) | Notification centre → preferences |

Tapping a tab swaps the active module; each module keeps its own internal navigation stack (so going Home → Jobs → Job Detail → back returns to the Jobs feed, not Home). A simple top bar inside each screen provides back-navigation and section titles.

## Screen inventory & flow

### Module 1 — Interview Copilot (dark navy aesthetic, `#0c1d48` + blue glow, matching desktop preview's Copilot visual language)

1. **Onboarding/Permissions** — welcome explainer, mic/audio permission callouts, Continue button
2. **Session Setup** — job title (with quick-select chips), resume (upload new / use Lightforth resume, filename + remove), job description (optional, "Suggest for me" AI button), audio device picker with "Connected" confirmation, "Don't ask me again" checkbox
3. **Response Style modal** — Default / Headlines / Coaching, selectable cards
4. **Live Canvas** — status bar (network + Listening/Processing/Answering states cycling like `MOCK_QA`), response panel with green listening glow, bouncing processing dots, streaming answer text, settings popover with reset
5. **Session Complete** — confirmation + "Go Home" button (returns to Home tab)

### Module 2 — Auto Apply (light brand aesthetic, `#2563EB` blue, existing shadcn/ui look)

6. **Job Feed** — scrollable list of job cards matched to a mock profile (logo, title, company, location, match tag)
7. **Job Detail** — full posting + prominent one-tap **Apply** button
8. **Apply animation** — brief simulated "Applying…" → success state (auto-fills career profile/resume, per the brief)
9. **Apply History** — list of past applications with status badges (submitted / viewed / shortlisted / rejected / interview)
10. **Application Detail** — what was submitted + current status timeline

### Module 3 — Notifications

11. **Notification Centre** — bell icon entry point with unread badge; three grouped sections (Application Updates, Job Matches, Account & Credits) with timestamps, mark-as-read / clear-all, tap-through to relevant detail screens
12. **Notification Preferences** — granular toggles exactly as specified in the brief: Application Updates (push/email), Job Matches (push, frequency, email digest), Account & Credits (push), Quiet Hours (default 10pm–8am, custom range)

### Home (entry hub)

13. **Home/Dashboard** — credit balance card, "Start a Copilot session" and "Browse jobs" quick actions, snippet of recent activity/notifications — the natural landing screen and connective tissue between modules

## Interaction model

- Top-level `type ActiveTab = 'home' | 'jobs' | 'copilot' | 'notifications'` plus per-module view-state types (mirroring `DesktopView`/`CopilotStatus` in the existing preview)
- Framer Motion `AnimatePresence` for slide/fade transitions between screens within a module, and between tabs
- Mock data constants at the top of the file: job listings, applications w/ statuses, notifications w/ categories/timestamps, the Q&A cycling set (can reuse/adapt `MOCK_QA` and `MOCK_RESUMES` from the desktop preview for consistency)
- Deep "tap-through" links are simulated by switching both `activeTab` and the destination module's internal view (e.g. tapping a notification about an interview request switches to Copilot tab at the relevant screen)

## Testing / verification

This is a visual prototype — verification means running the dev server and clicking through every screen in the inventory above to confirm the flow is navigable end-to-end with no dead ends (every screen has a way forward and a way back to Home).
