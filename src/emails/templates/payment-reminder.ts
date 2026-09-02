import { formatUsd } from '@/ui/currency'
import { button, calloutBox, heading, infoTable, paragraph, renderEmailShell } from '../shell'
import { formatDateInZone } from '../format'
import type { EmailTemplateBuilder } from '../types'

export const buildPaymentReminderEmail: EmailTemplateBuilder = (timeZone) => {
  const renewDate = formatDateInZone(new Date('2026-09-07T16:00:00Z'), timeZone)

  const body = `
${heading('Your Jobwhisper Pro renews in 5 days')}
${paragraph(`Hi Ada, just a heads up, your subscription renews on ${renewDate}.`)}
${infoTable([
  ['Plan', 'Jobwhisper Pro (monthly)'],
  ['Renewal date', renewDate],
  ['Amount', formatUsd(10000)],
  ['Payment method', 'Visa &middot;&middot;&middot;&middot; 4242'],
])}
${calloutBox('Heads up', 'Nothing to do here, this is just a reminder. Your card will be charged automatically.')}
${button('#', 'Manage subscription')}
`

  return {
    subject: 'Your Jobwhisper Pro renews in 5 days',
    previewText: `Renewing ${renewDate} for ${formatUsd(10000)}`,
    html: renderEmailShell({
      title: 'Upcoming renewal',
      previewText: `Renewing ${renewDate} for ${formatUsd(10000)}`,
      bodyHtml: body,
    }),
  }
}
