# Desktop App — Screen Manifest

One row per screen in the prototype. Params are the review affordances; production routes the same state through its own router.

| Route | View file | Props type | States covered | Notes |
| --- | --- | --- | --- | --- |
| `/desktop` | `src/features/desktop/desktop-sign-in-view.tsx` | `DesktopSignInViewProps` | Default | Movable window chrome; sign in enters the app at permissions. |
| `/desktop/permissions` | `src/features/desktop/desktop-permissions-view.tsx` | (none) | Default | Screen + microphone permission steps. |
| `/desktop/home` | `src/features/desktop/desktop-home-view.tsx` | `DesktopHomeViewProps` | `?state=loading`, `error`, `empty`, ready (few/many rows); dark; 360px | Launch cards, recent sessions (each row resumes that session), credits card with Top up + Manage; calendar prompt dismissible. |
| `/desktop/configure?kind=interview` | `src/features/desktop/desktop-configure-view.tsx` | `DesktopConfigureViewProps` | Step 1/2, `kind=coding|meeting`, `?state=lowcredits` (<1 hr warning on Start), resume attached/removed | Start without setup jumps straight to a session; low-credit dialog branches to Top up or Start anyway. |
| `/desktop/session?kind=interview` | `src/features/desktop/desktop-session-view.tsx` | `DesktopSessionViewProps` | `?state=empty` (no transcript/chat), ready (dense transcript), `&connection=fair|unstable`, `&resume=1` banner, loading skeleton, mic popover open, screenshot chip attached | Scroll pauses on hover/focus/tap with a row shade + Jump to latest; stealth forced on entry; external mic picker; camera attaches a screenshot chip to the AI chat (sent messages clear it). |
| `/desktop/overlay` | `src/features/desktop/desktop-overlay-view.tsx` | `DesktopOverlayViewProps` | Answer present / listening (dismissed), `?connection=unstable`, `appearance=solid|clear` | Mini reply window follows Settings → Window appearance; clear adds backdrop blur over the call. |
| `/desktop/complete?kind=interview` | `src/features/desktop/desktop-complete-view.tsx` | `DesktopCompleteViewProps` | Feedback selectable | Completion screen with session feedback. |
| `/desktop/home?settings=<section>` | `src/features/desktop/desktop-settings-dialog.tsx` | `DesktopSettingsDialogProps` | Nine sections; theme system/light/dark; appearance solid/clear; stealth on/off; mic source picked | Add credits opens `?topup=1` in-app; What's new swaps `settings` for `whatsnew`. |
| `/desktop/home?whatsnew=1` | `src/features/desktop/desktop-whats-new-dialog.tsx` | `DesktopWhatsNewDialogProps` | Open/closed | Release note v1.0.14; bell dot clears when the dialog opens. |
| `/desktop/home?topup=1` | `src/features/billing/add-credits-dialog.tsx` | `AddCreditsDialogProps` | Idle, processing, success, custom amount, below-minimum error | Same dialog as web billing; purchase raises the live wallet balance. |
| (chrome) | `src/features/desktop/desktop-header.tsx` | `DesktopHeaderProps` | Notifications dot on/off, stealth on/off | Bell opens What's new; avatar menu carries Settings, What's new, Log out. |
