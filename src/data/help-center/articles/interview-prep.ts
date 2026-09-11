import type { HelpArticle } from '../types'

export const interviewPrepArticles: readonly HelpArticle[] = [
  {
    slug: 'how-mock-interviews-work',
    title: 'How AI mock interviews work',
    description: 'Practice with an AI interviewer and get a detailed report.',
    lastUpdated: '2026-09-01',
    content: [
      { type: 'paragraph', text: 'Interview Prep lets you practice with an AI-powered interviewer that adapts to your target role and provides a full performance report after every session.' },
      { type: 'heading', text: 'Starting a session', level: 2 },
      { type: 'list', ordered: true, items: [
        'Select the resume you want to practice with.',
        'Enter the target job description or company name.',
        'Choose your interview type: behavioral, technical, case study, or general.',
        'The AI asks questions, you respond (text or voice), and receive real-time feedback.',
      ]},
      { type: 'heading', text: 'After the session', level: 2 },
      { type: 'paragraph', text: 'You receive a detailed report covering your strengths, areas for improvement, specific answer quality scores, and actionable suggestions for each question.' },
    ],
  },
  {
    slug: 'interview-types',
    title: 'Interview types you can practice',
    description: 'Behavioral, technical, case study, and general.',
    lastUpdated: '2026-09-01',
    content: [
      { type: 'paragraph', text: 'Jobwhisper supports four interview types, each tailored to different roles and stages of the interview process.' },
      { type: 'list', items: [
        'Behavioral — focuses on past experiences, leadership, teamwork, and conflict resolution. Common in most interviews.',
        'Technical — coding challenges, system design, and technical problem-solving. For engineering and technical roles.',
        'Case study — business problems, strategic thinking, and analytical reasoning. For consulting, PM, and business roles.',
        'General — a mix of common questions covering motivation, strengths, weaknesses, and culture fit.',
      ]},
      { type: 'callout', variant: 'tip', text: 'Not sure which type to pick? Start with behavioral — it is the most common format across industries.' },
    ],
  },
  {
    slug: 'practicing-for-a-specific-company',
    title: 'Practicing for a specific company',
    description: 'Tailor your practice session to any employer.',
    lastUpdated: '2026-09-01',
    content: [
      { type: 'paragraph', text: 'You can set the job details for any company, and the AI will tailor its questions and feedback to match that employer\'s typical interview style.' },
      { type: 'heading', text: 'How to set it up', level: 2 },
      { type: 'list', ordered: true, items: [
        'In Interview Prep, enter the company name and job title.',
        'Paste the actual job description if you have it — this gives the AI the most context.',
        'The AI generates questions that match the role, seniority, and industry.',
      ]},
      { type: 'paragraph', text: 'The more context you provide, the more relevant and useful the practice session will be.' },
    ],
  },
]
