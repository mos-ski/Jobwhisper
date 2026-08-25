import type { InterviewHistoryRow, InterviewLiveSession, InterviewPrepSession, InterviewReport, InterviewReportStep, InterviewerVoice } from '@/contracts/interview.draft'

export const interviewSession: InterviewPrepSession = {
  id: 'interview-session-001',
  uploadedFileName: 'adewale_damola_PM_resume.pdf',
  interviewType: 'introductory',
  difficulty: 'medium',
  targetRole: 'Product Manager',
  companyName: 'Google',
  additionalContext:
    'I am preparing for a product manager interview focused on growth, user research, and cross-functional leadership. The role expects clear examples of prioritization, metrics, and stakeholder communication.',
  optionalDocuments: ['Product case notes.pdf'],
}

export const interviewerVoices: readonly InterviewerVoice[] = [
  {
    id: 'amelie-laurent',
    name: 'Amélie Laurent',
    title: 'Founder & CEO',
    summary: 'Former co-founder of Opendoor. Early staff at Spotify and Clearbit.',
    imageSrc: '/v3-assets/Interiew characters/Image4.png',
    selected: false,
    audioSrc: '/v3-assets/voice-preview-amelie.mp3',
  },
  {
    id: 'nikolas-gibbons',
    name: 'Nikolas Gibbons',
    title: 'Engineering Manager',
    summary: 'Lead engineering teams at Figma, Pitch, and Protocol Labs.',
    imageSrc: '/v3-assets/Interiew characters/Image5.png',
    selected: false,
    audioSrc: '/v3-assets/voice-preview-nikolas.mp3',
  },
  {
    id: 'sienna-hewitt',
    name: 'Sienna Hewitt',
    title: 'Product Manager',
    summary: 'Former PM for Linear, Lambda School, and On Deck.',
    imageSrc: '/v3-assets/Interiew characters/Image-1.png',
    selected: false,
    audioSrc: '/v3-assets/voice-preview-sienna.mp3',
  },
  {
    id: 'zahra-christensen',
    name: 'Zahra Christensen',
    title: 'Backend Developer',
    summary: 'Lead backend dev at Clearbit. Former Clearbit and Loom.',
    imageSrc: '/v3-assets/Interiew characters/Image-2.png',
    selected: false,
    audioSrc: '/v3-assets/voice-preview-zahra.mp3',
  },
  {
    id: 'caitlyn-king',
    name: 'Caitlyn King',
    title: 'Product Designer',
    summary: 'Founding design team at Figma. Former Pleo, Stripe, and Tile.',
    imageSrc: '/v3-assets/Interiew characters/Image-3.png',
    selected: false,
    audioSrc: '/v3-assets/voice-preview-caitlyn.mp3',
  },
  {
    id: 'zaid-schwartz',
    name: 'Zaid Schwartz',
    title: 'UX Researcher',
    summary: 'Lead user research for Slack. Contractor for Netflix and Udacity.',
    imageSrc: '/v3-assets/Interiew characters/Image-4.png',
    selected: false,
    audioSrc: '/v3-assets/voice-preview-zaid.mp3',
  },
]

export const interviewLiveSession: InterviewLiveSession = {
  title: 'Interview for UI/UX Designer',
  timer: '00:04',
  signalLabel: 'Strong',
  activityLabel: 'Idle...',
  interviewer: {
    name: 'Nikolas Gibbons',
    title: 'Engineering Manager',
    label: 'Maya · Interviewer',
    imageSrc: '/v3-assets/figma/live-session-nikolas.png',
  },
  candidate: {
    name: 'You',
    title: 'Product Manager',
    label: 'Darnell Smith · You',
    imageSrc: '/v3-assets/figma/live-session-darnell.png',
  },
  questions: [
    { id: 'question-1', text: 'Walk me through a time you had to prioritize a roadmap with limited engineering capacity.' },
    { id: 'question-2', text: 'Tell me about a product decision you made using data that turned out to be wrong. What did you do next?' },
    { id: 'question-3', text: 'How do you handle disagreement with an engineering lead about scope or timeline?' },
    { id: 'question-4', text: 'Describe a launch you owned end-to-end. What was the outcome and what would you change?' },
    { id: 'question-5', text: 'Where do you see the biggest opportunity for this product in the next twelve months?' },
  ],
}

export const reportSteps: readonly InterviewReportStep[] = [
  { id: 'recording', label: 'Processing call recording', status: 'active' },
  { id: 'transcript', label: 'Fetching transcript and audio', status: 'pending' },
  { id: 'analysis', label: 'Analyzing performance', status: 'pending' },
  { id: 'feedback', label: 'Generating coaching feedback', status: 'pending' },
]

export const interviewHistoryRows: readonly InterviewHistoryRow[] = [
  { id: 'interview-history-1', title: 'Product Manager', company: 'Amazon Inc.', score: 88, duration: '34m', dateTime: 'August 13th 2026, 12:49 pm' },
  { id: 'interview-history-2', title: 'Senior Product Designer', company: 'Google', score: 76, duration: '22m', dateTime: 'August 10th 2026, 3:18 pm' },
  { id: 'interview-history-3', title: 'Growth Product Lead', company: 'Notion', score: 93, duration: '48m', dateTime: 'August 6th 2026, 8:44 am' },
  { id: 'interview-history-4', title: 'Backend Engineer, Payments', company: 'Stripe', score: 68, duration: '17m', dateTime: 'August 2nd 2026, 11:05 am' },
  { id: 'interview-history-5', title: 'UX Researcher', company: 'Spotify', score: 84, duration: '39m', dateTime: 'July 28th 2026, 5:23 pm' },
  { id: 'interview-history-6', title: 'Recruiter Screen - Compliance Analyst', company: 'Goldman Sachs', score: 71, duration: '14m', dateTime: 'July 23rd 2026, 9:52 am' },
  { id: 'interview-history-7', title: 'Data Analyst', company: 'Airbnb', score: 89, duration: '31m', dateTime: 'July 18th 2026, 1:37 pm' },
  { id: 'interview-history-8', title: 'Marketing Manager, Lifecycle', company: 'HubSpot', score: 62, duration: '26m', dateTime: 'July 13th 2026, 4:09 pm' },
  { id: 'interview-history-9', title: 'Director of Product', company: 'Lightforth', score: 95, duration: '52m', dateTime: 'July 8th 2026, 10:47 am' },
  { id: 'interview-history-10', title: 'Head of Product', company: 'DeeXoptions', score: 79, duration: '20m', dateTime: 'July 2nd 2026, 6:15 pm' },
]

export const interviewReport: InterviewReport = {
  title: 'Recruiter Screen - Product Designer',
  subtitle: 'Recruiter Screen · Senior Recruiter · 18 min',
  interviewerImageSrc: '/v3-assets/interview-report-maya.png',
  score: 82,
  summary:
    'You showed strong raw material: specific metrics, a grounded product story, and calm recovery when pressed. The main improvement area is sequencing. Lead with the concrete example earlier, then use the broader narrative as support.',
  whatWentWell: [
    'Used specific metrics (42% to 57% activation lift) to quantify impact',
    'Showed genuine cross-functional partnership language with engineering',
    'Calm recovery when pressed for specificity — adapted quickly',
  ],
  whatNeedsWork: [
    'Lead with the concrete example earlier in your answer',
    'Tighten the opening — too much framing before the core point',
    'Explain how design decisions were made, not just what was built',
  ],
  knowledgeGaps: [
    'Design process articulation lacked depth on research methods',
    'No mention of user testing or validation approaches',
    'Portfolio storytelling needs stronger problem framing',
  ],
  suggestedQuestions: [
    'Tell me about a time you had to make a design decision with incomplete data. How did you approach it?',
    'Describe your process for prioritizing competing design requirements from different stakeholders.',
    'How do you measure the success of a design change after it ships?',
    'Walk me through how you collaborate with engineers when a design requires technical trade-offs.',
  ],
  rubric: [
    { element: 'Answer Structure', status: 'partial', notes: 'Lead with outcome, then context. The strongest examples arrived after the second prompt.' },
    { element: 'Specificity', status: 'strong', notes: 'Metrics were credible. Put one measurable result in the first thirty seconds.' },
    { element: 'Pace and Clarity', status: 'partial', notes: 'For recruiter screens, aim for concise answers with room for follow-up.' },
    { element: 'Design Process Articulation', status: 'strong', notes: 'Clearly described research → wireframe → prototype → test cycle with concrete artifacts.' },
    { element: 'Tool & Craft Depth', status: 'needs-work', notes: 'Mentioned Figma and prototyping but did not explain how design decisions were made or validated.' },
    { element: 'Cross-Functional Collaboration', status: 'strong', notes: 'Designed with eng and PM from kickoff — language showed genuine partnership, not handoff.' },
  ],
  talkTime: {
    youPercent: 47,
    interviewerPercent: 53,
    tip: 'For recruiter screens, aim for concise answers with room for follow-up.',
  },
  metrics: [
    {
      id: 'structure',
      label: 'Answer Structure',
      score: 82,
      interviewerScore: 73,
      note: 'Lead with outcome, then context. The strongest examples arrived after the second prompt.',
    },
    {
      id: 'specificity',
      label: 'Specificity',
      score: 86,
      interviewerScore: 68,
      note: 'Metrics were credible. Put one measurable result in the first thirty seconds.',
    },
    {
      id: 'pace',
      label: 'Pace and Clarity',
      score: 79,
      interviewerScore: 53,
      note: 'For recruiter screens, aim for concise answers with room for follow-up.',
    },
  ],
  transcript: [
    {
      id: 'transcript-1',
      speaker: 'Maya',
      timestamp: '00:09',
      text: 'Walk me through the kind of product work you want to be known for, and keep it to ninety seconds.',
    },
    {
      id: 'transcript-2',
      speaker: 'You',
      timestamp: '00:31',
      text: 'I want to be known for turning messy user problems into clear product systems. My strongest work sits where research, interaction design, and business goals meet.',
    },
    {
      id: 'transcript-3',
      speaker: 'Maya',
      timestamp: '02:14',
      text: 'That is clear, but I need one specific product example. What changed because of your work?',
    },
    {
      id: 'transcript-4',
      speaker: 'You',
      timestamp: '02:46',
      text: 'On a retention project, I redesigned onboarding around user intent signals and partnered with engineering to instrument drop-off. Activation improved from 42 percent to 57 percent over the next release cycle.',
    },
  ],
}
