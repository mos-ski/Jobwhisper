# Auto Apply Done For You Widget Design

## Goal

Add the approved Figma promotion to the Auto Apply Jobs page so candidates browsing jobs can discover the human-managed Done For You service.

## Placement and behavior

- Render the promotion only on `/v3/auto-apply/jobs`, fixed to the logical bottom-right of the viewport.
- Preserve the Figma composition: blue campaign header, Jobwhisper wordmark, interview guarantee, white wave transition, supporting copy, primary signup action, and secondary dismissal action.
- Use the approved copy from Figma.
- `Sign Up Now` navigates to `/v3/billing/done-for-you`.
- The close control and `Maybe Later.` hide the widget for the current page session.
- On narrow viewports, constrain the card to the available width and keep all controls keyboard reachable without covering the whole page.

## Architecture

- Add a domain-specific `DoneForYouPromoWidget` under `src/features/auto-apply/`.
- Keep it presentational by receiving the destination URL and dismissal callback as props.
- Let `AutoApplyJobsView` own the temporary dismissed state and render the widget outside the jobs content flow.
- Store the exact Figma-exported wordmark and wave assets under `public/v3-assets/figma/` so the implementation does not depend on expiring asset URLs.

## Accessibility and verification

- Use a named region, a real link for navigation, and buttons for dismissal.
- Give the icon-only close button an accessible label and visible focus treatment.
- Pair the visual guarantee with text and maintain contrast using existing semantic tokens.
- Add a route-level test for visibility, destination, and dismissal, then verify the focused test, production build, and browser rendering.
