import type { FunnelQuestion, FunnelTrialOffer } from '@/contracts/funnel.draft'

export const creditsFunnelQuestions: readonly FunnelQuestion[] = [
  {
    id: 'goal',
    tab: 'Goal',
    ask: 'What do you want to do with this resume?',
    kind: 'options',
    options: [
      { label: 'Tailor it to this job', hint: 'Rewrite it around the posting, leading with the experience the employer asked for.' },
      { label: 'Auto-Apply to roles like it', hint: 'Find matching roles and prepare every application for you to approve.' },
      { label: 'Practise for the interview', hint: 'Rehearse with an AI interviewer on this role, then read what landed.' },
      { label: 'Get live help in the interview', hint: 'Copilot in the real conversation, drawn from this resume and this posting.' },
    ],
  },
  {
    id: 'timing',
    tab: 'Timing',
    ask: 'How soon are you looking to start?',
    kind: 'options',
    options: [
      { label: 'Right away', hint: 'I could start within a fortnight.' },
      { label: 'Within a month', hint: 'I have notice to work, or a date in mind.' },
      { label: 'One to three months', hint: 'No rush, but I am moving.' },
      { label: 'Just exploring', hint: 'Seeing what is out there before I commit.' },
    ],
  },
  {
    id: 'pace',
    tab: 'Pace',
    ask: 'How many interviews do you want a week?',
    kind: 'options',
    options: [
      { label: 'One or two', hint: 'Fewer roles, more preparation for each one.' },
      { label: 'Three to five', hint: 'A steady week without losing the day job.' },
      { label: 'Five or more', hint: 'Volume. Keep them coming.' },
      { label: 'As many as I can get', hint: 'Apply wide and sort the shortlist later.' },
    ],
  },
  {
    id: 'setup',
    tab: 'Setup',
    ask: 'What kind of role are you looking for?',
    kind: 'options',
    options: [
      { label: 'Fully remote', hint: 'Anywhere, with no commute in the offer.' },
      { label: 'Hybrid', hint: 'Some days in the office, some at home.' },
      { label: 'On-site', hint: 'In person, with a team around you.' },
      { label: 'Open to any', hint: 'The role matters more than where it is.' },
    ],
  },
  {
    id: 'title',
    tab: 'Title',
    ask: 'What job title are you going for?',
    kind: 'text',
    placeholder: 'e.g. Senior Product Designer',
  },
  {
    id: 'reason',
    tab: 'About you',
    ask: 'What brings you to Jobwhisper?',
    kind: 'options',
    options: [
      { label: 'Actively job hunting', hint: 'Applying now, and I want to move faster.' },
      { label: 'Open to the right thing', hint: 'Not looking hard, but I would take a good role.' },
      { label: 'Preparing for interviews', hint: 'I have rounds booked and want to be ready.' },
      { label: 'Just having a look', hint: 'Working out whether this is for me.' },
    ],
  },
  {
    id: 'source',
    tab: 'About you',
    ask: 'How did you hear about us?',
    kind: 'pills',
    choices: ['Search', 'Social', 'A friend', 'YouTube', 'An ad', 'Somewhere else'],
  },
]

export const creditsFunnelOffer: FunnelTrialOffer = {
  credits: 500,
  creditsWorth: 'About 500 minutes of Interview Copilot or practice',
  trialDays: 7,
  planName: 'Pro',
  firstMonthUsd: 40,
  monthlyUsd: 99,
  reminderDaysBefore: 2,
  firstChargeOn: '2026-10-02',
}
