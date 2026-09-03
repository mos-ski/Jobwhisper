import { ArrowUpRight, ChevronRight, CircleHelp, ExternalLink, Lock, LogOut, Mail, Menu, Monitor, PanelLeftClose, PanelLeftOpen, Play, Settings, User, X } from 'lucide-react'
import { FaApple } from 'react-icons/fa'
import { SiGoogleplay } from 'react-icons/si'
import { useState, type ReactNode } from 'react'

import type { DashboardAction, DashboardActionId, DashboardInstallPrompt, DashboardNavItem } from '@/contracts/dashboard.draft'
import type { UserIdentity } from '@/contracts/identity'
import { centsToCredits, formatCredits, usagePercent } from '@/lib/credits'
import { Button, cn, Dialog, DialogClose, DialogPopup, DialogTitle, DialogTrigger, JobwhisperIcon, JobwhisperMark, SideMenu, UpgradeDialog } from '@/ui'
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

export type DashboardViewProps = {
  readonly user: UserIdentity
  readonly navItems: readonly DashboardNavItem[]
  readonly actions: readonly DashboardAction[]
  readonly installPrompt: DashboardInstallPrompt
  readonly creditBalanceCents: number
  readonly totalCreditsCents: number
  readonly autoApplyBalanceCredits: number
  readonly autoApplyTotalCredits: number
  readonly resumeBuilderBalanceCredits: number
  readonly resumeBuilderTotalCredits: number
  readonly isLoading?: boolean
  readonly activeDropdown?: 'help' | 'credits' | 'profile'
  readonly creditNotice?: 'low' | 'empty'
}

const navIconByLabel: Record<string, ReactNode> = {
  Dashboard: <DashboardIcon />,
  'My Documents': <DocumentsIcon />,
  'Auto-Apply': <AutoApplyIcon />,
  'Interview Prep': <InterviewPrepIcon />,
  'Interviews & Meetings': <CopilotIcon />,
  'Knowledge Base': <KnowledgeBaseIcon />,
  Marketplace: <MarketplaceIcon />,
  'Download Apps': <DownloadIcon />,
  'Billing & subscription': <BillingIcon />,
  Settings: <SettingsIcon />,
  Tutorial: <TutorialIcon />,
  Support: <SupportIcon />,
}

const NAV_DIVIDER_LABELS = new Set(['Knowledge Base', 'Tutorial'])

function toSideMenuItems(navItems: readonly DashboardNavItem[]) {
  return navItems.map((item) => ({
    ...item,
    icon: navIconByLabel[item.label] ?? <SettingsIcon />,
    dividerBefore: NAV_DIVIDER_LABELS.has(item.label),
  }))
}

function DashboardSidebar({ navItems, collapsed }: { readonly navItems: readonly DashboardNavItem[]; readonly collapsed: boolean }) {
  return <SideMenu items={toSideMenuItems(navItems)} collapsed={collapsed} />
}

function MobileNavDrawer({ navItems }: { readonly navItems: readonly DashboardNavItem[] }) {
  return (
    <Dialog>
      <DialogTrigger
        aria-label="Open navigation menu"
        className="grid size-11 place-items-center rounded-soft text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus lg:hidden"
      >
        <Menu aria-hidden="true" className="size-6" />
      </DialogTrigger>
      <DialogPopup placement="start" aria-label="Navigation" className="p-0">
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <JobwhisperMark className="h-6 w-auto text-brand-mark" />
          <DialogClose aria-label="Close navigation menu" className="static" />
        </div>
        <SideMenu items={toSideMenuItems(navItems)} className="block h-[calc(100%-3.5rem)] w-full" />
      </DialogPopup>
    </Dialog>
  )
}

function HelpDropdown({ forceOpen = false }: { readonly forceOpen?: boolean }) {
  return (
    <section
      aria-label="Product updates and support"
      className={cn(
        'absolute end-0 top-full z-20 mt-3 hidden w-[min(334px,calc(100vw-2rem))] overflow-hidden rounded-md border border-border bg-surface text-xs shadow-popover group-focus-within:block group-hover:block',
        forceOpen ? 'block' : undefined,
      )}
    >
      <div className="flex items-center justify-between gap-4 bg-positive-surface px-3 py-1.5">
        <h2 className="text-sm font-bold leading-6 text-positive">
          Whats new? <span className="text-danger">*</span>
        </h2>
        <a href="/v3/updates" className="text-xs leading-5 text-ink-muted underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
          See Latest Updates &gt;
        </a>
      </div>
      <div className="grid">
        <article className="px-4 py-2">
          <h3 className="text-xs font-semibold leading-5 text-ink">Supported Browsers</h3>
          <p className="mt-1 text-xs leading-5 text-ink-muted">Chrome (Best Compatibility), Edge, Opera, Brave, Chromium.</p>
        </article>
        <article className="border-t border-border px-4 py-2">
          <h3 className="inline-flex items-center gap-1 text-xs font-semibold leading-5 text-ink">
            Search on help center
            <ExternalLink aria-hidden="true" className="size-3" />
          </h3>
          <p className="mt-1 text-xs leading-5 text-ink-muted">Find answers to frequently asked questions from our written articles.</p>
        </article>
        <article className="border-t border-border px-4 py-2">
          <h3 className="text-xs font-semibold leading-5 text-ink">Give feedback?</h3>
          <p className="mt-1 text-xs leading-5 text-ink-muted">
            <a href="/v3/feedback" className="font-medium text-accent underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Fill this form</a>
            {' '}or Join Discord for support and community interaction or send us an email to{' '}
            <a href="mailto:support@jobwhisper.org" className="font-medium text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">support@jobwhisper.org</a>
          </p>
        </article>
        <article className="border-t border-border px-4 py-2">
          <h3 className="text-xs font-semibold leading-5 text-ink">Support Hours:</h3>
          <p className="mt-1 text-xs leading-5 text-ink-muted">Mon - Fri: 9 AM - 6 PM CST<br />Sat - Sun: Limited Support</p>
        </article>
      </div>
      <a href="/v3/tutorials" className="flex min-h-10 items-center justify-center gap-2 bg-danger px-3 text-sm font-bold text-on-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
        <Play aria-hidden="true" className="size-4" />
        Tutorial Videos
      </a>
      <a href="mailto:support@jobwhisper.org" className="flex min-h-12 items-center justify-center gap-2 bg-accent px-3 text-sm font-semibold text-on-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
        <Mail aria-hidden="true" className="size-4" />
        Send us an email
      </a>
    </section>
  )
}

function HelpModal({ open, onOpenChange }: { readonly open: boolean; readonly onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup aria-label="Product updates and support" className="overflow-hidden p-0">
        <div className="flex items-center justify-between gap-4 bg-positive-surface px-4 py-3">
          <DialogTitle className="text-sm font-bold leading-6 text-positive">
            Whats new? <span className="text-danger">*</span>
          </DialogTitle>
          <DialogClose className="static" />
        </div>
        <div className="grid">
          <a href="/v3/updates" className="border-b border-border px-4 py-2 text-xs leading-5 text-ink-muted underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            See Latest Updates &gt;
          </a>
          <article className="px-4 py-3">
            <h3 className="text-xs font-semibold leading-5 text-ink">Supported Browsers</h3>
            <p className="mt-1 text-xs leading-5 text-ink-muted">Chrome (Best Compatibility), Edge, Opera, Brave, Chromium.</p>
          </article>
          <article className="border-t border-border px-4 py-3">
            <h3 className="inline-flex items-center gap-1 text-xs font-semibold leading-5 text-ink">
              Search on help center
              <ExternalLink aria-hidden="true" className="size-3" />
            </h3>
            <p className="mt-1 text-xs leading-5 text-ink-muted">Find answers to frequently asked questions from our written articles.</p>
          </article>
          <article className="border-t border-border px-4 py-3">
            <h3 className="text-xs font-semibold leading-5 text-ink">Give feedback?</h3>
            <p className="mt-1 text-xs leading-5 text-ink-muted">
              <a href="/v3/feedback" className="font-medium text-accent underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Fill this form</a>
              {' '}or Join Discord for support and community interaction or send us an email to{' '}
              <a href="mailto:support@jobwhisper.org" className="font-medium text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">support@jobwhisper.org</a>
            </p>
          </article>
          <article className="border-t border-border px-4 py-3">
            <h3 className="text-xs font-semibold leading-5 text-ink">Support Hours:</h3>
            <p className="mt-1 text-xs leading-5 text-ink-muted">Mon - Fri: 9 AM - 6 PM CST<br />Sat - Sun: Limited Support</p>
          </article>
        </div>
        <div className="grid gap-2 px-4 pb-2 pt-3">
          <a href="/v3/tutorials" className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-danger text-sm font-bold text-on-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            <Play aria-hidden="true" className="size-4" />
            Tutorial Videos
          </a>
          <a href="mailto:support@jobwhisper.org" className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-accent text-sm font-semibold text-on-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            <Mail aria-hidden="true" className="size-4" />
            Send us an email
          </a>
        </div>
      </DialogPopup>
    </Dialog>
  )
}

function CreditIcon({ className }: { readonly className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 29.9911 29.9911" fill="none" className={className}>
      <path d="M9.53467 17.3274L14.1033 14.5419V8.72991" stroke="currentColor" strokeWidth="2.03323" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M27.4918 21.2437V17.4948C27.4918 16.4585 25.3925 15.6204 22.8057 15.6204C20.219 15.6204 18.121 16.4598 18.1196 17.4948V24.9926C18.121 26.0275 20.2177 26.867 22.8057 26.867C25.3938 26.867 27.4905 26.0275 27.4918 24.9926V17.4948" stroke="currentColor" strokeWidth="2.03323" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.121 17.4948C18.121 18.5298 20.219 19.3692 22.8071 19.3692C25.3951 19.3692 27.4918 18.5298 27.4918 17.4948" stroke="currentColor" strokeWidth="2.03323" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.1196 21.2437C18.1196 22.2786 20.2177 23.1181 22.8057 23.1181C25.3938 23.1181 27.4918 22.2786 27.4918 21.2437" stroke="currentColor" strokeWidth="2.03323" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24.7042 11.2467C23.3946 5.50973 17.8829 1.7531 12.0643 2.63157C6.2457 3.51005 2.08872 8.72642 2.53108 14.5943C2.97344 20.4622 7.86548 24.9964 13.75 24.9926" stroke="currentColor" strokeWidth="2.03323" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function creditPercentLeft(balance: number, total: number): number {
  return total > 0 ? Math.max(0, Math.min(100, Math.round((balance / total) * 100))) : 100
}

type CreditDropdownRow = {
  readonly label: string
  readonly balanceCredits: number
  readonly percentLeft: number
}

function CreditDropdown({
  creditBalanceCents,
  totalCreditsCents,
  autoApplyBalanceCredits,
  autoApplyTotalCredits,
  resumeBuilderBalanceCredits,
  resumeBuilderTotalCredits,
  forceOpen = false,
}: {
  readonly creditBalanceCents: number
  readonly totalCreditsCents: number
  readonly autoApplyBalanceCredits: number
  readonly autoApplyTotalCredits: number
  readonly resumeBuilderBalanceCredits: number
  readonly resumeBuilderTotalCredits: number
  readonly forceOpen?: boolean
}) {
  const rows: readonly CreditDropdownRow[] = [
    {
      label: 'Interview Copilot',
      balanceCredits: Math.round(centsToCredits(creditBalanceCents)),
      percentLeft: usagePercent(creditBalanceCents, totalCreditsCents),
    },
    {
      label: 'Auto Apply',
      balanceCredits: autoApplyBalanceCredits,
      percentLeft: creditPercentLeft(autoApplyBalanceCredits, autoApplyTotalCredits),
    },
    {
      label: 'Resume Builder',
      balanceCredits: resumeBuilderBalanceCredits,
      percentLeft: creditPercentLeft(resumeBuilderBalanceCredits, resumeBuilderTotalCredits),
    },
  ]

  return (
    <section
      aria-label="Usage balance"
      className={cn(
        'absolute end-0 top-full z-20 mt-3 hidden w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-border bg-surface shadow-popover group-focus-within:block group-hover:block',
        forceOpen ? 'block' : undefined,
      )}
    >
      <div className="grid gap-4 px-4 py-4">
        <h2 className="text-sm font-semibold text-ink">Credit balances</h2>
        {rows.map((row) => (
          <div key={row.label}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-medium text-ink">{row.label}</span>
              <span className="text-ink-muted">{row.balanceCredits} credits</span>
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-pill bg-surface-subtle">
                <div className={cn('h-full rounded-pill', row.percentLeft > 20 ? 'bg-accent' : 'bg-danger')} style={{ inlineSize: `${row.percentLeft}%` }} />
              </div>
              <span className="shrink-0 text-xs font-medium text-ink-muted">{row.percentLeft}%</span>
            </div>
          </div>
        ))}
      </div>
      <a
        href="/v3/billing"
        className="block border-t border-border px-4 py-2.5 text-center text-sm text-ink-muted transition-colors hover:bg-surface-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        See detailed breakdown
      </a>
    </section>
  )
}

function CreditNotice({ variant, remainingCents, totalCents }: { readonly variant: 'low' | 'empty'; readonly remainingCents: number; readonly totalCents: number }) {
  const isLow = variant === 'low'
  const remainingPercent = usagePercent(remainingCents, totalCents)

  return (
    <div
      role="status"
      aria-label={isLow ? 'Low balance notice' : 'Empty balance notice'}
      className={cn(
        'absolute start-1/2 top-14 z-10 flex min-h-9 w-[min(684px,calc(100vw-2rem))] -translate-x-1/2 items-center gap-1 rounded-b-xl ps-6 pe-3 text-sm font-semibold shadow-control',
        isLow ? 'bg-accent-subtle text-accent' : 'bg-danger text-on-danger',
      )}
    >
      <p className="min-w-0 flex-1 truncate leading-6">{isLow ? `${remainingPercent}% left this cycle!` : '0% remaining this cycle'}</p>
      <a href="/v3/billing" className="shrink-0 underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
        Upgrade
      </a>
      <button type="button" aria-label="Dismiss balance notice" className="grid size-6 shrink-0 place-items-center rounded-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
        <X aria-hidden="true" className="size-4" />
      </button>
    </div>
  )
}

function ProfileDropdown({ user, forceOpen = false }: { readonly user: UserIdentity; readonly forceOpen?: boolean }) {
  return (
    <section
      aria-label={`Account menu for ${user.name}`}
      className={cn(
        'absolute end-0 top-full z-20 mt-3 hidden w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-md border border-border bg-surface text-sm shadow-popover group-focus-within:block group-hover:block',
        forceOpen ? 'block' : undefined,
      )}
    >
      <div className="flex items-center gap-3 bg-accent-subtle px-4 py-4">
        <span className="relative shrink-0">
          <img src="/v3-assets/dashboard-avatar.png" alt="" className="size-12 rounded-pill object-cover" />
          <span aria-hidden="true" className="absolute bottom-0 end-0 size-3 rounded-pill border-2 border-surface bg-positive" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-base font-bold text-ink">{user.name}</p>
          <p className="truncate text-sm text-ink-muted">{user.email}</p>
        </div>
      </div>
      <nav aria-label="Account">
        <a href="/v3/settings" className="flex min-h-12 items-center gap-3 border-t border-border px-4 text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-inset hover:bg-surface-subtle">
          <User aria-hidden="true" className="size-5 shrink-0 text-ink-muted" />
          <span className="flex-1 font-medium">Account</span>
          <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-ink-muted" />
        </a>
        <a href="/v3/settings?tab=security" className="flex min-h-12 items-center gap-3 border-t border-border px-4 text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-inset hover:bg-surface-subtle">
          <Settings aria-hidden="true" className="size-5 shrink-0 text-ink-muted" />
          <span className="flex-1 font-medium">Security</span>
          <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-ink-muted" />
        </a>
      </nav>
      <button
        type="button"
        className="flex min-h-12 w-full items-center gap-3 border-t border-border px-4 text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-inset hover:bg-danger-surface"
      >
        <LogOut aria-hidden="true" className="size-5 shrink-0" />
        <span className="font-medium">Logout</span>
      </button>
    </section>
  )
}

function DashboardHeader({
  user,
  navItems,
  creditBalanceCents,
  totalCreditsCents,
  autoApplyBalanceCredits,
  autoApplyTotalCredits,
  resumeBuilderBalanceCredits,
  resumeBuilderTotalCredits,
  activeDropdown,
  creditNotice,
  collapsed,
  onToggleCollapse,
}: {
  readonly user: UserIdentity
  readonly navItems: readonly DashboardNavItem[]
  readonly creditBalanceCents: number
  readonly totalCreditsCents: number
  readonly autoApplyBalanceCredits: number
  readonly autoApplyTotalCredits: number
  readonly resumeBuilderBalanceCredits: number
  readonly resumeBuilderTotalCredits: number
  readonly activeDropdown?: 'help' | 'credits' | 'profile'
  readonly creditNotice?: 'low' | 'empty'
  readonly collapsed: boolean
  readonly onToggleCollapse: () => void
}) {
  return (
    <header className="relative flex h-14 items-center justify-between border-b border-border bg-surface px-4 lg:px-5">
      <div className="flex items-center gap-2">
        <MobileNavDrawer navItems={navItems} />
        <a href="/v3" className="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus" aria-label="Jobwhisper home">
          {collapsed ? (
            <JobwhisperIcon className="size-7 text-brand-mark" />
          ) : (
            <JobwhisperMark className="h-7 w-auto text-brand-mark" />
          )}
        </a>
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-pressed={collapsed}
          aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
          className="hidden size-9 place-items-center rounded-soft text-ink-muted transition-colors hover:bg-surface-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus lg:grid"
        >
          {collapsed ? <PanelLeftOpen aria-hidden="true" className="size-5" /> : <PanelLeftClose aria-hidden="true" className="size-5" />}
        </button>
      </div>
      <div className="flex items-center gap-4">
        <div className="group relative">
          <a href="/v3/billing" aria-label={`${formatCredits(creditBalanceCents)} balance remaining`} className="relative grid size-11 place-items-center rounded-soft text-accent-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            <CreditIcon className="size-6" />
            <span className="absolute -start-1.5 top-1 grid min-w-4 place-items-center rounded-pill bg-danger px-1 text-[10px] font-semibold leading-4 text-on-danger">{usagePercent(creditBalanceCents, totalCreditsCents)}%</span>
          </a>
          <CreditDropdown
            creditBalanceCents={creditBalanceCents}
            totalCreditsCents={totalCreditsCents}
            autoApplyBalanceCredits={autoApplyBalanceCredits}
            autoApplyTotalCredits={autoApplyTotalCredits}
            resumeBuilderBalanceCredits={resumeBuilderBalanceCredits}
            resumeBuilderTotalCredits={resumeBuilderTotalCredits}
            forceOpen={activeDropdown === 'credits'}
          />
        </div>
        <div className="group relative hidden lg:block">
          <a href="/v3/help" aria-label="Help" className="grid size-11 place-items-center rounded-soft text-accent-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            <CircleHelp aria-hidden="true" className="size-6" />
          </a>
          <HelpDropdown forceOpen={activeDropdown === 'help'} />
        </div>
        <div className="group relative">
          <button type="button" aria-label={`Open profile menu for ${user.name}`} className="grid size-11 place-items-center rounded-pill focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            <img src="/v3-assets/dashboard-avatar.png" alt="" className="size-9 rounded-pill object-cover" />
          </button>
          <ProfileDropdown user={user} forceOpen={activeDropdown === 'profile'} />
        </div>
      </div>
      {creditNotice ? <CreditNotice variant={creditNotice} remainingCents={creditBalanceCents} totalCents={totalCreditsCents} /> : null}
    </header>
  )
}

const actionIconById: Record<DashboardActionId, string> = {
  'resume-tailor': '/v3-assets/figma/action-icon-resume.svg',
  'interview-practice': '/v3-assets/figma/action-icon-interview-prep.svg',
  'interview-copilot': '/v3-assets/figma/action-icon-copilot.svg',
  'coding-copilot': '/v3-assets/figma/action-icon-coding.svg',
  'meeting-copilot': '/v3-assets/figma/action-icon-meeting.svg',
  'auto-apply': '/v3-assets/figma/action-icon-auto-apply.svg',
  'done-for-you': '/v3-assets/figma/action-icon-dfy.svg',
}

function ActionCard({ action, onLockedClick }: { readonly action: DashboardAction; readonly onLockedClick: (action: DashboardAction) => void }) {
  const locked = action.locked ?? false

  const cardClassName = cn(
    'group flex flex-col gap-3 rounded-[9px] border border-border bg-surface px-[18px] py-3 text-start shadow-control transition duration-200 ease-out hover:border-accent hover:bg-accent-subtle focus-visible:border-accent focus-visible:bg-accent-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus motion-reduce:transition-none sm:hover:-translate-y-0.5',
  )

  const content = (
    <>
      <span
        aria-hidden="true"
        className="relative flex h-[57.6px] w-[56.5px] shrink-0 items-center justify-center transition-transform duration-200 group-hover:scale-110 group-focus-visible:scale-110 motion-reduce:transition-none"
      >
        <img src={actionIconById[action.id]} alt="" className={cn('size-full object-contain', locked && 'opacity-50 grayscale')} />
        {locked ? (
          <span className="absolute -bottom-1 -right-1 grid size-5 place-items-center rounded-full border border-border bg-surface shadow-control">
            <Lock aria-hidden="true" className="size-3 text-ink-muted" />
          </span>
        ) : null}
      </span>
      <div className="grid gap-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-gowun text-sm font-bold leading-[18px] tracking-[-0.28px] text-ink transition-colors duration-200 group-hover:text-accent group-focus-visible:text-accent motion-reduce:transition-none">
            {action.title}
            {action.linkStyle === 'arrow' ? <span aria-hidden="true"> →</span> : null}
            {action.linkStyle === 'external' ? <ArrowUpRight aria-hidden="true" className="ms-1 inline size-3.5 align-[-1px]" /> : null}
          </h2>
          {action.badge ? (
            <span className="rounded-[4px] bg-[#e8e8e8] px-1.5 py-0.5 text-[9px] font-bold uppercase leading-[13.5px] tracking-[0.45px] text-[#475467]">{action.badge}</span>
          ) : null}
        </div>
        <p className="text-xs leading-[18px] tracking-[-0.24px] text-ink-muted">{action.description}</p>
      </div>
    </>
  )

  if (locked) {
    return (
      <button
        type="button"
        data-variant="locked"
        onClick={() => onLockedClick(action)}
        className={cardClassName}
        aria-label={`${action.title}. Requires an unlock. ${action.description}`}
      >
        {content}
      </button>
    )
  }

  return (
    <a
      href={action.href}
      data-variant="rest"
      data-featured={action.featured ? 'true' : undefined}
      className={cardClassName}
      aria-label={`${action.title}. ${action.description}`}
    >
      {content}
    </a>
  )
}

function DashboardUpgradeDialog({ action, onOpenChange }: { readonly action: DashboardAction | null; readonly onOpenChange: (open: boolean) => void }) {
  return (
    <UpgradeDialog
      open={action !== null}
      onOpenChange={onOpenChange}
      title={action?.lockCta ?? 'Upgrade to Premium'}
      message={action?.lockMessage ?? `${action ? action.title : 'This feature'} is available on our Pro and Business plans. Upgrade your plan to unlock live AI assistance during meetings.`}
      ctaLabel={action?.lockCta ?? 'Upgrade Plan'}
      ctaHref={action?.lockHref ?? '/v3/billing'}
    />
  )
}

function SkeletonBlock({ className }: { readonly className?: string }) {
  return <span aria-hidden="true" className={cn('block animate-pulse rounded-lg bg-surface-subtle motion-reduce:animate-none', className)} />
}

function DashboardLoadingView() {
  return (
    <main className="min-h-screen bg-canvas text-ink">
      <div role="status" aria-label="Loading dashboard" className="sr-only">
        Loading dashboard
      </div>
      <header className="flex h-14 items-center justify-between border-b border-border bg-surface px-4 lg:px-5">
        <SkeletonBlock className="h-7 w-32" />
        <div className="flex items-center gap-3">
          <SkeletonBlock className="size-9 rounded-pill" />
          <SkeletonBlock className="size-9 rounded-pill" />
          <SkeletonBlock className="size-9 rounded-pill" />
        </div>
      </header>
      <div className="flex">
        <aside className="hidden w-[223px] shrink-0 bg-surface lg:block">
          <div className="grid gap-3 px-6 pt-6">
            {Array.from({ length: 8 }, (_, index) => (
              <SkeletonBlock key={index} className="h-7 w-full" />
            ))}
          </div>
        </aside>
        <section className="min-h-[calc(100vh-3.5rem)] flex-1 px-4 py-10 sm:px-6 lg:px-16 lg:py-36">
          <div className="mx-auto w-full max-w-3xl">
            <SkeletonBlock className="h-8 w-full max-w-lg" />
            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 7 }, (_, index) => (
                <div key={index} className="min-h-44 rounded-[9px] border border-border bg-surface px-[18px] py-3 shadow-control">
                  <SkeletonBlock className="h-[57.6px] w-[56.5px]" />
                  <SkeletonBlock className="mt-5 h-4 w-40" />
                  <SkeletonBlock className="mt-3 h-12 w-full" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

function InstallPrompt({ installPrompt }: { readonly installPrompt: DashboardInstallPrompt }) {
  return (
    <section className="w-fit max-w-full rounded-panel bg-accent-subtle p-3 lg:absolute lg:bottom-14 lg:end-8" aria-label="Install apps">
      <div className="flex items-center gap-3">
        <img src={installPrompt.qrSrc} alt="QR code to install Jobwhisper apps" className="size-16 shrink-0 rounded-soft object-cover" />
        <div className="grid gap-2">
          <p className="text-sm font-medium text-accent">{installPrompt.title}</p>
          <div className="flex flex-nowrap gap-2 overflow-x-auto">
            <a href={installPrompt.desktopHref} className="inline-flex min-h-8 shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-pill bg-accent px-3 text-xs font-semibold text-on-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              <Monitor aria-hidden="true" className="size-4" />
              Install Desktop
            </a>
            <a href={installPrompt.mobileHref} className="inline-flex min-h-8 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-pill bg-accent px-3 text-xs font-semibold text-on-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              <FaApple aria-hidden="true" className="size-4" />
              <SiGoogleplay aria-hidden="true" className="size-3.5" />
              Install Mobile
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export function DashboardView({
  user,
  navItems,
  actions,
  installPrompt,
  creditBalanceCents,
  totalCreditsCents,
  autoApplyBalanceCredits,
  autoApplyTotalCredits,
  resumeBuilderBalanceCredits,
  resumeBuilderTotalCredits,
  isLoading = false,
  activeDropdown,
  creditNotice,
}: DashboardViewProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [upgradeAction, setUpgradeAction] = useState<DashboardAction | null>(null)
  const [helpModalOpen, setHelpModalOpen] = useState(false)

  if (isLoading) {
    return <DashboardLoadingView />
  }

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <DashboardHeader
        user={user}
        navItems={navItems}
        creditBalanceCents={creditBalanceCents}
        totalCreditsCents={totalCreditsCents}
        autoApplyBalanceCredits={autoApplyBalanceCredits}
        autoApplyTotalCredits={autoApplyTotalCredits}
        resumeBuilderBalanceCredits={resumeBuilderBalanceCredits}
        resumeBuilderTotalCredits={resumeBuilderTotalCredits}
        activeDropdown={activeDropdown}
        creditNotice={creditNotice}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((prev) => !prev)}
      />
      <div className="flex">
        <DashboardSidebar navItems={navItems} collapsed={collapsed} />
        <section className="relative min-h-[calc(100vh-3.5rem)] flex-1 px-4 py-10 sm:px-6 sm:py-12 lg:px-16 lg:py-36">
          <div className="mx-auto w-full max-w-3xl">
            <h1 className="font-gowun text-xl font-semibold leading-tight text-ink sm:text-2xl">Welcome, what would you like to do today?</h1>
            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {actions.map((action) => (
                <ActionCard key={action.id} action={action} onLockedClick={setUpgradeAction} />
              ))}
            </div>
          </div>
          <div className="mx-auto mt-12 w-full max-w-3xl lg:max-w-none">
            <InstallPrompt installPrompt={installPrompt} />
          </div>
          <div className="fixed bottom-4 end-4 lg:hidden">
            <button
              type="button"
              onClick={() => setHelpModalOpen(true)}
              aria-label="Help"
              className="grid size-11 place-items-center rounded-pill bg-surface text-accent shadow-panel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              <CircleHelp aria-hidden="true" className="size-5" />
            </button>
          </div>
        </section>
      </div>

      <DashboardUpgradeDialog action={upgradeAction} onOpenChange={(open) => { if (!open) setUpgradeAction(null) }} />
      <HelpModal open={helpModalOpen} onOpenChange={setHelpModalOpen} />
    </main>
  )
}
