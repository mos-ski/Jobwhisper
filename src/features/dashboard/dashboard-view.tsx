import { ArrowRight, ChevronRight, CircleHelp, Code2, CreditCard, ExternalLink, Gift, Lock, LogOut, Mail, Menu, Monitor, PanelLeftClose, PanelLeftOpen, Play, Settings, User, Video, X } from 'lucide-react'
import { FaApple } from 'react-icons/fa'
import { SiGoogleplay } from 'react-icons/si'
import { useState, type ReactNode } from 'react'

import type { DashboardAction, DashboardActionId, DashboardInstallPrompt, DashboardNavItem } from '@/contracts/dashboard.draft'
import type { UserIdentity } from '@/contracts/identity'
import { formatCredits, usagePercent } from '@/lib/credits'
import { Button, cn, Dialog, DialogClose, DialogPopup, DialogTitle, DialogTrigger, LightforthMark, SideMenu } from '@/ui'
import { BriefcaseActionIcon, CopilotActionIcon, MonitorActionIcon, ResumeActionIcon } from './dashboard-action-icons'
import {
  AutoApplyIcon,
  BillingIcon,
  CopilotIcon,
  DashboardIcon,
  DocumentsIcon,
  DownloadIcon,
  InterviewPrepIcon,
  KnowledgeBaseIcon,
  SettingsIcon,
} from './dashboard-nav-icons'

export type DashboardViewProps = {
  readonly user: UserIdentity
  readonly navItems: readonly DashboardNavItem[]
  readonly actions: readonly DashboardAction[]
  readonly installPrompt: DashboardInstallPrompt
  readonly creditBalanceCents: number
  readonly totalCreditsCents: number
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
  'Download Apps': <DownloadIcon />,
  'Billing & subscription': <BillingIcon />,
  Settings: <SettingsIcon />,
}

function toSideMenuItems(navItems: readonly DashboardNavItem[]) {
  return navItems.map((item) => ({
    ...item,
    icon: navIconByLabel[item.label] ?? <SettingsIcon />,
    dividerBefore: item.label === 'Knowledge Base',
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
          <LightforthMark className="h-6 w-auto text-brand-mark" />
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
            <a href="mailto:support@lightforth.org" className="font-medium text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">support@lightforth.org</a>
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
      <a href="mailto:support@lightforth.org" className="flex min-h-12 items-center justify-center gap-2 bg-accent px-3 text-sm font-semibold text-on-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
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
              <a href="mailto:support@lightforth.org" className="font-medium text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">support@lightforth.org</a>
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
          <a href="mailto:support@lightforth.org" className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-accent text-sm font-semibold text-on-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            <Mail aria-hidden="true" className="size-4" />
            Send us an email
          </a>
        </div>
      </DialogPopup>
    </Dialog>
  )
}

function CreditDropdown({ creditBalanceCents, totalCreditsCents, forceOpen = false }: { readonly creditBalanceCents: number; readonly totalCreditsCents: number; readonly forceOpen?: boolean }) {
  const remainingPercent = usagePercent(creditBalanceCents, totalCreditsCents)
  const progressStyle = { inlineSize: `${remainingPercent}%` }

  return (
    <section
      aria-label="Usage balance"
      className={cn(
        'absolute end-0 top-full z-20 mt-3 hidden w-[min(16rem,calc(100vw-2rem))] overflow-hidden rounded-md border border-border bg-surface text-xs shadow-popover group-focus-within:block group-hover:block',
        forceOpen ? 'block' : undefined,
      )}
    >
      <div className="grid gap-3 px-4 py-3">
        <div className="flex min-h-9 items-center justify-between gap-4">
          <h2 className="text-sm font-medium leading-6 text-ink">Usage balance</h2>
          <a href="/v3/billing" className="inline-flex min-h-7 items-center justify-center gap-1 rounded-lg border border-border bg-surface px-2 text-xs font-semibold text-ink-muted shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            Upgrade
            <ArrowRight aria-hidden="true" className="size-3" />
          </a>
        </div>
        <div className="grid gap-1.5">
          <div className="flex items-center justify-between gap-4 text-sm text-ink-muted">
            <span>Usage this month</span>
            <span className="font-medium text-ink">{remainingPercent}% remaining</span>
          </div>
          <div className="h-2 overflow-hidden rounded-pill bg-surface-subtle">
            <div className="h-full rounded-pill bg-accent shadow-control" style={progressStyle} />
          </div>
          <p className="text-end text-xs font-medium leading-5 text-ink-muted">{formatCredits(creditBalanceCents)} remaining</p>
        </div>
      </div>
      <a href="/v3/billing" className="flex min-h-12 items-center justify-center gap-2 bg-accent px-3 text-sm font-semibold text-on-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
        <Gift aria-hidden="true" className="size-4" />
        Add Funds
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
  activeDropdown,
  creditNotice,
  collapsed,
  onToggleCollapse,
}: {
  readonly user: UserIdentity
  readonly navItems: readonly DashboardNavItem[]
  readonly creditBalanceCents: number
  readonly totalCreditsCents: number
  readonly activeDropdown?: 'help' | 'credits' | 'profile'
  readonly creditNotice?: 'low' | 'empty'
  readonly collapsed: boolean
  readonly onToggleCollapse: () => void
}) {
  return (
    <header className="relative flex h-14 items-center justify-between border-b border-border bg-surface px-4 lg:px-5">
      <div className="flex items-center gap-2">
        <MobileNavDrawer navItems={navItems} />
        <a href="/v3" className="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus" aria-label="Lightforth home">
          {collapsed ? (
            <img src="/v3-assets/Logo%20icon.svg" alt="" className="size-7" />
          ) : (
            <LightforthMark className="h-7 w-auto text-brand-mark" />
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
            <CreditCard aria-hidden="true" className="size-6" />
            <span className="absolute -start-1.5 top-1 grid min-w-4 place-items-center rounded-pill bg-danger px-1 text-[10px] font-semibold leading-4 text-on-danger">{usagePercent(creditBalanceCents, totalCreditsCents)}%</span>
          </a>
          <CreditDropdown creditBalanceCents={creditBalanceCents} totalCreditsCents={totalCreditsCents} forceOpen={activeDropdown === 'credits'} />
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

const actionIconById: Record<DashboardActionId, ReactNode> = {
  'resume-tailor': <ResumeActionIcon />,
  'interview-practice': <MonitorActionIcon />,
  'interview-copilot': <CopilotActionIcon />,
  'coding-copilot': <Code2 aria-hidden="true" />,
  'meeting-copilot': <Video aria-hidden="true" />,
  'auto-apply': <BriefcaseActionIcon />,
}

function ActionCard({ action, onLockedClick }: { readonly action: DashboardAction; readonly onLockedClick: (action: DashboardAction) => void }) {
  const locked = action.locked ?? false

  const cardClassName = cn(
    'group flex min-h-32 flex-col gap-3 rounded-lg border border-border bg-surface px-5 py-4 text-start shadow-control transition duration-200 ease-out hover:border-accent hover:bg-accent-subtle focus-visible:border-accent focus-visible:bg-accent-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus motion-reduce:transition-none sm:hover:-translate-y-0.5',
  )

  const content = (
    <>
      <span
        aria-hidden="true"
        className="size-4 text-ink transition-transform duration-200 group-hover:scale-110 group-focus-visible:scale-110 motion-reduce:transition-none [&>svg]:size-4"
      >
        {locked ? <Lock aria-hidden="true" /> : actionIconById[action.id] ?? null}
      </span>
      <div className="grid gap-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-sm font-bold tracking-normal text-ink transition-colors duration-200 group-hover:text-accent group-focus-visible:text-accent motion-reduce:transition-none">
            {action.title} <span aria-hidden="true">-&gt;</span>
          </h2>
          {action.badge ? (
            <span className="rounded-soft bg-positive-surface px-1.5 py-0.5 text-xs font-bold uppercase tracking-wide text-positive">{action.badge}</span>
          ) : null}
        </div>
        <p className="text-xs font-medium leading-5 text-ink-muted">{action.description}</p>
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
        aria-label={`${action.title}. Requires a plan upgrade. ${action.description}`}
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

function UpgradeDialog({ action, onOpenChange }: { readonly action: DashboardAction | null; readonly onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={action !== null} onOpenChange={onOpenChange}>
      <DialogPopup aria-label="Upgrade to Premium">
        <DialogClose />
        <span aria-hidden="true" className="grid size-11 place-items-center rounded-xl border border-border bg-surface-raised text-ink-muted shadow-control [&>svg]:size-5">
          <Lock aria-hidden="true" />
        </span>
        <DialogTitle className="mt-4">Upgrade to Premium</DialogTitle>
        <p className="mt-1 text-sm text-ink-muted">
          {action ? action.title : 'This feature'} is available on our Pro and Business plans. Upgrade your plan to unlock live AI assistance during meetings.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Not now
          </Button>
          <a
            href="/v3/billing"
            className="inline-flex min-h-10 items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            Upgrade Plan
          </a>
        </div>
      </DialogPopup>
    </Dialog>
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
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="min-h-32 rounded-lg border border-border bg-surface px-5 py-4 shadow-control">
                  <SkeletonBlock className="size-4" />
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
    <section className="rounded-panel bg-accent-subtle p-3 lg:absolute lg:bottom-14 lg:end-8" aria-label="Install apps">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <img src={installPrompt.qrSrc} alt="QR code to install Lightforth apps" className="size-28 rounded-soft object-cover" />
        <div className="grid gap-3">
          <p className="text-base font-medium text-accent">{installPrompt.title}</p>
          <div className="flex flex-wrap gap-2">
            <a href={installPrompt.desktopHref} className="inline-flex min-h-8 items-center justify-center gap-1 rounded-pill bg-accent px-3 text-xs font-semibold text-on-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              <Monitor aria-hidden="true" className="size-4" />
              Install Desktop
            </a>
            <a href={installPrompt.mobileHref} className="inline-flex min-h-8 items-center justify-center gap-1.5 rounded-pill bg-accent px-3 text-xs font-semibold text-on-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
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

export function DashboardView({ user, navItems, actions, installPrompt, creditBalanceCents, totalCreditsCents, isLoading = false, activeDropdown, creditNotice }: DashboardViewProps) {
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
        activeDropdown={activeDropdown}
        creditNotice={creditNotice}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((prev) => !prev)}
      />
      <div className="flex">
        <DashboardSidebar navItems={navItems} collapsed={collapsed} />
        <section className="relative min-h-[calc(100vh-3.5rem)] flex-1 px-4 py-10 sm:px-6 sm:py-12 lg:px-16 lg:py-36">
          <div className="mx-auto w-full max-w-3xl">
            <h1 className="text-xl font-semibold leading-tight text-ink sm:text-2xl">Welcome, what would you like to do today?</h1>
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

      <UpgradeDialog action={upgradeAction} onOpenChange={(open) => { if (!open) setUpgradeAction(null) }} />
      <HelpModal open={helpModalOpen} onOpenChange={setHelpModalOpen} />
    </main>
  )
}
