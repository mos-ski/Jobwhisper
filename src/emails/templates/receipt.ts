import { formatUsd } from '@/ui/currency'
import { button, eyebrow, heading, infoTable, paragraph, renderEmailShell } from '../shell'
import { formatDateInZone } from '../format'
import type { EmailTemplateBuilder } from '../types'

export const buildReceiptEmail: EmailTemplateBuilder = (timeZone) => {
  const date = formatDateInZone(new Date('2026-09-02T14:32:00Z'), timeZone)

  const body = `
${eyebrow('Payment receipt')}
${heading('Receipt for your Jobwhisper Pro subscription')}
${paragraph('Hi Ada,', { marginBottom: 8 })}
${paragraph(`Thanks for your payment. Here's your receipt for ${date}.`)}
${infoTable([
  ['Plan', 'Jobwhisper Pro (monthly)'],
  ['Amount charged', formatUsd(4000)],
  ['Payment method', 'Visa &middot;&middot;&middot;&middot; 4242'],
  ['Receipt number', 'JW-2026-0091422'],
])}
${button('#', 'Download PDF receipt')}
${paragraph('Questions about this charge? Reply to this email and we\'ll help you out.', { muted: true })}
`

  return {
    subject: `Your Jobwhisper receipt for ${date}`,
    previewText: `Payment received: ${formatUsd(4000)} for Jobwhisper Pro`,
    html: renderEmailShell({ title: 'Jobwhisper receipt', previewText: `Payment received: ${formatUsd(4000)}`, bodyHtml: body }),
  }
}
