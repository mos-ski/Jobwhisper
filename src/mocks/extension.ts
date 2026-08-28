import type { ExtensionAppliedJob, ExtensionJobBoard } from '@/contracts/extension.draft'

export const extensionJobBoards: readonly ExtensionJobBoard[] = [
  { id: 'indeed', name: 'Indeed', state: 'start' },
  { id: 'glassdoor', name: 'Glassdoor', state: 'start' },
  { id: 'workable', name: 'Workable', state: 'connect' },
  { id: 'linkedin', name: 'LinkedIn', state: 'in-progress' },
]

// Queued per board, revealed one at a time while that board's run is active — see
// src/apps/extension/App.tsx for the reveal timer. Order matters: this is the order
// each board's feed fills in.
export const extensionAppliedJobQueue: readonly ExtensionAppliedJob[] = [
  {
    id: 'linkedin-1',
    boardId: 'linkedin',
    title: 'Senior Product Manager',
    company: 'Notion',
    listingUrl: 'https://www.linkedin.com/jobs/search/notion-senior-pm',
    outcome: 'success',
  },
  {
    id: 'linkedin-2',
    boardId: 'linkedin',
    title: 'Backend Engineer',
    company: 'Stripe',
    listingUrl: 'https://www.linkedin.com/jobs/search/stripe-backend-eng',
    outcome: 'failed',
    failureReason: 'This application failed because of VPN, please turn off your VPN and try again.',
  },
  {
    id: 'glassdoor-1',
    boardId: 'glassdoor',
    title: 'Growth Marketing Manager',
    company: 'HubSpot',
    listingUrl: 'https://www.glassdoor.com/job/hubspot-growth-marketing',
    outcome: 'success',
  },
  {
    id: 'glassdoor-2',
    boardId: 'glassdoor',
    title: 'UX Researcher',
    company: 'Airbnb',
    listingUrl: 'https://www.glassdoor.com/job/airbnb-ux-researcher',
    outcome: 'success',
  },
  {
    id: 'indeed-1',
    boardId: 'indeed',
    title: 'Data Analyst',
    company: 'Coinbase',
    listingUrl: 'https://www.indeed.com/job/coinbase-data-analyst',
    outcome: 'success',
  },
]
