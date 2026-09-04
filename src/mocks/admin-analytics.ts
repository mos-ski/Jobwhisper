import type {
  AdminAnalyticsDemographics,
  AdminAnalyticsFunnels,
  AdminAnalyticsReferrals,
  AdminAnalyticsScores,
  AdminAnalyticsSurveyDistributions,
} from '@/contracts/admin-analytics.draft'

export const adminAnalyticsSurveyDistributions: AdminAnalyticsSurveyDistributions = {
  dateRangeLabel: 'Aug 5 – Sep 3, 2026',
  distributions: [
    {
      questionId: 'question-intent',
      prompt: 'What brought you to Jobwhisper today?',
      type: 'single-select',
      totalResponses: 1_734,
      buckets: [
        { optionId: 'option-intent-interview', label: 'I have interviews coming up', count: 712, percent: 41 },
        { optionId: 'option-intent-search', label: 'I am looking for roles right now', count: 520, percent: 30 },
        { optionId: 'option-intent-handsoff', label: 'I want someone to apply for me', count: 346, percent: 20 },
        { optionId: 'option-intent-browsing', label: 'Just looking around', count: 156, percent: 9 },
      ],
    },
    {
      questionId: 'question-timeline',
      prompt: 'When is your next interview?',
      type: 'single-select',
      totalResponses: 1_734,
      buckets: [
        { optionId: 'option-timeline-week', label: 'This week', count: 486, percent: 28 },
        { optionId: 'option-timeline-month', label: 'In the next month', count: 624, percent: 36 },
        { optionId: 'option-timeline-later', label: 'Later than a month out', count: 382, percent: 22 },
        { optionId: 'option-timeline-none', label: 'Nothing booked yet', count: 242, percent: 14 },
      ],
    },
    {
      questionId: 'question-rounds',
      prompt: 'Which rounds do you expect?',
      type: 'multi-select',
      totalResponses: 1_482,
      buckets: [
        { optionId: 'option-rounds-screen', label: 'Recruiter screen', count: 891, percent: 60 },
        { optionId: 'option-rounds-behavioural', label: 'Behavioural', count: 741, percent: 50 },
        { optionId: 'option-rounds-coding', label: 'Live coding', count: 534, percent: 36 },
        { optionId: 'option-rounds-system', label: 'System design', count: 386, percent: 26 },
        { optionId: 'option-rounds-panel', label: 'Panel or onsite loop', count: 297, percent: 20 },
      ],
    },
    {
      questionId: 'question-role',
      prompt: 'What role are you targeting?',
      type: 'free-text',
      totalResponses: 1_198,
      buckets: [],
    },
  ],
}

export const adminAnalyticsDemographics: AdminAnalyticsDemographics = {
  dateRangeLabel: 'Aug 5 – Sep 3, 2026',
  distributions: [
    {
      dimension: 'Desired role',
      total: 1_734,
      buckets: [
        { label: 'Product Manager', count: 347, percent: 20 },
        { label: 'Software Engineer', count: 295, percent: 17 },
        { label: 'Data Analyst', count: 225, percent: 13 },
        { label: 'Marketing Manager', count: 191, percent: 11 },
        { label: 'UX/UI Designer', count: 173, percent: 10 },
        { label: 'Backend Engineer', count: 156, percent: 9 },
        { label: 'Frontend Engineer', count: 139, percent: 8 },
        { label: 'Other', count: 208, percent: 12 },
      ],
    },
    {
      dimension: 'Experience level',
      total: 1_734,
      buckets: [
        { label: 'Entry Level', count: 278, percent: 16 },
        { label: 'Mid Level', count: 590, percent: 34 },
        { label: 'Senior', count: 607, percent: 35 },
        { label: 'Lead', count: 191, percent: 11 },
        { label: 'Executive', count: 68, percent: 4 },
      ],
    },
    {
      dimension: 'Country',
      total: 1_561,
      buckets: [
        { label: 'Nigeria', count: 421, percent: 27 },
        { label: 'United States', count: 312, percent: 20 },
        { label: 'India', count: 234, percent: 15 },
        { label: 'United Kingdom', count: 156, percent: 10 },
        { label: 'Canada', count: 125, percent: 8 },
        { label: 'Germany', count: 94, percent: 6 },
        { label: 'Other', count: 219, percent: 14 },
      ],
    },
  ],
}

export const adminAnalyticsScores: AdminAnalyticsScores = {
  dateRangeLabel: 'Aug 5 – Sep 3, 2026',
  scoreDistribution: {
    buckets: [
      { range: '0–19', count: 4 },
      { range: '20–39', count: 18 },
      { range: '40–59', count: 87 },
      { range: '60–79', count: 246 },
      { range: '80–100', count: 189 },
    ],
    totalSessions: 544,
    averageScore: 74,
  },
  scoreTrend: {
    points: [
      { label: 'Aug 5', averageScore: 71, sessionCount: 14 },
      { label: 'Aug 7', averageScore: 73, sessionCount: 16 },
      { label: 'Aug 9', averageScore: 70, sessionCount: 12 },
      { label: 'Aug 11', averageScore: 75, sessionCount: 18 },
      { label: 'Aug 13', averageScore: 76, sessionCount: 20 },
      { label: 'Aug 15', averageScore: 72, sessionCount: 15 },
      { label: 'Aug 17', averageScore: 74, sessionCount: 17 },
      { label: 'Aug 19', averageScore: 77, sessionCount: 22 },
      { label: 'Aug 21', averageScore: 78, sessionCount: 24 },
      { label: 'Aug 23', averageScore: 73, sessionCount: 19 },
      { label: 'Aug 25', averageScore: 75, sessionCount: 21 },
      { label: 'Aug 27', averageScore: 79, sessionCount: 26 },
      { label: 'Aug 29', averageScore: 80, sessionCount: 28 },
      { label: 'Aug 31', averageScore: 76, sessionCount: 23 },
      { label: 'Sep 2', averageScore: 81, sessionCount: 30 },
    ],
    totalSessions: 544,
    averageScore: 74,
  },
}

export const adminAnalyticsFunnels: AdminAnalyticsFunnels = {
  dateRangeLabel: 'Aug 5 – Sep 3, 2026',
  funnel: {
    stages: [
      { id: 'top-of-funnel', label: 'Landing page visit', count: 12_480, percentOfTop: 100, dropOffPercent: 0 },
      { id: 'signup', label: 'Account created', count: 1_734, percentOfTop: 14, dropOffPercent: 86 },
      { id: 'first-session', label: 'First session started', count: 1_128, percentOfTop: 9, dropOffPercent: 35 },
      { id: 'subscribed', label: 'Subscribed', count: 547, percentOfTop: 4, dropOffPercent: 52 },
    ],
    totalTopOfFunnel: 12_480,
  },
  timeToConvert: {
    buckets: [
      { range: 'Same day', count: 203 },
      { range: '1–3 days', count: 164 },
      { range: '4–7 days', count: 98 },
      { range: '8–14 days', count: 52 },
      { range: '15–30 days', count: 21 },
      { range: '31+ days', count: 9 },
    ],
    medianDays: 2,
    averageDays: 5,
  },
}

export const adminAnalyticsReferrals: AdminAnalyticsReferrals = {
  dateRangeLabel: 'Aug 5 – Sep 3, 2026',
  stats: {
    invitesSent: 3_418,
    signupsAttributed: 892,
    conversionToPaidRate: 18,
    creditsPaidOut: 89_200,
    totalReferralRevenue: 74_400_000,
  },
}
