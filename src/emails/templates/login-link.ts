import { button, calloutBox, heading, paragraph, renderEmailShell } from '../shell'
import type { EmailTemplateBuilder } from '../types'

export const buildLoginLinkEmail: EmailTemplateBuilder = () => {
  const body = `
${heading('Sign in to Jobwhisper')}
${paragraph('Click the button below to sign in. This link expires in 15 minutes and can only be used once.')}
${button('#', 'Sign in to Jobwhisper')}
${calloutBox('Security note', "If you didn't request this email, you can safely ignore it, your account is still secure.")}
${paragraph('Or enter this code manually if you were asked for one:', { muted: true, marginBottom: 6 })}
<p style="margin:0 0 20px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:24px;letter-spacing:0.12em;font-weight:700;color:#1c1d20;">482 917</p>
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
