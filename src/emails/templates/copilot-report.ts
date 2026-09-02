import { button, divider, heading, infoTable, paragraph, pill, renderEmailShell } from '../shell'
import { formatDateTimeInZone } from '../format'
import type { EmailTemplateBuilder } from '../types'

export const buildCopilotReportEmail: EmailTemplateBuilder = (timeZone) => {
  const sessionTime = formatDateTimeInZone(new Date('2026-09-01T18:00:00Z'), timeZone)

  const body = `
${heading('Your Interview Copilot session report is ready')}
${paragraph(`Your live session for the Product Manager role at Coinbase (${sessionTime}) has been recorded and evaluated.`)}
${infoTable([
  ['Role', 'Product Manager'],
  ['Company', 'Coinbase'],
  ['Session length', '38 minutes'],
  ['Questions covered', '11'],
])}
${paragraph(`${pill('Overall: Strong', 'positive')}`, { marginBottom: 20 })}
${button('#', 'View full report')}
${divider()}
${paragraph('The report includes your transcript, response structure notes, and suggested improvements for your next round.', { muted: true, marginBottom: 0 })}
`

  return {
    subject: 'Your Interview Copilot report is ready',
    previewText: 'Session recorded and evaluated: Product Manager at Coinbase.',
    html: renderEmailShell({
      title: 'Copilot report ready',
      previewText: 'Session recorded and evaluated: Product Manager at Coinbase.',
      bodyHtml: body,
    }),
  }
}
