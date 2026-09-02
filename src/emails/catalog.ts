import { buildCopilotReportEmail } from './templates/copilot-report'
import { buildInterviewPrepReportEmail } from './templates/interview-prep-report'
import { buildJobAlertEmail } from './templates/job-alert'
import { buildLoginLinkEmail } from './templates/login-link'
import { buildMeetingRecapEmail } from './templates/meeting-recap'
import { buildPaymentFailedEmail } from './templates/payment-failed'
import { buildPaymentReminderEmail } from './templates/payment-reminder'
import { buildReceiptEmail } from './templates/receipt'
import type { EmailTemplateBuilder } from './types'

export type EmailCatalogEntry = {
  slug: string
  label: string
  category: 'Account' | 'Billing' | 'Jobs' | 'Reports' | 'Meetings'
  description: string
  build: EmailTemplateBuilder
}

export const EMAIL_CATALOG: EmailCatalogEntry[] = [
  {
    slug: 'login-link',
    label: 'Sign-in link',
    category: 'Account',
    description: 'Passwordless sign-in email with a magic link and a fallback 6-digit code.',
    build: buildLoginLinkEmail,
  },
  {
    slug: 'receipt',
    label: 'Payment receipt',
    category: 'Billing',
    description: 'Receipt sent immediately after a successful subscription charge.',
    build: buildReceiptEmail,
  },
  {
    slug: 'payment-reminder',
    label: 'Renewal reminder',
    category: 'Billing',
    description: 'Sent a few days before a subscription auto-renews.',
    build: buildPaymentReminderEmail,
  },
  {
    slug: 'payment-failed',
    label: 'Payment failed',
    category: 'Billing',
    description: 'Sent when a renewal charge is declined, with a grace-period warning.',
    build: buildPaymentFailedEmail,
  },
  {
    slug: 'job-alert',
    label: 'Job alert',
    category: 'Jobs',
    description: 'Daily digest of new Auto Apply matches for the user.',
    build: buildJobAlertEmail,
  },
  {
    slug: 'copilot-report',
    label: 'Interview Copilot report',
    category: 'Reports',
    description: 'Sent when a live Interview Copilot session report finishes generating.',
    build: buildCopilotReportEmail,
  },
  {
    slug: 'interview-prep-report',
    label: 'Interview prep report',
    category: 'Reports',
    description: 'Sent when a mock interview practice session scorecard finishes generating.',
    build: buildInterviewPrepReportEmail,
  },
  {
    slug: 'meeting-recap',
    label: 'Meeting recap',
    category: 'Meetings',
    description: 'Automated summary and action items sent after a recorded call.',
    build: buildMeetingRecapEmail,
  },
]

export function getEmailCatalogEntry(slug: string): EmailCatalogEntry | undefined {
  return EMAIL_CATALOG.find((entry) => entry.slug === slug)
}
