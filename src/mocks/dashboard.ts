import type { DashboardAction, DashboardInstallPrompt, DashboardNavItem } from '@/contracts/dashboard.draft'

export const dashboardNavItems: readonly DashboardNavItem[] = [
  { label: 'Dashboard', href: '/v3/app', active: true },
  { label: 'My Documents', href: '/v3/resume/history' },
  { label: 'Auto-Apply', href: '/v3/auto-apply/jobs' },
  { label: 'Interview Prep', href: '/v3/interview-prep/history' },
  { label: 'Interviews & Meetings', href: '/v3/interview-copilot/history' },
  { label: 'Knowledge Base', href: '/v3/documents' },
  { label: 'Download Apps', href: '/v3/downloads' },
  { label: 'Billing & subscription', href: '/v3/billing' },
  { label: 'Settings', href: '/v3/settings' },
]

export const dashboardActions: readonly DashboardAction[] = [
  {
    id: 'resume-tailor',
    title: 'Tailor my Resume',
    description: 'Let Lightforth craft your perfect resume tailored to every role and optimized for results.',
    href: '/v3/resume',
    featured: true,
  },
  {
    id: 'interview-practice',
    title: 'Practice For Interview',
    description: 'Practice with AI interviewers, get actionable feedback, and walk into interviews more confident than ever.',
    href: '/v3/interview-prep',
  },
  {
    id: 'interview-copilot',
    title: 'Interview Copilot',
    description: 'Live AI assistance during interviews — real-time suggestions as the conversation happens.',
    href: '/v3/interview-copilot?mode=interview',
  },
  {
    id: 'auto-apply',
    title: 'Apply for Jobs',
    description: 'Let Lightforth auto-apply to relevant roles based on your preferences no more job hunting stress.',
    href: '/v3/auto-apply',
    badge: 'BETA',
  },
  {
    id: 'coding-copilot',
    title: 'Coding Copilot',
    description: 'Live AI assistance for coding interviews — real-time hints as you work through the problem.',
    href: '/v3/interview-copilot?mode=coding',
  },
  {
    id: 'meeting-copilot',
    title: 'Meeting Copilot',
    description: 'Live AI assistance during meetings — real-time notes and talking points as the conversation happens.',
    href: '/v3/interview-copilot?mode=meeting',
    locked: true,
  },
]

export const dashboardInstallPrompt: DashboardInstallPrompt = {
  title: 'Install the Lightforth desktop or mobile app to get live Copilot assistance wherever you interview.',
  qrSrc: '/v3-assets/Barcode.png',
  desktopHref: '/v3/downloads/desktop',
  mobileHref: '/v3/downloads/mobile',
}
