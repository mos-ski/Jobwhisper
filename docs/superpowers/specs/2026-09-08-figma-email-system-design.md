# Figma Email System Rebuild

## Goal

Rebuild all eight Jobwhisper transactional email templates around the visual language of Figma node `859:3571` while preserving each template's existing purpose, subject line, preview text, timezone behavior, and Jobwhisper-specific content.

## Visual Direction

The shared email canvas uses the Figma frame's cobalt background, centered Jobwhisper wordmark, and a 640px white content card with a 20px radius. Each message begins with a large Gowun Batang greeting, followed by Rethink Sans body content. Primary actions use the cobalt brand color and light text. The footer remains inside the white card and contains delivery/preferences copy plus centered social links.

The Untitled UI placeholder identity and sample address from Figma are not copied. Existing Jobwhisper branding, recipients, legal copy, and template-specific product language remain authoritative.

## Architecture

`src/emails/shell.ts` remains the single source for email-safe primitives. It will expose a redesigned shared shell and reusable helpers for headings, paragraphs, actions, detail tables, status labels, callouts, lists, and verification-code cells. Templates in `src/emails/templates/` continue to return complete HTML strings through the existing `EmailTemplateBuilder` contract.

The templates remain table-based and inline-styled for compatibility with Gmail, Outlook, and other common clients. Responsive adjustments may use a small embedded media query where inline styles cannot express mobile behavior. No new runtime dependency is required.

## Template Adaptation

- Sign-in link: uses the Figma verification pattern, with the six-digit fallback code rendered as individual bordered cells and the sign-in action retained.
- Receipt, renewal reminder, and payment failure: use the shared greeting and action pattern with compact transaction details; warning content remains explicit and not color-only.
- Job alert: presents the three matches as structured rows within the white card.
- Interview Copilot and Interview Prep reports: preserve score and session metadata in compact information sections.
- Meeting recap: preserves summary and action items in the shared card system.

## Assets

The current Jobwhisper wordmark assets are reused. Social icons are sourced from the Figma export and committed locally so temporary Figma URLs are not shipped. Every image receives explicit dimensions and descriptive or intentionally empty alternative text as appropriate.

## Responsive and Accessibility Behavior

The desktop presentation follows the 640px Figma card. On narrow screens, the outer gutter and card padding reduce while the card becomes fluid. Text remains readable without horizontal scrolling, detail rows can stack where necessary, and action links remain large enough to activate reliably. Content order remains logical without CSS. Statuses and warnings use text in addition to color.

## Error Handling and Safety

All user-provided or dynamic plain text continues to pass through HTML escaping before insertion. Existing trusted markup values remain limited to template-owned content. URLs and labels in shared helpers are escaped. The preview surface continues to isolate rendered HTML in an iframe.

## Verification

- Add focused tests for shell structure, escaped values, verification cells, template catalog coverage, and key Figma-derived styling.
- Run TypeScript and the production Vite build.
- Render every catalog template in the preview route and inspect representative desktop and mobile captures.
- Check that no temporary Figma asset URL remains in source.

## Out of Scope

This rebuild does not add new email types, change product flows, introduce a sending provider, or rewrite the preview/catalog application outside changes required to review the new templates.
