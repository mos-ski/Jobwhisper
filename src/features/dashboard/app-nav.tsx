import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

import { SideMenu, Workspace, type SideMenuItem, type WorkspaceProps } from '@/ui'

import {
  AutoApplyIcon,
  BillingIcon,
  CopilotIcon,
  DashboardIcon,
  DocumentsIcon,
  DownloadIcon,
  InterviewPrepIcon,
  KnowledgeBaseIcon,
  MarketplaceIcon,
  SettingsIcon,
  SupportIcon,
  TutorialIcon,
} from './dashboard-nav-icons'

type AppNavEntry = {
  readonly label: string
  readonly href: string
  readonly icon: ReactNode
  /** Pathname prefix that marks this item active — broader than an exact match so any sub-route of a section (e.g. /v3/auto-apply/method) still highlights its parent nav item. */
  readonly matchPrefix: string
  readonly dividerBefore?: boolean
}

const APP_NAV_ENTRIES: readonly AppNavEntry[] = [
  { label: 'Dashboard', href: '/v3/app', icon: <DashboardIcon />, matchPrefix: '/v3/app' },
  { label: 'My Documents', href: '/v3/resume/history', icon: <DocumentsIcon />, matchPrefix: '/v3/resume' },
  { label: 'Auto-Apply', href: '/v3/auto-apply/jobs', icon: <AutoApplyIcon />, matchPrefix: '/v3/auto-apply' },
  { label: 'Interview Prep', href: '/v3/interview-prep/history', icon: <InterviewPrepIcon />, matchPrefix: '/v3/interview-prep' },
  { label: 'Interviews & Meetings', href: '/v3/interview-copilot/history', icon: <CopilotIcon />, matchPrefix: '/v3/interview-copilot' },
  { label: 'Knowledge Base', href: '/v3/documents', icon: <KnowledgeBaseIcon />, matchPrefix: '/v3/documents', dividerBefore: true },
  { label: 'Marketplace', href: '/v3/marketplace', icon: <MarketplaceIcon />, matchPrefix: '/v3/marketplace' },
  { label: 'Download Apps', href: '/v3/downloads', icon: <DownloadIcon />, matchPrefix: '/v3/downloads' },
  { label: 'Billing & subscription', href: '/v3/billing', icon: <BillingIcon />, matchPrefix: '/v3/billing' },
  { label: 'Settings', href: '/v3/settings', icon: <SettingsIcon />, matchPrefix: '/v3/settings' },
  { label: 'Tutorial', href: '/v3/tutorials', icon: <TutorialIcon />, matchPrefix: '/v3/tutorials', dividerBefore: true },
  { label: 'Support', href: '/v3/support', icon: <SupportIcon />, matchPrefix: '/v3/support' },
]

export function useAppSideMenuItems(): readonly SideMenuItem[] {
  const { pathname } = useLocation()
  return APP_NAV_ENTRIES.map((entry) => ({
    label: entry.label,
    href: entry.href,
    icon: entry.icon,
    active: pathname.startsWith(entry.matchPrefix),
    dividerBefore: entry.dividerBefore,
  }))
}

/** Persistent, always-collapsed icon rail shown beside every signed-in page outside the dashboard home (which has its own expandable sidebar). */
function AppSideNav() {
  const items = useAppSideMenuItems()
  return <SideMenu items={items} collapsed />
}

export type AppShellProps = WorkspaceProps

/** Drop-in replacement for the bare `Workspace` wrapper every non-dashboard page used to render on its own — adds the collapsed nav rail so a page is never a dead end back to Home. */
export function AppShell({ children, className, ...props }: AppShellProps) {
  return (
    <Workspace className={className} {...props}>
      <div className="flex">
        <AppSideNav />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </Workspace>
  )
}
