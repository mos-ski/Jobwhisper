# Lightforth Design Tokens

## Color Roles

All colors are defined in `src/tokens/theme.css` and `src/tokens/tokens.ts` with light and dark variants.

### Surface

| Token | Tailwind | Purpose |
|---|---|---|
| `canvas` | `bg-canvas` | Page background |
| `surface` | `bg-surface` | Card/panel surface |
| `surface-raised` | `bg-surface-raised` | Elevated surface (hover states) |
| `surface-subtle` | `bg-surface-subtle` | Subtle background (skeletons, placeholders) |
| `surface-inverse` | `bg-surface-inverse` | Dark-on-light inversions (tooltips, toasts) |

### Text

| Token | Tailwind | Purpose |
|---|---|---|
| `ink` | `text-ink` | Primary text |
| `ink-muted` | `text-ink-muted` | Secondary/muted text |

### Borders

| Token | Tailwind | Purpose |
|---|---|---|
| `border` | `border-border` | General borders |
| `input` | `border-input` | Input field borders |
| `muted` | `text-muted` | Disabled/muted text |

### Accent (Brand)

| Token | Tailwind | Purpose |
|---|---|---|
| `accent` | `bg-accent` | Primary brand color, buttons |
| `accent-hover` | `bg-accent-hover` | Accent hover state |
| `accent-subtle` | `bg-accent-subtle` | Subtle accent background |
| `accent-muted` | `bg-accent-muted` | Muted accent background |
| `accent-text` | `text-accent-text` | Accent for text links |
| `on-accent` | `text-on-accent` | Text on accent background |
| `focus` | `ring-focus` | Focus ring color |

### Status

| Token | Tailwind | Purpose |
|---|---|---|
| `positive` | `text-positive` | Success/good |
| `positive-surface` | `bg-positive-surface` | Success background |
| `warning` | `text-warning` | Warning text |
| `warning-surface` | `bg-warning-surface` | Warning background |
| `danger` | `text-danger` | Error/danger |
| `danger-hover` | `bg-danger-hover` | Danger hover state |
| `danger-surface` | `bg-danger-surface` | Danger background |
| `on-danger` | `text-on-danger` | Text on danger background |
| `info` | `text-info` | Informational |
| `info-surface` | `bg-info-surface` | Informational background |
| `accent-secondary` | `bg-accent-secondary` | Secondary decorative accent (violet) — used for feature-branded gradient tiles like Tutorial cards, never for interactive/semantic UI |
| `accent-tertiary` | `bg-accent-tertiary` | Third decorative accent (pink) — combines with `accent`/`accent-secondary` for the 3-stop AI-suggestion gradient (icon + text), never for interactive/semantic UI |
| `paper` | `bg-paper` | Fixed white "physical page" background for the resume canvas — same value in light and dark theme, since a printed document doesn't follow app chrome |
| `paper-ink` | `text-paper-ink` / `border-paper-ink` | Fixed near-black text/rule color for resume paper content — pairs with `paper`, never adapts to theme |
| `paper-muted` | `text-paper-muted` | Fixed muted gray for secondary resume paper text (contact line, dates) — pairs with `paper` |

### Overlay & Brand

| Token | Tailwind | Purpose |
|---|---|---|
| `overlay` | `bg-overlay` | Modal overlay |
| `brand-bar` | `bg-brand-bar` | Top navigation bar |
| `brand-bar-text` | `text-brand-bar-text` | Nav bar text |
| `brand-mark` | `text-brand-mark` | Logo mark color |
| `brand-mark-accent` | `text-brand-mark-accent` | Logo mark accent |

### Live Canvas (Interview/Copilot)

| Token | Tailwind | Purpose |
|---|---|---|
| `live-canvas` | `bg-live-canvas` | Live session background |
| `live-header` | `bg-live-header` | Live session header |
| `live-strip` | `bg-live-strip` | Live status strip |
| `live-panel` | `bg-live-panel` | Live session panel |
| `live-border` | `border-live-border` | Live session borders |
| `live-message` | `bg-live-message` | Chat message background |
| `live-scrim` | `bg-live-scrim` | Screen share scrim |
| `live-avatar-neutral` | `bg-live-avatar-neutral` | Neutral avatar tint |
| `live-avatar-warm` | `bg-live-avatar-warm` | Warm avatar tint |
| `live-workspace` | `bg-live-workspace` | Live workspace background |
| `live-divider` | `bg-live-divider` | Live session dividers |
| `live-panel-header` | `bg-live-panel-header` | Live panel header background |
| `live-control-border` | `border-live-control-border` | Live control borders |

## Radius

| Token | Tailwind | Value |
|---|---|---|
| `radius-soft` | `rounded-soft` | 0.375rem (6px) |
| `radius-panel` | `rounded-panel` | 0.75rem (12px) |
| `radius-pill` | `rounded-pill` | 9999px |

## Shadow

| Token | Tailwind | Purpose |
|---|---|---|
| `shadow-xs` | `shadow-xs` | Subtle elevation |
| `shadow-sm` | `shadow-sm` | Small elevation |
| `shadow-panel` | `shadow-panel` | Card/panel elevation |
| `shadow-control` | `shadow-control` | Input/button elevation |
| `shadow-popover` | `shadow-popover` | Popover/dropdown elevation |
| `shadow-lg` | `shadow-lg` | Large elevation |
| `shadow-xl` | `shadow-xl` | Extra large elevation |

## Z-Index

| Token | Tailwind | Value |
|---|---|---|
| `z-shell` | `z-shell` | 10 |
| `z-dropdown` | `z-dropdown` | 20 |
| `z-sticky` | `z-sticky` | 30 |
| `z-modal` | `z-modal` | 40 |
| `z-overlay` | `z-overlay` | 50 |
| `z-tooltip` | `z-tooltip` | 60 |
| `z-toast` | `z-toast` | 70 |

## Typography

| Token | Tailwind | Value |
|---|---|---|
| `text-xs` | `text-xs` | 0.75rem |
| `text-sm` | `text-sm` | 0.8125rem |
| `text-base` | `text-base` | 0.875rem |
| `text-lg` | `text-lg` | 1rem |
| `text-xl` | `text-xl` | 1.125rem |
| `text-2xl` | `text-2xl` | 1.5rem |
| `text-3xl` | `text-3xl` | 1.875rem |
| `text-4xl` | `text-4xl` | 2.25rem |

## Motion

| Token | Tailwind | Value |
|---|---|---|
| `duration-fast` | `duration-fast` | 100ms |
| `duration-normal` | `duration-normal` | 200ms |
| `duration-slow` | `duration-slow` | 300ms |
| `ease-default` | `ease-default` | cubic-bezier(0.4, 0, 0.2, 1) |
| `ease-in` | `ease-in` | cubic-bezier(0.4, 0, 1, 1) |
| `ease-out` | `ease-out` | cubic-bezier(0, 0, 0.2, 1) |
| `ease-in-out` | `ease-in-out` | cubic-bezier(0.4, 0, 0.2, 1) |

## Font

| Token | Tailwind | Value |
|---|---|---|
| `font-sans` | `font-sans` | Instrument Sans, system-ui, sans-serif |
