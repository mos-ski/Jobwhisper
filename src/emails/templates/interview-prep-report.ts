import { button, divider, heading, infoTable, paragraph, pill, renderEmailShell } from '../shell'
import { formatDateTimeInZone } from '../format'
import type { EmailTemplateBuilder } from '../types'

export const buildInterviewPrepReportEmail: EmailTemplateBuilder = (timeZone) => {
  const sessionTime = formatDateTimeInZone(new Date('2026-08-30T15:00:00Z'), timeZone)

  const body = `
${heading('Your mock interview report is ready')}
${paragraph(`Your practice session for the Senior Product Manager role (${sessionTime}) has been scored.`)}
${infoTable([
  ['Role practiced', 'Senior Product Manager'],
  ['Interviewer persona', 'Direct &amp; Analytical'],
  ['Difficulty', 'Hard'],
  ['Questions asked', '9'],
])}
${paragraph(`${pill('Score: 82 / 100', 'positive')}`, { marginBottom: 20 })}
${button('#', 'View scorecard and transcript')}
${divider()}
${paragraph('Your report breaks down structure, clarity, and confidence by question, with example stronger answers.', { muted: true, marginBottom: 0 })}
`

  return {
    subject: 'Your mock interview scorecard is ready',
    previewText: 'You scored 82/100 practicing for Senior Product Manager.',
    html: renderEmailShell({
      title: 'Interview prep report',
      previewText: 'You scored 82/100 practicing for Senior Product Manager.',
      bodyHtml: body,
    }),
  }
}
