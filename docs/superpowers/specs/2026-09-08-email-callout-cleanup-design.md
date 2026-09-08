# Email Callout Cleanup

## Scope

Remove the generic tinted callout-card treatment from every transactional email template. This includes the accent rail, rounded tinted panel, and uppercase label used for routine notes.

## Treatment

- Routine context, such as sign-in security guidance and renewal reminders, becomes plain paragraph copy in the normal reading flow.
- Important billing warnings remain explicit through direct wording and restrained typographic emphasis, without introducing a separate decorative card.
- Spacing follows the surrounding email body rhythm so the note reads as part of the message rather than a reusable dashboard component.
- The shared callout helper is removed when no template uses it, preventing the rejected treatment from returning accidentally.

## Verification

- Render all eight templates and assert that none contains the former callout markup or label treatment.
- Keep email HTML table-based and inline-styled.
- Verify the scoped email tests and production build.
