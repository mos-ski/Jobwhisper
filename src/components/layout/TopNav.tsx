import { useState } from 'react'
import {
  Bell,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  ExternalLink,
  FileText,
  Gift,
  HelpCircle,
  LogOut,
  Mail,
  Menu,
  MessageCircle,
  Settings,
  Tag,
  User,
  X,
  Zap,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const NOTIFICATIONS = [
  { id: '1', icon: CreditCard, color: 'text-blue-500 bg-blue-50', title: '1 credit deducted', desc: 'Resume tailored for Google · Senior Frontend Engineer', time: '2m ago', read: false },
  { id: '2', icon: CheckCircle2, color: 'text-green-600 bg-green-50', title: 'Auto-Apply submitted', desc: 'Applied to Product Designer at Apple via LinkedIn', time: '15m ago', read: false },
  { id: '3', icon: FileText, color: 'text-purple-500 bg-purple-50', title: 'Interview report ready', desc: 'Your Software Engineer session report is available', time: '1h ago', read: false },
  { id: '4', icon: BriefcaseBusiness, color: 'text-amber-500 bg-amber-50', title: '12 new job matches', desc: 'New roles match your profile — check Auto-Apply', time: '3h ago', read: true },
  { id: '5', icon: Zap, color: 'text-blue-500 bg-blue-50', title: '3 credits used today', desc: 'Resume builder ×1 · Interview prep ×2', time: '6h ago', read: true },
  { id: '6', icon: Tag, color: 'text-rose-500 bg-rose-50', title: '🎉 50% off Premium — this week only', desc: 'Upgrade to Premium and get 100 credits/month', time: '1d ago', read: true },
]

export default function TopNav({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [notifOpen, setNotifOpen] = useState(false)
  const [readIds, setReadIds] = useState<Set<string>>(new Set(['4', '5', '6']))

  const unreadCount = NOTIFICATIONS.filter((n) => !readIds.has(n.id)).length

  function markAllRead() {
    setReadIds(new Set(NOTIFICATIONS.map((n) => n.id)))
  }

  const planCredits = user?.plan === 'premium' ? 100 : user?.plan === 'pro' ? 50 : user?.plan === 'starter' ? 15 : 34
  const remainingCredits = user?.credits ?? 31
  const totalCredits = Math.max(planCredits, remainingCredits + (user?.creditsUsed ?? 0))
  const usedCredits = Math.max(0, totalCredits - remainingCredits)
  const creditPercent = totalCredits ? Math.max(0, Math.min(100, Math.round((remainingCredits / totalCredits) * 100))) : 0

  const initials =
    user?.name
      ?.split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ?? 'U'

  return (
    <header className="flex h-14 flex-shrink-0 items-center justify-end gap-1.5 border-b border-border bg-white px-3 sm:gap-2 sm:px-6">
      <button
        onClick={onMenuClick}
        className="mr-auto rounded-md p-2 transition-colors hover:bg-muted md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5 text-foreground" />
      </button>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="relative rounded-full p-2 transition-colors hover:bg-muted"
          aria-label="Open credit counter"
        >
          <Zap className="h-5 w-5 text-primary" />
          <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {remainingCredits}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={12} className="w-[calc(100vw-2rem)] max-w-72 rounded-xl bg-white p-4 shadow-xl">
          <div className="mb-5 flex items-center justify-between gap-3">
            <p className="text-base font-semibold text-foreground">Credits</p>
            <Link
              to="/billing"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'sm' }),
                'h-9 rounded-lg px-3 text-sm font-semibold text-slate-600',
              )}
            >
              Upgrade {'->'}
            </Link>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-500">Remaining Credits</span>
              <span className="font-semibold text-foreground">{remainingCredits}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-500">Total Allocated</span>
              <span className="font-semibold text-foreground">{totalCredits}</span>
            </div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-primary" style={{ width: `${creditPercent}%` }} />
          </div>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-500">Used: {usedCredits}</span>
            <span className="font-medium text-foreground">{creditPercent}% remaining</span>
          </div>
          <Button className="mt-4 h-10 w-full rounded-lg bg-gradient-to-r from-blue-500 to-violet-500 text-sm font-bold shadow-sm">
            <Gift className="h-5 w-5" />
            Get more credits
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="relative">
        <button
          onClick={() => setNotifOpen((o) => !o)}
          className="relative rounded-full p-2 transition-colors hover:bg-muted"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </button>

        {notifOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
            <div className="absolute right-0 top-full z-50 mt-2 w-[calc(100vw-1.5rem)] max-w-96 overflow-hidden rounded-xl border border-border bg-white shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <p className="text-sm font-semibold text-foreground">
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-2 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </p>
                <button
                  onClick={markAllRead}
                  className="text-xs text-primary hover:underline"
                >
                  Mark all read
                </button>
              </div>

              {/* List */}
              <div className="max-h-[420px] overflow-y-auto divide-y divide-border">
                {NOTIFICATIONS.map((n) => {
                  const isUnread = !readIds.has(n.id)
                  return (
                    <button
                      key={n.id}
                      onClick={() => setReadIds((s) => new Set([...s, n.id]))}
                      className={cn(
                        'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50',
                        isUnread && 'bg-primary/[0.03]',
                      )}
                    >
                      <div className={cn('mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full', n.color)}>
                        <n.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn('text-sm', isUnread ? 'font-semibold text-foreground' : 'font-medium text-foreground/80')}>
                          {n.title}
                        </p>
                        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{n.desc}</p>
                        <p className="mt-1 text-[11px] text-muted-foreground/70">{n.time}</p>
                      </div>
                      {isUnread && (
                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Footer */}
              <div className="border-t border-border">
                <button
                  onClick={() => setNotifOpen(false)}
                  className="flex h-10 w-full items-center justify-center text-xs font-medium text-primary hover:bg-primary/5 transition-colors"
                >
                  View all notifications
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-full p-2 transition-colors hover:bg-muted" aria-label="Open help">
          <HelpCircle className="h-5 w-5 text-primary" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={12} className="w-[calc(100vw-2rem)] max-w-80 overflow-hidden rounded-xl bg-white p-0 shadow-xl">
          <div className="flex items-center justify-between bg-emerald-50 px-4 py-3">
            <p className="text-base font-bold text-emerald-600">Whats new? *</p>
            <button
              className="text-sm text-slate-500 hover:text-foreground"
              onClick={() => window.open('https://help.lightforth.ai/updates', '_blank')}
            >
              See Latest Updates {'>'}
            </button>
          </div>
          <div className="divide-y">
            <section className="px-4 py-3">
              <h3 className="text-sm font-semibold text-foreground">Supported Browsers</h3>
              <p className="mt-1.5 text-sm leading-5 text-slate-500">
                Chrome (Best Compatibility), Edge, Opera, Brave, Chromium.
              </p>
            </section>
            <button
              className="block w-full px-4 py-3 text-left hover:bg-muted/50"
              onClick={() => window.open('https://help.lightforth.ai', '_blank')}
            >
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                Search on help center
                <ExternalLink className="h-3.5 w-3.5" />
              </h3>
              <p className="mt-1.5 text-sm leading-5 text-slate-500">
                Find answers to frequently asked questions from our written articles.
              </p>
            </button>
            <section className="px-4 py-3">
              <h3 className="text-sm font-semibold text-foreground">Give feedback?</h3>
              <p className="mt-1.5 text-sm leading-5 text-slate-500">
                <a className="text-primary underline-offset-2 hover:underline" href="https://help.lightforth.ai/feedback" target="_blank" rel="noreferrer">
                  Fill this form
                </a>{' '}
                or Join Discord for support and community interaction or send us an email to{' '}
                <a className="text-primary hover:underline" href="mailto:support@lightforth.org">
                  support@lightforth.org
                </a>
              </p>
            </section>
            <section className="px-4 py-3">
              <h3 className="text-sm font-semibold text-foreground">Support Hours:</h3>
              <p className="mt-1.5 text-sm leading-5 text-slate-500">
                Mon - Fri: 9 AM - 6 PM CST
                <br />
                Sat - Sun: Limited Support
              </p>
            </section>
          </div>
          <button
            className="flex h-12 w-full items-center justify-center gap-3 border-t bg-white text-sm font-medium text-primary hover:bg-blue-50"
            onClick={() => window.location.href = 'mailto:support@lightforth.org'}
          >
            <Mail className="h-5 w-5" />
            Send us an email
          </button>
          <button
            className="flex h-12 w-full items-center justify-center gap-3 rounded-b-xl bg-[#1298ee] text-sm font-medium text-white hover:bg-[#0b8add]"
            onClick={() => window.open('https://discord.gg/lightforth', '_blank')}
          >
            <MessageCircle className="h-5 w-5" />
            Join community
          </button>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-muted" aria-label="Open account menu">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-xs font-bold text-foreground">
              {initials}
            </span>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={14} className="w-[calc(100vw-2rem)] max-w-72 overflow-hidden rounded-xl bg-white p-0 shadow-xl">
          <div className="flex items-center gap-3 rounded-t-xl bg-blue-100 px-4 py-4">
            <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-full bg-slate-200">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-xs font-black text-foreground">
                  USER
                </span>
              )}
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-blue-100 bg-emerald-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-bold text-foreground">{user?.name ?? 'Adedamola Adewale'}</p>
              <p className="truncate text-sm text-slate-500">{user?.email ?? 'adewaledamola52@yahoo.com'}</p>
            </div>
            <X className="h-5 w-5 flex-shrink-0 text-slate-600" />
          </div>
          <DropdownMenuItem className="flex h-12 cursor-pointer items-center gap-4 rounded-none px-5 text-base font-semibold text-slate-700" onClick={() => navigate('/settings')}>
            <User className="h-5 w-5 text-slate-500" />
            <span className="flex-1">Account</span>
            <ChevronRight className="h-5 w-5 text-slate-400" />
          </DropdownMenuItem>
          <DropdownMenuItem className="flex h-12 cursor-pointer items-center gap-4 rounded-none px-5 text-base font-semibold text-slate-700" onClick={() => navigate('/settings?tab=security')}>
            <Settings className="h-5 w-5 text-slate-500" />
            <span className="flex-1">Security</span>
            <ChevronRight className="h-5 w-5 text-slate-400" />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex h-12 cursor-pointer items-center gap-4 rounded-b-xl px-5 text-base font-semibold text-red-600" onClick={logout}>
            <LogOut className="h-5 w-5" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
