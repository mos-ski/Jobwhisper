import { FONT, brand, button, divider, escapeHtml, heading, paragraph, pill, renderEmailShell } from '../shell'
import type { EmailTemplateBuilder } from '../types'

const JOBS = [
  { title: 'Senior Product Manager', company: 'Coinbase', match: '96% match', location: 'Remote (US)' },
  { title: 'Product Manager, Growth', company: 'Notion', match: '91% match', location: 'San Francisco, CA' },
  { title: 'Group Product Manager', company: 'Stripe', match: '88% match', location: 'Remote (US)' },
]

function jobRow(job: (typeof JOBS)[number], isLast: boolean): string {
  return `<tr>
<td style="padding:16px 0;${isLast ? '' : `border-bottom:1px solid ${brand.paperLine};`}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td>
<p style="margin:0 0 3px;font-family:${FONT};font-size:15px;font-weight:600;color:${brand.textLight};">${escapeHtml(job.title)}</p>
<p style="margin:0;font-family:${FONT};font-size:13px;color:${brand.mutedLight};">${escapeHtml(job.company)} &middot; ${escapeHtml(job.location)}</p>
</td>
<td align="right" style="white-space:nowrap;">${pill(job.match, 'positive')}</td>
</tr>
</table>
</td>
</tr>`
}

function jobList(): string {
  const rows = JOBS.map((j, i) => jobRow(j, i === JOBS.length - 1)).join('')
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 20px;background-color:#ffffff;border:1px solid ${brand.paperLine};border-radius:8px;">
<tr><td style="padding:4px 18px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows}</table></td></tr>
</table>`
}

export const buildJobAlertEmail: EmailTemplateBuilder = () => {
  const body = `
${heading('3 new matches for Product Manager roles')}
${paragraph('Based on your Auto Apply preferences, here are today\'s strongest matches.')}
${jobList()}
${button('#', 'View all matches')}
${divider()}
${paragraph("You're getting this because job alerts are turned on for your account.", { muted: true, marginBottom: 0 })}
`

  return {
    subject: '3 new job matches ready for you',
    previewText: 'Senior Product Manager at Coinbase, and 2 more strong matches.',
    html: renderEmailShell({
      title: 'New Jobwhisper matches',
      previewText: 'Senior Product Manager at Coinbase, and 2 more strong matches.',
      bodyHtml: body,
    }),
  }
}
