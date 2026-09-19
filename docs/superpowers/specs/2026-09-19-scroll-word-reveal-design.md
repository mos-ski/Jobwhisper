# Journey paragraph scroll reveal

## Scope

Animate only the explanatory paragraph beneath “Start to finish.” Words reveal in reading order as the user scrolls through the paragraph.

## Behavior

- Render the original sentence as individual word spans while preserving natural wrapping and accessible continuous text.
- Derive reveal progress from the paragraph’s position in the viewport.
- Begin revealing when the paragraph approaches the lower portion of the viewport and complete before it leaves the upper portion.
- Move from a muted resting color to the normal ink color one word at a time.
- Reverse the reveal naturally when the user scrolls upward.
- Show the complete paragraph without animation when `prefers-reduced-motion: reduce` is active.

## Implementation boundaries

- Use React state, a ref, `requestAnimationFrame`, and the native scroll event; add no runtime dependency.
- Keep the current paragraph copy and emphasis exactly intact.
- Preserve mobile wrapping and avoid fixed word positions.
- Remove listeners and pending animation frames during effect cleanup.

## Verification

- Confirm progressive reveal and reverse reveal in the browser.
- Confirm the paragraph is fully readable with reduced motion enabled.
- Confirm layout remains intact at 360px and desktop widths.
- Run the production build and repository diff checks.
