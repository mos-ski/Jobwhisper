# Design Clichés — Do Not Ship These

By 2026, every one of these reads as "an AI coding tool made this" to anyone who's looked at more than a handful of SaaS landing pages. They're not wrong individually, they're wrong because *everyone's* default generator reaches for them, so together they're the fastest way to make Jobwhisper look like a template instead of a product with a point of view.

This file is normative for every agent (including Claude) working in this repo, on every surface: web app, marketing, emails, desktop, extension. If you catch yourself about to reach for one of these because it's the fast/safe/obvious choice, stop and use the repo's actual system instead — see `TOKENS.md`, `AGENTS.md` Section 3, and the fonts already wired in `src/index.css`.

Read this alongside `AGENTS.md` before touching any visual surface.

---

## Color

- **Purple-to-blue gradient backgrounds.** The single most recognizable "AI SaaS" tell. Jobwhisper's palette is ink / paper / red-signal (see `TOKENS.md`, or `--vsl-*` in `vsl-landing-page.css`) — no blue-purple gradients, anywhere.
- **Gradient hero text** (`bg-clip-text` rainbow headlines). Same tell, worse when it's the first thing on the page. Headlines are solid `ink`/`text-light`, full stop.
- **Low-contrast dark mode** — `gray-800` text on `gray-900` backgrounds because it "looks moody." If you can't verify AA contrast (per `AGENTS.md` Section 7), it's wrong. Dark mode should be as legible as light mode, not atmospheric at the cost of readability.
- **Glassmorphism cards** (frosted `backdrop-blur` panels floating over a gradient). Adds visual noise without adding meaning. Use real surfaces: `bg-surface`, a border, a shadow token.
- **Grain/noise texture laid over a gradient.** Same complaint as the gradient itself, plus an extra unnecessary layer.

## Typography

- **Inter everywhere.** It's the default in every starter template, which is exactly why it signals "unstyled." This repo's type is **Gowun Batang** (display: headings, big figures/prices, emphasis lines, quotes) + **Rethink Sans** (body copy, and doubles as the small-caps/mono label font) — see the role split documented for the VSL page. Never substitute a generic sans as primary. See the standing memory on this if you're Claude in a future session.
- **Space Grotesk + Instrument Serif pairing.** This is the *other* extremely recognizable 2026 AI-SaaS pairing (geometric grotesk + thin display serif). Not our fonts. Don't reach for it even as a "just prototyping" placeholder.
- **Serif italics on accent words mid-sentence** ("Build *better* products") — a stylistic tic borrowed wholesale from a few popular templates. If a word needs emphasis, use weight or the display font at the sentence/line level (like the VSL page's `.punch` treatment), not an italic flourish inside body copy.
- **Em dashes everywhere.** Already an enforced repo rule (see the "Remove em dashes from user-facing copy" commit) — extend it to anything new. Use a comma, a period, or restructure the sentence.
- **Generic buzzword copy** — "supercharge," "unlock," "seamless," "elevate," "game-changing," "revolutionize." Write the actual, specific claim (see the VSL page's copy for the tone: concrete, second-person, no filler).

## Icons & Decoration

- **A row of exactly three icon boxes** ("Fast. Secure. Simple.") above three short lines of copy. It's the default "features section" every generator produces because it's the easiest grid to fill. If you need a features grid, vary the count and give each item real, specific copy — see `.vsl-grid` (seven items, not three, each with a real capability).
- **A badge above the headline** ("✨ New" / "AI-Powered" pill) as a reflexive hero decoration. Only use a badge/eyebrow when it's carrying real information (see `eyebrow()` in `src/emails/shell.ts` — it labels the email's actual category, it isn't decoration).
- **Emojis inside headings or section titles.** Never in this product's voice. Emojis in body copy or UI chrome are also off-brand — the signal/live-status language already exists (`--live`, the pulsing dot) and does this job without emoji.
- **Lucide icons dropped in indiscriminately as decoration.** `lucide-react` is a real dependency here and fine to use *functionally* (a chevron on a select, an icon on a documented button) — the cliché is icons added as visual filler with no semantic job. If you can delete the icon and lose no information, delete it.
- **Untouched shadcn/ui defaults.** `shadcn` is a dependency here too. Never ship a component straight from the registry with default shadows, default radii, default spacing. Every primitive that reaches `src/ui/` gets restyled against this repo's tokens — that's the whole point of Section 3/4 of `AGENTS.md`.

## Layout & Motion

- **Every section fading/sliding in on scroll.** A blanket `IntersectionObserver` reveal on every `<section>` is a template default, not a design decision. Entrance animation is fine when it's deliberate and scoped (the VSL hero's single staggered reveal, `.hero-load`), not applied uniformly down the whole page.
- **Cursor-following spotlight/beam effects.** Pure template flourish, adds nothing, feels like every other AI-generated landing page's hero.
- **Buttons that only fade opacity on hover.** A real hover state changes something with weight — background color, border, elevation (see `.btn-primary:hover` going pure black, or `.vsl-btn-primary:hover`) — not just `opacity-80`.
- **Colored left-border "info cards"** (`border-l-4 border-blue-500` callouts) as the default way to add visual interest to a block of text. Used sparingly and semantically (a real warning, a real live-signal callout — see `calloutBox()` in the email system) this is fine; used as decoration on every third paragraph, it's filler.
- **Inconsistent spacing** — mixing `p-4`/`p-5`/`p-6` or arbitrary `px-[13px]` values across similar components because nothing was measured against a scale. `AGENTS.md` Section 3 already bans this outside tokens; hold new marketing/prototype surfaces to the same bar even though the automated check only runs in the production repo.

---

## The actual test

Before shipping a visual decision, ask: *would this exact choice show up if I typed "make me a modern SaaS landing page" into any AI tool with no other context?* If yes, it's not a decision, it's a default. Replace it with something that comes from Jobwhisper's actual brand system (ink/paper/red-signal, Gowun Batang/Rethink Sans, the VSL page's restraint) or from the specific content of the screen you're building, not from what's statistically common in 2026 AI-generated UI.
