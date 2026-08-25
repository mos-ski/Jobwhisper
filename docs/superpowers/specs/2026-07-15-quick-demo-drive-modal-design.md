# Quick Demo Drive Modal Design

## Goal

Let visitors watch the selected Lightforth quick demo without leaving the landing page.

## Interaction

- Replace the current in-page anchor behavior of `Watch Quick Demo` with a button action.
- Open a modal containing the Google Drive preview player for file `118_lmiPcoUBvDzsglUGqZc2uZDDmIJQs`.
- Use the embed URL `https://drive.google.com/file/d/118_lmiPcoUBvDzsglUGqZc2uZDDmIJQs/preview`.
- Close the modal from the close button, backdrop click, or `Escape`.
- Lock page scrolling while the modal is open and restore it when closed.

## Layout

- Keep the existing interview-pressure section unchanged.
- Present the player in a centered 16:9 surface with a dark backdrop.
- Cap the desktop player width so it remains comfortably inside the viewport.
- On mobile, use the available width with safe outer padding and preserve the 16:9 ratio.
- Keep the close control visible above the player at all sizes.

## Accessibility

- Use a real button for the trigger.
- Mark the modal as an accessible dialog with a clear label.
- Give the iframe a descriptive title.
- Give the close control an accessible name.

## Error Boundary

Google Drive owns playback and permission errors inside the iframe. The landing page will not attempt to reimplement player controls. The video must remain shared so visitors can view it without requesting access.

## Verification

- Component test: clicking `Watch Quick Demo` opens the dialog with the exact Drive preview URL.
- Component test: the close button removes the dialog.
- Browser check at desktop and mobile widths: modal framing, close control, scroll lock, and player visibility.
- Run the full test suite and production build.
