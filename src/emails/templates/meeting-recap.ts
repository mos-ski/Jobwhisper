import { FONT, brand, button, divider, escapeHtml, heading, paragraph, renderEmailShell } from '../shell'
import { formatDateInZone } from '../format'
import type { EmailTemplateBuilder } from '../types'

const ACTION_ITEMS = [
  'Send the updated pricing one-pager to the buying committee',
  'Loop in security for the SOC 2 questionnaire by Friday',
  'Schedule technical deep-dive with their engineering lead',
]

function actionItemRow(text: string, isLast: boolean): string {
  return `<tr>
<td style="padding:12px 0;vertical-align:top;width:20px;${isLast ? '' : `border-bottom:1px solid ${brand.paperLine};`}">
<span style="display:inline-block;width:6px;height:6px;margin-top:8px;border-radius:50%;background-color:${brand.ink};"></span>
</td>
<td style="padding:12px 0;font-family:${FONT};font-size:14px;line-height:21px;color:${brand.textLight};${isLast ? '' : `border-bottom:1px solid ${brand.paperLine};`}">${escapeHtml(text)}</td>
</tr>`
}

function actionItemList(): string {
  const rows = ACTION_ITEMS.map((item, i) => actionItemRow(item, i === ACTION_ITEMS.length - 1)).join('')
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;background-color:#ffffff;border:1px solid ${brand.paperLine};border-radius:8px;">
<tr><td style="padding:2px 18px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows}</table></td></tr>
</table>`
}

export const buildMeetingRecapEmail: EmailTemplateBuilder = (timeZone) => {
  const meetingDate = formatDateInZone(new Date('2026-09-01T17:00:00Z'), timeZone)

  const body = `
${heading('Recap: Discovery call with Acme Corp')}
${paragraph(`${meetingDate} &middot; 45 minutes &middot; 4 attendees`, { muted: true })}
${paragraph('Here\'s a summary of what was discussed, generated from your call recording.')}
<p style="margin:0 0 8px;font-family:${FONT};font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.03em;color:${brand.mutedLight};">Summary</p>
${paragraph('Acme is evaluating Jobwhisper for their internal recruiting team. Budget is approved for Q4, main blocker is security review. Champion is pushing for a decision by end of month.')}
<p style="margin:0 0 8px;font-family:${FONT};font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.03em;color:${brand.mutedLight};">Action items</p>
${actionItemList()}
${button('#', 'View full transcript')}
${divider()}
${paragraph('Recaps are generated automatically. Correct anything that looks off directly in the app.', { muted: true, marginBottom: 0 })}
`

  return {
    subject: 'Recap: Discovery call with Acme Corp',
    previewText: '3 action items and a full summary from your call.',
    html: renderEmailShell({
      title: 'Meeting recap',
      previewText: '3 action items and a full summary from your call.',
      bodyHtml: body,
    }),
  }
}
