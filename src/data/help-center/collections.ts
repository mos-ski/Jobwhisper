import type { HelpCollection } from './types'
import { gettingStartedArticles } from './articles/getting-started'
import { resumeBuilderArticles } from './articles/resume-builder'
import { interviewPrepArticles } from './articles/interview-prep'
import { interviewCopilotArticles } from './articles/interview-copilot'
import { autoApplyArticles } from './articles/auto-apply'
import { accountBillingArticles } from './articles/account-billing'
import { troubleshootingArticles } from './articles/troubleshooting'

export const helpCollections: readonly HelpCollection[] = [
  {
    slug: 'getting-started',
    title: 'Getting Started',
    description: 'New to Jobwhisper? Start here.',
    icon: 'Rocket',
    articles: gettingStartedArticles,
  },
  {
    slug: 'resume-builder',
    title: 'Resume Builder',
    description: 'AI-powered resume tailoring and ATS optimization.',
    icon: 'FileText',
    articles: resumeBuilderArticles,
  },
  {
    slug: 'interview-prep',
    title: 'Interview Prep',
    description: 'Practice with AI mock interviews and get detailed reports.',
    icon: 'MessageSquare',
    articles: interviewPrepArticles,
  },
  {
    slug: 'interview-copilot',
    title: 'Interview Copilot',
    description: 'Real-time coaching during your live interviews.',
    icon: 'Headphones',
    articles: interviewCopilotArticles,
  },
  {
    slug: 'auto-apply',
    title: 'Auto Apply',
    description: 'Automated job applications you review before sending.',
    icon: 'Zap',
    articles: autoApplyArticles,
  },
  {
    slug: 'account-billing',
    title: 'Account & Billing',
    description: 'Plans, credits, refunds, and account management.',
    icon: 'CreditCard',
    articles: accountBillingArticles,
  },
  {
    slug: 'troubleshooting',
    title: 'Troubleshooting',
    description: 'Browser requirements, common issues, and support.',
    icon: 'LifeBuoy',
    articles: troubleshootingArticles,
  },
]
