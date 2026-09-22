# Landing CTA Hierarchy Design

## Goal

Make the landing page present one clear interview-focused conversion action while keeping product downloads easy to find in the navigation and social-proof overlay.

## Approved hierarchy

- The hero contains one primary blue button labeled `Ace my next interview` that opens account creation.
- The desktop navigation contains a dedicated text-only `Download` dropdown and a restrained secondary `Log in` button.
- The mobile navigation keeps Sign up visible and keeps the download menu available in compact form.
- The demo has no centered Get Started action or guarantee caption.
- After the hero leaves the viewport, a fixed, horizontally centered social-proof pill appears. It uses a single-line outcome statement and a primary blue `Download` action with Apple and Windows marks.
- `Ace my next interview` is the only blue primary action in the hero viewport.
- The navigation Download trigger has no leading mark; it uses only its label and dropdown chevron.
- The free-credit and no-card reassurance row uses full readable contrast rather than reduced opacity.

## Boundaries

- Reuse the existing download menu data and menu primitive.
- Preserve Features, Pricing, FAQ, Log in, and the mobile navigation menu.
- Use existing semantic color tokens and existing platform assets.
- Keep all actions keyboard-accessible and at least 44 CSS pixels high.

## Verification

- Component tests assert the labels and action destinations.
- The full test suite and production build must pass.
- Desktop and narrow mobile layouts must be visually checked.
