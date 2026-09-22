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
    description: 'What the platform does, how to set it up, and a realistic first week.',
    icon: 'Rocket',
    articles: gettingStartedArticles,
  },
  {
    slug: 'resume-builder',
    title: 'Resume Builder',
    description: 'Tailoring against a real posting, ATS scores, exports, and managing versions.',
    icon: 'FileText',
    articles: resumeBuilderArticles,
  },
  {
    slug: 'interview-prep',
    title: 'Interview Prep',
    description: 'Mock interviews, the four formats, and practising for a named employer.',
    icon: 'MessageSquare',
    articles: interviewPrepArticles,
  },
  {
    slug: 'interview-copilot',
    title: 'Interview Copilot',
    description: 'Live support in a real interview: setup, audio, the Copilots, and the ethics of it.',
    icon: 'Headphones',
    articles: interviewCopilotArticles,
  },
  {
    slug: 'auto-apply',
    title: 'Auto Apply',
    description: 'Matching, the review step, and what a successful application costs.',
    icon: 'Zap',
    articles: autoApplyArticles,
  },
  {
    slug: 'account-billing',
    title: 'Account & Billing',
    description: 'Every price, how the two credit balances work, refunds, and account settings.',
    icon: 'CreditCard',
    articles: accountBillingArticles,
  },
  {
    slug: 'troubleshooting',
    title: 'Troubleshooting',
    description: 'Requirements, the fixes for what actually goes wrong, support, and privacy.',
    icon: 'LifeBuoy',
    articles: troubleshootingArticles,
  },
]
