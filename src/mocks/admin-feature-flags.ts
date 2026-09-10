import type { AdminFeatureFlag, AdminFeatureFlagCategory } from '@/contracts/admin-feature-flags.draft'

export const adminFeatureFlags: readonly AdminFeatureFlag[] = [
  // Products
  { id: 'resume-builder', name: 'Resume builder', description: 'Tailoring, ATS scoring, the editor and export.', category: 'products', enabled: true },
  { id: 'auto-apply', name: 'Auto-Apply', description: 'Job scouting and the agent that submits applications.', category: 'products', enabled: true },
  { id: 'interview-prep', name: 'Interview prep', description: 'Practice interviews, their reports and the history.', category: 'products', enabled: true },
  { id: 'interviews-meetings', name: 'Interviews & meetings', description: 'The live copilot across interview, coding and meeting modes.', category: 'products', enabled: true },
  { id: 'marketplace', name: 'Marketplace', description: 'Templates and guides sold individually.', category: 'products', enabled: true },

  // App
  { id: 'knowledge-base', name: 'Knowledge base', description: 'Uploads, scrapes and notes that ground prep and copilot.', category: 'app', enabled: true },
  { id: 'download-apps', name: 'Download apps', description: 'The whole downloads page, desktop and mobile alike.', category: 'app', enabled: true },
  { id: 'desktop-app', name: 'Desktop app', description: 'The macOS and Windows download cards.', category: 'app', enabled: true, parentId: 'download-apps' },
  { id: 'mobile-app', name: 'Mobile app', description: 'The iOS and Android cards.', category: 'app', enabled: true, parentId: 'download-apps' },
  { id: 'tutorial', name: 'Tutorial', description: 'The walkthrough videos and articles.', category: 'app', enabled: true },

  // Support
  { id: 'support', name: 'Support', description: 'Raising a request and tracking the ones already raised.', category: 'support', enabled: true },
  { id: 'ask-question', name: 'Ask a question', description: 'The "ask a question" request kind.', category: 'support', enabled: true, parentId: 'support' },
  { id: 'report-bug', name: 'Report a bug', description: 'The bug report request kind.', category: 'support', enabled: true, parentId: 'support' },
  { id: 'make-complaint', name: 'Make a complaint', description: 'The complaint request kind.', category: 'support', enabled: true, parentId: 'support' },
  { id: 'give-feedback', name: 'Give feedback', description: 'The feedback request kind.', category: 'support', enabled: true, parentId: 'support' },
  { id: 'request-feature', name: 'Request a feature', description: 'The feature request kind.', category: 'support', enabled: true, parentId: 'support' },
  { id: 'billing-refund', name: 'Billing or refund', description: 'The billing and refund request kind.', category: 'support', enabled: true, parentId: 'support' },
  { id: 'star-ratings', name: 'Star ratings', description: 'The 1–5 score on the kinds that ask for one.', category: 'support', enabled: true, parentId: 'support' },
]

export const adminFeatureFlagCategoryLabels: Record<AdminFeatureFlagCategory, { readonly label: string; readonly description: string }> = {
  products: { label: 'Products', description: 'Also switchable from Products, where the blast radius is shown. Off in either place is off.' },
  app: { label: 'App', description: 'Parts of the app that are not sold. Switching a parent off takes its children with it.' },
  support: { label: 'Support', description: 'The request kinds the support form offers, and the star rating.' },
}
