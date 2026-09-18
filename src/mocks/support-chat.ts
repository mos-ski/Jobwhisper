import type {
  SupportChatMessage,
  QuickReply,
  SupportChatSession,
  KBArticle,
  KBCategory,
} from '@/contracts/support-chat'

export const supportChatQuickReplies: readonly QuickReply[] = [
  { id: 'qr_credits', label: 'Credits', payload: 'How do credits work?' },
  { id: 'qr_billing', label: 'Billing', payload: 'I have a billing question' },
  { id: 'qr_copilot', label: 'Copilot', payload: 'How does Copilot work?' },
  { id: 'qr_resume', label: 'Resume', payload: 'How do I build my resume?' },
  { id: 'qr_auto_apply', label: 'Auto Apply', payload: 'How does Auto Apply work?' },
  { id: 'qr_human', label: 'Talk to a human', payload: 'I need to speak with a team member' },
]

export const supportBotGreeting: SupportChatMessage = {
  id: 'msg_greeting',
  sender: 'bot',
  authorName: 'Jobwhisper Bot',
  body: "Hi there! I'm here to help. What can I assist you with today?",
  timestampLabel: 'Just now',
}

export const supportBotResponses: Record<string, string> = {
  credits:
    'Credits are used to access premium features like Resume Tailoring, Interview Prep, and Auto Apply. Each feature has a different credit cost. You can check your balance in the Billing page.',
  billing:
    'For billing questions, you can manage your subscription and view invoices in the Billing section of your dashboard. Need help with a specific charge?',
  copilot:
    'Interview Copilot gives you real-time AI coaching during practice interviews. It listens to your answers and provides instant feedback on delivery, content, and structure.',
  resume:
    'You can build your resume from scratch or upload an existing one. Our AI will help you tailor it for specific job descriptions to maximize your match score.',
  'auto apply':
    'Auto Apply lets you set preferences once and we automatically apply to matched jobs on your behalf. You can review and approve each application before it goes out.',
  human: "I'll connect you with a team member right away. You'll be notified when they join.",
}

export const supportHandoffMessage: SupportChatMessage = {
  id: 'msg_handoff',
  sender: 'system',
  authorName: 'System',
  body: 'Connecting you to a team member...',
  timestampLabel: 'Just now',
}

export const supportHumanMessage: SupportChatMessage = {
  id: 'msg_human_1',
  sender: 'human',
  authorName: 'Daniel Okoye',
  body: "Hey! I saw you had a question. How can I help?",
  timestampLabel: '2 min ago',
}

export const supportUserMessage1: SupportChatMessage = {
  id: 'msg_user_1',
  sender: 'user',
  authorName: 'You',
  body: 'I was charged twice for my Pro subscription',
  timestampLabel: '3 min ago',
}

export const supportBotMessage1: SupportChatMessage = {
  id: 'msg_bot_1',
  sender: 'bot',
  authorName: 'Jobwhisper Bot',
  body: "I'm sorry to hear that. Let me look into this for you. Can you confirm the email address associated with your account?",
  timestampLabel: '3 min ago',
}

export const initialSupportSession: SupportChatSession = {
  id: 'chat_session_1',
  state: 'idle',
  messages: [],
  quickReplies: supportChatQuickReplies,
}

export const kbCategories: readonly KBCategory[] = [
  { id: 'getting-started', label: 'Getting Started', count: 8 },
  { id: 'credits-billing', label: 'Credits & Billing', count: 12 },
  { id: 'resume', label: 'Resume Builder', count: 15 },
  { id: 'interview-prep', label: 'Interview Prep', count: 10 },
  { id: 'copilot', label: 'Copilot', count: 7 },
  { id: 'auto-apply', label: 'Auto Apply', count: 9 },
  { id: 'account', label: 'Account & Settings', count: 6 },
  { id: 'troubleshooting', label: 'Troubleshooting', count: 11 },
]

export const kbArticles: readonly KBArticle[] = [
  {
    id: 'kb_001',
    category: 'getting-started',
    question: 'How do I create my first resume?',
    answer: 'Go to the Resume page and click "New Resume". You can start from scratch or upload an existing PDF. Our AI will help you fill in the details and optimize for your target role.',
    updatedAtLabel: '2 days ago',
    isPublished: true,
  },
  {
    id: 'kb_002',
    category: 'credits-billing',
    question: 'How do credits work?',
    answer: 'Credits are used to access premium features. Each feature costs a different amount — Resume Tailoring costs 5 credits, Interview Prep costs 10 credits, and Auto Apply costs 3 credits per application. You can top up credits from the Billing page.',
    updatedAtLabel: '1 week ago',
    isPublished: true,
  },
  {
    id: 'kb_003',
    category: 'credits-billing',
    question: 'How do I upgrade to Pro?',
    answer: 'Navigate to Billing > Plans and select the Pro plan. You can pay with card or bank transfer. Pro includes 100 credits per month, unlimited resume builds, and priority support.',
    updatedAtLabel: '3 days ago',
    isPublished: true,
  },
  {
    id: 'kb_004',
    category: 'copilot',
    question: 'What is Interview Copilot?',
    answer: 'Interview Copilot is a real-time AI coach that listens to your practice interviews and gives instant feedback on your answers, body language, and delivery. It works in your browser with no downloads required.',
    updatedAtLabel: '5 days ago',
    isPublished: true,
  },
  {
    id: 'kb_005',
    category: 'auto-apply',
    question: 'How does Auto Apply work?',
    answer: 'Set your job preferences (role, location, salary range, company size) and Auto Apply will automatically find and apply to matching jobs. You get notified for each application and can approve or reject before submission.',
    updatedAtLabel: '1 day ago',
    isPublished: true,
  },
  {
    id: 'kb_006',
    category: 'troubleshooting',
    question: 'My credits are not showing after purchase',
    answer: 'Credits usually appear within 2-3 minutes. If they haven\'t appeared after 10 minutes, try refreshing the page. If the issue persists, contact support with your payment confirmation email.',
    updatedAtLabel: '4 days ago',
    isPublished: true,
  },
  {
    id: 'kb_007',
    category: 'resume',
    question: 'Can I export my resume as PDF?',
    answer: 'Yes. After building or tailoring your resume, click the "Export" button and select PDF. The export is free and does not cost any credits.',
    updatedAtLabel: '6 days ago',
    isPublished: true,
  },
  {
    id: 'kb_008',
    category: 'interview-prep',
    question: 'How do I start an interview practice session?',
    answer: 'Go to Interview Prep, select your target role and industry, then choose a question category (behavioral, technical, case study). The AI will conduct the interview and provide a detailed scorecard at the end.',
    updatedAtLabel: '1 week ago',
    isPublished: true,
  },
  {
    id: 'kb_009',
    category: 'account',
    question: 'How do I change my email address?',
    answer: 'Go to Settings > Account and click "Edit" next to your email. You\'ll need to verify the new email address before the change takes effect.',
    updatedAtLabel: '2 weeks ago',
    isPublished: true,
  },
  {
    id: 'kb_010',
    category: 'credits-billing',
    question: 'Can I get a refund?',
    answer: 'We offer refunds within 7 days of purchase if you haven\'t used any credits from that purchase. Contact support with your order number to request a refund.',
    updatedAtLabel: '3 days ago',
    isPublished: false,
  },
]
