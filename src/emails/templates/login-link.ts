import { button, greeting, paragraph, renderEmailShell, verificationCode } from '../shell'
import type { EmailTemplateBuilder } from '../types'

export const buildLoginLinkEmail: EmailTemplateBuilder = () => {
  const body = `
${greeting('Olivia')}
${paragraph('This is your verification code:', { marginBottom: 16 })}
${verificationCode('482 917')}
${paragraph('This code will only be valid for the next 15 minutes. If the code does not work, you can use this login verification link:')}
${button('#', 'Verify email')}
${paragraph("If you didn't request this email, you can ignore it. Your account is still secure.", { muted: true })}
${paragraph('Thanks,<br>The Jobwhisper team', { marginBottom: 0 })}
`

  return {
    subject: 'Your Jobwhisper sign-in link',
    previewText: 'Use this link to sign in, it expires in 15 minutes.',
    html: renderEmailShell({
      title: 'Sign in to Jobwhisper',
      previewText: 'Use this link to sign in, it expires in 15 minutes.',
      bodyHtml: body,
    }),
  }
}
