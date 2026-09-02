import { formatUsd } from '@/ui/currency'
import { button, calloutBox, eyebrow, heading, infoTable, paragraph, renderEmailShell } from '../shell'
import { formatDateInZone } from '../format'
import type { EmailTemplateBuilder } from '../types'

export const buildPaymentFailedEmail: EmailTemplateBuilder = (timeZone) => {
  const attemptedOn = formatDateInZone(new Date('2026-09-02T16:00:00Z'), timeZone)

  const body = `
${eyebrow('Payment issue', 'live')}
${heading('We couldn\'t process your payment')}
${paragraph(`Hi Ada, we tried to charge your card on ${attemptedOn} for your Jobwhisper Pro renewal, but the payment didn't go through.`)}
${infoTable([
  ['Plan', 'Jobwhisper Pro (monthly)'],
  ['Amount due', formatUsd(10000)],
  ['Payment method', 'Visa &middot;&middot;&middot;&middot; 4242'],
  ['Reason', 'Card declined'],
])}
${calloutBox('Your access continues for now, but update your payment method within 3 days to avoid interruption.', 'live')}
${button('#', 'Update payment method')}
${paragraph('Need help? Reply to this email and we\'ll sort it out with you.', { muted: true, marginBottom: 0 })}
`

  return {
    subject: 'Action needed: your Jobwhisper payment failed',
    previewText: `We couldn't charge your card for ${formatUsd(10000)}. Update your payment method.`,
    html: renderEmailShell({
      title: 'Payment failed',
      previewText: `We couldn't charge your card for ${formatUsd(10000)}.`,
      bodyHtml: body,
    }),
  }
}
