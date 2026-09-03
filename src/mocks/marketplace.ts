import type { MarketplaceItem } from '@/contracts/marketplace.draft'

// One-time content purchases — unconnected to any subscription or credit balance. See PRICING.md §5.
export const marketplaceItems: readonly MarketplaceItem[] = [
  {
    id: 'swipe',
    name: '5 Must-Master Interview Questions: Answer Swipe File',
    priceDollars: 19,
    description: 'Word-for-word answer frameworks for the questions that end interviews early.',
  },
  {
    id: 'resumes',
    name: '10 Fully Customizable Resume Templates',
    priceDollars: 29,
    description: 'ATS-safe templates for every industry, ready to fill in and send today.',
  },
  {
    id: 'coverletter',
    name: 'Cover Letter Swipe File',
    priceDollars: 15,
    description: 'Proven cover letter openers and structures you can adapt in minutes.',
  },
  {
    id: 'salary',
    name: 'Salary Negotiation Word-for-Word Scripts',
    priceDollars: 15,
    description: 'Exactly what to say when they ask your salary expectations, and when they make an offer.',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Profile Optimization Checklist',
    priceDollars: 12,
    description: 'The same checklist recruiters use to decide who gets a message.',
  },
  {
    id: 'starbank',
    name: 'Behavioural Question Story Bank (STAR Method)',
    priceDollars: 19,
    description: 'Pre-built STAR stories you can adapt to almost any behavioural question.',
  },
  {
    id: 'followup',
    name: 'Post-Interview Follow-Up Email Templates',
    priceDollars: 9,
    description: 'Send the right note within the hour, every time.',
  },
  {
    id: 'plan30',
    name: '30-Day Job Search Action Plan',
    priceDollars: 17,
    description: 'A day-by-day plan so you always know exactly what to do next.',
  },
]
